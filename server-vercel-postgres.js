const express = require('express');
const path = require('path');
const { sql } = require('@vercel/postgres');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database table
async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        movie1 VARCHAR(255),
        movie2 VARCHAR(255),
        movie3 VARCHAR(255),
        movie4 VARCHAR(255),
        movie5 VARCHAR(255),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Database table ready.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Initialize database on startup
initDatabase();

// This allows Express to read form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (for Vercel compatibility)
app.use(express.static(path.join(__dirname)));

// Serve your index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submissions
app.post('/submit', async (req, res) => {
  try {
    const answers = req.body;
    
    // Insert the submission into the database
    const result = await sql`
      INSERT INTO submissions (name, movie1, movie2, movie3, movie4, movie5)
      VALUES (${answers.name || 'Anonymous'}, ${answers.movie1 || ''}, ${answers.movie2 || ''}, ${answers.movie3 || ''}, ${answers.movie4 || ''}, ${answers.movie5 || ''})
      RETURNING *
    `;

    res.send(`
      <html>
        <head><title>Thank You</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0a174e; color: #fff;">
          <h2>Thank you for submitting your favorite movies!</h2>
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
          <p>Error: ${error.message}</p>
          <a href="/" style="color: #1e90ff;">Back to form</a>
        </body>
      </html>
    `);
  }
});

app.get('/submissions', async (req, res) => {
  try {
    // Get all submissions ordered by submission time (newest first)
    const result = await sql`
      SELECT * FROM submissions 
      ORDER BY submitted_at DESC
    `;
    
    if (result.rows.length === 0) {
      res.send(`
        <html>
          <head><title>All Submissions</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0a174e; color: #fff;">
            <h2>All Submissions</h2>
            <p>No submissions yet.</p>
            <a href="/" style="color: #1e90ff;">Back to form</a>
          </body>
        </html>
      `);
      return;
    }

    const entries = result.rows.map(row => {
      return `<li><strong>${row.name}</strong>: ${row.movie1}, ${row.movie2}, ${row.movie3}, ${row.movie4}, ${row.movie5} <small>(submitted: ${new Date(row.submitted_at).toLocaleString()})</small></li>`;
    }).join('');
    
    res.send(`
      <html>
        <head><title>All Submissions</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0a174e; color: #fff;">
          <h2>All Submissions</h2>
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
          <p>Error: ${error.message}</p>
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