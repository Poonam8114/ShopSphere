import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, loading, error } = useAuth();
  const { addToast } = useToast();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Find where they came from
  const redirect = location.state?.from?.pathname || '/';

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields', 'warning');
      return;
    }
    try {
      await login(email, password);
      addToast('Successfully logged in!');
    } catch (err) {
      // Handled by AuthContext error state
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-darkCard p-8 shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 mb-3">
            <LogIn size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sign in to your ShopSphere account</p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 flex items-center gap-2.5 text-xs font-semibold">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                required
              />
              <Mail className="absolute left-3.5 top-3 text-gray-400" size={16} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                required
              />
              <Lock className="absolute left-3.5 top-3 text-gray-400" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-100 dark:shadow-none hover:scale-[1.01] flex items-center justify-center"
          >
            {loading ? <Spinner size="sm" color="white" /> : 'Sign In'}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center mt-6 pt-6 border-t border-gray-50 dark:border-zinc-800/80">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
