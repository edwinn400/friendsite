const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new sqlite3.Database('submissions.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      movie1 TEXT,
      movie2 TEXT,
      movie3 TEXT,
      movie4 TEXT,
      movie5 TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Submissions table ready.');
      }
    });
  }
});

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
  const answers = req.body;
  
  // Insert the submission into the database
  const sql = `INSERT INTO submissions (name, movie1, movie2, movie3, movie4, movie5) 
                VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    answers.name || 'Anonymous',
    answers.movie1 || '',
    answers.movie2 || '',
    answers.movie3 || '',
    answers.movie4 || '',
    answers.movie5 || ''
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error saving submission:', err);
      res.status(500).send(`
        <html>
          <head><title>Error</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>There was an error saving your submission.</h2>
            <a href="/" style="color: #1e90ff;">Back to form</a>
          </body>
        </html>
      `);
    } else {
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
    }
  });
});

app.get('/submissions', (req, res) => {
  const sql = `SELECT * FROM submissions ORDER BY submitted_at DESC`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error reading submissions:', err);
      res.status(500).send(`
        <html>
          <head><title>Error</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>Error reading submissions.</h2>
            <a href="/" style="color: #1e90ff;">Back to form</a>
          </body>
        </html>
      `);
      return;
    }
    
    if (rows.length === 0) {
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

    const entries = rows.map(row => {
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
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Export for Vercel
module.exports = app;
