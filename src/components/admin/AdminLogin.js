import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgLogin from './bglogin.png';
import { LoginService } from '../services/ApiService';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await LoginService({
        username: formData.username,
        password: formData.password
      });

      /**
       * Backend Response Example:
       * {
       *   access_token: "...",
       *   refresh_token: "...",
       *   user_role: "ADMIN" | "EMPLOYEE",
       *   onboarding_completed: false
       * }
       */

      // Store auth data
      sessionStorage.setItem('access_token', res.access_token);
      sessionStorage.setItem('refresh_token', res.refresh_token);
      sessionStorage.setItem('user_role', res.user_role);

      // Role-based redirect
      if (res.user_role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.user_role === 'EMPLOYEE') {
        navigate('/employee');
      } else {
        // Safety fallback
        setError('Unauthorized role');
        sessionStorage.clear();
      }

    } catch (err) {
      setError(err?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-5">
      <div className="flex w-full max-w-4xl h-[550px] bg-white shadow-2xl rounded-[30px] overflow-hidden border border-gray-100">

        {/* Left Image */}
        <div className="hidden md:block w-1/2 h-full relative">
          <img
            src={bgLogin}
            alt="Login Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#10d876] focus:ring-1 focus:ring-[#10d876]"
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#10d876] focus:ring-1 focus:ring-[#10d876]"
                disabled={loading}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#10d876] hover:bg-[#0ebf68] text-white font-bold py-3 rounded-lg transition duration-300 shadow-lg shadow-green-500/30 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
