import React, { useState } from "react";
import { Image as ImageIcon, Send } from "lucide-react";
export default function AddPostForm({ onAddPost }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "flood",
    author: "You",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // store real file
      setImagePreview(URL.createObjectURL(file)); // keep preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.location) {
      return alert("Please fill in all required fields.");
    }

    // Build FormData for API
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("location_name", form.location);
    fd.append("disaster_type", form.category);
    fd.append("link", form.link || "");

    if (imageFile) {
      fd.append("images", imageFile);
    }

    // Call parent function
    onAddPost(fd);

    // Reset UI
    setForm({ title: "", description: "", location: "", category: "flood" });
    setImagePreview(null);
    setImageFile(null);
  };
  // const handleImage = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) setImagePreview(URL.createObjectURL(file));
  // };
  return (
    <form className="add-post-form" onSubmit={handleSubmit}>
      <h2>Add New Post</h2>
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
      {imagePreview && (
        <img src={imagePreview} alt="Preview" className="imagepreview" />
      )}
      <div className="add-post-form-buttons">
        <label className="upload-label">
          <ImageIcon size={20} />
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{
              display: "none",
            }}
          />
        </label>
        <button type="submit" className="submit-post">
          <Send size={20} />
          Post
        </button>
      </div>
    </form>
  );
}
