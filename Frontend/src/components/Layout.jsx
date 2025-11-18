import { Outlet, Link, useLocation } from "react-router-dom";
import "./Layout.css";
import Navbar from "./Navbar";
import ChatBot from "./ChatBot";
import ScrollToTop from "./ScrollToTop";
import ToastProvider from "./UI/ToastProvider";

export default function Layout() {
  const location = useLocation();
  const isAnalyzePage = location.pathname === "/analyze";
  const isHistoryPage = location.pathname === "/history";

  return (
    <ToastProvider>
      <div className="layout">
        <Navbar />

        <main className="main-content">
          <Outlet />
        </main>
        <ChatBot />
        {/* show scroll-to-top except on analyze and history pages */}
        {!isAnalyzePage && !isHistoryPage && <ScrollToTop />}

        {!isAnalyzePage && (
          <footer className="footer">
            <div className="footer-content">
              <p className="footer-copyright">
                &copy; 2025 Floods Insights. All rights reserved.
              </p>
            </div>
          </footer>
        )}
      </div>
    </ToastProvider>
  );
}
