const { Redis } = require('@upstash/redis');

// Load local config if available (for development)
let config = {};
try {
  // Always try to load local config when running locally
  config = require('../config.js');
  console.log('✅ Loaded local config.js');
} catch (error) {
  console.log('⚠️  Local config.js not found, using environment variables');
  // config.js doesn't exist, use environment variables
}

// Debug: Log configuration (without sensitive data)
console.log('Redis URL:', config.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL ? 'Set' : 'Not set');
console.log('Redis Token:', config.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN ? 'Set' : 'Not set');

// Initialize Upstash Redis
let redis;
try {
  redis = new Redis({
    url: config.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: config.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} catch (error) {
  console.error('Error initializing Redis:', error);
  throw error;
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    // Get all submission IDs from the sorted set
    const submissionIds = await redis.zrange('submissions', 0, -1);
    
    // Fetch all submissions
    const submissions = [];
    for (const id of submissionIds) {
      const submission = await redis.get(`submission:${id}`);
      if (submission) {
        submissions.push(submission);
      }
    }

    // Sort by submission time (newest first)
    submissions.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <html>
        <head>
          <title>All Submissions</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #0a174e; color: #fff; }
            .container { max-width: 800px; margin: 0 auto; }
            .submission { background: rgba(255,255,255,0.1); margin: 20px 0; padding: 20px; border-radius: 10px; }
            .name { font-size: 1.2em; font-weight: bold; margin-bottom: 10px; color: #1e90ff; }
            .movies { margin: 10px 0; }
            .movie { margin: 5px 0; }
            .timestamp { font-size: 0.8em; color: #ccc; margin-top: 10px; }
            .back-link { text-align: center; margin: 20px 0; }
            .back-link a { color: #1e90ff; text-decoration: none; }
            .back-link a:hover { text-decoration: underline; }
            h1 { text-align: center; color: #1e90ff; }
            .count { text-align: center; margin-bottom: 30px; color: #ccc; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎬 All Movie Submissions</h1>
            <div class="count">Total submissions: ${submissions.length}</div>
            
            ${submissions.map(sub => `
              <div class="submission">
                <div class="name">👤 ${sub.name}</div>
                <div class="movies">
                  <div class="movie">1. ${sub.movie1 || 'Not specified'}</div>
                  <div class="movie">2. ${sub.movie2 || 'Not specified'}</div>
                  <div class="movie">3. ${sub.movie3 || 'Not specified'}</div>
                  <div class="movie">4. ${sub.movie4 || 'Not specified'}</div>
                  <div class="movie">5. ${sub.movie5 || 'Not specified'}</div>
                </div>
                <div class="timestamp">Submitted: ${new Date(sub.submitted_at).toLocaleString()}</div>
              </div>
            `).join('')}
            
            <div class="back-link">
              <a href="/">← Back to form</a>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>There was an error fetching submissions.</h2>
          <p>Error: ${error.message}</p>
          <a href="/" style="color: #1e90ff;">Back to form</a>
        </body>
      </html>
    `);
  }
}; 