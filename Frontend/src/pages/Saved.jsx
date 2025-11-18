import "./Saved.css";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { API_BASE } from "../config/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/Community/PostCard";
import ConfirmModal from "../components/UI/ConfirmModal";
import { useToast } from "../components/UI/ToastProvider";
import RequireAuth from "../components/Auth/RequireAuth";

export default function Saved() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState(new Set());

  const mountedRef = useRef(true);

  const fetchSaved = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // fetch user's bookmarks
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const bmRes = await axios.get(`${API_BASE}/api/bookmarks/my?limit=1000`, {
        headers,
      });

      const bookmarkList = bmRes?.data?.data?.bookmarks || [];
      const bookmarkedIds = new Set(
        bookmarkList.map((b) =>
          String(b.report_id || b.reportId || b.report_id)
        )
      );

      // fetch all reports and filter by bookmark ids (fallback if API doesn't embed report)
      const reportsRes = await axios.get(`${API_BASE}/api/reports`);
      const all = reportsRes?.data?.data?.reports || [];

      const savedReports = all
        .map((item) => ({
          id: String(item.id),
          title: item.title,
          description: item.description,
          location: item.location_name,
          category: item.disaster_type,
          author: item.author_name,
          authorId: String(
            item.author_id ?? item.authorId ?? item.user_id ?? item.userId ?? ""
          ),
          timestamp: new Date(item.created_at).toLocaleString(),
          likes: Number(item.likes_count) || 0,
          comments: [],
          image: item.images?.length ? item.images[0] : null,
          link: item.link || "",
          latitude: String(item.latitude ?? item.lat ?? "0"),
          longitude: String(item.longitude ?? item.lon ?? "0"),
        }))
        .filter((r) => bookmarkedIds.has(r.id));

      if (!mountedRef.current) return;

      setPosts(savedReports);
      setSavedPosts(bookmarkedIds);

      // fetch comments for each saved post
      try {
        const commentFetches = savedReports.map((p) =>
          axios
            .get(`${API_BASE}/api/comments/report/${p.id}`, { headers })
            .then((r) => ({ id: p.id, data: r.data }))
            .catch(() => ({ id: p.id, data: null }))
        );

        const commentsResults = await Promise.all(commentFetches);
        if (!mountedRef.current) return;
        setPosts((prev) =>
          prev.map((p) => {
            const found = commentsResults.find((c) => c.id === p.id);
            if (found && found.data?.success) {
              const comments = (found.data.data.comments || []).map((c) => ({
                id: String(c.id),
                author: c.user_name || "Unknown",
                content: c.comment_text,
                timestamp: new Date(c.created_at).toLocaleString(),
              }));
              return { ...p, comments };
            }
            return p;
          })
        );
      } catch (err) {
        console.error("Error fetching comments for saved posts:", err);
      }

      // fetch likes for the current user to mark liked posts
      if (token) {
        try {
          const lk = await axios.get(`${API_BASE}/api/likes/my?limit=1000`, {
            headers,
          });
          if (lk?.data?.success) {
            const likedIds = new Set(
              lk.data.data.likes.map((l) => String(l.report_id))
            );
            setLikedPosts(likedIds);
          }
        } catch (err) {
          console.error("Error fetching user likes:", err);
        }
      }
    } catch (err) {
      console.error("Error loading saved items:", err);
      if (!mountedRef.current) return;
      setError(err?.message || "Failed to load saved items");
      setPosts([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    mountedRef.current = true;
    fetchSaved();
    return () => (mountedRef.current = false);
  }, [fetchSaved]);

  const isOwnerOf = (post) => {
    if (!user) return false;
    const uid = String(
      user.id ?? user.user_id ?? user.userId ?? user._id ?? ""
    );
    const aid = String(
      post.authorId ?? post.author_id ?? post.user_id ?? post.userId ?? ""
    );
    return uid !== "" && aid !== "" && uid === aid;
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const { showToast } = useToast();

  const openConfirmDelete = (postId) => {
    if (!user || !token) {
      navigate("/login", { state: { from: location } });
      return;
    }
    setPostToDelete(postId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const postId = postToDelete;
    setConfirmOpen(false);
    setPostToDelete(null);
    try {
      await axios.delete(`${API_BASE}/api/reports/${postId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast({ message: "Post deleted", type: "error", duration: 3000 });
    } catch (err) {
      console.error("Error deleting post:", err);
      showToast({
        message: "Failed to delete post",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleLike = async (postId) => {
    if (!user || !token) {
      navigate("/login", { state: { from: location } });
      return;
    }
    const updated = new Set(likedPosts);
    const willLike = !updated.has(postId);
    if (willLike) updated.add(postId);
    else updated.delete(postId);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: willLike ? p.likes + 1 : Math.max(0, p.likes - 1) }
          : p
      )
    );
    setLikedPosts(updated);

    try {
      await axios.post(
        `${API_BASE}/api/likes/toggle`,
        { report_id: Number(postId) },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
    } catch (err) {
      console.error("Error toggling like:", err);
      const revert = new Set(likedPosts);
      if (willLike) revert.delete(postId);
      else revert.add(postId);
      setLikedPosts(revert);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likes: willLike ? Math.max(0, p.likes - 1) : p.likes + 1 }
            : p
        )
      );
    }
  };

  const handleSave = async (postId) => {
    if (!user || !token) {
      navigate("/login", { state: { from: location } });
      return;
    }
    const updated = new Set(savedPosts);
    const willSave = !updated.has(postId);
    if (willSave) updated.add(postId);
    else updated.delete(postId);
    setSavedPosts(updated);

    try {
      await axios.post(
        `${API_BASE}/api/bookmarks/toggle`,
        { report_id: Number(postId) },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      // if unsaved from Saved page, remove from UI list
      if (!willSave) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      const revert = new Set(savedPosts);
      if (willSave) revert.delete(postId);
      else revert.add(postId);
      setSavedPosts(revert);
    }
  };

  const toggleComments = (postId) => {
    const updated = new Set(expandedComments);
    updated.has(postId) ? updated.delete(postId) : updated.add(postId);
    setExpandedComments(updated);
  };

  const handleAddComment = (postId, commentText) => {
    if (!commentText) return;
    if (!user || !token) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const tempId = `tmp-${Date.now()}`;
    const newComment = {
      id: tempId,
      author: (user && (user.name || user.username)) || "You",
      content: commentText,
      timestamp: "Just now",
      pending: true,
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );

    (async () => {
      try {
        const res = await axios.post(
          `${API_BASE}/api/comments`,
          { report_id: Number(postId), comment_text: commentText },
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const data = res.data;
        if (data?.success && data.data?.comment) {
          const serverComment = data.data.comment;
          const formatted = {
            id: String(serverComment.id),
            author:
              serverComment.author_name ||
              (user && (user.name || user.username)) ||
              "You",
            content:
              serverComment.comment_text ||
              serverComment.content ||
              commentText,
            timestamp: new Date(
              serverComment.created_at || Date.now()
            ).toLocaleString(),
          };
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    comments: p.comments.map((c) =>
                      c.id === tempId ? formatted : c
                    ),
                  }
                : p
            )
          );
        } else {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    comments: p.comments.map((c) =>
                      c.id === tempId ? { ...c, pending: false } : c
                    ),
                  }
                : p
            )
          );
        }
      } catch (err) {
        console.error("Error posting comment:", err);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, comments: p.comments.filter((c) => c.id !== tempId) }
              : p
          )
        );
      }
    })();
  };

  return (
    <RequireAuth>
      <div className="saved-page">
        <div className="page-container">
          <h1 className="page-title">Saved Items</h1>
          <p className="page-description">
            Access your saved analyses and reports
          </p>
        </div>

        {/* Loader / error shown under the page header, above the posts container */}
        {loading && (
          <div className="loader-row">
            <div className="spinner" aria-hidden="true"></div>
            <div className="loader-text">Loading saved items…</div>
          </div>
        )}

        {error && (
          <div className="posts-error">
            <p>Failed to load saved items: {error}</p>
            <button className="refresh-button" onClick={() => fetchSaved()}>
              Refresh
            </button>
          </div>
        )}

        <div className="community-container">
          <main className="posts-section">
            {posts.length === 0 && !loading && !error ? (
              <div className="no-saved">No saved posts yet.</div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isLiked={likedPosts.has(post.id)}
                  isSaved={savedPosts.has(post.id)}
                  commentsExpanded={expandedComments.has(post.id)}
                  isOwner={isOwnerOf(post)}
                  onDelete={() => openConfirmDelete(post.id)}
                  onLike={() => handleLike(post.id)}
                  onSave={() => handleSave(post.id)}
                  onToggleComments={() => toggleComments(post.id)}
                  onAddComment={(text) => handleAddComment(post.id, text)}
                />
              ))
            )}
          </main>
        </div>
        <ConfirmModal
          open={confirmOpen}
          title="Delete post"
          description="Are you sure you want to delete this post? This cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </RequireAuth>
  );
}
