import { useState } from "react";
import { Link, redirect, useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../api/user.api";
import { logout } from "../store/slices/authSlice";
import { queryClient } from "../main";

const Navbar = () => {
  const [error, setError] = useState("");
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    setError("");
    try {
      // throw new Error("logout not implemented yet")
      const res = await logoutUser();
      // const res = false;
      if (res) dispatch(logout());
      // Invalidate currentUser query that was main in checkAuth for dashboard route to clear cached user data
      await queryClient.removeQueries({ queryKey: ["currentUser"] });
      return navigate({ to: "/auth" });
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      console.log("eror occured while logging out:", error);
    }
  };
  return (
    <nav className="bg-[#fafafa] border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-3 sm:px-6 lg:px-8">
        {/* Mobile menu which shows up when hamburger icon clicked*/}
        <div
          id="mobile-menu"
          className={`${
            mobileOpen ? "block" : "hidden"
          } md:hidden bg-white border-t border-gray-100`}
        >
          <div className="px-3 pt-3 pb-4 space-y-1">
            <Link
              to="/dashboard"
              onClick={closeMobile}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              to="/analytics"
              onClick={closeMobile}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Analytics
            </Link>

            {/* user / auth area */}
            <div className="mt-2 border-t pt-2">
              {isAuthenticated ? (
                <div className="px-3 text-sm text-gray-600">
                  Signed in as{" "}
                  <span className="font-medium text-gray-800">{user.name}</span>
                </div>
              ) : (
                <div className="px-3 text-sm text-gray-600">
                  Sign in for Full Access
                </div>
              )}
            </div>
          </div>
        </div>

        {/* below is my main navbar */}
        <div className="flex items-center justify-between gap-4 py-2 md:py-3">
          {/* Left side - App Name - common on mobile and desktop */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              TinyRoute
            </Link>
          </div>

          {/* below first is mobile navbar remaining - hamburger menu + action button */}
          <div className="flex">
            {/* hamburger menu btn that shows only on mobile devices, and on mobile dashboard, analytics etc are hidden */}
            <div>
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-controls="mobile-menu"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="md:hidden inline-flex items-center justify-center px-2 mx-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {/* icon: hamburger / x */}
                {mobileOpen ? (
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Right side - Auth buttons */}
            <div className="flex items-center">
              {/* Mobile auth button - visible on small screens */}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="md:hidden bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={closeMobile}
                  className="md:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* below is desktop menu remaining items- dashboard, analytics + welcome + action button */}
          <div className="hidden md:flex items-center space-x-2">
            {/* these 2 links hidden on mobile by default */}
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg border border-transparent hover:border-blue-200 transition-all"
              >
                Dashboard
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                to="/analytics"
                className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg border border-transparent hover:border-blue-200 transition-all"
              >
                Analytics
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <span className="px-2 py-1 rounded-md bg-gray-100 border border-gray-200 text-gray-800 text-sm shadow-sm hover:shadow transition-all whitespace-nowrap">
                  Welcome, {user.name || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              // null
              <Link
                to="/auth"
                className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
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
