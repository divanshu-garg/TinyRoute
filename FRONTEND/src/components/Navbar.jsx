import React from 'react';
import { Link } from '@tanstack/react-router';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const {isAuthenticated} = useSelector((state) => state.auth);
    // const handleLogout = () => {}
  return (
    <nav className="bg-[#fafafa] border-b border-gray-200 shadow-lg sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          {/* Left side - App Name */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all">
              TinyRoute
            </Link>
          </div>
          <div className="flex items-center">
            <Link to="/dashboard" className="text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg border border-transparent hover:border-blue-200 transition-all">
              Dashboard
            </Link>
          </div>
          {/* Right side - Auth buttons */}
          <div className="flex items-center">
            {(isAuthenticated) ? (
            //   <div className="flex items-center space-x-4">
            //     <span className="text-gray-700">Welcome, {user.name || 'User'}</span>
            //     <button
            //       onClick={handleLogout}
            //       className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            //     >
            //       Logout
            //     </button>
            //   </div>
            null
            ) : (
              <Link
                to="/auth"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;