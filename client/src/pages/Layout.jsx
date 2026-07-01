import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, Sidebar as sidebarIcon, X } from "lucide-react";
import {SignIn, useUser } from "@clerk/clerk-react";
import Sidebar from "./Sidebar"; 
const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setsidebar] = useState();
  const {user}=useUser()
  return user ? (
    <div className="flex flex-col items-start justify-start h-screen">
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200">
        <img className="cursor-pointer w-32 sm:w-44" src={assets.logo} alt="" onClick={() => navigate("/")}/>
        {sidebar ? (
          <X onClick={()=>setsidebar(false)} className="w-6 h-6 text-gray-600 sm:hidden" />
        ) : (
          <Menu onClick={()=>setsidebar(true)} className="w-6 h-6 text-gray-600 sm:hidden" />
        )}
      </nav>

      <div  className="flex-1 w-full flex h-[calc(100vh-64px)]">
        <Sidebar sidebar={sidebar} setsidebar={setsidebar}/>
        <div className='flex-1 bg-[#F4F7FB]'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn/>
    </div>
  )
};

export default Layout;


// import React, { useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { assets } from "../assets/assets";
// // Lucide-react के Sidebar आइकॉन का नाम बदलकर SidebarIcon किया गया ताकि नेमिंग क्लैश न हो
// import { Menu, Sidebar as SidebarIcon, X } from "lucide-react"; 
// import { SignIn, useUser } from "@clerk/clerk-react";

// // आपकी ऊपर वाली कस्टम साइडबार फ़ाइल का इंपोर्ट
// import Sidebar from "./Sidebar"; 

// const Layout = () => {
//   const navigate = useNavigate();
//   // साइडबार स्टेट (डिफ़ॉल्ट रूप से बंद यानी false)
//   const [sidebar, setSidebar] = useState(false); 
//   const { user, isLoaded } = useUser();

//   // जब तक क्लर्क लोड हो रहा है, ब्लैंक फ़्लिकरिंग होने से बचाएं
//   if (!isLoaded) {
//     return <div className="h-screen w-full bg-[#F4F7FB]" />;
//   }

//   return user ? (
//     <div className="flex flex-col items-start justify-start h-screen">
//       {/* टॉप नेविगेशन बार */}
//       <nav className="w-full px-8 min-h-14 h-14 bg-white flex items-center justify-between border-b border-gray-200 z-50">
//         <img 
//           src={assets.logo} 
//           alt="Logo" 
//           onClick={() => navigate("/")} 
//           className="cursor-pointer h-7" 
//         />
        
//         {/* मोबाइल स्क्रीन हैमबर्गर मेनू कंट्रोल्स */}
//         {sidebar ? (
//           <X onClick={() => setSidebar(false)} className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer" />
//         ) : (
//           <Menu onClick={() => setSidebar(true)} className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer" />
//         )}
//       </nav>

//       {/* मुख्य डैशबोर्ड ग्रिड पैनल */}
//       <div className="flex-1 w-full flex h-[calc(100vh-56px)] overflow-hidden">
//         {/* प्रॉप्स को बिना किसी स्पेलिंग मिसमैच के बिलकुल सही तरीके से पास किया गया है */}
//         <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        
//         <div className="flex-1 bg-[#F4F7FB] overflow-y-auto">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   ) : (
//     <div className="flex items-center justify-center h-screen bg-slate-50">
//       <SignIn />
//     </div>
//   );
// };

// export default Layout;
