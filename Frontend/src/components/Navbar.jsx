import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  User,
  Bookmark,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "./Navbar.css";
import mainLogo from "../assets/download.jpeg";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth() || {};
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState("");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  function handleThemeToggle() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function toggleUserMenu() {
    if (isUserMenuOpen) {
      setMenuAnimation("exiting");
      setTimeout(() => {
        setIsUserMenuOpen(false);
        setMenuAnimation("");
      }, 200);
    } else {
      setIsUserMenuOpen(true);
      setMenuAnimation("entering");
    }
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  async function handleLogout() {
    if (logout) await logout();
    toggleUserMenu();
    navigate("/");
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        if (isUserMenuOpen) {
          setMenuAnimation("exiting");
          setTimeout(() => {
            setIsUserMenuOpen(false);
            setMenuAnimation("");
          }, 200);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      const navbar = document.querySelector(".navbar-container");
      const mobileMenu = document.querySelector(".navbar-links");

      if (
        isMobileMenuOpen &&
        navbar &&
        !navbar.contains(event.target) &&
        mobileMenu &&
        !mobileMenu.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img
              src={mainLogo}
              alt="Floods Insights Logo"
              className="logo-image"
            />
            <span className="logo-text">Eye Of Habi</span>
          </Link>

          <ul
            className={`navbar-links ${isMobileMenuOpen ? "mobile-open" : ""}`}
          >
            <li>
              <NavLink
                to="/"
                className="nav-link"
                end
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/history"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                History of Floods
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analyze"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                Analyze
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/community"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                Community
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                About Us
              </NavLink>
            </li>
          </ul>

          <div className="actions">
            <button
              className="theme-switcher"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </button>

            {/* User Actions */}
            <div className="user-menu">
              <button
                ref={buttonRef}
                className={`user-menu-button ${isUserMenuOpen ? "active" : ""}`}
                onClick={toggleUserMenu}
                aria-label="User menu"
                aria-expanded={isUserMenuOpen}
                title={user?.email || "User menu"}
              >
                <User className="user-icon" />
              </button>

              {isUserMenuOpen && (
                <div
                  ref={dropdownRef}
                  className={`user-dropdown ${menuAnimation}`}
                >
                  {user ? (
                    <>
                      <div className="user-info">
                        <p className="user-name">
                          {user?.name || "Current User"}
                        </p>
                        {user?.email && (
                          <p className="user-email">{user.email}</p>
                        )}
                      </div>

                      <ul className="dropdown-menu">
                        <li className="dropdown-item">
                          <Link
                            to="/saved"
                            className="dropdown-link"
                            onClick={toggleUserMenu}
                          >
                            <Bookmark />
                            <span>Saved</span>
                          </Link>
                        </li>
                        <li className="dropdown-item">
                          <Link
                            to="/settings"
                            className="dropdown-link"
                            onClick={toggleUserMenu}
                          >
                            <Settings />
                            <span>Settings</span>
                          </Link>
                        </li>
                        <li className="dropdown-item">
                          <button
                            onClick={handleLogout}
                            className="dropdown-link logout"
                          >
                            <LogOut />
                            <span>Logout</span>
                          </button>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <ul className="dropdown-menu">
                      <li className="dropdown-item">
                        <Link
                          to="/login"
                          className="dropdown-link"
                          onClick={toggleUserMenu}
                        >
                          <User />
                          <span>Login</span>
                        </Link>
                      </li>
                      <li className="dropdown-item">
                        <Link
                          to="/register"
                          className="dropdown-link"
                          onClick={toggleUserMenu}
                        >
                          <User />
                          <span>Register</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger Menu Button */}
            <button
              className="hamburger-menu"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
export { Navbar };
