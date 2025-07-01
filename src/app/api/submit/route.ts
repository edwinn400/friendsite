import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

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

export async function POST(request: NextRequest) {
  try {
    const answers = await request.json();
    
    // Determine if this is a movie, TV show, music, book, or art submission
    const isMovieSubmission = answers.movie1 !== undefined;
    const isShowSubmission = answers.show1 !== undefined;
    const isMusicSubmission = answers.music1 !== undefined;
    const isBookSubmission = answers.book1 !== undefined;
    const isArtSubmission = answers.artPiece !== undefined;
    
    if (!isMovieSubmission && !isShowSubmission && !isMusicSubmission && !isBookSubmission && !isArtSubmission) {
      return NextResponse.json({
        success: false,
        error: 'Invalid submission format'
      }, { status: 400 });
    }

    let submissionType = 'movie';
    if (isShowSubmission) submissionType = 'show';
    else if (isMusicSubmission) submissionType = 'music';
    else if (isBookSubmission) submissionType = 'book';
    else if (isArtSubmission) submissionType = 'art';

    const submission = {
      id: Date.now().toString(),
      type: submissionType,
      name: answers.name || 'Anonymous',
      ...(isMovieSubmission && {
        movie1: answers.movie1 || '',
        movie2: answers.movie2 || '',
        movie3: answers.movie3 || '',
        movie4: answers.movie4 || '',
        movie5: answers.movie5 || '',
        genres1: answers.genres1 || [],
        genres2: answers.genres2 || [],
        genres3: answers.genres3 || [],
        genres4: answers.genres4 || [],
        genres5: answers.genres5 || [],
        why1: answers.why1 || '',
        why2: answers.why2 || '',
        why3: answers.why3 || '',
        why4: answers.why4 || '',
        why5: answers.why5 || '',
      }),
      ...(isShowSubmission && {
        show1: answers.show1 || '',
        show2: answers.show2 || '',
        show3: answers.show3 || '',
        show4: answers.show4 || '',
        show5: answers.show5 || '',
        genres1: answers.genres1 || [],
        genres2: answers.genres2 || [],
        genres3: answers.genres3 || [],
        genres4: answers.genres4 || [],
        genres5: answers.genres5 || [],
        why1: answers.why1 || '',
        why2: answers.why2 || '',
        why3: answers.why3 || '',
        why4: answers.why4 || '',
        why5: answers.why5 || '',
      }),
      ...(isMusicSubmission && {
        music1: answers.music1 || '',
        music2: answers.music2 || '',
        music3: answers.music3 || '',
        music4: answers.music4 || '',
        music5: answers.music5 || '',
        artist1: answers.artist1 || '',
        artist2: answers.artist2 || '',
        artist3: answers.artist3 || '',
        artist4: answers.artist4 || '',
        artist5: answers.artist5 || '',
        why1: answers.why1 || '',
        why2: answers.why2 || '',
        why3: answers.why3 || '',
        why4: answers.why4 || '',
        why5: answers.why5 || '',
      }),
      ...(isBookSubmission && {
        book1: answers.book1 || '',
        book2: answers.book2 || '',
        book3: answers.book3 || '',
        book4: answers.book4 || '',
        book5: answers.book5 || '',
        why1: answers.why1 || '',
        why2: answers.why2 || '',
        why3: answers.why3 || '',
        why4: answers.why4 || '',
        why5: answers.why5 || '',
      }),
      ...(isArtSubmission && {
        artPiece: answers.artPiece || '',
        artFile: answers.artFile || '',
      }),
      submitted_at: new Date().toISOString()
    };

    console.log(`📝 Attempting to save ${submissionType} submission:`, submission.id);

    // Store in Upstash Redis with type-specific keys
    await redis.set(`${submissionType}_submission:${submission.id}`, submission);
    console.log(`✅ ${submissionType} submission saved to Redis`);
    
    await redis.zadd(`${submissionType}_submissions`, { score: Date.now(), member: submission.id });
    console.log(`✅ ${submissionType} submission ID added to sorted set`);

    const typeNames = {
      movie: 'Movie',
      show: 'TV Show',
              music: 'Songs',
      book: 'Book',
      art: 'Art Piece'
    };

    return NextResponse.json({
      success: true,
      message: `${typeNames[submissionType as keyof typeof typeNames]} submission saved successfully!`,
      submissionId: submission.id,
      type: submissionType
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