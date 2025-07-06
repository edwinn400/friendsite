import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Load local config if available (for development)
let config: Record<string, string> = {};
try {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    config = require('../../../../config.js');
    console.log('✅ Loaded local config.js');
  }
} catch {
  console.log('⚠️  Local config.js not found, using environment variables');
}

const redisUrl = config.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = config.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = new Redis({
  url: redisUrl!,
  token: redisToken!,
});

export async function PUT(request: NextRequest) {
  try {
    const { submissionId, updates } = await request.json();
    
    // Basic validation
    if (!submissionId || !updates) {
      return NextResponse.json(
        { error: 'Missing submissionId or updates' },
        { status: 400 }
      );
    }
    
    console.log(`📝 Admin editing submission: ${submissionId}`);
    
    // The submissionId should already be in the correct format (e.g., "book_submission:1751520861685")
    // Get current submission
    const submission = await redis.get(submissionId);
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Apply updates
    const updatedSubmission = { ...submission, ...updates };
    
    // Save back to Redis
    await redis.set(submissionId, updatedSubmission);
    
    console.log('✅ Admin updated submission successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
      submission: updatedSubmission
    });
    
  } catch (error) {
    console.error('❌ Admin error editing submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { submissionId } = await request.json();
    
    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing submissionId' },
        { status: 400 }
      );
    }
    
    console.log(`🗑️ Admin deleting submission: ${submissionId}`);
    
    // The submissionId should already be in the correct format (e.g., "book_submission:1751520861685")
    // Extract the type and id from the submissionId
    const parts = submissionId.split(':');
    if (parts.length !== 2) {
      return NextResponse.json(
        { error: 'Invalid submissionId format' },
        { status: 400 }
      );
    }
    
    const [typeWithSubmission, id] = parts;
    const type = typeWithSubmission.replace('_submission', '');
    
    // Remove from type-specific submissions sorted set
    await redis.zrem(`${type}_submissions`, id);
    
    // Delete the submission data
    await redis.del(submissionId);
    
    console.log('✅ Admin deleted submission successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Admin error deleting submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
} 