import React from "react";
import TrendingPosts from "./TrendingPosts";
import { TrendingUp } from "lucide-react";
export default function Sidebar({ mostLikedPosts = [], onAnalyze }) {
  return (
    <div>
      <div className="sidebar-section">
        <div className="sidebar-header">
          <TrendingUp size={20} />
          <h2>Most Liked Posts</h2>
        </div>
        <TrendingPosts posts={mostLikedPosts} />
      </div>
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Quick Actions</h3>
        <button className="sidebar-button" onClick={onAnalyze}>
          Analyze Your Region
        </button>
        <button className="sidebar-button secondary">View Saved Posts</button>
      </div>
    </div>
  );
}
