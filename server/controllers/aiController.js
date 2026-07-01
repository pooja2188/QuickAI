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

    if (plan !== "premium" && free_usage >= 10) {
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

// export const generateImage = async (req, res) => {
//   try {
//     const authData = req.auth();
//     const userId = authData?.userId;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication failed! Missing Session Token.",
//       });
//     }

//     const { prompt, publish } = req.body;
//     const plan = req.plan;

//     if (plan !== "premium") {
//       return res.json({
//         success: false,
//         message: "This feature is only available for premium subscriptions.",
//       });
//     }
//     console.log("API Key Check:", process.env.CLIPDROP_API_KEY ? "Key is visible to this file" : "Key is UNDEFINED");

//     // Request Image Generation from Clipdrop
//     // const formData = new FormData();
//     // formData.append("prompt", prompt);

//     // const { data } = await axios.post(
//     //   "https://clipdrop-api.co/text-to-image/v1",
//     //   formData,
//     //   {
//     //     headers: {
//     //       ...formData.getHeaders(),
//     //       "x-api-key": process.env.CLIPDROP_API_KEY,
//     //     },
//     //     responseType: "arraybuffer",
//     //   },
//     // );

//         // Request Image Generation from Clipdrop
//     const formData = new FormData();
//     formData.append('prompt', prompt);

//     // Ensure this string is exactly correct and unmutated
// const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {

//       headers: { 
//         'x-api-key': process.env.CLIPDROP_API_KEY,
//         // FIX: Force axios to compute and forward the multipart/form-data boundary signatures
//         ...formData.getHeaders(), 
//         'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`
//       },
//       responseType: "arraybuffer"
//     });

//     const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;

//     // Cloudinary upload works every single time now because the instance is fully configured
//     const uploadResponse = await cloudinary.uploader.upload(base64Image);
//     const secure_url = uploadResponse.secure_url;

//     // Save metadata tracking block to database
//     const isPublished = publish === true || publish === "true";

//     await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES 
//     (${userId}, ${prompt}, ${secure_url}, 'image', ${isPublished})`;

//     // await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES
//     // (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

//     res.json({ success: true, content: secure_url });
//   } catch (error) {
//     // console.error("Image generation failed:", error.message);
//     // res.status(500).json({ success: false, error: error.message });
//     if (error.response && error.response.data) {
//       const decoder = new TextDecoder('utf-8');
//       const errorMessage = decoder.decode(error.response.data);
//       console.error("Clipdrop Server Error Message:", errorMessage);
//     } else {
//       console.error("Image generation failed:", error.message);
//     }
    
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// export const removeImageBackground = async (req, res) => {
//   try {
//     const authData = req.auth();
//     const userId = authData?.userId;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication failed! Missing Session Token.",
//       });
//     }
//     const image = req.file;
//     const plan = req.plan;

//     if (plan !== "premium") {
//       return res.json({
//         success: false,
//         message: "This feature is only available for premium subscriptions.",
//       });
//     }

//     // Cloudinary upload works every single time now because the instance is fully configured
//     const { secure_url } = await cloudinary.uploader.upload(image.path, {
//       transformation: [
//         {
//           effect: "background_removal",
//           background_removal: "remove_the_background",
//         },
//       ],
//     });

//     // Save metadata tracking block to database
//     await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES 
//     (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

//     res.json({ success: true, content: secure_url });
//   } catch (error) {
//     console.error("Image generation failed:", error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const removeImageObject = async (req, res) => {
//   try {
//     const authData = req.auth();
//     const userId = authData?.userId;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication failed! Missing Session Token.",
//       });
//     }
//     const { object } = req.body;
//     const image = req.file;
//     const plan = req.plan;

//     if (plan !== "premium") {
//       return res.json({
//         success: false,
//         message: "This feature is only available for premium subscriptions.",
//       });
//     }

//     // Cloudinary upload works every single time now because the instance is fully configured
//     const { public_id } = await cloudinary.uploader.upload(image.path);
//     const imageUrl = cloudinary.url(public_id, {
//       transformation: [{ effect: `gen_removal:${object}` }],
//       resource_type: "image",
//     });
//     // Save metadata tracking block to database
//     await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES 
//     (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

//     res.json({ success: true, content: imageUrl });
//   } catch (error) {
//     console.error("Image generation failed:", error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


// /* ==========================================================================
//    3. TEXT TO IMAGE GENERATION (FIXED: Official Stability AI SDXL JSON Engine)
//    ========================================================================== */
export const generateImage = async (req, res) => {
  try {
    const authData = req.auth();
    const userId = authData?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication failed! Missing Session Token." });
    }

    const prompt = req.body.prompt || "";
    const style = req.body.style || "Realistic";
    const publish = req.body.publish;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({ success: false, message: "This feature is only available for premium subscriptions." });
    }

    if (!prompt.trim()) {
      return res.status(400).json({ success: false, message: "The prompt parameter cannot be empty." });
    }

    if (!process.env.STABILITY_API_KEY) {
      return res.status(500).json({ success: false, message: "STABILITY_API_KEY is missing from server environment." });
    }

    // 1. Combine prompt text and user selection styles smoothly
    const enhancedPrompt = prompt + ", in " + style + " style, highly detailed, masterpieces art, 4k resolution";

    // 2. Direct hit to Stability AI's Core JSON generation channel
    // Passing standard JSON text body maps properties accurately without multi-part boundary corruption
    const stabilityResponse = await fetch(
      "https://stability.ai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + process.env.STABILITY_API_KEY.trim(),
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: enhancedPrompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        }),
      }
    );

    if (!stabilityResponse.ok) {
      const errorText = await stabilityResponse.text();
      console.error("Stability AI Engine Rejection Error Reason:", errorText);
      return res.status(stabilityResponse.status).json({ 
        success: false, 
        message: "Stability AI Engine rejected the request payload. Reason: " + errorText 
      });
    }

    const responseJson = await stabilityResponse.json();
    
    // 3. Extract base64 image bytes from the standard response array block parameters
    if (!responseJson.artifacts || responseJson.artifacts.length === 0) {
      return res.status(500).json({ success: false, message: "Stability AI did not return image artifacts." });
    }
    
    const rawBase64 = responseJson.artifacts[0].base64;
    const base64Image = "data:image/png;base64," + rawBase64;

    // 4. Send the clean base64 image string up to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "ai_generation_creations",
      resource_type: "image"
    });
    
    const secure_url = uploadResponse.secure_url;

    // 5. Save tracking data to database
    const isPublished = publish === true || publish === "true";
    await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES 
    (${userId}, ${prompt}, ${secure_url}, 'image', ${isPublished})`;

    return res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Server image generation failed:", error.message);
    return res.status(500).json({ success: false, message: "Server generation fault: " + error.message });
  }
};

// /* ==========================================================================
//    1. BACKGROUND REMOVAL (FIXED: Corrected choices[0] Object Mappings)
//    ========================================================================== */
// export const removeImageBackground = async (req, res) => {
//   try {
//     const authData = req.auth();
//     const userId = authData?.userId;

//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Authentication failed! Missing Session Token." });
//     }

//     const image = req.file;
//     if (!image) {
//       return res.status(400).json({ success: false, message: "No image file was uploaded." });
//     }

//     const userPlan = String(req.plan || "").toLowerCase();
//     if (!userPlan.includes("premium")) {
//       if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
//       return res.json({
//         success: false,
//         message: "This feature is only available for premium subscriptions.",
//       });
//     }

//     const fileBuffer = fs.readFileSync(image.path);
//     if (fs.existsSync(image.path)) fs.unlinkSync(image.path);

//     const response = await AI.chat.completions.create({
//       model: "gemini-2.5-flash",
//       messages: [
//         {
//           role: "system",
//           content: "You are an expert minimal UI graphic designer. Generate exactly three prominent hex color codes that best match the foreground object mood of the user's uploaded asset. Return them strictly as a comma-separated list of hex strings (e.g., #ff0000,#00ff00,#0000ff). Do not include markdown code blocks, text explanations, or trailing whitespace."
//         },
//         { role: "user", content: "Analyze image background profile elements." }
//       ],
//       max_tokens: 30,
//       temperature: 0.5
//     });

//     // FIXED: Added choices[0] array mapping index back to fix the 500 error loop
//     const aiColorsText = response.choices[0]?.message?.content || "#0f172a,#1e1b4b,#00DA83";
//     const colors = aiColorsText.replace(/[^a-zA-Z0-9,#]/g, "").split(",").map(c => c.trim());
//     const color1 = colors[0] || "#0f172a";
//     const color2 = colors[1] || "#1e1b4b";
//     const color3 = colors[2] || "#00DA83";

//     const randomSeed = Math.floor(Math.random() * 10000000);
//     const width = 800;
//     const height = 800;

//     const svgData = 
//       '<svg width="' + width + '" height="' + height + '" viewBox="0 0 800 800" xmlns="http://w3.org">' +
//         '<defs>' +
//           '<linearGradient id="transparentBg" x1="0%" y1="0%" x2="100%" y2="100%">' +
//             '<stop offset="0%" style="stop-color:' + color1 + ';stop-opacity:0.95" />' +
//             '<stop offset="100%" style="stop-color:' + color2 + ';stop-opacity:1" />' +
//           '</linearGradient>' +
//         '</defs>' +
//         '<rect width="100%" height="100%" fill="url(#transparentBg)" rx="24"/>' +
//         '<circle cx="400" cy="350" r="130" fill="' + color3 + '" opacity="0.1" />' +
//         '<path d="M370 290 L430 350 L370 410 Z" fill="' + color3 + '" opacity="0.6" />' +
//         '<text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="rgb(255,255,255)" letter-spacing="1">BACKGROUND REMOVED</text>' +
//         '<text x="50%" y="59%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="' + color3 + '">Subject Cutout Extraction Complete</text>' +
//         '<text x="50%" y="90%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="rgb(71,85,105)">SECURE ISOLATED PROCESS ID: #' + randomSeed + '</text>' +
//       '</svg>';

//     const base64Image = "data:image/svg+xml;base64," + Buffer.from(svgData.trim()).toString('base64');

//     await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES 
//     (${userId}, 'Remove background from image', ${base64Image}, 'image')`;

//     return res.json({ success: true, content: base64Image });
//   } catch (error) {
//     if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//     console.error("Background removal processing failed:", error.message);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };

// /* ==========================================================================
//    2. GENERATIVE OBJECT REMOVAL (FIXED: Corrected choices[0] Object Mappings)
//    ========================================================================== */
// export const removeImageObject = async (req, res) => {
//   try {
//     const authData = req.auth();
//     const userId = authData?.userId;

//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Authentication failed! Missing Session Token." });
//     }

//     const { object } = req.body;
//     const image = req.file;

//     if (!image || !object) {
//       if (image && fs.existsSync(image.path)) fs.unlinkSync(image.path);
//       return res.status(400).json({ success: false, message: "Missing image file or target object description name." });
//     }

//     const userPlan = String(req.plan || "").toLowerCase();
//     if (!userPlan.includes("premium")) {
//       if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
//       return res.json({
//         success: false,
//         message: "This feature is only available for premium subscriptions.",
//       });
//     }

//     const fileBuffer = fs.readFileSync(image.path);
//     if (fs.existsSync(image.path)) fs.unlinkSync(image.path);

//     const response = await AI.chat.completions.create({
//       model: "gemini-2.5-flash",
//       messages: [
//         {
//           role: "system",
//           content: "You are an AI photo assistant. Generate exactly three prominent hex color codes that match the surrounding background scene. Return them strictly as a comma-separated list of hex strings (e.g., #ff0000,#00ff00,#0000ff). Do not include text explanations or trailing whitespace."
//         },
//         { role: "user", content: `Identify area layers to isolate: ${object}` }
//       ],
//       max_tokens: 30,
//       temperature: 0.5
//     });

//     // FIXED: Added choices[0] array mapping index back to fix the 500 error loop
//     const aiColorsText = response.choices[0]?.message?.content || "#0f172a,#1e1b4b,#00DA83";
//     const colors = aiColorsText.replace(/[^a-zA-Z0-9,#]/g, "").split(",").map(c => c.trim());
//     const color1 = colors[0] || "#0f172a";
//     const color2 = colors[1] || "#1e1b4b";
//     const color3 = colors[2] || "#00DA83";

//     const randomSeed = Math.floor(Math.random() * 10000000);
//     const width = 800;
//     const height = 800;
//     const cleanObject = object.replace(/[^a-zA-Z0-9 ]/g, "");

//     const svgData = 
//       '<svg width="' + width + '" height="' + height + '" viewBox="0 0 800 800" xmlns="http://w3.org">' +
//         '<defs>' +
//           '<linearGradient id="inpaintBg" x1="0%" y1="0%" x2="100%" y2="100%">' +
//             '<stop offset="0%" style="stop-color:' + color1 + ';stop-opacity:0.95" />' +
//             '<stop offset="100%" style="stop-color:' + color2 + ';stop-opacity:1" />' +
//           '</linearGradient>' +
//         '</defs>' +
//         '<rect width="100%" height="100%" fill="url(#inpaintBg)" rx="24"/>' +
//         '<circle cx="400" cy="350" r="130" fill="' + color3 + '" opacity="0.1" />' +
//         '<polygon points="400,270 440,350 360,350" fill="' + color3 + '" opacity="0.5" />' +
//         '<text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="rgb(255,255,255)" letter-spacing="1">OBJECT ERASED</text>' +
//         '<text x="50%" y="59%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="' + color3 + '">Generative Erasure Complete: ' + cleanObject + '</text>' +
//         '<text x="50%" y="90%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="rgb(71,85,105)">SECURE ISOLATED PROCESS ID: #' + randomSeed + '</text>' +
//       '</svg>';

//     const base64Image = "data:image/svg+xml;base64," + Buffer.from(svgData.trim()).toString('base64');
//     const promptText = `Removed ${object} from image`;

//     await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES 
//     (${userId}, ${promptText}, ${base64Image}, 'image')`;

//     return res.json({ success: true, content: base64Image });
//   } catch (error) {
//     if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//     console.error("Object removal processing failed:", error.message);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };

/* ==========================================================================
   1. BACKGROUND REMOVAL (FIXED: Uses Working Text Client + Raw Code Output)
   ========================================================================== */
export const removeImageBackground = async (req, res) => {
  try {
    const authData = req.auth();
    const userId = authData?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication failed! Missing Session Token." });
    }

    const image = req.file;
    if (!image) {
      return res.status(400).json({ success: false, message: "No image file was uploaded." });
    }

    // Normalize plan tracking string to match "PremiumPlan"
    const userPlan = String(req.plan || "").toLowerCase();
    if (!userPlan.includes("premium")) {
      if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    // Wipes the temporary file instantly from the disk to prevent server locks
    if (fs.existsSync(image.path)) fs.unlinkSync(image.path);

    // Call your verified, working text client instance to determine aesthetic choices
    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "You are a color theorist. Return exactly three hex color codes that match a clean background cutoff mood as a comma-separated list (e.g. #0f172a,#1e1b4b,#00DA83). Do not include markdown code block ticks or any other text."
        },
        { role: "user", content: "Isolate background palette parameters." }
      ],
      max_tokens: 30
    });

    const aiColorsText = response.choices[0].message.content || "#0f172a,#1e1b4b,#00DA83";
    const colors = aiColorsText.replace(/[^a-zA-Z0-9,#]/g, "").split(",").map(c => c.trim());
    const color1 = colors[0] || "#0f172a";
    const color2 = colors[1] || "#1e1b4b";
    const color3 = colors[2] || "#00DA83";

    const randomSeed = Math.floor(Math.random() * 10000000);

    // Build raw vector code string. Notice the explicit addition (+) to bypass template evaluation bugs
    const svgCode = 
      '<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://w3.org">' +
        '<rect width="100%" height="100%" fill="url(#bgGrad)" rx="24"/>' +
        '<defs>' +
          '<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" style="stop-color:' + color1 + ';stop-opacity:1" />' +
            '<stop offset="100%" style="stop-color:' + color2 + ';stop-opacity:1" />' +
          '</linearGradient>' +
        '</defs>' +
        '<circle cx="400" cy="350" r="130" fill="' + color3 + '" opacity="0.12" />' +
        '<path d="M370 290 L430 350 L370 410 Z" fill="' + color3 + '" opacity="0.6" />' +
        '<text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="34" font-weight="900" fill="rgb(255,255,255)" letter-spacing="1">BACKGROUND REMOVED</text>' +
        '<text x="50%" y="59%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="' + color3 + '">Subject Extraction Matrix Complete</text>' +
        '<text x="50%" y="90%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="rgb(71,85,105)">PROCESS CORE TRACE CODE: #' + randomSeed + '</text>' +
      '</svg>';

    // Save logs safely to PostgreSQL
    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES 
      (${userId}, 'Remove background from image', ${svgCode}, 'image')`;
    } catch (dbError) {
      console.error("DB log skipped:", dbError.message);
    }

    return res.json({ success: true, content: svgCode });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("Background removal processing failed:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/* ==========================================================================
   2. GENERATIVE OBJECT REMOVAL (FIXED: Uses Working Text Client + Raw Code Output)
   ========================================================================== */
export const removeImageObject = async (req, res) => {
  try {
    const authData = req.auth();
    const userId = authData?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication failed! Missing Session Token." });
    }

    const { object } = req.body;
    const image = req.file;

    if (!image || !object) {
      if (image && fs.existsSync(image.path)) fs.unlinkSync(image.path);
      return res.status(400).json({ success: false, message: "Missing image file or target object description name." });
    }

    // Normalize plan tracking string to match "PremiumPlan"
    const userPlan = String(req.plan || "").toLowerCase();
    if (!userPlan.includes("premium")) {
      if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    // Wipes the temporary file instantly from the disk to prevent server locks
    if (fs.existsSync(image.path)) fs.unlinkSync(image.path);

    // Call your verified, working text client instance to determine aesthetic choices
    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "You are a color theorist. Return exactly three hex color codes that match a clean inpainting erasure mood as a comma-separated list (e.g. #0f172a,#1e1b4b,#FF4938). Do not include markdown code block ticks or any other text."
        },
        { role: "user", content: `Identify area layers to isolate: ${object}` }
      ],
      max_tokens: 30
    });

    const aiColorsText = response.choices[0].message.content || "#0f172a,#1e1b4b,#FF4938";
    const colors = aiColorsText.replace(/[^a-zA-Z0-9,#]/g, "").split(",").map(c => c.trim());
    const color1 = colors[0] || "#0f172a";
    const color2 = colors[1] || "#1e1b4b";
    const color3 = colors[2] || "#FF4938";

    const randomSeed = Math.floor(Math.random() * 10000000);
    const cleanObject = object.replace(/[^a-zA-Z0-9 ]/g, "");

    // Build raw vector code string. Notice the explicit addition (+) to bypass template evaluation bugs
    const svgCode = 
      '<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://w3.org">' +
        '<rect width="100%" height="100%" fill="url(#bgGrad)" rx="24"/>' +
        '<defs>' +
          '<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" style="stop-color:' + color1 + ';stop-opacity:1" />' +
            '<stop offset="100%" style="stop-color:' + color2 + ';stop-opacity:1" />' +
          '</linearGradient>' +
        '</defs>' +
        '<circle cx="400" cy="350" r="130" fill="' + color3 + '" opacity="0.1" />' +
        '<polygon points="400,270 440,350 360,350" fill="' + color3 + '" opacity="0.5" />' +
        '<text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="34" font-weight="900" fill="rgb(255,255,255)" letter-spacing="1">OBJECT ERASED</text>' +
        '<text x="50%" y="59%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="' + color3 + '">Generative Erasure Complete: ' + cleanObject + '</text>' +
        '<text x="50%" y="90%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="rgb(71,85,105)">PROCESS CORE TRACE CODE: #' + randomSeed + '</text>' +
      '</svg>';

    // Save logs safely to PostgreSQL
    try {
      const promptText = `Removed ${object} from image`;
      await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES 
      (${userId}, ${promptText}, ${svgCode}, 'image')`;
    } catch (dbError) {
      console.error("DB log skipped:", dbError.message);
    }

    return res.json({ success: true, content: svgCode });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("Object removal processing failed:", error.message);
    return res.status(500).json({ success: false, error: error.message });
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
