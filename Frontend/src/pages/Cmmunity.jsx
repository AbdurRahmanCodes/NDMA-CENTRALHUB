import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  TrendingUp,
  Clock,
  MapPin,
  Image as ImageIcon,
  Send,
} from "lucide-react";
import "./Community.css";

export default function Community() {
  const navigate = useNavigate();

  // Dummy posts
  const [posts, setPosts] = useState([
    {
      id: "1",
      title: "Heavy Floods Hit Northern Region — Stay Safe Everyone!",
      description:
        "The recent heavy rainfall has caused severe flooding across the northern region. Many roads are blocked, and several villages are currently isolated. If you live nearby, avoid traveling and stay on higher ground. Emergency teams are on-site helping evacuate residents.",
      location: "Nile Delta, Egypt",
      category: "flood",
      author: "Sarah Khaled",
      timestamp: "2 hours ago",
      likes: 8,
      image:
        "https://images.unsplash.com/photo-1518281361980-b26bfd556770?auto=format&fit=crop&w=1200&q=80",
      comments: [
        {
          id: "c1",
          author: "Omar Ali",
          content: "Stay safe everyone! Hope the water levels drop soon.",
          timestamp: "1 hour ago",
        },
        {
          id: "c2",
          author: "Leila Ahmed",
          content: "We need more emergency boats here. It's really bad.",
          timestamp: "45 minutes ago",
        },
      ],
    },
    {
      id: "2",
      title: "Community Effort: Volunteers Help Clean Up After Floods",
      description:
        "After last week’s floods, dozens of volunteers came together to help clear debris, distribute food, and support affected families. The community spirit has been incredible. Please share if you want to join the next cleanup drive scheduled for this weekend!",
      location: "Aswan, Egypt",
      category: "flood",
      author: "Mohamed Hassan",
      timestamp: "5 hours ago",
      likes: 15,
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
      comments: [
        {
          id: "c3",
          author: "Nour Okbi",
          content: "Proud of our community! Count me in for the next event.",
          timestamp: "3 hours ago",
        },
        {
          id: "c4",
          author: "Youssef Kamal",
          content: "Amazing effort by everyone involved 👏",
          timestamp: "2 hours ago",
        },
      ],
    },
  ]);

  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    location: "",
    author: "You",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [fetchedPosts, setFetchedPosts] = useState([]);
useEffect(()  => {
    // Simulate fetching posts from an API
    const fetchPosts = async () => {
      
      setFetchedPosts(response);
    };
    fetchPosts();
  }, []);

  // Like handler
  const handleLike = (postId) => {
    const updated = new Set(likedPosts);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: updated.has(postId) ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
    updated.has(postId) ? updated.delete(postId) : updated.add(postId);
    setLikedPosts(updated);
  };

  // Save handler
  const handleSave = (postId) => {
    const updated = new Set(savedPosts);
    updated.has(postId) ? updated.delete(postId) : updated.add(postId);
    setSavedPosts(updated);
  };

  // Toggle comments
  const toggleComments = (postId) => {
    const updated = new Set(expandedComments);
    updated.has(postId) ? updated.delete(postId) : updated.add(postId);
    setExpandedComments(updated);
  };

  // Add comment
  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const newComment = {
      id: `c${Date.now()}`,
      author: "You",
      content: commentText,
      timestamp: "Just now",
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );

    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  // Handle new post creation
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description || !newPost.location)
      return alert("Please fill in all fields except image (optional).");

    const post = {
      id: `${Date.now()}`,
      title: newPost.title,
      description: newPost.description,
      location: newPost.location,
      category: newPost.category,
      author: newPost.author,
      timestamp: "Just now",
      likes: 0,
      comments: [],
      image: imagePreview || "",
    };

    setPosts([post, ...posts]);
    setNewPost({
      title: "",
      description: "",
      location: "",
      category: "flood",
      author: "You",
      image: "",
    });
    setImagePreview(null);
  };

  // Image upload preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const getCategoryBadge = (category) => {
    const badges = {
      flood: { text: "Flood Alert", class: "badge-flood" },
      earthquake: { text: "Earthquake", class: "badge-earthquake" },
      general: { text: "Community", class: "badge-general" },
    };
    return badges[category];
  };

  const mostLikedPosts = [...posts]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  return (
    <div className="community-page">
      {/* Header */}
      <header className="community-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
          <h1 className="community-title">Community Hub</h1>
          <p className="community-subtitle">
            Share experiences, alerts, and support each other during natural
            disasters
          </p>
        </div>
      </header>

      <div className="community-container">
        <main className="posts-section">
          {/* Add New Post */}
          <form className="add-post-form" onSubmit={handleAddPost}>
            <h2>Add New Post</h2>
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={newPost.description}
              onChange={(e) =>
                setNewPost({ ...newPost, description: e.target.value })
              }
            ></textarea>
            <input
              type="text"
              placeholder="Location"
              value={newPost.location}
              onChange={(e) =>
                setNewPost({ ...newPost, location: e.target.value })
              }
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            )}

            <div className="add-post-form-buttons">
              <label className="upload-label">
                <ImageIcon size={20} />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              <button type="submit" className="submit-post">
                <Send size={20} />
                Post
              </button>
            </div>
          </form>

          {/* Posts */}
          {posts.map((post) => {
            const badge = getCategoryBadge(post.category);
            const isLiked = likedPosts.has(post.id);
            const isSaved = savedPosts.has(post.id);
            const commentsExpanded = expandedComments.has(post.id);

            return (
              <article key={post.id} className="post-card">
                {/* Header */}
                <div className="post-header">
                  <div className="post-author-info">
                    <div className="author-avatar">{post.author.charAt(0)}</div>
                    <div>
                      <h3 className="author-name">{post.author}</h3>
                      <div className="post-meta">
                        <Clock size={14} />
                        <span>{post.timestamp}</span>
                        <MapPin size={14} />
                        <span>{post.location}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`category-badge ${badge.class}`}>
                    {badge.text}
                  </span>
                </div>

                {post.image && (
                  <div className="post-image-container">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="post-image"
                    />
                  </div>
                )}

                <div className="post-content">
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-description">{post.description}</p>
                </div>

                <div className="post-actions">
                  <button
                    className={`action-button ${isLiked ? "active-like" : ""}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    className={`action-button ${
                      commentsExpanded ? "active" : ""
                    }`}
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle size={20} />
                    <span>{post.comments.length}</span>
                  </button>

                  <button
                    className={`action-button ${isSaved ? "active-save" : ""}`}
                    onClick={() => handleSave(post.id)}
                  >
                    <Bookmark
                      size={20}
                      fill={isSaved ? "currentColor" : "none"}
                    />
                  </button>

                  <button className="action-button">
                    <Share2 size={20} />
                  </button>
                </div>

                {commentsExpanded && (
                  <div className="comments-section">
                    <div className="comments-list">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <div className="comment-avatar">
                            {comment.author.charAt(0)}
                          </div>
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-author">
                                {comment.author}
                              </span>
                              <span className="comment-time">
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="add-comment">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="comment-input"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs({
                            ...commentInputs,
                            [post.id]: e.target.value,
                          })
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddComment(post.id)
                        }
                      />
                      <button
                        className="comment-submit"
                        onClick={() => handleAddComment(post.id)}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </main>

        <aside className="community-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-header">
              <TrendingUp size={20} />
              <h2>Most Liked Posts</h2>
            </div>
            <div className="trending-posts">
              {mostLikedPosts.map((post, index) => (
                <div key={post.id} className="trending-post">
                  <span className="trending-rank">#{index + 1}</span>
                  <div className="trending-content">
                    <h4 className="trending-title">{post.title}</h4>
                    <div className="trending-meta">
                      <span className="trending-likes">
                        <Heart size={14} />
                        {post.likes}
                      </span>
                      <span className="trending-comments">
                        <MessageCircle size={14} />
                        {post.comments.length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Quick Actions</h3>
            <button
              className="sidebar-button"
              onClick={() => navigate("/analyze")}
            >
              Analyze Your Region
            </button>
            <button className="sidebar-button secondary">
              View Saved Posts
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
