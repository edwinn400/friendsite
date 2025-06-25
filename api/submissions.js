// In-memory storage (shared across function instances)
let submissions = [];

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
    if (submissions.length === 0) {
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <html>
          <head><title>All Submissions</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0a174e; color: #fff;">
            <h2>All Submissions</h2>
            <p>No submissions yet.</p>
            <p><strong>Note:</strong> This is using temporary storage. Data will be lost when the server restarts.</p>
            <a href="/" style="color: #1e90ff;">Back to form</a>
          </body>
        </html>
      `);
      return;
    }

    const entries = submissions.map(submission => {
      return `<li><strong>${submission.name}</strong>: ${submission.movie1}, ${submission.movie2}, ${submission.movie3}, ${submission.movie4}, ${submission.movie5} <small>(submitted: ${new Date(submission.submitted_at).toLocaleString()})</small></li>`;
    }).join('');
    
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <html>
        <head><title>All Submissions</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0a174e; color: #fff;">
          <h2>All Submissions</h2>
          <p><strong>Note:</strong> This is using temporary storage. Data will be lost when the server restarts.</p>
          <ul style="text-align: left; max-width: 800px; margin: 0 auto;">${entries}</ul>
          <br>
          <a href="/" style="color: #1e90ff;">Back to form</a>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error reading submissions:', error);
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>Error reading submissions.</h2>
          <a href="/" style="color: #1e90ff;">Back to form</a>
        </body>
      </html>
    `);
  }
}; 