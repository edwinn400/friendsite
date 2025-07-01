const { Redis } = require('@upstash/redis');

// Load config
const config = require('./config.local.js');

const redis = new Redis({
  url: config.UPSTASH_REDIS_REST_URL,
  token: config.UPSTASH_REDIS_REST_TOKEN,
});

async function editSubmission(submissionId, updates) {
  try {
    console.log(`📝 Editing submission: ${submissionId}`);
    
    // Get current submission
    const submission = await redis.hgetall(`submission:${submissionId}`);
    
    if (!submission || Object.keys(submission).length === 0) {
      console.log('❌ Submission not found');
      return;
    }
    
    console.log('📋 Current submission:', submission);
    
    // Apply updates
    const updatedSubmission = { ...submission, ...updates };
    
    // Save back to Redis
    await redis.hset(`submission:${submissionId}`, updatedSubmission);
    
    console.log('✅ Submission updated successfully');
    console.log('📋 Updated submission:', updatedSubmission);
    
  } catch (error) {
    console.error('❌ Error editing submission:', error);
  }
}

async function deleteSubmission(submissionId) {
  try {
    console.log(`🗑️ Deleting submission: ${submissionId}`);
    
    // Remove from submissions sorted set
    await redis.zrem('submissions', submissionId);
    
    // Delete the submission data
    await redis.del(`submission:${submissionId}`);
    
    console.log('✅ Submission deleted successfully');
    
  } catch (error) {
    console.error('❌ Error deleting submission:', error);
  }
}

async function listSubmissions() {
  try {
    console.log('📋 Listing all submissions...');
    
    const submissionIds = await redis.zrange('submissions', 0, -1);
    
    for (const id of submissionIds) {
      const submission = await redis.hgetall(`submission:${id}`);
      console.log(`\nID: ${id}`);
      console.log(`Name: ${submission.name}`);
      console.log(`Type: ${submission.type}`);
      console.log(`Date: ${submission.submitted_at}`);
    }
    
  } catch (error) {
    console.error('❌ Error listing submissions:', error);
  }
}

// Example usage:
// Edit a submission
// editSubmission('1751341438938', { name: 'Updated Name', movie1: 'New Movie' });

// Delete a submission
// deleteSubmission('1751341438938');

// List all submissions
// listSubmissions();

module.exports = { editSubmission, deleteSubmission, listSubmissions }; 