import { Outlet, Link } from "react-router-dom";
import "./Layout.css";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-copyright">
            &copy; 2025 Floods Insights. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
