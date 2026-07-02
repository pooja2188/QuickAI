// import { useState } from "react";
// import React from "react";
// import { Edit, Sparkles, Image } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "@clerk/clerk-react";
// import toast from "react-hot-toast";

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
// const Generateimages = () => {
//   const imageStyle = [
//     "Realistic",
//     "Ghibli style",
//     "Anime style",
//     "Cartoon style",
//     "Fantasy style",
//     "3D style",
//     "Portrait style",
//   ];
//   const [selectedStyle, setSelectedStyle] = useState("Realistic");
//   const [input, setInput] = useState("");
//   const [publish, setPublish] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [content, setContent] = useState("");
//   const { getToken } = useAuth();
//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
//       const response = await axios.post(
//         "/api/ai/generate-image",
//         { prompt, publish },
//         { headers: { Authorization: `Bearer ${await getToken()}` } },
//       );

//       if (response.data && response.data.success) {
//         setContent(response.data.content);
//       } else {
//         toast.error(response.data?.message || "Generation failed.");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//     setLoading(false);
//   };
//   return (
//     <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
//       <form
//         onSubmit={onSubmitHandler}
//         className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
//       >
//         <div className="flex items-center gap-3">
//           <Sparkles className="w-6 text-[#00AD25]" />
//           <h1 className="text-xl font-semibold">AI Image Generation</h1>
//         </div>
//         <p className="mt-6 text-sm font-medium">Describe your image</p>
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           type="text"
//           rows={4}
//           className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
//           placeholder="Describe what you want to see in the image..."
//           required
//         />
//         <p className="mt-4 text-sm font-medium">Style</p>
//         <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
//           {imageStyle.map((item) => (
//             <span
//               onClick={() => setSelectedStyle(item)}
//               className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item ? "bg-green-50 text-green-700" : " text-gray-500 border-gray-300"}`}
//               key={item}
//             >
//               {item}
//             </span>
//           ))}
//         </div>
//         <div className="my-6 flex items-center gap-2">
//           <label className="relative cursor-pointer flex items-center gap-3 select-none">
//             <input
//               type="checkbox"
//               onChange={(e) => setPublish(e.target.checked)}
//               checked={publish}
//               className="sr-only peer"
//             />
//             <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
//             <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
//             <p className="text-sm text-slate-700 font-medium">
//               Make this image Public
//             </p>
//           </label>
//         </div>
//         <button
//           disabled={loading}
//           type="submit"
//           className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
//         >
//           {loading ? (
//             <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
//           ) : (
//             <Image className="w-5" />
//           )}
//           Generate Image
//         </button>
//       </form>

//       <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
//         <div className="flex items-center gap-3">
//           <Image className="w-5 h-5 text-[#00AD25]" />
//           <h1 className="text-xl font-semibold">Generated image</h1>
//         </div>

//         {!content ? (
//           <div className="flex-1 flex justify-center items-center">
//             <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
//               <Image className="w-9 h-9" />
//               <p>Enter a topic and click "Generate image" to get started</p>
//             </div>
//           </div>
//         ) : (
//           <div className="mt-3 h-full">
//             <img src={content} alt="image" className="w-full h-full" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Generateimages;


// import { useState } from "react";
// import React from "react";
// import { Sparkles, Image } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "@clerk/clerk-react";
// import toast from "react-hot-toast";

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// const Generateimages = () => {
//   const imageStyle = [
//     "Realistic",
//     "Ghibli style",
//     "Anime style",
//     "Cartoon style",
//     "Fantasy style",
//     "3D style",
//     "Portrait style",
//   ];
  
//   const [selectedStyle, setSelectedStyle] = useState("Realistic");
//   const [input, setInput] = useState("");
//   const [publish, setPublish] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [content, setContent] = useState("");
//   const { getToken } = useAuth();

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setContent(""); 
      
//       const response = await axios.post(
//         "/api/ai/generate-image",
//         { prompt: input, style: selectedStyle, publish },
//         { headers: { Authorization: `Bearer ${await getToken()}` } },
//       );

//       if (response.data && response.data.success) {
//         setContent(response.data.content);
//         toast.success("AI Image generated successfully!");
//       } else {
//         toast.error(response.data?.message || "Generation failed.");
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message;
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
//       <form
//         onSubmit={onSubmitHandler}
//         className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
//       >
//         <div className="flex items-center gap-3">
//           <Sparkles className="w-6 text-[#00AD25]" />
//           <h1 className="text-xl font-semibold">AI Image Generation</h1>
//         </div>
        
//         <p className="mt-6 text-sm font-medium">Describe your image</p>
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           rows={4}
//           className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 resize-none focus:border-green-500"
//           placeholder="Describe what you want to see in the image..."
//           required
//         />
        
//         <p className="mt-4 text-sm font-medium">Style</p>
//         <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
//           {imageStyle.map((item) => (
//             <span
//               key={item}
//               onClick={() => setSelectedStyle(item)}
//               className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-colors ${
//                 selectedStyle === item 
//                   ? "bg-green-50 text-green-700 border-green-300 font-medium" 
//                   : "text-gray-500 border-gray-300 hover:border-gray-400"
//               }`}
//             >
//               {item}
//             </span>
//           ))}
//         </div>
        
//         <div className="my-6 flex items-center gap-2">
//           <label className="relative cursor-pointer flex items-center gap-3 select-none">
//             <input
//               type="checkbox"
//               onChange={(e) => setPublish(e.target.checked)}
//               checked={publish}
//               className="sr-only peer"
//             />
//             <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
//             <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
//             <p className="text-sm text-slate-700 font-medium">Make this image Public</p>
//           </label>
//         </div>
        
//         <button
//           disabled={loading}
//           type="submit"
//           className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50"
//         >
//           {loading ? (
//             <span className="w-4 h-4 my-1 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
//           ) : (
//             <>
//               <Image className="w-5" />
//               <span>Generate Image</span>
//             </>
//           )}
//         </button>
//       </form>

//       <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
//         <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
//           <Image className="w-5 h-5 text-[#00AD25]" />
//           <h1 className="text-xl font-semibold">Generated image</h1>
//         </div>

//         {!content ? (
//           <div className="flex-1 flex justify-center items-center">
//             <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
//               <Image className="w-9 h-9 stroke-1" />
//               <p>Enter a topic and click "Generate image" to get started</p>
//             </div>
//           </div>
//         ) : (
//           <div className="mt-4 w-full rounded-xl overflow-hidden border border-slate-100 shadow-sm flex justify-center items-center p-1 bg-slate-50/50">
//             <img 
//               src={content} 
//               alt="AI Graphic Result Layout" 
//               className="w-full h-auto object-contain max-h-[400px] rounded-lg" 
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Generateimages;


import { useState } from "react";
import React from "react";
import { Sparkles, Image } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Generateimages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "3D style",
    "Portrait style",
  ];
  
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  // const onSubmitHandler = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     setContent(""); 
      
  //     const response = await axios.post(
  //       "/api/ai/generate-image",
  //       { prompt: input, style: selectedStyle, publish },
  //       { headers: { Authorization: `Bearer ${await getToken()}` } },
  //     );

  //     if (response.data && response.data.success) {
  //       setContent(response.data.content);
  //       toast.success("AI Image generated successfully!");
  //     } else {
  //       toast.error(response.data?.message || "Generation failed.");
  //     }
  //   } catch (error) {
  //     const errorMsg = error.response?.data?.message || error.message;
  //     toast.error(errorMsg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmitHandler = async (e) => {
  e.preventDefault();
  if (!input) return toast.error("Please provide a prompt description.");

  try {
    setLoading(true);
    setContent(""); 
    
    const token = await getToken();
    if (!token) {
      toast.error("Clerk session context missing. Please refresh your page.");
      setLoading(false);
      return;
    }

    // ✨ ENHANCEMENT: Combine description with selection style context for Clipdrop
    const compiledPrompt = `${input}, ${selectedStyle}`;

    const response = await axios.post(
      "/api/ai/generate-image",
      { prompt: compiledPrompt, publish },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data && response.data.success) {
      setContent(response.data.content);
      toast.success("AI Image generated successfully!");
    } else {
      // ✨ FIX: Fallback to the 'error' key if 'message' is absent inside custom payloads
      toast.error(response.data?.message || response.data?.error || "Generation failed.");
    }
  } catch (error) {
    // ✨ FIX: Match custom Express handling syntax rules precisely
    const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700 bg-slate-50/20">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold text-slate-800">AI Image Generation</h1>
        </div>
        
        <p className="mt-6 text-sm font-medium text-slate-700">Describe your image</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full p-3 mt-2 outline-none text-sm rounded-lg border border-gray-300 resize-none focus:border-green-500 bg-slate-50/40"
          placeholder="Describe what you want to see in the image..."
          required
        />
        
        <p className="mt-4 text-sm font-medium text-slate-700">Style</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {imageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1.5 border rounded-full cursor-pointer transition-colors ${
                selectedStyle === item 
                  ? "bg-green-50 text-green-700 border-green-400 font-medium" 
                  : "text-slate-500 border-gray-300 bg-white"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        
        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer flex items-center gap-3 select-none">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
            <p className="text-sm text-slate-700 font-medium">Make this image Public</p>
          </label>
        </div>
        
        <button
          disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2.5 mt-6 text-sm rounded-xl font-semibold cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          ) : (
            <>
              <Image className="w-4 h-4" />
              <span>Generate Image</span>
            </>
          )}
        </button>
      </form>

      <div className="w-full max-w-lg p-5 bg-white rounded-xl flex flex-col border border-gray-200 min-h-[450px] shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <Image className="w-5 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold text-slate-800">Generated image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center py-20">
            <div className="text-sm flex flex-col items-center gap-4 text-gray-400 text-center max-w-xs">
              <Image className="w-10 h-10 stroke-1" />
              <p>Enter a topic and click "Generate image" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-5 w-full flex-1 flex items-center justify-center p-1 bg-slate-900 rounded-xl border border-slate-100 min-h-[350px]">
            <img 
              src={content} 
              alt="AI Generated Output Preview" 
              className="w-full h-auto object-contain max-h-[400px] rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Generateimages;
