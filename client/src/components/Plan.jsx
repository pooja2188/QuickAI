// import React from 'react'
// import { useUser } from '@clerk/clerk-react'

// function Plan() { 
//   // Clerk से यूजर का लॉगिन स्टेटस (isSignedIn) और डेटा निकालना
//   const { user, isSignedIn } = useUser();
//   const clerkUserId = user?.id || "";

//   // ✅ LIVE PLAN DETECTION: क्लर्क के डेटाबेस से यूज़र का असली एक्टिव प्लान रीड करें
//   const currentActivePlan = user?.privateMetadata?.plan || 'free';
//   const isPremiumUser = currentActivePlan === 'premium';

//   // आपका असली Stripe चेकआउट लिंक
//   const baseStripeUrl = "https://buy.stripe.com/test_00wbIVaTh5dL3cX6Cu6AM00";
//   const stripeCheckoutUrl = `${baseStripeUrl}?client_reference_id=${clerkUserId}`;

//   return (
//     <div className='max-w-5xl mx-auto z-20 my-30 px-4 font-sans'>
//       {/* 1. Header Typography */}
//       <div className='text-center'>
//         <h2 className='text-slate-700 text-[42px] font-semibold tracking-tight'>Choose Your Plan</h2>
//         <p className='text-gray-500 max-w-lg mx-auto mt-2 text-sm md:text-base'>
//           Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
//         </p>
//       </div>
      
//       {/* 2. Responsive Pricing Grid */}
//       <div className='mt-14 max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-4'>
        
//         {/* ==================== FREE PLAN CARD ==================== */}
//         <div className={`bg-white p-8 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[400px] transition-all ${
//           !isSignedIn ? 'opacity-60 grayscale-[20%] border-gray-200' : (!isPremiumUser ? 'border-emerald-500 shadow-md shadow-emerald-500/5 border-2' : 'border-gray-200')
//         }`}>
//           <div>
//             <div className='flex justify-between items-center mb-1'>
//               <h3 className='text-xl font-bold text-slate-800'>Free</h3>
//               {/* ✅ FIXED: "Active Plan" बैज केवल तभी दिखेगा जब यूज़र सच में फ्री प्लान पर होगा! */}
//               {isSignedIn && !isPremiumUser && (
//                 <span className='bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse'>
//                   Active Plan
//                 </span>
//               )}
//             </div>
//             <p className='text-xs text-gray-400 mb-6'>Perfect for exploring the foundational tools.</p>
//             <div className='flex items-baseline gap-1 mb-6'>
//               <span className='text-4xl font-extrabold text-slate-800'>$0</span>
//               <span className='text-gray-400 text-xs font-medium'>/ month</span>
//             </div>
//             <ul className='space-y-3.5 mb-8 text-sm text-slate-600 font-medium'>
//               <li className='flex items-center gap-2.5'><span className='text-indigo-600 font-bold mr-1'>✓</span> Basic Title Generation</li>
//               <li className='flex items-center gap-2.5'><span className='text-indigo-600 font-bold mr-1'>✓</span> 3 Free Articles per month</li>
//               <li className='flex items-center gap-2.5'><span className='text-indigo-600 font-bold mr-1'>✓</span> Standard Dashboard Access</li>
//             </ul>
//           </div>

//           {!isSignedIn ? (
//             <a href="/sign-in" className='w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl text-center block hover:bg-gray-800'>
//               Sign In to Activate
//             </a>
//           ) : !isPremiumUser ? (
//             <button className='w-full py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl cursor-default shadow-sm shadow-emerald-500/10'>
//               Current Plan
//             </button>
//           ) : (
//             <button className='w-full py-2.5 bg-gray-100 text-gray-400 text-sm font-semibold rounded-xl cursor-not-allowed border'>
//               Downgrade
//             </button>
//           )}
//         </div>

//         {/* ==================== PREMIUM PLAN CARD ==================== */}
//         <div className={`bg-white p-8 rounded-2xl border shadow-md flex flex-col justify-between min-h-[400px] relative transition-all ${
//           !isSignedIn ? 'opacity-60 grayscale-[20%] border-gray-200' : (isPremiumUser ? 'border-indigo-600 border-2 shadow-indigo-600/10' : 'border-gray-200')
//         }`}>
//           <span className='absolute -top-3 right-6 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm'>
//             Popular
//           </span>
//           <div>
//             <div className='flex justify-between items-center mb-1'>
//               <h3 className='text-xl font-bold text-slate-800'>Premium</h3>
//               {/* ✅ FIXED: "Active Plan" बैज प्रीमियम यूज़र होने पर यहाँ दिखाई देगा! */}
//               {isSignedIn && isPremiumUser && (
//                 <span className='bg-indigo-50 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse border border-indigo-200'>
//                   Active Plan
//                 </span>
//               )}
//             </div>
//             <p className='text-xs text-gray-400 mb-6'>Unlock advanced generation features for professional workflows.</p>
//             <div className='flex items-baseline gap-1 mb-6'>
//               <span className='text-4xl font-extrabold text-slate-800'>$16</span>
//               <span className='text-gray-400 text-xs font-medium'>/ month</span>
//             </div>
//             <ul className='space-y-3.5 mb-8 text-sm text-slate-600 font-medium'>
//               <li className='flex items-center gap-2.5'><span className='text-indigo-600 font-bold mr-1'>✓</span> Unlimited Title Generation</li>
//               <li className='flex items-center gap-2.5'><span className='text-indigo-600 font-bold mr-1'>✓</span> Unlimited Article Generation</li>
//               <li className='flex items-center gap-2.5'><span className='text-indigo-600 font-bold mr-1'>✓</span> Priority Support Channels</li>
//               <li className='flex items-center gap-2.5'><span className='text-indigo-600 font-bold mr-1'>✓</span> Advanced AI Writing Assistant</li>
//             </ul>
//           </div>
          
//           {/* ✅ FIXED BUTTON LOGIC: अगर यूजर पहले से प्रीमियम है, तो बटन डिसएबल (Current Plan) हो जाएगा */}
//           {!isSignedIn ? (
//             <a href="/sign-in" className='w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl text-center shadow-md shadow-indigo-600/10 block'>
//               Sign In to Upgrade
//             </a>
//           ) : isPremiumUser ? (
//             <button className='w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl cursor-default shadow-md shadow-indigo-600/10'>
//               Current Plan
//             </button>
//           ) : (
//             <a 
//               href={stripeCheckoutUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className='w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl text-center shadow-md shadow-indigo-600/10 transition-all block'
//             >
//               Upgrade to Premium
//             </a>
//           )}
//         </div>

//       </div>
//     </div>
//   )
// }

// export default Plan



import React from 'react'
import { PricingTable } from '@clerk/clerk-react'

const Plan=()=> {

  return (
    <div className='max-w-5xl mx-auto z-20 my-30'>
      {/* 1. Header Typography */}
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold tracking-tight'>Choose Your Plan</h2>
        <p className='text-gray-500 max-w-lg mx-auto mt-2 text-sm md:text-base'>
          Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>
      <div className='mt-14 max-sm:mx-8'>
          <PricingTable/>
      </div>
    </div>
  )
};

export default Plan