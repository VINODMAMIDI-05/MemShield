import React from 'react';
import { 
  RefreshCw, 
  BrainCircuit, 
  Zap, 
  Play 
} from 'lucide-react';
import type { User, ThemeMode } from '../types';
import { ThemeSelector } from './ThemeSelector';

interface HeaderProps {
  activeTab: string;
  protectionEnabled: boolean;
  onRefresh: () => void;
  onLaunchSimulator: () => void;
  user: User | null;
  latencyMs?: number;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  protectionEnabled,
  onRefresh,
  onLaunchSimulator,
  latencyMs = 9,
  currentTheme,
  onSelectTheme
}) => {
  const getTabLabel = (id: string) => {
    switch (id) {
      case "overview": return "Security Overview & Threat Analytics";
      case "playground": return "Sanitization & AI Gateway Playground";
      case "memory_shield": return "AI Memory & Context Protection";
      case "policies": return "Policy & Rules Manager";
      case "sessions": return "Protected Session Vault";
      case "audit": return "Immutable Audit Trail";
      case "integrations": return "AI Gateway & SDK Integrations";
      case "settings": return "Control Center & Security Settings";
      default: return id.replace("_", " ");
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#070A18] flex items-center justify-between px-6 sm:px-8 shrink-0 relative z-30 shadow-md">
      
      {/* Tab Title & Subtitle */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2.5">
            <span>{getTabLabel(activeTab)}</span>
          </h1>
        </div>

        {/* Live Protection Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full text-[11px] font-bold">
          <span className={`w-2 h-2 rounded-full ${
            protectionEnabled 
              ? "bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.7)]" 
              : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]"
          }`}></span>
          <span className="text-slate-400">Security Middleware:</span>
          <span className={`font-mono uppercase font-black ${protectionEnabled ? "text-emerald-400" : "text-rose-400"}`}>
            {protectionEnabled ? "ENFORCING" : "FAIL-OPEN"}
          </span>
        </div>

        {/* AI Memory Guard Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 rounded-full text-[10px] font-semibold">
          <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Memory Shield Active</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {/* Latency badge */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-mono bg-[#0F1426] px-2.5 py-1.5 rounded-lg border border-slate-800">
          <Zap className="w-3 h-3 text-sky-400" />
          <span>{latencyMs}ms</span>
        </div>

        {/* Theme Switcher */}
        <ThemeSelector
          currentTheme={currentTheme}
          onSelectTheme={onSelectTheme}
        />

        {/* Quick Launch Simulator Button */}
        {activeTab !== "playground" && (
          <button
            onClick={onLaunchSimulator}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-[0_2px_10px_rgba(14,165,233,0.3)] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Launch Playground</span>
          </button>
        )}

        {/* Refresh data */}
        <button
          onClick={onRefresh}
          className="p-2 bg-[#0F1426] hover:bg-[#161D36] border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all shadow-sm cursor-pointer"
          title="Refresh Dashboard Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
};
