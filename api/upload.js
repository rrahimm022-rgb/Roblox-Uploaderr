export const config={api:{bodyParser:false}};
async function readMultipart(req){const chunks=[];for await(const c of req)chunks.push(c);return Buffer.concat(chunks)}
function getBoundary(ct){const m=ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);return m&&(m[1]||m[2])}
function parseMultipart(buf,boundary){const out={};const sep=Buffer.from('--'+boundary);let p=0;while(true){const s=buf.indexOf(sep,p);if(s<0)break;const h=buf.indexOf(Buffer.from('\r\n\r\n'),s);if(h<0)break;const e=buf.indexOf(sep,h+4);if(e<0)break;const header=buf.slice(s+sep.length+2,h).toString();let data=buf.slice(h+4,e-2);const nm=header.match(/name="([^"]+)"/);if(!nm){p=e;continue}const fm=header.match(/filename="([^"]*)"/);out[nm[1]]={filename:fm?.[1]||'',data};p=e}return out}
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const key=process.env.ROBLOX_API_KEY,creatorId=process.env.ROBLOX_CREATOR_ID,creatorType=process.env.ROBLOX_CREATOR_TYPE||'user';
 if(!key||!creatorId)return res.status(500).json({error:'Server is not configured. Add ROBLOX_API_KEY, ROBLOX_CREATOR_ID and ROBLOX_CREATOR_TYPE in Vercel.'});
 try{
  const body=await readMultipart(req), boundary=getBoundary(req.headers['content-type']||'');
  if(!boundary)return res.status(400).json({error:'Multipart upload required.'});
  const parts=parseMultipart(body,boundary), file=parts.file, meta=parts.request?.data?.toString()||'';
  if(!file?.data?.length)return res.status(400).json({error:'No file uploaded.'});
  if(file.data.length>20*1024*1024)return res.status(413).json({error:'Roblox Create Asset content is limited to 20 MB per request.'});
  const m=JSON.parse(meta||'{}');
  const creator=creatorType==='group'?{groupId:String(creatorId)}:{userId:String(creatorId)};
  const form=new FormData();form.append('request',JSON.stringify({assetType:m.assetType||'Decal',displayName:m.displayName||file.filename||'Revolution Asset',description:m.description||'',creationContext:{creator}}));
  form.append('fileContent',new Blob([file.data],{type:m.contentType||'application/octet-stream'}),file.filename||'asset');
  const r=await fetch('https://apis.roblox.com/assets/v1/assets',{method:'POST',headers:{'x-api-key':key},body:form});
  const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={raw:text}}
  return res.status(r.status).json(data);
 }catch(e){return res.status(500).json({error:e.message});}
}
