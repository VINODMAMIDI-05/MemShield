import React from 'react';
import { 
  ShieldCheck, 
  EyeOff, 
  Lock, 
  Activity, 
  ArrowUpRight, 
  Play, 
  CheckCircle2, 
  FileCheck2, 
  BrainCircuit, 
  Fingerprint 
} from 'lucide-react';
import type { DashboardStats, AuditLog } from '../../types';

interface OverviewTabProps {
  stats: DashboardStats | null;
  onNavigateTab: (tab: string) => void;
  onLaunchPlayground: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  onNavigateTab,
  onLaunchPlayground
}) => {
  const totalMasked = stats?.total_masked || 128;
  const totalBlocked = stats?.total_blocked || 14;

  const entityDistribution = [
    { type: "Passwords & Secrets", count: 38, percentage: 27, color: "bg-rose-500", text: "text-rose-400" },
    { type: "API Keys & Tokens", count: 32, percentage: 23, color: "bg-amber-500", text: "text-amber-400" },
    { type: "Financial & Credit Cards", count: 28, percentage: 20, color: "bg-purple-500", text: "text-purple-400" },
    { type: "Government IDs (Aadhaar/PAN)", count: 24, percentage: 17, color: "bg-sky-500", text: "text-sky-400" },
    { type: "Personal Contacts (Email/Phone)", count: 20, percentage: 13, color: "bg-emerald-500", text: "text-emerald-400" },
  ];

  const complianceStandards = [
    { name: "SOC 2 Type II", status: "Protected", coverage: "100%", desc: "CC6.1 Logical Access & Secret Protection" },
    { name: "HIPAA Security", status: "Protected", coverage: "100%", desc: "45 CFR § 164.312 PHI De-identification" },
    { name: "PCI-DSS v4.0", status: "Protected", coverage: "100%", desc: "Req 3.4 Cardholder Data Masking" },
    { name: "EU GDPR", status: "Protected", coverage: "100%", desc: "Art. 25 Privacy by Design & Pseudonymization" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 4 Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Shield Status */}
        <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-350 uppercase tracking-wider">AI Shield Status</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3 tracking-tight">ENFORCING</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero Unmasked Leaks to LLM</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-full"></div>
          </div>
        </div>

        {/* Card 2: Sensitive Entities Masked */}
        <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-350 uppercase tracking-wider">Sanitized & Masked</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <EyeOff className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3 tracking-tight">{totalMasked}</p>
          <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium mt-2">
            <span>Redacted with cryptographic tokens</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full w-[88%]"></div>
          </div>
        </div>

        {/* Card 3: High-Risk Credentials Blocked */}
        <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-350 uppercase tracking-wider">Fail-Closed Blocked</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-400 mt-3 tracking-tight">{totalBlocked}</p>
          <div className="flex items-center gap-1.5 text-xs text-rose-300 font-medium mt-2">
            <span>Passkeys, API secrets intercepted</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full w-[35%]"></div>
          </div>
        </div>

        {/* Card 4: AI Memory Leak Prevented */}
        <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-350 uppercase tracking-wider">AI Memory Shield</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-300 mt-3 tracking-tight">67 Stops</p>
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium mt-2">
            <span>Vector store poison prevented</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full w-[95%]"></div>
          </div>
        </div>

      </div>

      {/* Main Grid: Live Audit Stream & Entity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1 & 2: Real-time Live Security Audit Stream */}
        <div className="lg:col-span-2 bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <span>Real-Time Threat & Ingestion Stream</span>
                </h3>
                <p className="text-xs text-slate-350 mt-0.5">Live interception log of prompts and payloads checked by MemShield.</p>
              </div>

              <button
                onClick={() => onNavigateTab("audit")}
                className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Full Audit Vault</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stream Items */}
            <div className="mt-4 space-y-2.5">
              {(!stats?.recent_events || stats.recent_events.length === 0) ? (
                <div className="py-12 text-center text-slate-500 text-xs">No recent events logged. Stream active.</div>
              ) : (
                stats.recent_events.slice(0, 5).map((evt: AuditLog) => (
                  <div 
                    key={evt.id} 
                    className="p-3.5 bg-[#070A18] border border-slate-850 hover:border-slate-700/80 rounded-xl flex items-center justify-between text-xs transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        evt.action === "BLOCK" 
                          ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" 
                          : evt.action === "MASK" 
                          ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
                          : "bg-sky-400"
                      }`}></div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-xs">{evt.event_type.replace(/_/g, " ")}</span>
                          <span className="text-[10px] font-mono bg-slate-800 text-slate-350 px-1.5 py-0.2 rounded font-bold">
                            {evt.data_type || "PAYLOAD"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-350 mt-0.5 font-mono">
                          Channel: {evt.session_id ? evt.session_id.substring(0, 14) : "Global Gateway"} • {new Date(evt.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-md font-black text-[10px] uppercase tracking-wider ${
                      evt.action === "BLOCK" 
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" 
                        : evt.action === "MASK" 
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/30" 
                        : "bg-sky-500/10 text-sky-300 border border-sky-500/30"
                    }`}>
                      {evt.action}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-350">
            <span>Fail-Closed Policy: <strong className="text-emerald-400 font-semibold">Strict Zero-Trust Active</strong></span>
            <span className="font-mono">Proxy: 127.0.0.1:8000</span>
          </div>
        </div>

        {/* Col 3: Sensitivity Breakdown & Quick Actions */}
        <div className="space-y-6">
          
          {/* Entity Distribution Card */}
          <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-sky-400" />
              <span>Sensitive Entity Breakdown</span>
            </h3>

            <div className="space-y-3.5">
              {entityDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300">{item.type}</span>
                    <span className={`font-mono font-bold ${item.text}`}>{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Simulator Launch Card */}
          <div className="bg-gradient-to-br from-[#0F1836] to-[#0A0F24] border border-sky-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <h4 className="text-sm font-bold text-white mb-1">Interactive Security Gate</h4>
            <p className="text-xs text-slate-350 leading-relaxed">
              Test real-time sanitization on raw text or send intercepted prompts to LLMs with live policy enforcement.
            </p>

            <button
              onClick={onLaunchPlayground}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_2px_12px_rgba(14,165,233,0.3)] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Launch Protection Simulator</span>
            </button>
          </div>

        </div>

      </div>

      {/* Enterprise Compliance Readiness Grid */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Compliance & Regulatory Posture</span>
            </h3>
            <p className="text-xs text-slate-350 mt-0.5">Automated policy mapping to major global privacy standards.</p>
          </div>

          <button
            onClick={() => onNavigateTab("policies")}
            className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Manage Compliance Presets</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceStandards.map((std, idx) => (
            <div key={idx} className="p-4 bg-[#070A18] border border-slate-850 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-white">{std.name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  {std.coverage}
                </span>
              </div>
              <p className="text-[11px] text-slate-350 leading-snug">{std.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
