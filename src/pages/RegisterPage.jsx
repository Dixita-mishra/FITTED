import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, User, Mail, KeyRound } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name || 'New Member', email, password);
    navigate('/home');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-fitted-card border border-fitted-gold/30 text-fitted-gold mb-2 shadow-glow-gold/10">
            <img src="/logo.svg" alt="Fitted" className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Join Fitted</h1>
          <p className="text-xs text-gray-400">Personalized fashion intelligence built specifically for you</p>
        </div>

        {/* Register Form Panel */}
        <div className="glass-panel-gold p-8 rounded-3xl space-y-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Dixita Mishra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-fitted-card border border-white/10 text-white text-xs focus:outline-none focus:border-fitted-gold transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="dixita@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-fitted-card border border-white/10 text-white text-xs focus:outline-none focus:border-fitted-gold transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-fitted-card border border-white/10 text-white text-xs focus:outline-none focus:border-fitted-gold transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-glow-gold/20"
            >
              <span>{loading ? 'Creating Passport...' : 'Create Style Passport'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Redirect to Login */}
        <p className="text-center text-xs text-gray-400">
          Already have an account?{' '}
          <NavLink to="/login" className="text-fitted-gold font-semibold hover:underline">
            Sign In
          </NavLink>
        </p>

      </div>
    </div>
  );
}
