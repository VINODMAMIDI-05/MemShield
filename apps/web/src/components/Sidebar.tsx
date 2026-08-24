import React from 'react';
import { 
  Shield, 
  Activity, 
  PlayCircle, 
  BrainCircuit, 
  ListChecks, 
  History, 
  FileText, 
  Cpu, 
  Settings as SettingsIcon, 
  LogOut, 
  User as UserIcon
} from 'lucide-react';
import type { User } from '../types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  activeSessionsCount?: number;
  totalBlockedCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  activeSessionsCount = 3
}) => {
  const navSections: NavSection[] = [
    {
      group: "Core Shield",
      items: [
        { id: "overview", label: "Overview & Metrics", icon: Activity },
        { id: "playground", label: "Protection Playground", icon: PlayCircle, badge: "Live" },
        { id: "memory_shield", label: "AI Memory Shield", icon: BrainCircuit, badge: "Guard" },
      ]
    },
    {
      group: "Governance & Vault",
      items: [
        { id: "policies", label: "Policy & Rules Engine", icon: ListChecks },
        { id: "sessions", label: "Session Vault", icon: History, count: activeSessionsCount },
        { id: "audit", label: "Immutable Audit Trail", icon: FileText },
      ]
    },
    {
      group: "Infrastructure",
      items: [
        { id: "integrations", label: "AI Gateway & SDK", icon: Cpu },
        { id: "settings", label: "Control Center", icon: SettingsIcon },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#070A18] border-r border-slate-800/80 flex flex-col justify-between shrink-0 relative z-30 select-none">
      
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80 bg-[#060814]">
          <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.35)]">
            <Shield className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-base tracking-tight text-white">MemShield</h2>
              <span className="text-[9px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 px-1 py-0.2 rounded font-bold">AI</span>
            </div>
            <span className="text-[10px] text-slate-350 tracking-wide font-medium">Privacy & Security Platform</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-5 overflow-y-auto max-h-[calc(100vh-190px)]">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-350 mb-1.5">
                {sec.group}
              </div>
              
              {sec.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-gradient-to-r from-sky-500/20 via-blue-600/20 to-indigo-600/20 text-sky-300 border border-sky-500/30 shadow-[0_2px_12px_rgba(14,165,233,0.15)]" 
                        : "text-slate-400 hover:bg-[#0E132A] hover:text-white border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-sky-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                      <span>{item.label}</span>
                    </div>

                    {/* Badges / Counters */}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile & Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-[#060814]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#0C1024] border border-slate-800/60">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-white truncate leading-tight">{user?.name || "Security Lead"}</h4>
              <p className="text-[10px] text-slate-350 truncate">{user?.organization || "Admin Console"}</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="p-1.5 text-slate-350 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all border border-transparent hover:border-rose-500/20 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};
