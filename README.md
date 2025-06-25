# Friendsite - Movie Survey App

A simple web application where users can submit their favorite movies and view all submissions. Deployed on Vercel with serverless functions.

## Features

- Submit your top 5 favorite movies with genres and explanations
- View all submissions from other users
- Modern, responsive UI with dark theme
- Serverless deployment on Vercel
- In-memory storage (temporary, will be upgraded to persistent storage)

## Live Demo

Visit the deployed app: [Your Vercel URL here]

## Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/edwinn400/friendsite.git
   cd friendsite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and go to `http://localhost:3000`**

## Project Structure

```
friendsite/
├── api/
│   └── index.js          # Main Vercel serverless function
├── index.html            # Frontend form
├── package.json          # Dependencies and scripts
├── vercel.json           # Vercel configuration
├── README.md             # This file
└── .gitignore           # Git ignore rules
```

## Deployment

This app is configured for automatic deployment on Vercel:

1. **Connect to GitHub** - Vercel automatically detects changes
2. **Automatic builds** - Deploys on every push to main branch
3. **Serverless functions** - Uses Vercel's API structure

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Deployment:** Vercel (serverless functions)
- **Storage:** In-memory (temporary)

## Future Improvements

- [ ] Add persistent database (Upstash Redis or Vercel Postgres)
- [ ] Add user authentication
- [ ] Add movie search/autocomplete
- [ ] Add submission editing
- [ ] Add analytics and insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License
