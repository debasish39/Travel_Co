import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-transparent px-4">
      
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-10 text-center max-w-md w-full animate-fadeIn">
        
        {/* 404 */}
        <h1 className="text-8xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent animate-float">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-indigo-900 mt-4">
          Page Not Found
        </h2>

        {/* Text */}
        <p className="text-gray-600 text-sm mt-3 mb-6">
          Oops! The page you're looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-600 to-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          ⬅ Back to Home
        </Link>

      </div>
    </div>
  );
};

export default NotFound;