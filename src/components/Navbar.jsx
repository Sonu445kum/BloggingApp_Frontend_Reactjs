import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sun, Moon, User, LogOut, Settings, Menu, X } from "lucide-react";
import { useGetBlogsQuery } from "../api/apiSlice";
import useDebounce from "../hooks/useDebounce";

export default function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token"); // check if user logged in

  const links = useMemo(() => [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ], []);

  const { data: blogs = [] } = useGetBlogsQuery();
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  // Live suggestions
  useEffect(() => {
    if (!debouncedSearchTerm) {
      if (suggestions.length > 0) setSuggestions([]);
      return;
    }

    const matched = blogs
      .filter((blog) =>
        blog.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .slice(0, 5);

    if (JSON.stringify(matched) !== JSON.stringify(suggestions)) {
      setSuggestions(matched);
    }
  }, [debouncedSearchTerm, blogs, suggestions]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/blogs/search?query=${encodeURIComponent(searchTerm)}`);
      setSuggestions([]);
      setMenuOpen(false);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setSuggestions([]);
    navigate(`/blogs/search?query=${encodeURIComponent(title)}`);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 border-b border-gray-700 dark:border-gray-700 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-105 transition-transform"
        >
          MyBlogApp
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-200 dark:text-gray-100 hover:text-yellow-500 transition"
            >
              {link.name}
            </Link>
          ))}

          {/* Search */}
          <div className="relative">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blogs..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-700 dark:bg-gray-800 text-gray-200 dark:text-gray-100 focus:outline-none border border-gray-600 dark:border-gray-700 focus:ring-2 focus:ring-yellow-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" size={18} />
            </form>

            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute mt-2 w-full bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg shadow-lg z-10"
                >
                  {suggestions.map((blog) => (
                    <li
                      key={blog.id}
                      onClick={() => handleSuggestionClick(blog.title)}
                      className="px-4 py-2 hover:bg-gray-600 dark:hover:bg-gray-700 cursor-pointer text-gray-200"
                    >
                      {blog.title}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-700 dark:bg-gray-800 hover:bg-yellow-500 hover:text-white transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Auth Dropdown */}
          {token ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center text-white font-semibold hover:scale-105 transition"
              >
                <User size={18} />
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-40 bg-gray-800 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden"
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings size={16} className="mr-2" /> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User size={16} className="mr-2" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-200 hover:bg-red-600"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/auth/login" className="text-gray-200 hover:text-yellow-500">Login</Link>
              <Link to="/auth/register" className="text-gray-200 hover:text-yellow-500">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-md text-gray-200 hover:text-yellow-500 transition">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 left-0 w-full bg-gray-800 dark:bg-gray-900 px-6 py-4 shadow-md z-50"
              >
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-gray-200 dark:text-gray-100 hover:text-yellow-500 transition"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="relative mt-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search blogs..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 dark:bg-gray-800 text-gray-200 dark:text-gray-100 focus:outline-none border border-gray-600 dark:border-gray-700 focus:ring-2 focus:ring-yellow-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" size={18} />
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-full bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg shadow-lg z-50"
                      >
                        {suggestions.map((blog) => (
                          <li
                            key={blog.id}
                            onClick={() => handleSuggestionClick(blog.title)}
                            className="px-4 py-2 hover:bg-gray-600 dark:hover:bg-gray-700 cursor-pointer text-gray-200"
                          >
                            {blog.title}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </form>

                {/* Mobile Auth Dropdown */}
                {token && (
                  <div className="mt-4 border-t border-gray-700 pt-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-200 hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
