const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for testing (will be replaced with Upstash later)
let submissions = [];

// This allows Express to read form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (for Vercel compatibility)
app.use(express.static(path.join(__dirname)));

// Serve your index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submissions
app.post('/submit', (req, res) => {
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

    // Store in memory (temporary)
    submissions.unshift(submission);

    res.send(`
      <html>
        <head><title>Thank You</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0a174e; color: #fff;">
          <h2>Thank you for submitting your favorite movies!</h2>
          <p><strong>Note:</strong> This is using temporary storage. Data will be lost when the server restarts.</p>
          <form action="/submissions" method="get">
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
          <a href="/" style="color: #1e90ff;">Back to form</a>
        </body>
      </html>
    `);
  }
});

app.get('/submissions', (req, res) => {
  try {
    if (submissions.length === 0) {
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
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Export for Vercel
module.exports = app; 