import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} My Blog App. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/blogs" className="hover:text-white transition-colors">
            Blogs
          </Link>
          <Link to="/auth/login" className="hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/auth/register" className="hover:text-white transition-colors">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
