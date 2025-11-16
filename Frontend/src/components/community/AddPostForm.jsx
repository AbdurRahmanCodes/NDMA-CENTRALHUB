import React, { useState } from "react";
import { Image as ImageIcon, Send } from "lucide-react";
import "./AddPostForm.css";
import { useAuth } from "../../context/AuthContext";
import { API_BASE } from "../../config/api";

export default function AddPostForm({ onAddPost }) {
  const { token, user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "flood",
    link: "",
    latitude: "",
    longitude: "",
    status: "active",
    author: "You",
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | posting | success | error
  const [errorMsg, setErrorMsg] = useState(null);

  const handleImage = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setImageFiles(files);
      setImagePreview(files.map((f) => URL.createObjectURL(f)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.location) {
      setErrorMsg("Please fill in the title, description and location.");
      return;
    }
    setErrorMsg(null);
    setStatus("posting");

    // Build FormData for API
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("location_name", form.location);
    // append coordinates if provided, otherwise fall back to 0
    fd.append("latitude", form.latitude ? String(form.latitude) : "0");
    fd.append("longitude", form.longitude ? String(form.longitude) : "0");
    fd.append("disaster_type", form.category);
    fd.append("link", form.link || "");
    fd.append("status", form.status || "active");

    // append image files (API expects images[] or multiple 'images')
    if (imageFiles && imageFiles.length) {
      imageFiles.forEach((file) => fd.append("images", file));
    }

    // Do NOT append author fields here; backend derives author from JWT

    try {
      if (onAddPost) {
        // delegate submission to parent which returns the created/ formatted post
        const created = await onAddPost(fd);
        if (!created) {
          setStatus("error");
          setErrorMsg("Failed to create report. Please try again.");
          return;
        }

        // success — show inline success state on the button
        setStatus("success");
        setErrorMsg(null);

        // Reset UI fields
        setForm({
          title: "",
          description: "",
          location: "",
          category: "flood",
          link: "",
          latitude: "",
          longitude: "",
          status: "active",
          author: "You",
        });
        setImagePreview([]);
        setImageFiles([]);

        // revert success state after a short delay
        setTimeout(() => setStatus("idle"), 2500);
        return;
      }

      // Fallback: if parent didn't provide handler, do POST here (legacy behavior)
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const resp = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers,
        body: fd,
      });
      const json = await resp.json();
      if (!json?.success) {
        console.error("Add post failed:", json);
        setStatus("error");
        setErrorMsg(json?.message || "Failed to create report");
        return;
      }

      // success
      setStatus("success");
      setErrorMsg(null);
      setForm({
        title: "",
        description: "",
        location: "",
        category: "flood",
        link: "",
        latitude: "",
        longitude: "",
        status: "active",
        author: "You",
      });
      setImagePreview([]);
      setImageFiles([]);
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error("Error creating report:", err);
      setStatus("error");
      setErrorMsg(
        err?.message || "Failed to create report. See console for details."
      );
    }
  };
  // const handleImage = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) setImagePreview(URL.createObjectURL(file));
  // };
  return (
    <form className="add-post-form" onSubmit={handleSubmit}>
      <h2>Add New Post</h2>
      {errorMsg && <div className="form-error">{errorMsg}</div>}
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
      {/* Optional reference link and coordinates */}
      <input
        type="url"
        placeholder="Reference link (optional)"
        value={form.link}
        onChange={(e) => setForm({ ...form, link: e.target.value })}
      />
      <div className="coords-row">
        <input
          type="text"
          placeholder="Latitude (optional)"
          value={form.latitude}
          onChange={(e) => setForm({ ...form, latitude: e.target.value })}
        />
        <input
          type="text"
          placeholder="Longitude (optional)"
          value={form.longitude}
          onChange={(e) => setForm({ ...form, longitude: e.target.value })}
        />
      </div>

      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="disaster-select"
      >
        <option value="flood">Flood</option>
        <option value="earthquake">Earthquake</option>
        <option value="wildfire">Wildfire</option>
        <option value="storm">Storm</option>
        <option value="other">Other Disaster</option>
      </select>
      {imagePreview && imagePreview.length > 0 && (
        <div className="image-preview-grid">
          {imagePreview.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Preview ${idx + 1}`}
              className="imagepreview"
            />
          ))}
        </div>
      )}
      <div className="add-post-form-buttons">
        <label className="upload-label">
          <ImageIcon size={20} />
          Upload Image
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImage}
            className="hidden-file-input"
          />
        </label>
        <button
          type="submit"
          className={`submit-post ${status === "success" ? "success" : ""}`}
          disabled={status === "posting"}
        >
          <Send size={20} />
          {status === "posting"
            ? "Posting..."
            : status === "success"
            ? "Posted"
            : "Post"}
        </button>
      </div>
    </form>
  );
}
