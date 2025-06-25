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

export async function POST(request: NextRequest) {
  try {
    const answers = await request.json();
    const submission = {
      id: Date.now().toString(),
      name: answers.name || 'Anonymous',
      movie1: answers.movie1 || '',
      movie2: answers.movie2 || '',
      movie3: answers.movie3 || '',
      movie4: answers.movie4 || '',
      movie5: answers.movie5 || '',
      submitted_at: new Date().toISOString()
    };

    console.log('📝 Attempting to save submission:', submission.id);

    // Store in Upstash Redis
    await redis.set(`submission:${submission.id}`, submission);
    console.log('✅ Submission saved to Redis');
    
    await redis.zadd('submissions', { score: Date.now(), member: submission.id });
    console.log('✅ Submission ID added to sorted set');

    return NextResponse.json({
      success: true,
      message: 'Submission saved successfully!',
      submissionId: submission.id
    });

  } catch (error) {
    console.error('❌ Error saving submission:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 