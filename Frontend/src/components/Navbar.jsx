import { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router";
import { Sun, Moon, User, Bookmark, Settings, LogOut } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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

  function handleLogout() {
    console.log("Logging out...");
    // Add your logout logic here
    toggleUserMenu();
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

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-text">Floods Insights</span>
          </div>

          <ul className="navbar-links">
            <li>
              <NavLink to="/" className="nav-link" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/history" className="nav-link">
                History of Floods
              </NavLink>
            </li>
            <li>
              <NavLink to="/analyze" className="nav-link">
                Analyze
              </NavLink>
            </li>
            <li>
              <NavLink to="/learn" className="nav-link">
                Learn
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="nav-link">
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

            {/* User Menu Dropdown */}
            <div className="user-menu">
              <button
                ref={buttonRef}
                className={`user-menu-button ${isUserMenuOpen ? "active" : ""}`}
                onClick={toggleUserMenu}
                aria-label="User menu"
                aria-expanded={isUserMenuOpen}
              >
                <User className="user-icon" />
              </button>

              {isUserMenuOpen && (
                <div
                  ref={dropdownRef}
                  className={`user-dropdown ${menuAnimation}`}
                >
                  <div className="user-info">
                    <p className="user-name">John Doe</p>
                    <p className="user-email">john.doe@example.com</p>
                  </div>

                  <ul className="dropdown-menu">
                    <li className="dropdown-item">
                      <Link to="/saved" className="dropdown-link">
                        <Bookmark />
                        <span>Saved</span>
                      </Link>
                    </li>
                    <li className="dropdown-item">
                      <Link to="/settings" className="dropdown-link">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
