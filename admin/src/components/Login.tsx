import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Mail, Key } from 'lucide-react';
import { login } from '../config/auth.config';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[130px] animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[130px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[130px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative h-20 w-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white ring-1 ring-white/10 shadow-2xl overflow-hidden">
              <img 
                src="/zimscholar-logo.png" 
                alt="ZimScholar Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
        </div>

        <h2 className="text-center text-4xl font-bold text-white tracking-tight mb-2">
          Admin Portal
        </h2>
        <p className="text-center text-slate-400 mb-8 font-light">
          Access your secure dashboard
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[440px] relative z-10 px-4">
        {/* Glassmorphism Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-white/10 p-8 sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-start animate-fade-in-up">
                <div className="flex-shrink-0">
                  <ShieldCheck className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">{error}</h3>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                  Username
                </label>
                <div className="relative transform transition-all duration-300 group-hover:scale-[1.01]">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm transition-all shadow-inner"
                    placeholder="Enter your username"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative transform transition-all duration-300 group-hover:scale-[1.01]">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm transition-all shadow-inner"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-slate-400 bg-transparent">
                Demo Access
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="group text-center p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Username</p>
                <code className="text-sm font-mono text-blue-300">admin</code>
              </div>
              <div className="group text-center p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Password</p>
                <code className="text-sm font-mono text-blue-300">admin123</code>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          &copy; 2026 Admin Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
