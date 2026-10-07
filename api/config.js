export default function handler(req,res){
 if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
 const configured=Boolean(process.env.ROBLOX_API_KEY && process.env.ROBLOX_CREATOR_ID && process.env.ROBLOX_CREATOR_TYPE);
 res.status(200).json({configured,creatorId:process.env.ROBLOX_CREATOR_ID||null,creatorType:process.env.ROBLOX_CREATOR_TYPE||null});
}
