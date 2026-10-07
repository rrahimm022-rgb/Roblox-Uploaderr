export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 const id=req.query?.id;if(!id)return res.status(400).json({error:'Operation id required'});const key=process.env.ROBLOX_API_KEY;if(!key)return res.status(500).json({error:'ROBLOX_API_KEY missing'});
 const r=await fetch('https://apis.roblox.com/assets/v1/operations/'+encodeURIComponent(id),{headers:{'x-api-key':key}});const t=await r.text();res.status(r.status).send(t);
}
