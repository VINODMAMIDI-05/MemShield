import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Lock, 
  ArrowRight, 
  Zap, 
  EyeOff, 
  Brain,
  Sparkles
} from 'lucide-react';

interface DataFlowBannerProps {
  protectionEnabled: boolean;
  totalMasked?: number;
  totalBlocked?: number;
  activeSessions?: number;
}

export const DataFlowBanner: React.FC<DataFlowBannerProps> = ({
  protectionEnabled,
  totalMasked = 128,
  totalBlocked = 14,
  activeSessions = 3
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1021] via-[#0F172E] to-[#0A0E1F] border border-sky-500/20 p-6 shadow-2xl mb-8 group">
      {/* Background glow effects */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/15 transition-all duration-700"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left: Core Positioning Message */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>AI Privacy Protection Engine & Security Layer</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            Your AI is protected. <br />
            <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Your sensitive information stays private.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-350 mt-2 leading-relaxed font-normal">
            MemShield sits transparently between your users and upstream AI systems. Sensitive credentials, PII, and company secrets are intercepted and sanitized before they can reach AI models or persist in AI memory.
          </p>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Leakage to AI Memory</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
              <Zap className="w-3.5 h-3.5" />
              <span>&lt; 12ms Inspection Overhead</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <EyeOff className="w-3.5 h-3.5" />
              <span>{totalMasked} Masked / {totalBlocked} Blocked</span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Pipeline Diagram Graphic */}
        <div className="bg-[#070A16]/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3 min-w-[320px] sm:min-w-[380px] shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            <span>Live Security Middleware Flow</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {protectionEnabled ? "GATEWAY ACTIVE" : "BYPASSED"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            {/* Step 1: User / Client App */}
            <div className="flex flex-col items-center text-center p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 w-24">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 mb-1.5">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-200">Client / App</span>
              <span className="text-[8px] text-slate-300 mt-0.5">Raw Stream</span>
            </div>

            <ArrowRight className="w-4 h-4 text-sky-400 shrink-0 animate-pulse" />

            {/* Step 2: MemShield Guard */}
            <div className="flex flex-col items-center text-center p-2.5 rounded-lg bg-gradient-to-b from-sky-950/80 to-blue-950/80 border border-sky-500/40 w-32 shadow-[0_0_15px_rgba(56,189,248,0.15)] relative">
              <div className="absolute -top-2 -right-1 bg-sky-500 text-[8px] font-black text-slate-950 px-1.5 py-0.2 rounded-full">
                SHIELD
              </div>
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 mb-1.5">
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-sky-200">MemShield</span>
              <span className="text-[8px] text-sky-400 font-mono mt-0.5">Sanitize & Guard</span>
            </div>

            <ArrowRight className="w-4 h-4 text-sky-400 shrink-0 animate-pulse" />

            {/* Step 3: Upstream LLM & Memory */}
            <div className="flex flex-col items-center text-center p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 w-28">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-1.5">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-200">AI & Memory</span>
              <span className="text-[8px] text-emerald-400 mt-0.5">Protected State</span>
            </div>
          </div>

          <div className="bg-[#0A0E1F] p-2 rounded-lg border border-slate-850 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Active Channel: <strong className="text-slate-200 font-mono">Port 8000 / Proxy</strong></span>
            <span className="text-sky-400 font-semibold">{activeSessions} sessions live</span>
          </div>
        </div>

      </div>
    </div>
  );
};
