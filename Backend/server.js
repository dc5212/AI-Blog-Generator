const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Blog post schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Anthropic API setup
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Routes
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: "claude-3-opus-20240229",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Generate a blog post about ${prompt}. Include a title at the beginning.`
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
      }
    );

    const generatedText = response.data.content[0].text;

    
    const lines = generatedText.trim().split('\n');
    const title = lines[0];
    const content = lines.slice(1).join('\n').trim();

    const newPost = new Post({
      title: title,
      content: content
    });

    await newPost.save();
    res.json(newPost);
  } catch (error) {
    console.error('Error generating post:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error generating post', error: error.response ? error.response.data : error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
