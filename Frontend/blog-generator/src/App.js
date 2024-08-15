import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="nav-buttons">
          <Link to="/" className="nav-button">Home</Link>
          <Link to="/generate" className="nav-button">Generate New Blog</Link>
        </nav>

        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/generate" element={<BlogGenerator />} />
          <Route path="/post/:id" element={<BlogPost />} />
        </Routes>
      </div>
    </Router>
  );
}

function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${API_BASE_URL}/posts/${id}`);
        setPosts(posts.filter(post => post._id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="blog-list">
      <h1>Blog Posts</h1>
      <div className="post-grid">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <h2>
              <Link to={`/post/${post._id}`} className="post-title">{post.title}</Link>
            </h2>
            <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
            <button onClick={() => handleDelete(post._id)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, { prompt });
      setLoading(false);
      // Open the new blog post in a new tab
      const fullUrl = `${window.location.origin}/post/${response.data._id}`;
      window.open(fullUrl, '_blank');
      // Clear the input field after successful generation
      setPrompt('');
    } catch (error) {
      console.error('Error generating post:', error);
      setLoading(false);
    }
  };

  return (
    <div className="blog-generator">
      <h1>Generate New Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt for your blog post"
          required
        />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Generating...' : 'Generate Post'}
        </button>
      </form>
    </div>
  );
}

function BlogPost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchPost(id);
  }, [id]);

  const fetchPost = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  if (!post) return <div className="loading">Loading...</div>;

  return (
    <div className="blog-post">
      <h1>{post.title}</h1>
      <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
      <div className="post-content">{post.content}</div>
    </div>
  );
}

export default App;