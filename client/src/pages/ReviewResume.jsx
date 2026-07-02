// import React, { useState } from 'react'
// import { FileText, Sparkles } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useAuth } from '@clerk/clerk-react';
// import Markdown from 'react-markdown';

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// const ReviewResume = () => {
//   const [fileInput, setFileInput] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [content, setContent] = useState("");

//   const { getToken } = useAuth();

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     if (!fileInput) return toast.error("Please select a PDF file first.");

//     try {
//       setLoading(true);
//       setContent("");

//       // FIXED: Build a clean MultiPart FormData envelope to stream the file cleanly to Multer
//       const formData = new FormData();
//       formData.append("resume", fileInput);

//       const response = await axios.post(
//         "/api/ai/resume-review",
//         formData,
//         { 
//           headers: { 
//             Authorization: `Bearer ${await getToken()}`,
//             "Content-Type": "multipart/form-data" 
//           } 
//         }
//       );

//       if (response.data && response.data.success) {
//         setContent(response.data.content);
//         toast.success("Resume audited successfully!");
//       } else {
//         toast.error(response.data?.message || "Generation failed.");
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message;
//       toast.error("Audit failed: " + errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
//       <form
//         onSubmit={onSubmitHandler}
//         className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
//       >
//         <div className="flex items-center gap-3">
//           <Sparkles className="w-6 text-[#00DA83]" />
//           <h1 className="text-xl font-semibold">Resume Review</h1>
//         </div>

//         <p className="mt-6 text-sm font-medium text-slate-700">Upload Resume File (PDF)</p>
//         <input
//           onChange={(e) => setFileInput(e.target.files[0])}
//           type="file"
//           accept="application/pdf"
//           className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-700 bg-slate-50/50"
//           required
//         />
//         <p className='text-xs text-gray-400 mt-1'>Upload your official PDF document to parse metrics directly.</p>

//         <button 
//           disabled={loading}
//           type="submit"
//           className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer font-medium shadow-sm hover:opacity-95 transition-opacity"
//         >
//           {loading ? (
//             <span className="w-4 h-4 my-1 rounded-full border-2 border-white border-t-transparent animate-spin" ></span>
//           ) : (
//             <>
//               <FileText className="w-5" />
//               <span>Review Resume</span>
//             </>
//           )}
//         </button>
//       </form>

//       <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-hidden shadow-sm">
//         <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
//           <FileText className="w-5 h-5 text-[#00DA83]" />
//           <h1 className="text-xl font-semibold">Analysis Results</h1>
//         </div>

//         {!content ? (
//           <div className="flex-1 flex justify-center items-center py-20">
//             <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center">
//               <FileText className="w-9 h-9 stroke-1" />
//               <p>Upload a PDF resume and click "Review Resume" to view your feedback report.</p>
//             </div>
//           </div>
//         ) : (
//           <div className='mt-3 flex-1 overflow-y-scroll text-sm text-slate-600 leading-relaxed prose max-w-none w-full pb-4'>
//             <div className='reset-tw'>
//               <Markdown>{content}</Markdown>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ReviewResume;


import React, { useState } from 'react';
import { FileText, Sparkles } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from '@clerk/clerk-react';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [fileInput, setFileInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!fileInput) return toast.error("Please select a PDF file first.");

    try {
      setLoading(true);
      setContent("");

      const token = await getToken();
      if (!token) {
        toast.error("Authentication session missing. Please re-login.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("resume", fileInput);

      const response = await axios.post(
        "/api/ai/resume-review",
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          } 
        }
      );

      if (response.data && response.data.success) {
        setContent(response.data.content);
        toast.success("Resume audited successfully!");
      } else {
        toast.error(response.data?.message || "Generation failed.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error("Audit failed: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>

        <p className="mt-6 text-sm font-medium text-slate-700">Upload Resume File (PDF)</p>
        <input
          onChange={(e) => setFileInput(e.target.files[0])}
          type="file"
          accept="application/pdf"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-700 bg-slate-50/50"
          required
        />
        <p className='text-xs text-gray-400 mt-1'>Upload your official PDF document to parse metrics directly.</p>

        <button 
          disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer font-medium shadow-sm hover:opacity-95 transition-opacity"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-white border-t-transparent animate-spin" ></span>
          ) : (
            <>
              <FileText className="w-5" />
              <span>Review Resume</span>
            </>
          )}
        </button>
      </form>

      {/* Analysis Results Display Box */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 h-[600px] shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
          <FileText className="w-5 h-5 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center py-20">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center">
              <FileText className="w-9 h-9 stroke-1" />
              <p>Upload a PDF resume and click "Review Resume" to view your feedback report.</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex-1 overflow-y-auto text-sm text-slate-600 leading-relaxed max-w-none w-full pb-4 pr-1">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewResume;
