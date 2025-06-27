import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

// Define the submission type
interface Submission {
  id: string;
  type: "movie" | "show" | "music" | "book" | "art";
  name: string;
  movie1?: string;
  movie2?: string;
  movie3?: string;
  movie4?: string;
  movie5?: string;
  genres1?: string[];
  genres2?: string[];
  genres3?: string[];
  genres4?: string[];
  genres5?: string[];
  why1?: string;
  why2?: string;
  why3?: string;
  why4?: string;
  why5?: string;
  show1?: string;
  show2?: string;
  show3?: string;
  show4?: string;
  show5?: string;
  music1?: string;
  music2?: string;
  music3?: string;
  music4?: string;
  music5?: string;
  book1?: string;
  book2?: string;
  book3?: string;
  book4?: string;
  book5?: string;
  artPiece?: string;
  artFile?: string;
  submitted_at: string;
}

// Load local config if available (for development)
let config: Record<string, string> = {};
try {
  // Only try to load local config in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    config = require('../../../../config.js');
    console.log('✅ Loaded local config.js');
  }
} catch {
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
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // Remove default to allow getting all types
    
    console.log('🔍 Fetching submissions, type filter:', type || 'all');
    
    // If a specific type is requested, validate it
    if (type && type !== 'movie' && type !== 'show' && type !== 'music' && type !== 'book' && type !== 'art') {
      return NextResponse.json({
        error: 'Invalid type parameter. Must be "movie", "show", "music", "book", or "art"'
      }, { status: 400 });
    }

    let allSubmissions: Submission[] = [];

    if (type) {
      // Get submissions of a specific type
      const submissionIds = await redis.zrange(`${type}_submissions`, 0, -1, { rev: true });
      console.log(`📋 Found ${submissionIds.length} ${type} submission IDs:`, submissionIds);
      
      if (submissionIds && submissionIds.length > 0) {
        const submissions = await Promise.all(
          submissionIds.map(async (id) => {
            const submission = await redis.get(`${type}_submission:${id}`);
            return submission as Submission | null;
          })
        );
        allSubmissions = submissions.filter((submission): submission is Submission => submission !== null);
        console.log(`✅ Retrieved ${allSubmissions.length} ${type} submissions`);
      }
    } else {
      // Get all submissions from all types
      const types = ['movie', 'show', 'music', 'book', 'art'];
      
      for (const submissionType of types) {
        const submissionIds = await redis.zrange(`${submissionType}_submissions`, 0, -1, { rev: true });
        console.log(`📋 Found ${submissionIds.length} ${submissionType} submission IDs:`, submissionIds);
        
        if (submissionIds && submissionIds.length > 0) {
          const submissions = await Promise.all(
            submissionIds.map(async (id) => {
              const submission = await redis.get(`${submissionType}_submission:${id}`);
              return submission as Submission | null;
            })
          );
          allSubmissions.push(...submissions.filter((submission): submission is Submission => submission !== null));
          console.log(`✅ Retrieved ${submissions.filter(s => s !== null).length} ${submissionType} submissions`);
        }
      }
      
      // Sort all submissions by submission date (newest first)
      allSubmissions.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    }

    console.log(`🎯 Returning ${allSubmissions.length} total submissions`);
    console.log('📊 Submission types breakdown:', allSubmissions.reduce((acc, sub) => {
      acc[sub.type] = (acc[sub.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));

    return NextResponse.json({ 
      submissions: allSubmissions,
      type: type || 'all',
      count: allSubmissions.length
    });

  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 