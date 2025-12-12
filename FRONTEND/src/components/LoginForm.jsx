import React, { useState } from 'react';
import { loginUser } from '../api/user.api.js';
import {useDispatch, useSelector} from "react-redux"
import { login } from '../store/slices/authSlice.js';
import { useNavigate } from '@tanstack/react-router';

function LoginForm({setShowLoginComponent}) {
    const auth = useSelector((state)=>state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const user = await loginUser(formData.email, formData.password);
      console.log('Login successful:', user);
      if(user){
        dispatch(login(user))
        navigate({to:"/dashboard"})
      }
        
      // Handle successful login (redirect, store token, etc.)
    } catch (err) {
      console.log("an error occured during registration:", err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-gray-100 max-w-lg w-full mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        {error && (
          <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <span onClick={()=> setShowLoginComponent(false)} className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
