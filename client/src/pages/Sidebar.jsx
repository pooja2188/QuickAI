// import { useClerk, useUser } from "@clerk/clerk-react";
// import { Eraser, Image, Hash, House, Scissors, SquarePen, FileText, Users } from "lucide-react";
// import React from "react";
// import { NavLink } from "react-router-dom";

// const navItems=[
//     {to:'/ai',label:'Dashboard',Icon:House},
//     {to:'/ai/write-article',label:'Write Article',Icon:SquarePen},
//     {to:'/ai/blog-titles',label:'Blog Titles',Icon:Hash},
//     {to:'/ai/generate-images',label:'Generatre Images',Icon:Image},
//     {to:'/ai/remove-background',label:'Remove Background',Icon:Eraser},
//     {to:'/ai/remove-object',label:'Remove Object',Icon:Scissors},
//     {to:'/ai/review-resume',label:'Review Resume',Icon:FileText},
//     {to:'/ai/community',label:'Community',Icon:Users}
// ]
// const Sidebar = ({ sidebar, setSidebar }) => {
//     const {user}=useUser()
//     const {signOut,openUserProfile}=useClerk()
//   return (
//     <div
//       className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"} transition-all duration-300 ease-in-out`}
//     >
//         <div className="my-7 w-full">
//             <img src={user.imageUrl} alt="User avatar" className="w-13 rounded-full mx-auto"/>
//             <h1 className="mt-1 text-center">{user.fullName}</h1>
//             <div>
//                 {navItems.map(({to,label,Icon})=>{
//                     <NavLink key={to} to={to} end={to==='/ai'} onClick={()=>setSidebar(false)} className={({isActive})=>`px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive? 'bg-linear-to-r from-[#3C81F6]  to-[#9234EA] text-white' : ''}`}>
//                         {({isActive})=>(
//                             <>
//                             <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`}/>
//                             {label}
//                             </>
//                         )}
//                     </NavLink>
//                 })}
//             </div> 
//         </div>
//     </div>
//   );
// };

// export default Sidebar;


import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import { Eraser, Image, Hash, House, Scissors, SquarePen, FileText, Users, LogOut } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
    { to: '/ai', label: 'Dashboard', Icon: House },
    { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
    { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash }, 
    { to: '/ai/generate-images', label: 'Generate Images', Icon: Image }, 
    { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
    { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
    { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
    { to: '/ai/community', label: 'Community', Icon: Users }
];

// props में Layout.jsx से आ रहे sidebar और setSidebar को मैच किया गया है
const Sidebar = ({ sidebar, setSidebar }) => {
    const { user, isLoaded, isSignedIn } = useUser();
    const { signOut, openUserProfile } = useClerk();

    // 1. अगर क्लर्क लोड हो रहा है, तो क्रैश होने से बचाएं
    if (!isLoaded) {
        return <div className="w-60 bg-white border-r border-gray-200" />;
    }

    // 2. अगर यूजर लॉगआउट हो चुका है, तो सुरक्षित फॉलबैक दिखाएं
    if (!isSignedIn || !user) {
        return (
            <div className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-center items-center max-sm:absolute top-14 bottom-0 ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"} transition-all duration-300 ease-in-out`}>
                <a href="/sign-in" className="text-sm font-semibold text-indigo-600 hover:underline">
                    Sign In to View App
                </a>
            </div>
        );
    }

    return (
        <div
            className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"} transition-all duration-300 ease-in-out z-50`}
        >
            <div className="my-7 w-full">
                {/* यूजर प्रोफाइल हेडर */}
                <div className="mb-6 text-center">
                    <img 
                        src={user.imageUrl} 
                        alt="User avatar" 
                        className="w-12 h-12 rounded-full mx-auto cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => openUserProfile()}
                    />
                    <h1 className="mt-2 font-medium text-slate-800 text-sm">{user.fullName}</h1>
                </div>

                {/* सुधरा हुआ नेविगेशन लूप */}
                <div className="px-6 mt-5 text-sm text-gray-600 font-medium">
                    {navItems.map(({ to, label, Icon }) => (
                        <NavLink 
                            key={to} 
                            to={to} 
                            end={to === '/ai'} 
                            onClick={() => setSidebar(false)} // लिंक क्लिक होने पर मोबाइल में साइडबार बंद होगा
                            className={({ isActive }) => 
                                `px-4 py-2.5 flex items-center gap-3 rounded-lg text-sm font-medium transition-all ${
                                    isActive 
                                    ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white shadow-md shadow-blue-500/10' 
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                    <span>{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div> 
            </div>

            <div className="w-full p-4 px-7 border-t border-gray-200 flex items-center justify-between">
                <div onClick={openUserProfile} className="flex gap-2 items-center cursor-pointer">
                    <img src={user.imageUrl} className="w-8 rounded-full" alt=""/>
                    <div>
                        <h1 className="text-sm font-medium">{user.fullName}</h1>
                        <p className="text-xs text-gray-500">
                            <Protect plan='premium' fallback='Free'>Premium</Protect>
                            Plan
                        </p>
                    </div>
                    <LogOut onClick={signOut} className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"/>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
