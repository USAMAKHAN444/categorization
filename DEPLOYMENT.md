# Vercel Deployment Guide

## Issue
The app works locally but shows "Failed to fetch" error when deployed on Vercel.

## Root Cause
The app is hardcoded to use a specific IP address (`34.222.0.221`) for the API endpoint, which may not be accessible from Vercel's servers.

## Solutions

### Option 1: Configure Environment Variables in Vercel (Recommended)

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_API_ENDPOINT` = `http://34.222.0.221/categorize`

2. **Redeploy:**
   - Push changes to Git
   - Vercel will automatically redeploy

### Option 2: Update vercel.json (Already Done)
The `vercel.json` file has been updated with:
- SPA rewrite rules for React Router
- Environment variable configuration

### Option 3: Use a Public Domain
If the IP address is not accessible from Vercel:
1. Set up a domain for your API server
2. Update the environment variable to use the domain instead of IP
3. Ensure CORS is properly configured on your server

## Current Configuration
- `vercel.json` includes SPA rewrites and environment variables
- App now uses `import.meta.env.VITE_API_ENDPOINT` instead of hardcoded IP
- Better error handling for connection issues

## Testing
After deployment:
1. Check browser console for detailed error messages
2. Verify the environment variable is set correctly in Vercel
3. Test with a simple document upload

## Troubleshooting
- If still getting "Failed to fetch": Check if `34.222.0.221` is accessible from the internet
- Consider using a public domain or cloud service for your API
- Ensure your server accepts requests from Vercel's domain
