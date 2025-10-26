import React, { useState, useEffect, useMemo } from "react";
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

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.is_admin ? "admin" : "user";
  const username = user?.username || "User";

  const links = useMemo(
    () => [
      { name: "Home", path: "/" },
      { name: "Blogs", path: "/blogs" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ],
    []
  );

  const { data: blogs = [] } = useGetBlogsQuery();
  const stableBlogs = useMemo(() => blogs, [blogs]);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!debouncedSearchTerm) return setSuggestions([]);
    const matched = stableBlogs
      .filter((blog) => blog.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      .slice(0, 5);
    setSuggestions(matched);
  }, [debouncedSearchTerm, stableBlogs]);

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
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 border-b border-gray-700 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-105 transition-transform"
        >
          SonuBlogApp
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-200 hover:text-yellow-500 transition"
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
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </form>

            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute mt-2 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10"
                >
                  {suggestions.map((blog) => (
                    <li
                      key={blog.id}
                      onClick={() => handleSuggestionClick(blog.title)}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-gray-200"
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
            className="p-2 rounded-full bg-gray-700 hover:bg-yellow-500 hover:text-white transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Auth Section */}
          {token ? (
            <div className="relative flex items-center space-x-2">
              {/* Admin Badge */}
              {role === "admin" && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-xs font-bold px-2 py-1 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/30 border border-yellow-500 animate-pulse"
                >
                  Admin
                </motion.span>
              )}

              {/* Profile Icon */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center text-white hover:scale-105 transition"
              >
                <User size={18} />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-12 w-44 bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    {role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700"
                      >
                        <Settings size={16} className="mr-2" /> Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700"
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
              <Link to="/auth/login" className="text-gray-200 hover:text-yellow-500">
                Login
              </Link>
              <Link to="/auth/register" className="text-gray-200 hover:text-yellow-500">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md text-gray-200 hover:text-yellow-500 transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 left-0 w-full bg-gray-800 px-6 py-4 shadow-md z-50"
              >
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-gray-200 hover:text-yellow-500"
                  >
                    {link.name}
                  </Link>
                ))}

                <form onSubmit={handleSearchSubmit} className="relative mt-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search blogs..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </form>

                <div className="mt-4 border-t border-gray-700 pt-3">
                  {token ? (
                    <>
                      {role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                        >
                          Dashboard
                        </Link>
                      )}
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
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 text-gray-200 hover:text-yellow-500"
                      >
                        Login
                      </Link>
                      <Link
                        to="/auth/register"
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 text-gray-200 hover:text-yellow-500"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
