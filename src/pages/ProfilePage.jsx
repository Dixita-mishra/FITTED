import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Sparkles, 
  Ruler, 
  Palette, 
  Check, 
  Edit3, 
  Shirt,
  Shield,
  ArrowRight,
  Bot
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);

  const [bodyType, setBodyType] = useState(user?.bodyType || 'Athletic Trapezoid');
  const [undertone, setUndertone] = useState(user?.undertone || 'Warm Golden');
  const [height, setHeight] = useState(user?.height || "5'11\" (180 cm)");
  const [chest, setChest] = useState(user?.chest || "39 in");
  const [waist, setWaist] = useState(user?.waist || "31 in");

  const bodyShapes = ['Athletic Trapezoid', 'Inverted Triangle', 'Rectangle', 'Oval / Rounded'];
  const undertones = ['Warm Golden', 'Cool Pink/Rose', 'Neutral Olive', 'Deep Rich Mahogany'];

  const handleSave = () => {
    updateUserProfile({
      bodyType,
      undertone,
      height,
      chest,
      waist
    });
    setEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="glass-panel-gold rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-fitted-gold shadow-glow-gold"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">{user?.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-fitted-gold/20 text-fitted-gold text-[10px] font-bold">
                PRO PASSPORT
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">{user?.email}</p>
            <p className="text-[11px] text-fitted-gold font-mono mt-0.5">Style Score: {user?.styleScore || 88}/100</p>
          </div>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className="px-5 py-2.5 rounded-xl bg-fitted-card border border-white/10 hover:border-fitted-gold text-white text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Edit3 className="w-4 h-4 text-fitted-gold" />
          <span>{editing ? 'Cancel Editing' : 'Edit Passport'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Body Profile & Measurements */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-6 border border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Ruler className="w-4 h-4 text-fitted-gold" />
              <span>1. Body Shape & Measurements</span>
            </h3>

            {editing ? (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Body Silhouette Profile</label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-fitted-card border border-white/10 text-white"
                  >
                    {bodyShapes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Height</label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-fitted-card border border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Chest</label>
                    <input
                      type="text"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-fitted-card border border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Waist</label>
                    <input
                      type="text"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-fitted-card border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-fitted-card/70 border border-white/5 space-y-1">
                  <span className="text-gray-400">Body Profile</span>
                  <p className="text-white font-bold">{bodyType}</p>
                </div>
                <div className="p-3 rounded-xl bg-fitted-card/70 border border-white/5 space-y-1">
                  <span className="text-gray-400">Height</span>
                  <p className="text-white font-bold">{height}</p>
                </div>
                <div className="p-3 rounded-xl bg-fitted-card/70 border border-white/5 space-y-1">
                  <span className="text-gray-400">Chest Measurement</span>
                  <p className="text-white font-bold">{chest}</p>
                </div>
                <div className="p-3 rounded-xl bg-fitted-card/70 border border-white/5 space-y-1">
                  <span className="text-gray-400">Waist Measurement</span>
                  <p className="text-white font-bold">{waist}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Color Palette & Undertone */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-6 border border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-fitted-gold" />
              <span>2. Undertone & Color Palette</span>
            </h3>

            {editing ? (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Skin Undertone Classification</label>
                  <select
                    value={undertone}
                    onChange={(e) => setUndertone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-fitted-card border border-white/10 text-white"
                  >
                    {undertones.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-fitted-card/70 border border-white/5 space-y-1">
                  <span className="text-gray-400">Skin Undertone</span>
                  <p className="text-fitted-gold font-bold">{undertone}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-gray-300 font-semibold">Recommended Complementary Colors</span>
                  <div className="flex items-center gap-2">
                    {['#1A1A24', '#D4AF37', '#334155', '#C59B6C', '#F5F5F0'].map((color, i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-xl border border-white/20 shadow-sm flex items-center justify-center text-[9px] font-mono text-white"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {editing && (
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-gold/20"
            >
              <Check className="w-4 h-4" />
              <span>Save Style Passport Changes</span>
            </button>
          )}

          {/* Gemini AI Partner Recommendation Banner */}
          <div className="glass-panel-gold rounded-3xl p-6 space-y-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-fitted-gold text-xs font-bold uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                <span>Gemini AI Partner Matcher</span>
              </div>
              <h4 className="text-sm font-bold text-white">Find Allergy-Safe & Budget Partner Products</h4>
              <p className="text-xs text-gray-300">
                Use your saved height ({user?.height || "5'11\""}), chest ({user?.chest || "39\""}), and body shape ({user?.bodyType || "Trapezoid"}) to generate tailored product recommendations.
              </p>
            </div>
            <button
              onClick={() => navigate('/recommendations')}
              className="px-5 py-3 rounded-2xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-gold shrink-0 hover:brightness-110 transition-all"
            >
              <span>Match Partner Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
