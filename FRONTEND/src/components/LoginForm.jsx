import { useState } from "react";
import { loginUser } from "../api/user.api.js";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice.js";
import { useNavigate } from "@tanstack/react-router";

function LoginForm({ setShowLoginComponent }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await loginUser(formData.email, formData.password);
      if (user) {
        dispatch(login(user));
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium text-text-muted mb-1.5"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@company.com"
          className="w-full bg-base border border-border rounded-md px-3 py-2.5 text-sm text-text-primary placeholder-text-faint outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-colors"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium text-text-muted mb-1.5"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full bg-base border border-border rounded-md px-3 py-2.5 text-sm text-text-primary placeholder-text-faint outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-colors"
          required
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-danger-bg border border-danger/50 text-danger text-xs">
          <span className="size-1.5 rounded-full bg-danger shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2.5 text-sm font-semibold text-base bg-accent hover:bg-accent-hover disabled:bg-accent-dim disabled:text-text-faint disabled:cursor-not-allowed rounded-md transition-colors duration-150"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="mt-4 text-center">
        <p className="text-xs text-text-muted">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setShowLoginComponent(false)}
            className="text-accent hover:text-accent-hover font-medium transition-colors"
          >
            Create one
          </button>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
