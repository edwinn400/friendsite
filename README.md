# Friendsite - Movie Survey App

A simple web application where users can submit their favorite movies and view all submissions.

## Features

- Submit your top 5 favorite movies
- View all submissions from other users
- Data stored in SQLite database
- Simple and clean interface

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and go to `http://localhost:3000`

## Deployment Options

### Railway (Recommended)
Railway is perfect for SQLite apps and offers a generous free tier:

1. Create an account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway will automatically detect your Node.js app
4. The SQLite database will be created automatically

### Render
1. Create an account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`

### Heroku
1. Create an account at [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Run:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Vercel
1. Create an account at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically deploy your app

## Database

This app uses SQLite, which is:
- File-based (no separate database server needed)
- Perfect for small to medium applications
- Easy to deploy and maintain
- Zero configuration required

The database file (`submissions.db`) will be created automatically when you first run the application.

## Project Structure

- `server.js` - Express server with database operations
- `index.html` - Frontend form for movie submissions
- `submissions.db` - SQLite database (created automatically)
- `package.json` - Node.js dependencies and scripts

## API Endpoints

- `GET /` - Serve the main form
- `POST /submit` - Handle form submissions
- `GET /submissions` - View all submissions # friendsite
# friendsite
# friendsite
