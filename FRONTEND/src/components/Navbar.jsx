import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../api/user.api";
import { logout } from "../store/slices/authSlice";
import { queryClient } from "../main";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/analytics", label: "Analytics" },
];

const NavLink = ({ to, label, onClick }) => {
  const { location } = useRouterState();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-150
        ${
          isActive
            ? "text-text-primary bg-text-primary/6"
            : "text-text-muted hover:text-text-primary hover:bg-text-primary/4"
        }`}
    >
      {label}
      {isActive && (
        <span className="absolute inset-x-3 -bottom-px h-px bg-accent" />
      )}
    </Link>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef(null);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = async () => {
    setLogoutError("");
    try {
      const res = await logoutUser();
      if (res) dispatch(logout());
      await queryClient.removeQueries({ queryKey: ["currentUser"] });
      navigate({ to: "/auth" });
    } catch (err) {
      setLogoutError(
        err.response?.data?.message ?? "Logout failed. Please try again.",
      );
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200
        ${
          isScrolled
            ? "bg-base/95 backdrop-blur-md border-b border-border shadow-[0_1px_0_0_rgba(255,255,255,0.03)]"
            : "bg-base border-b border-border-sub"
        }`}
    >
      <div ref={mobileMenuRef}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              to="/"
              className="font-mono text-white font-semibold tracking-tight hover:text-accent-hover transition-colors duration-150"
            >
              tiny<span className="text-accent">route</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} {...link} />
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-text-primary/4 border border-text-primary/6">
                    <span className="size-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-xs text-text-default font-medium max-w-[120px] truncate">
                      Hi, {user?.name ?? "User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-text-muted hover:text-text-primary px-3 py-1.5 rounded-md hover:bg-text-primary/6 border border-transparent hover:border-text-primary/8 transition-all duration-150"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="text-xs font-semibold text-base bg-accent hover:bg-accent-hover px-4 py-1.5 rounded-md transition-colors duration-150"
                >
                  Sign in
                </Link>
              )}
            </div>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="md:hidden p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-text-primary/6 transition-colors"
            >
              <div className="flex flex-col justify-center gap-1.5 w-5 h-5">
                <span
                  className={`block h-px bg-current transition-all duration-200 origin-center
                    ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`}
                />
                <span
                  className={`block h-px bg-current transition-all duration-200
                    ${mobileOpen ? "opacity-0 -translate-x-1" : ""}`}
                />
                <span
                  className={`block h-px bg-current transition-all duration-200 origin-center
                    ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out border-t border-border-sub
            ${mobileOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} {...link} onClick={closeMobile} />
            ))}

            <div className="mt-2 pt-3 border-t border-border-sub">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-accent" />
                    <span className="text-xs text-text-default">
                      {user?.name ?? "User"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      closeMobile();
                      handleLogout();
                    }}
                    className="text-xs text-text-muted hover:text-text-primary px-3 py-1.5 rounded-md hover:bg-text-primary/6 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={closeMobile}
                  className="block w-full text-center text-xs font-semibold text-base bg-accent hover:bg-accent-hover px-4 py-2 rounded-md transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {logoutError && (
        <div className="absolute left-1/2 -translate-x-1/2 top-16 z-50 flex items-center gap-2 bg-danger-bg border border-danger/60 text-danger text-xs px-3 py-2 rounded-md shadow-lg">
          <span className="size-1.5 rounded-full bg-danger shrink-0" />
          {logoutError}
        </div>
      )}
    </header>
  );
};

export default Navbar;
