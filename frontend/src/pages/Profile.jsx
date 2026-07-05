import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, LogOut, Calendar } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-[80vh] flex items-center justify-center">
      <div className="w-full bg-white dark:bg-darkCard rounded-3xl border border-gray-100 dark:border-zinc-800/80 p-8 md:p-10 shadow-xl space-y-8">
        
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left pb-6 border-b border-gray-50 dark:border-zinc-800/80">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight">{user.name}</h2>
            <span className="inline-flex px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/30">
              {user.role} Member
            </span>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Account Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/40 border border-gray-100/50 dark:border-zinc-800/80">
              <User size={18} className="text-gray-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Full Name</span>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-250">{user.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/40 border border-gray-100/50 dark:border-zinc-800/80">
              <Mail size={18} className="text-gray-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Email Address</span>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-250">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/40 border border-gray-100/50 dark:border-zinc-800/80">
              <Shield size={18} className="text-gray-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Account Role</span>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-250 uppercase">{user.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/40 border border-gray-100/50 dark:border-zinc-800/80">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Account Status</span>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA logout */}
        <button
          onClick={logout}
          className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/30 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={15} />
          Logout from ShopSphere
        </button>
      </div>
    </div>
  );
};

export default Profile;
