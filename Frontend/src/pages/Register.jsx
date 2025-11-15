import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again. " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create account</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label">Name</label>
          <input
            className="auth-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-button" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div className="auth-alt">
          Already have an account?{" "}
          <Link className="auth-link" to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
