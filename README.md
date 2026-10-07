# Revolution Asset Hub — Production Starter

## 1. GitHub
Create a repository and push this folder.

## 2. Vercel
Import the GitHub repository. Build command: `npm run build`; output: `dist`.

## 3. Vercel Environment Variables
Add these under Project Settings → Environment Variables:

- `ROBLOX_API_KEY` — Roblox Open Cloud API key (server-side only)
- `ROBLOX_CREATOR_ID` — your Roblox User ID or Group ID
- `ROBLOX_CREATOR_TYPE` — `user` or `group`

Redeploy after adding/changing variables.

## 4. Roblox Open Cloud
Create an API key with the Asset API permissions required for your creator. The website sends the key only from Vercel server functions; it is never exposed through Vite's `VITE_` variables.

## 5. Upload
The `/api/upload` endpoint accepts multipart form data and calls Roblox `POST /assets/v1/assets`. Roblox's current Assets API supports creating assets including Audio, Decals, Images, Models, Meshes and Videos, with content-upload limits documented by Roblox. Creation returns an operation that can be polled through `/api/operation?id=...`.

## Security
Do not commit `.env`, API keys, cookies, or Roblox credentials to GitHub.
