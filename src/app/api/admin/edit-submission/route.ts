import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Load config
const config = require('../../../../config.local.js');

const redis = new Redis({
  url: config.UPSTASH_REDIS_REST_URL,
  token: config.UPSTASH_REDIS_REST_TOKEN,
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
    
    // Get current submission
    const submission = await redis.hgetall(`submission:${submissionId}`);
    
    if (!submission || Object.keys(submission).length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Apply updates
    const updatedSubmission = { ...submission, ...updates };
    
    // Save back to Redis
    await redis.hset(`submission:${submissionId}`, updatedSubmission);
    
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
    
    // Remove from submissions sorted set
    await redis.zrem('submissions', submissionId);
    
    // Delete the submission data
    await redis.del(`submission:${submissionId}`);
    
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