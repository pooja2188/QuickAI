import OpenAI from "openai";
import { clerkClient } from "@clerk/express";
import sql from "../configs/db.js";
import axios from "axios";
import "dotenv/config"; // Must be at the very top of your entry file!
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import fs from "fs";
import { PDFParse } from "pdf-parse";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    // 1. Grab auth context safely
    const authData = req.auth();
    const userId = authData?.userId;

    // CRITICAL GUARD: Stops the code instantly if your Postman request has no token.
    // This prevents Clerk from crashing with the "valid resource ID" error!
    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication failed! You forgot to pass the Clerk Token in your Postman Authorization Headers.",
      });
    }

    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage || 0; // Fallback to 0 if undefined

    if (plan !== "premium" && free_usage >= 20) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const targetLength = Number(length) || 500;
    const maxTokenLimit = targetLength > 500 ? targetLength * 2 : 1500;

    // 2. Request article generation from Gemini (Using standard stable model identifier)
    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a professional article writer. You write comprehensive, fully realized, highly engaging articles. Always meet the length requested by the user and never return just title fragments.",
        },
        {
          role: "user",
          content: `Write a detailed article about: "${prompt}". The article must be approximately ${targetLength} words long.`,
        },
      ],
      temperature: 0.7,
      max_tokens: maxTokenLimit,
    });

    // 3. FIX: Variable name unified to 'content' so it matches the SQL query and JSON response below
    const content = response.choices[0].message.content;

    // 4. Save into database
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES 
    (${userId}, ${prompt}, ${content}, 'article')`;

    // 5. Update user metadata safely since userId is guaranteed present here
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: Number(free_usage) + 1,
        },
      });
    }

    // 6. Return successful payload
    res.json({ success: true, content });
  } catch (error) {
    console.error("Execution failed:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    // 1. Grab auth context safely
    const authData = req.auth();
    const userId = authData?.userId;

    // Strict authentication guard
    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication failed! Missing Clerk Session Token in headers.",
      });
    }

    const { prompt } = req.body; // 'length' is not needed for short titles
    const plan = req.plan;
    const free_usage = req.free_usage || 0;

    // Enforce usage tiers
    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are an expert SEO and blog headline copywriter. Generate 5 distinct, highly engaging, click-worthy blog titles based on the user's topic. Format them as a clean, numbered list. Do not include introductory text or conclusions.",
        },
        {
          role: "user",
          content: `Generate catchy blog titles for the topic: "${prompt}"`,
        },
      ],
      temperature: 0.8,
      // FIX: Increase this to 1000 so the model has enough headroom to finish generation
      max_tokens: 1000,
    });

    // 3. FIX: Safely extract array choice index 0
    const content = response.choices[0].message.content;

    // 4. FIX: Save into database with type 'title' instead of 'article'
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES 
    (${userId}, ${prompt}, ${content}, 'blog-title')`;

    // 5. Update user metadata limits
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: Number(free_usage) + 1,
        },
      });
    }

    // 6. Return successful title suggestions
    res.json({ success: true, content });
  } catch (error) {
    console.error("Title generation failed:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const authData = req.auth();
    const userId = authData?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed! Missing Session Token.",
      });
    }

    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }
    console.log("API Key Check:", process.env.CLIPDROP_API_KEY ? "Key is visible to this file" : "Key is UNDEFINED");

    // Request Image Generation from Clipdrop
    // const formData = new FormData();
    // formData.append("prompt", prompt);

    // const { data } = await axios.post(
    //   "https://clipdrop-api.co/text-to-image/v1",
    //   formData,
    //   {
    //     headers: {
    //       ...formData.getHeaders(),
    //       "x-api-key": process.env.CLIPDROP_API_KEY,
    //     },
    //     responseType: "arraybuffer",
    //   },
    // );

        // Request Image Generation from Clipdrop
    const formData = new FormData();
    formData.append('prompt', prompt);

    // Ensure this string is exactly correct and unmutated
const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {

      headers: { 
        'x-api-key': process.env.CLIPDROP_API_KEY,
        // FIX: Force axios to compute and forward the multipart/form-data boundary signatures
        ...formData.getHeaders(), 
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`
      },
      responseType: "arraybuffer"
    });

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;

    // Cloudinary upload works every single time now because the instance is fully configured
    const uploadResponse = await cloudinary.uploader.upload(base64Image);
    const secure_url = uploadResponse.secure_url;

    // Save metadata tracking block to database
    const isPublished = publish === true || publish === "true";

    await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES 
    (${userId}, ${prompt}, ${secure_url}, 'image', ${isPublished})`;

    // await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES
    // (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    // console.error("Image generation failed:", error.message);
    // res.status(500).json({ success: false, error: error.message });
    if (error.response && error.response.data) {
      const decoder = new TextDecoder('utf-8');
      const errorMessage = decoder.decode(error.response.data);
      console.error("Clipdrop Server Error Message:", errorMessage);
    } else {
      console.error("Image generation failed:", error.message);
    }
    
    res.status(500).json({ success: false, error: error.message });
  }
};
export const removeImageBackground = async (req, res) => {
  try {
    const authData = req.auth();
    const userId = authData?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed! Missing Session Token.",
      });
    }
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    // Cloudinary upload works every single time now because the instance is fully configured
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    // Save metadata tracking block to database
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES 
    (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Image generation failed:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const authData = req.auth();
    const userId = authData?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed! Missing Session Token.",
      });
    }
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    // Cloudinary upload works every single time now because the instance is fully configured
    const { public_id } = await cloudinary.uploader.upload(image.path);
    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_removal:${object}` }],
      resource_type: "image",
    });
    // Save metadata tracking block to database
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES 
    (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error("Image generation failed:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const authData = req.auth();
    const userId = authData?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed! Missing Session Token.",
      });
    }

    const resume = req.file;
    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "No resume file was uploaded.",
      });
    }

    // Normalized Flexible Plan Check matrix string rules
    const userPlan = String(req.plan || "").toLowerCase();
    if (!userPlan.includes("premium")) {
      if (fs.existsSync(resume.path)) fs.unlinkSync(resume.path);
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      if (fs.existsSync(resume.path)) fs.unlinkSync(resume.path);
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB).",
      });
    }

    const nodeBuffer = fs.readFileSync(resume.path);
    const dataBuffer = new Uint8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.byteLength);
    
    const parser = new PDFParse(dataBuffer);
    const parsedResult = await parser.getText();

    if (fs.existsSync(resume.path)) fs.unlinkSync(resume.path);

    const rawText = parsedResult?.text || parsedResult || "";

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Could not extract readable text content from the uploaded PDF.",
      });
    }

    const promptText = `Review the following resume and provide a deep, thorough constructive critique on its strengths, weaknesses, formatting, impact metrics, and keyword optimizations. Format the response beautifully using clean markdown headers and bullet points. Resume Content:\n\n ${rawText}`;

    // 1. Dispatch data straight up to Gemini via OpenAI adapter
    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "You are an expert HR Manager and Technical Recruiter. Provide structural, highly actionable, long-form resume critiques. Always break down your answer into four distinct sections: 1) Executive Summary, 2) Core Strengths, 3) Critical Areas for Improvement, and 4) Actionable Recommendations.",
        },
        {
          role: "user",
          content: promptText,
        },
      ],
      temperature: 0.7,
      // FIXED: Hardcoded to 2500 to give the model full headroom to print the entire comprehensive report!
      max_tokens: 2500, 
    });

    const content = response.choices[0].message.content;

    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES 
      (${userId}, 'Review the uploaded resume PDF', ${content}, 'resume-review')`;
    } catch (dbError) {
      console.error("Database tracking log failed:", dbError.message);
    }

    return res.json({ success: true, content });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Critical Resume review processing fault:", error.message);
    return res.status(500).json({ success: false, message: "Backend process fault: " + error.message });
  }
};
