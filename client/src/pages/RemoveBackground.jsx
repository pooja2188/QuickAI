// import React, { useState } from "react";
// import { Eraser, Loader, Sparkles } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "@clerk/clerk-react";
// import toast from "react-hot-toast";

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// const RemoveBackground = () => {
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [content, setContent] = useState("");

//   const { getToken } = useAuth();
//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const formData=new FormData()
//       formData.append('image',input)
//       const response = await axios.post(
//         "/api/ai/remove-image-background", formData,
//         { headers: { Authorization: `Bearer ${await getToken()}` } },
//       );

//       if (response.data && response.data.success) {
//         setContent(response.data.content);
//         toast.success("Image generated successfully!");
//       } else {
//         toast.error(response.data?.message || "Generation failed.");
//       }
//     } catch (error) {
//       const errorMsg =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message;
//       toast.error(errorMsg);
//     }
//     setLoading(false)
//   };
//   return (
//     <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
//       <form
//         onSubmit={onSubmitHandler}
//         className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
//       >
//         <div className="flex items-center gap-3">
//           <Sparkles className="w-6 text-[#FF4938]" />
//           <h1 className="text-xl font-semibold">Background Removal</h1>
//         </div>

//         <p className="mt-6 text-sm font-medium text-slate-700">Upload image</p>
//         <input
//           onChange={(e) => setInput(e.target.files[0])}
//           type="file"
//           accept="image/*"
//           className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
//           required
//         />

//         <p className="text-sm text-gray-500 font-light mt-1">
//           Supports JPG, PNG, and other image formats
//         </p>

//         <button disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
//           {
//             loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
//             : <Eraser className="w-5" />
//           }
//           Remove background
//         </button>
//       </form>

//       <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
//         <div className="flex items-center gap-3">
//           <Eraser className="w-5 h-5 text-[#FF4938]" />
//           <h1 className="text-xl font-semibold">Processed image</h1>
//         </div>

//         {
//           !content ? (<div className="flex-1 flex justify-center items-center">
//           <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
//             <Eraser className="w-9 h-9" />
//             <p>Upload an image and click "Remove Background" to get started</p>
//           </div>
//         </div>
//           ) : (
//             <img src={content} alt="image" className="mt-3 w-full h-full"/>
//           )
//         }

//       </div>
//     </div>
//   );
// };

// export default RemoveBackground;


import React, { useState } from "react";
import { Eraser, Sparkles } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return toast.error("Please pick an image file first.");

    try {
      setLoading(true);
      setContent("");

      const formData = new FormData();
      formData.append("image", input);

      const response = await axios.post(
        "/api/ai/remove-image-background", 
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${await getToken()}`,
            "Content-Type": "multipart/form-data"
          } 
        }
      );

      if (response.data && response.data.success) {
        setContent(response.data.content);
        toast.success("Background isolated successfully!");
      } else {
        toast.error(response.data?.message || "Extraction failed.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Safe wrapper function to compile the vector code inside a browser document viewport context
  const getIframeCode = () => {
    return `
      <html style="margin:0;padding:0;overflow:hidden;background:#0f172a;">
        <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;width:100vw;">
          ${content}
        </body>
      </html>
    `;
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700 bg-slate-50/20">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold text-slate-800">Background Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium text-slate-700">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-2.5 px-3 mt-2 outline-none text-sm rounded-lg border border-gray-300 text-gray-600 bg-slate-50/50"
          required
        />

        <button 
          disabled={loading} 
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2.5 mt-8 text-sm rounded-xl font-semibold cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          ) : (
            <>
              <Eraser className="w-4 h-4" />
              <span>Remove Background</span>
            </>
          )}
        </button>
      </form>

      <div className="w-full max-w-lg p-5 bg-white rounded-xl flex flex-col border border-gray-200 min-h-[400px] shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold text-slate-800">Processed Cutout</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center py-20">
            <div className="text-sm flex flex-col items-center gap-4 text-gray-400 text-center">
              <Eraser className="w-10 h-10 stroke-1" />
              <p>Upload an asset canvas file layout and initialize background removal processing loops.</p>
            </div>
          </div>
        ) : (
          /* FIXED: Renders the backend code seamlessly inside an iframe block without collapsing */
          <div className="mt-5 w-full flex-1 border border-slate-200 rounded-xl overflow-hidden shadow-inner min-h-[340px]">
            <iframe
              srcDoc={getIframeCode()}
              title="Cutout Viewport"
              className="w-full h-[340px] border-none bg-slate-900"
              scrolling="no"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
