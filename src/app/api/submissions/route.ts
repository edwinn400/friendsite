import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Load local config if available (for development)
let config: any = {};
try {
  // Only try to load local config in development
  if (process.env.NODE_ENV === 'development') {
    config = require('../../../../config.js');
    console.log('✅ Loaded local config.js');
  }
} catch (error) {
  console.log('⚠️  Local config.js not found, using environment variables');
  // config.js doesn't exist, use environment variables
}

// Get the actual values being used
const redisUrl = config.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = config.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Debug: Log configuration (without sensitive data)
console.log('Redis URL:', redisUrl ? 'Set' : 'Not set');
console.log('Redis Token:', redisToken ? 'Set' : 'Not set');
console.log('Redis URL length:', redisUrl ? redisUrl.length : 0);
console.log('Redis Token length:', redisToken ? redisToken.length : 0);

// Validate the URL format
if (redisUrl) {
  try {
    new URL(redisUrl);
    console.log('✅ Redis URL is valid');
  } catch (error) {
    console.error('❌ Redis URL is invalid:', error);
  }
}

// Initialize Upstash Redis
let redis: Redis;
try {
  console.log('🔧 Initializing Redis client...');
  redis = new Redis({
    url: redisUrl!,
    token: redisToken!,
  });
  console.log('✅ Redis client initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Redis:', error);
  throw error;
}

export async function GET(request: NextRequest) {
  try {
    // Get all submission IDs from the sorted set
    const submissionIds = await redis.zrange('submissions', 0, -1, { rev: true });
    
    if (!submissionIds || submissionIds.length === 0) {
      return NextResponse.json({ submissions: [] });
    }

    // Get all submissions
    const submissions = await Promise.all(
      submissionIds.map(async (id) => {
        const submission = await redis.get(`submission:${id}`);
        return submission;
      })
    );

    // Filter out any null values and return
    const validSubmissions = submissions.filter(submission => submission !== null);

    return NextResponse.json({ submissions: validSubmissions });

  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 