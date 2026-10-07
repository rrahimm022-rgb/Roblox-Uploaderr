export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 const key=process.env.ROBLOX_API_KEY;
 if(!key) return res.status(500).json({ok:false,error:'ROBLOX_API_KEY is not configured on Vercel.'});
 try{
  const r=await fetch('https://apis.roblox.com/assets/v1/assets/0',{headers:{'x-api-key':key}});
  if(r.status===401||r.status===403) return res.status(200).json({ok:false,error:'Roblox rejected the API key. Check key permissions and creator access.'});
  return res.status(200).json({ok:true,message:'API key reached Roblox Open Cloud.'});
 }catch(e){return res.status(500).json({ok:false,error:e.message});}
}
