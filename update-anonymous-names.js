const { Redis } = require('@upstash/redis');

// Load config
const config = require('./config.js');

const redis = new Redis({
  url: config.UPSTASH_REDIS_REST_URL,
  token: config.UPSTASH_REDIS_REST_TOKEN,
});

async function updateAnonymousNames() {
  try {
    console.log('🔍 Finding all submissions...');
    
    // Get all submission IDs
    const submissionIds = await redis.zrange('submissions', 0, -1);
    console.log(`📋 Found ${submissionIds.length} total submissions`);
    
    let updatedCount = 0;
    
    for (const id of submissionIds) {
      const key = `submission:${id}`;
      const submissionStr = await redis.get(key);
      if (!submissionStr) continue;
      let submission;
      try {
        submission = JSON.parse(submissionStr);
      } catch (e) {
        console.log(`❌ Could not parse submission ${id}`);
        continue;
      }
      
      if (submission && submission.name === 'Anonymous') {
        console.log(`📝 Updating submission ${id} from "Anonymous" to "Nick Myers"`);
        submission.name = 'Nick Myers';
        await redis.set(key, JSON.stringify(submission));
        updatedCount++;
        
        console.log(`✅ Updated submission ${id}`);
      } else if (submission) {
        console.log(`ℹ️ Submission ${id} already has name: "${submission.name}"`);
      }
    }
    
    console.log(`\n🎉 Update complete! Updated ${updatedCount} submissions from "Anonymous" to "Nick Myers"`);
    
  } catch (error) {
    console.error('❌ Error updating names:', error);
  }
}

async function listAllSubmissions() {
  try {
    console.log('📋 Listing all current submissions...\n');
    
    const submissionIds = await redis.zrange('submissions', 0, -1);
    
    for (const id of submissionIds) {
      const key = `submission:${id}`;
      const submissionStr = await redis.get(key);
      if (!submissionStr) continue;
      let submission;
      try {
        submission = JSON.parse(submissionStr);
      } catch (e) {
        console.log(`❌ Could not parse submission ${id}`);
        continue;
      }
      console.log(`ID: ${id}`);
      console.log(`Name: ${submission.name || 'Anonymous'}`);
      console.log(`Type: ${submission.type}`);
      console.log(`Date: ${submission.submitted_at}`);
      console.log('---');
    }
    
  } catch (error) {
    console.error('❌ Error listing submissions:', error);
  }
}

// Run the update
updateAnonymousNames().then(() => {
  console.log('\n📋 Current submissions after update:');
  return listAllSubmissions();
}).catch(console.error); 