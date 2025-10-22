import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path ? "text-yellow-400" : "hover:text-yellow-300";

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl">BlogApp</Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/blogs" className={isActive("/blogs")}>Blogs</Link>
          {!token && (
            <>
              <Link to="/auth/login" className={isActive("/auth/login")}>Login</Link>
              <Link to="/auth/register" className={isActive("/auth/register")}>Register</Link>
            </>
          )}
          {token && (
            <>
              {userRole === "Admin" && <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>Admin</Link>}
              <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2">
          <Link to="/blogs" className={isActive("/blogs")} onClick={() => setMenuOpen(false)}>Blogs</Link>
          {!token && (
            <>
              <Link to="/auth/login" className={isActive("/auth/login")} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/auth/register" className={isActive("/auth/register")} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
          {token && (
            <>
              {userRole === "Admin" && <Link to="/admin/dashboard" className={isActive("/admin/dashboard")} onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
