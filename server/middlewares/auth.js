import { clerkClient } from "@clerk/express";
export const auth=async(req,res,next)=>{
    try{
        const {userId,has}=await req.auth();
        const hasPremiumPlan=await  has({plan:'premium'});
        const user=await clerkClient.users.getUser(userId)
        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage=user.privateMetadata.free_usage
        } else{
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata:{
                    free_usage:0
                }
            })
            req.free_usage=0;
        }
        req.plan=hasPremiumPlan?'premium':'free'
        next()
    }catch(error){ 
        res.json({success:false,message:error.message})
    }
}

// import { clerkClient, getAuth } from "@clerk/express";

// export const auth = async (req, res, next) => {
//     try {
//         const authData = getAuth(req); 
//         const userId = authData?.userId;
//         const has = authData?.has;

//         // Guard against missing user IDs
//         if (!userId) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: "Unauthorized. Missing or invalid Clerk session token in headers." 
//             });
//         }

//         // Fetch user data directly from Clerk to inspect raw metadata overrides
//         const user = await clerkClient.users.getUser(userId);
//         const privateMeta = user.privateMetadata || {};
//         const sessionClaims = authData?.sessionClaims || {};

//         // 1. FIX: Comprehensive check for Premium Status across all locations (Hooks, Claims, & Meta)
//         const builtInPremium = has ? has({ plan: 'premium' }) : false;
//         const metadataPremium = privateMeta.plan === 'premium' || privateMeta.plan === 'u:premium';
//         const claimPremium = sessionClaims.pla === 'premium' || sessionClaims.pla === 'u:premium';

//         const isPremiumUser = builtInPremium || metadataPremium || claimPremium;

//         // 2. Process Usage tier boundaries based on evaluated tier outcome
//         if (isPremiumUser) {
//             req.plan = 'premium';
//             req.free_usage = 0; // Premium users bypass free usage boundaries completely
//         } else {
//             req.plan = 'free';
//             const currentUsage = privateMeta.free_usage;
            
//             if (currentUsage !== undefined && currentUsage !== null) {
//                 req.free_usage = Number(currentUsage);
//             } else {
//                 // Initialize usage tracking safely for first-time active free users
//                 await clerkClient.users.updateUserMetadata(userId, {
//                     privateMetadata: { free_usage: 0 }
//                 });
//                 req.free_usage = 0;
//             }
//         }

//         next();
//     } catch (error) { 
//         console.error("Authentication Middleware Error:", error.message);
//         res.status(401).json({ success: false, message: error.message });
//     }
// };
