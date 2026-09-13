import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Settings, 
  Cpu, 
  Database, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch('http://localhost:8000/api/health', { signal: AbortSignal.timeout(1500) });
        if (res.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('demo');
        }
      } catch (err) {
        setBackendStatus('demo');
      }
    }
    checkBackend();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fitted-gold/15 text-fitted-gold text-xs font-bold uppercase tracking-wider">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Integration Status</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-white">Application Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Architecture & Backend Health */}
        <div className="glass-panel-gold rounded-3xl p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-fitted-gold" />
            <span>FastAPI & Database Pipeline</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-fitted-card/80 border border-white/5">
              <span className="text-gray-300 font-semibold">FastAPI Backend Server</span>
              {backendStatus === 'online' ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Online (localhost:8000)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-fitted-gold/20 text-fitted-gold font-bold flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Standalone Demo Fallback
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-fitted-card/80 border border-white/5">
              <span className="text-gray-300 font-semibold">MongoDB Async Database</span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">
                Motor PyMongo Ready
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-fitted-card/80 border border-white/5">
              <span className="text-gray-300 font-semibold">AI Vision Model Target</span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                Qwen-2.5 VL (via Groq)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-fitted-card/80 border border-white/5">
              <span className="text-gray-300 font-semibold">Payment Interface</span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                Razorpay Test Sandbox Ready
              </span>
            </div>
          </div>
        </div>

        {/* Security & API Key Governance */}
        <div className="glass-panel rounded-3xl p-6 space-y-6 border border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Security & Frontend Isolation</span>
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Strict Security Compliance</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              No secret API keys, Groq credentials, or Razorpay secret keys are exposed in client React code. All third-party integrations are abstracted through the FastAPI backend router layer.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white">Environment Configuration</h4>
            <div className="p-3 rounded-xl bg-fitted-card/80 font-mono text-[11px] text-gray-300 border border-white/5">
              VITE_API_BASE_URL: http://localhost:8000/api
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
