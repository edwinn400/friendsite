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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    const answers = req.body;
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

    // Store in Upstash Redis
    await redis.set(`submission:${submission.id}`, submission);
    await redis.zadd('submissions', { score: Date.now(), member: submission.id });

    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <html>
        <head><title>Thank You</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0a174e; color: #fff;">
          <h2>Thank you for submitting your favorite movies!</h2>
          <p><strong>✅ Data saved to persistent storage!</strong></p>
          <form action="/api/submissions" method="get">
              <button type="submit" style="background: #1e90ff; color: #fff; border: none; border-radius: 8px; padding: 12px 32px; font-size: 1.1em; cursor: pointer;">See Everyone's Answers</button>
          </form>
          <br>
          <a href="/" style="color: #1e90ff;">Submit another response</a>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>There was an error saving your submission.</h2>
          <p>Error: ${error.message}</p>
          <p>Stack: ${error.stack}</p>
          <a href="/" style="color: #1e90ff;">Back to form</a>
        </body>
      </html>
    `);
  }
}; 