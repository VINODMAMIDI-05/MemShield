import React, { useState } from 'react';
import { Shield, Lock, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import type { User } from '../types';

interface AuthModalProps {
  onSuccess: (token: string, user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("security@memshield.ai");
  const [password, setPassword] = useState("EnterprisePass123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const data = await api.register(name, email, password);
        onSuccess(data.access_token, data.user);
      } else {
        const data = await api.login(email, password);
        onSuccess(data.access_token, data.user);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const data = await api.login("security@memshield.ai", "EnterprisePass123!");
      onSuccess(data.access_token, data.user);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070914] px-4 relative overflow-hidden">
      {/* Glow aura */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0B0F22]/90 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
        
        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center rounded-2xl mb-3.5 shadow-[0_0_25px_rgba(14,165,233,0.4)]">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">MemShield</h1>
          <p className="text-xs text-sky-400 font-semibold uppercase tracking-widest mt-0.5">
            AI Privacy & Security Platform
          </p>
          <p className="text-xs text-slate-400 mt-2 text-center">
            "Your AI is protected. Your sensitive information stays private."
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-slate-350 text-[10px] mb-1.5 font-extrabold uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Sarah Connor"
                className="w-full bg-[#070A18] border border-slate-800 px-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-sky-500 text-xs transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-350 text-[10px] mb-1.5 font-extrabold uppercase tracking-wider">
              Security Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="security@enterprise.com"
              className="w-full bg-[#070A18] border border-slate-800 px-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-sky-500 text-xs transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-350 text-[10px] mb-1.5 font-extrabold uppercase tracking-wider">
              Master Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#070A18] border border-slate-800 px-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-sky-500 text-xs transition-all"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/30 px-3.5 py-2.5 rounded-xl text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all mt-2 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(14,165,233,0.35)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>{isRegister ? "Create Enterprise Account" : "Access Security Console"}</span>
          </button>
        </form>

        {/* Demo 1-Click Access */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2 bg-[#070A18] hover:bg-[#0E132A] border border-slate-800 hover:border-sky-500/40 text-sky-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>1-Click Enterprise Demo Login</span>
          </button>
        </div>

        <div className="mt-5 text-center text-xs text-slate-400">
          {isRegister ? "Already registered?" : "Need an account?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-sky-400 hover:underline font-bold cursor-pointer"
          >
            {isRegister ? "Log In here" : "Sign Up here"}
          </button>
        </div>

      </div>
    </div>
  );
};
