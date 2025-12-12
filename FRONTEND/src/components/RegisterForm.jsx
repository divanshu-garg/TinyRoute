import React, { useState } from 'react';
import { registerUser } from '../api/user.api.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from '@tanstack/react-router';
import { login } from '../store/slices/authSlice.js';

function RegisterForm({setShowLoginComponent}) {
    const auth = useSelector((state)=> state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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
      const user = await registerUser(formData.name, formData.email, formData.password);
      if(user){
        console.log('Registration successful:', user);
        dispatch(login(user))
        navigate({to:"/dashboard"})
      }
      // Handle successful registration (redirect, show success message, etc.)
    } catch (err) {
      console.log("an error occured during registration:", err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 max-w-lg w-full mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-600 text-sm">Join us to start shortening URLs</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter your email"
            className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
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
            placeholder="Create a password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition duration-200 text-center"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>

      <div className="mt-4 text-sm text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <span onClick={()=> setShowLoginComponent(true)}  className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;