# Friendsite - Upstash Redis Setup

This guide will help you set up Upstash Redis for your movie survey app on Vercel.

## Step 1: Create Upstash Redis Database

1. Go to [Upstash Console](https://console.upstash.com/)
2. Click **Create Database**
3. Choose a name (e.g., "friendsite-redis")
4. Select **Redis** as the database type
5. Choose a region close to your users
6. Select the **Free** plan (10,000 requests/day, 256MB storage)
7. Click **Create**

## Step 2: Get Environment Variables

After creating the database:

1. In your Upstash dashboard, click on your database
2. Go to the **REST API** tab
3. Copy these values:
   - **UPSTASH_REDIS_REST_URL** (the REST API URL)
   - **UPSTASH_REDIS_REST_TOKEN** (the REST API token)

## Step 3: Add Environment Variables to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   - Name: `UPSTASH_REDIS_REST_URL`, Value: (paste the URL)
   - Name: `UPSTASH_REDIS_REST_TOKEN`, Value: (paste the token)
5. Make sure to select **Production**, **Preview**, and **Development**
6. Click **Save**

## Step 4: Deploy

1. Push your code to GitHub
2. Vercel will automatically redeploy
3. Your app will now use Upstash Redis for storage

## Step 5: Test

1. Visit your deployed app
2. Fill out the movie survey form
3. Submit the form
4. Check that your submission is saved
5. View all submissions

## Benefits of Upstash Redis

✅ **Serverless Redis** - Perfect for Vercel  
✅ **Fast performance** - In-memory storage  
✅ **Free tier** - 10,000 requests/day, 256MB storage  
✅ **Global distribution** - Multiple regions available  
✅ **Simple setup** - Just two environment variables  
✅ **Persistent storage** - Data survives between deployments  

## Local Development

To test locally:

1. Install dependencies: `npm install`
2. Create a `.env` file with:
   ```
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token
   ```
3. Run: `node server-vercel-upstash.js`
4. Visit: `http://localhost:3000`

## Data Structure

The app stores data in Redis using:

- **Key-value pairs**: `submission:{id}` → submission object
- **Sorted set**: `submissions` → ordered list of submission IDs
- **Automatic ordering**: Newest submissions first

## Troubleshooting

### If you get connection errors:
1. Make sure the Upstash database is created and active
2. Check that environment variables are set correctly
3. Verify the URL and token are copied exactly

### If submissions don't save:
1. Check the Vercel function logs
2. Verify the Redis connection
3. Make sure you're using the Upstash server file

### If you hit rate limits:
1. Check your Upstash dashboard for usage
2. Free tier: 10,000 requests/day
3. Consider upgrading if needed

## Upstash Dashboard

You can view your data in the Upstash console:
1. Go to [console.upstash.com](https://console.upstash.com)
2. Click on your database
3. Go to **Data Browser** to see stored submissions 