# AI-Powered Blog Generator

This project is a full-stack web application that uses AI to generate blog posts. It's built with the MERN stack (MongoDB, Express.js, React, Node.js) and integrates with the Anthropic API for content generation.

## Features

- Generate blog posts using AI
- View a list of generated blog posts
- Read individual blog posts
- Delete blog posts
- Responsive design for various screen sizes

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (usually comes with Node.js)
- MongoDB (local installation or a MongoDB Atlas account)
- Anthropic API key

## Installation

1. Clone the repository:
   ```
   https://github.com/dc5212/AI-Blog-Generator.git
   cd ai-blog-generator
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. In the `.env` file in the `backend` directory replace the ANTHROPIC_API_KEY with your own key:
   ```
   
   ANTHROPIC_API_KEY=your_anthropic_api_key
   
   ```


## Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```
   The server should start running on `http://localhost:5000`.

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```
   The React app should open in your default browser at `http://localhost:3000`.

## Usage

1. On the home page, you'll see a list of existing blog posts (if any).
2. Click on "Generate New Blog" to create a new blog post.
3. Enter a prompt for the AI to generate content based on.
4. Click "Generate Post" and wait for the AI to create the content.
5. The new post will open in a new tab and be added to the list on the home page.
6. Click on a blog post title to read its full content.
7. Use the "Delete" button to remove a blog post.
