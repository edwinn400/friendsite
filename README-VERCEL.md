# Friendsite - Vercel Deployment Guide

This guide will help you deploy your movie survey app to Vercel with Vercel KV for data storage.

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A Vercel account (free at [vercel.com](https://vercel.com))

## Step 1: Set up Vercel KV

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (or create a new one)
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **KV** (Redis)
6. Choose a name for your database (e.g., "friendsite-kv")
7. Select the free plan
8. Click **Create**

## Step 2: Get KV Environment Variables

After creating the KV database:

1. In the Storage tab, click on your KV database
2. Go to the **Settings** tab
3. Copy the following environment variables:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

## Step 3: Add Environment Variables to Vercel

1. In your Vercel project dashboard, go to **Settings**
2. Click on **Environment Variables**
3. Add each of the KV environment variables you copied:
   - Name: `KV_URL`, Value: (paste the URL)
   - Name: `KV_REST_API_URL`, Value: (paste the URL)
   - Name: `KV_REST_API_TOKEN`, Value: (paste the token)
   - Name: `KV_REST_API_READ_ONLY_TOKEN`, Value: (paste the read-only token)
4. Make sure to select **Production**, **Preview**, and **Development** environments
5. Click **Save**

## Step 4: Deploy to Vercel

1. In your Vercel dashboard, click **Deployments**
2. Click **Redeploy** (or **Deploy** if it's a new project)
3. Vercel will automatically detect your Node.js app and deploy it
4. Wait for the deployment to complete

## Step 5: Test Your App

1. Click on your deployment URL
2. Fill out the movie survey form
3. Submit the form
4. Check that your submission is saved
5. View all submissions

## File Structure for Vercel

- `server-vercel.js` - Main server file using Vercel KV
- `index.html` - Frontend form
- `vercel.json` - Vercel configuration
- `package.json` - Dependencies including `@vercel/kv`

## Troubleshooting

### If you get KV connection errors:
1. Make sure all environment variables are set correctly
2. Check that the KV database is created and active
3. Verify the tokens have the correct permissions

### If the form doesn't submit:
1. Check the Vercel function logs in the dashboard
2. Make sure the `/submit` route is working
3. Verify the form action is pointing to `/submit`

### If submissions don't appear:
1. Check the KV database in the Vercel dashboard
2. Verify the `/submissions` route is working
3. Check the function logs for errors

## Local Development

To test locally with Vercel KV:

1. Install dependencies: `npm install`
2. Set up local environment variables (copy from Vercel dashboard)
3. Run: `node server-vercel.js`
4. Visit: `http://localhost:3000`

## Benefits of Vercel KV

- ✅ **Persistent storage** - Data survives between deployments
- ✅ **Fast access** - Redis-based for quick reads/writes
- ✅ **Free tier** - Generous free limits
- ✅ **Automatic scaling** - Handles traffic spikes
- ✅ **Global distribution** - Fast worldwide access

## Alternative: Use SQLite on Railway

If you prefer to keep using SQLite, consider deploying to [Railway](https://railway.app) instead, which supports SQLite databases natively. 