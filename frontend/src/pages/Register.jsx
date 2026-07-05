import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [customError, setCustomError] = useState(null);

  const { user, register, loading, error } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCustomError(null);

    if (!name || !email || !password || !confirmPassword) {
      setCustomError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setCustomError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setCustomError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(name, email, password);
      addToast('Registration successful! Welcome to ShopSphere.');
    } catch (err) {
      // Handled by AuthContext error
    }
  };

  const activeError = customError || error;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-darkCard p-8 shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 mb-3">
            <UserPlus size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get started with your ShopSphere account</p>
        </div>

        {/* Error Feedback */}
        {activeError && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 flex items-center gap-2.5 text-xs font-semibold">
            <AlertCircle size={16} />
            <span>{activeError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                required
              />
              <User className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                required
              />
              <Mail className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                required
              />
              <Lock className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                required
              />
              <Lock className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-100 dark:shadow-none hover:scale-[1.01] flex items-center justify-center pt-3"
          >
            {loading ? <Spinner size="sm" color="white" /> : 'Register'}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center mt-6 pt-6 border-t border-gray-50 dark:border-zinc-800/80">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
