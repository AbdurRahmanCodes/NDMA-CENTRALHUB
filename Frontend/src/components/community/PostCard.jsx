import React from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Clock,
  MapPin,
} from "lucide-react";
import CommentsSection from "./CommentsSection";
const getCategoryBadge = (category) => {
  const badges = {
    flood: { text: "Flood Alert", class: "badge-flood" },
    earthquake: { text: "Earthquake", class: "badge-earthquake" },
    general: { text: "Community", class: "badge-general" },
  };
  return badges[category] || badges.general;
};
export default function PostCard({
  post,
  isLiked,
  isSaved,
  commentsExpanded,
  onLike,
  onSave,
  onToggleComments,
  onAddComment,
}) {
  const badge = getCategoryBadge(post.category);
  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-author-info">
          <div className="author-avatar">{post.author?.charAt(0)}</div>
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
        <span className={`category-badge ${badge.class}`}>{badge.text}</span>
      </div>
      {post.image && (
        <div className="post-image-container">
          <img src={post.image} alt={post.title} className="post-image" />
        </div>
      )}
      <div className="post-content">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-description">{post.description}</p>
      </div>
      <div className="post-actions">
        <button
          className={`action-button ${isLiked ? "active-like" : ""}`}
          onClick={onLike}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          <span>{post.likes}</span>
        </button>
        <button
          className={`action-button ${commentsExpanded ? "active" : ""}`}
          onClick={onToggleComments}
        >
          <MessageCircle size={20} />
          <span>{post.comments?.length || 0}</span>
        </button>
        <button
          className={`action-button ${isSaved ? "active-save" : ""}`}
          onClick={onSave}
        >
          <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
        </button>
        <button className="action-button">
          <Share2 size={20} />
        </button>
      </div>
      {commentsExpanded && (
        <CommentsSection comments={post.comments} onAddComment={onAddComment} />
      )}
    </article>
  );
}
