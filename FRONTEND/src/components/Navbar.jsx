import {useState} from 'react';
import { Link, redirect, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../api/user.api';
import { logout } from '../store/slices/authSlice';
import { queryClient } from '../main';

const Navbar = () => {
    const [error, setError] = useState("")
    const {user, isAuthenticated} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
        setError('')
        try {
            // throw new Error("logout not implemented yet")
            const res = await logoutUser();
            // const res = false;
            if(res) dispatch(logout());
            // Invalidate currentUser query that was main in checkAuth for dashboard route to clear cached user data
            await queryClient.removeQueries({ queryKey: ['currentUser'] });
            return navigate({to:"/auth"})
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred. Please try again.");
            console.log("eror occured while logging out:", error)
        }
    }
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
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name || 'User'}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            // null
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

        {error && (
        <div className="absolute right-0 mt-2 bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-md text-xs shadow-sm">
            {error}
        </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;