const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

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
    answers.movie1,
    answers.movie2,
    answers.movie3,
    answers.movie4,
    answers.movie5
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error saving submission:', err);
      res.send('There was an error saving your submission.');
    } else {
      res.send(`
        <p>Thank you for submitting your favorite movies!</p>
        <form action="/submissions" method="get">
            <button type="submit">See Everyone's Answers</button>
        </form>
      `);
    }
  });
});

app.get('/submissions', (req, res) => {
  const sql = `SELECT * FROM submissions ORDER BY submitted_at DESC`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error reading submissions:', err);
      res.send('Error reading submissions.');
      return;
    }
    
    if (rows.length === 0) {
      res.send(`
        <h2>All Submissions</h2>
        <p>No submissions yet.</p>
        <a href="/">Back to form</a>
      `);
      return;
    }

    const entries = rows.map(row => {
      return `<li><strong>${row.name}</strong>: ${row.movie1}, ${row.movie2}, ${row.movie3}, ${row.movie4}, ${row.movie5} <small>(submitted: ${new Date(row.submitted_at).toLocaleString()})</small></li>`;
    }).join('');
    
    res.send(`
      <h2>All Submissions</h2>
      <ul>${entries}</ul>
      <a href="/">Back to form</a>
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
