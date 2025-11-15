import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddPostForm from "../components/Community/AddPostForm";
import PostCard from "../components/Community/PostCard";
import Sidebar from "../components/Community/Sidebar";
import "./Community.css";
export default function Community() {
  const navigate = useNavigate();
  // LOCAL state for now (will be replaced by API later)
  const [posts, setPosts] = useState([
    // keep small example data so UI renders instantly
    {
      id: "1",
      title: "Heavy Floods Hit Northern Region — Stay Safe Everyone!",
      description:
        "The recent heavy rainfall has caused severe flooding across the northern region.",
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
          content: "Stay safe everyone!",
          timestamp: "1 hour ago",
        },
      ],
    },
    {
      id: "2",
      title: "Community Effort: Volunteers Help Clean Up After Floods",
      description:
        "Volunteers came together to help clear debris and support families.",
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
          content: "Proud of our community!",
          timestamp: "3 hours ago",
        },
      ],
    },
  ]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState(new Set());

  // --- Fetch posts from API on mount using Axios ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          "https://kartak-demo-od0f.onrender.com/api/reports"
        );

        const data = res.data;

        if (data.success) {
          const apiPosts = data.data.reports.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            location: item.location_name,
            category: item.disaster_type,
            author: item.author_name,
            timestamp: new Date(item.created_at).toLocaleString(),
            likes: Number(item.likes_count) || 0,
            comments: [], // connect later
            image: item.images?.length ? item.images[0] : null,
          }));

          setPosts(apiPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleAddPost = async (formData) => {
    try {
      const res = await axios.post(
        "https://kartak-demo-od0f.onrender.com/api/reports",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data;

      if (data.success) {
        const newPost = data.data.report; // returned post from API

        // Format it into your UI post structure
        const formatted = {
          id: newPost.id,
          title: newPost.title,
          description: newPost.description,
          location: newPost.location_name,
          category: newPost.disaster_type,
          author: newPost.author_name || "You",
          timestamp: new Date(newPost.created_at).toLocaleString(),
          likes: 0,
          comments: [],
          image: newPost.images?.length ? newPost.images[0] : null,
        };

        setPosts((prev) => [formatted, ...prev]);
      }
    } catch (error) {
      console.error("Error adding post:", error);
      alert("Error creating post. Try again.");
    }
  };
  // --- Handlers (will map to API calls later) ---
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
  const handleSave = (postId) => {
    const updated = new Set(savedPosts);
    updated.has(postId) ? updated.delete(postId) : updated.add(postId);
    setSavedPosts(updated);
  };
  const toggleComments = (postId) => {
    const updated = new Set(expandedComments);
    updated.has(postId) ? updated.delete(postId) : updated.add(postId);
    setExpandedComments(updated);
  };
  const handleAddComment = (postId, commentText) => {
    if (!commentText) return;
    const newComment = {
      id: `c${Date.now()}`,
      author: "You",
      content: commentText,
      timestamp: "Just now",
    };
    2;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
  };
  // const handleAddPost = (postPayload) => {
  //   const post = {
  //     id: `${Date.now()}`,
  //     title: postPayload.title,
  //     description: postPayload.description,
  //     location: postPayload.location,
  //     category: postPayload.category || "general",
  //     author: postPayload.author || "You",
  //     timestamp: "Just now",
  //     likes: 0,
  //     comments: [],
  //     image: postPayload.image || "",
  //   };
  //   setPosts((prev) => [post, ...prev]);
  // };
  // Example: computed trending
  const mostLikedPosts = [...posts]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);
  useEffect(() => {
    // Placeholder for future fetch usage. Keep empty now.
  }, []);
  return (
    <div className="community-page">
      <header className="community-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
          <h1 className="community-title">Community Hub</h1>
          <p className="community-subtitle">
            Share experiences, alerts, and support each other
          </p>
        </div>
      </header>
      <div className="community-container">
        <main className="posts-section">
          <AddPostForm onAddPost={handleAddPost} />
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isLiked={likedPosts.has(post.id)}
              isSaved={savedPosts.has(post.id)}
              commentsExpanded={expandedComments.has(post.id)}
              onLike={() => handleLike(post.id)}
              onSave={() => handleSave(post.id)}
              onToggleComments={() => toggleComments(post.id)}
              onAddComment={(text) => handleAddComment(post.id, text)}
            />
          ))}
        </main>
        <aside className="community-sidebar">
          <Sidebar
            mostLikedPosts={mostLikedPosts}
            onAnalyze={() => navigate("/analyze")}
          />
        </aside>
      </div>
    </div>
  );
}
