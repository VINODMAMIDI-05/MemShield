import React, { useState } from 'react';
import { 
  ListChecks, 
  Lock, 
  Check, 
  Mail, 
  Phone, 
  CreditCard, 
  Key, 
  Fingerprint, 
  MapPin, 
  ShieldAlert,
  FileCheck2
} from 'lucide-react';
import type { Policy, PolicyAction, DataType } from '../../types';
import { COMPLIANCE_PRESETS } from '../../data/mockData';

interface PoliciesTabProps {
  policies: Policy[];
  onTogglePolicy: (policyId: string, enabled: boolean) => void;
  onActionChange: (policyId: string, action: PolicyAction) => void;
  onApplyPreset: (presetId: string) => void;
}

export const PoliciesTab: React.FC<PoliciesTabProps> = ({
  policies,
  onTogglePolicy,
  onActionChange,
  onApplyPreset
}) => {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const getPolicyIcon = (dataType: DataType | string) => {
    switch (dataType) {
      case "EMAIL": return <Mail className="w-4 h-4 text-sky-400" />;
      case "PHONE": return <Phone className="w-4 h-4 text-emerald-400" />;
      case "AADHAAR": case "PAN": case "CREDIT_CARD": return <CreditCard className="w-4 h-4 text-purple-400" />;
      case "PASSWORD": return <Lock className="w-4 h-4 text-rose-400" />;
      case "API_KEY": case "AUTH_TOKEN": case "PRIVATE_KEY": return <Key className="w-4 h-4 text-amber-400" />;
      case "ADDRESS": return <MapPin className="w-4 h-4 text-teal-400" />;
      case "PERSONAL_IDENTIFIER": return <Fingerprint className="w-4 h-4 text-indigo-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleApplyPresetClick = (presetId: string) => {
    setActivePreset(presetId);
    onApplyPreset(presetId);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1-Click Compliance Presets Carousel / Grid */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-sky-400" />
              <span>1-Click Compliance & Regulatory Presets</span>
            </h3>
            <p className="text-xs text-slate-350 mt-0.5">
              Instantly adjust your sensitive entity rules to match global security standards.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-350 font-bold">Zero-Configuration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPLIANCE_PRESETS.map(preset => {
            const isSelected = activePreset === preset.id;
            return (
              <div 
                key={preset.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected 
                    ? "bg-gradient-to-b from-sky-950/40 to-blue-950/40 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.2)]" 
                    : "bg-[#070A18] border-slate-850 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-800 text-sky-300 border border-slate-700">
                      {preset.badge}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">{preset.name}</h4>
                  <p className="text-[11px] text-slate-350 mt-1.5 leading-relaxed">{preset.description}</p>
                </div>

                <button
                  onClick={() => handleApplyPresetClick(preset.id)}
                  className={`mt-4 w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-sky-500 text-slate-950 font-black shadow-sm" 
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  }`}
                >
                  {isSelected ? "Preset Enforced" : "Enforce Preset"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Granular Policy Rules Table */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 bg-[#070A18] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-sky-400" />
              <span>Granular Data Entity Interception Rules</span>
            </h3>
            <p className="text-xs text-slate-350 mt-0.5">
              Specify the exact security action (Mask, Block, or Allow) when parsed entities are detected in prompt streams.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-350 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-bold">
              {policies.filter(p => p.enabled).length} of {policies.length} Active
            </span>
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-850">
          {policies.map(p => (
            <div 
              key={p.id} 
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                p.enabled ? "hover:bg-[#0E132A]/70" : "opacity-50 bg-[#070A14]"
              }`}
            >
              {/* Entity Info */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shrink-0">
                  {getPolicyIcon(p.data_type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-tight">
                      {p.data_type.replace(/_/g, " ")}
                    </h4>
                    <span className={`px-2 py-0.2 text-[9px] font-bold rounded-full ${
                      p.sensitivity === "STRICTLY_CONFIDENTIAL" 
                        ? "bg-rose-500/10 text-rose-300 border border-rose-500/30" 
                        : p.sensitivity === "CONFIDENTIAL" 
                        ? "bg-purple-500/10 text-purple-300 border border-purple-500/30" 
                        : "bg-sky-500/10 text-sky-300 border border-sky-500/30"
                    }`}>
                      {p.sensitivity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-350 mt-1 leading-snug">
                    {p.description || "Parsed using regex heuristics and keyword verb recognition."}
                  </p>
                </div>
              </div>

              {/* Action Selector & Toggle Switch */}
              <div className="flex items-center gap-5 shrink-0 self-end sm:self-center">
                
                {/* Action dropdown */}
                <select
                  value={p.action}
                  disabled={!p.enabled}
                  onChange={e => onActionChange(p.id, e.target.value as PolicyAction)}
                  className={`bg-[#070A18] border border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-bold focus:outline-none transition-all cursor-pointer ${
                    p.action === "BLOCK" 
                      ? "text-rose-400 border-rose-500/40" 
                      : p.action === "MASK" 
                      ? "text-amber-400 border-amber-500/40" 
                      : "text-emerald-400 border-emerald-500/40"
                  }`}
                >
                  <option value="BLOCK">BLOCK (Fail-Closed Deny)</option>
                  <option value="MASK">MASK (Redact / Anonymize)</option>
                  <option value="ALLOW">ALLOW (Unchanged Pass)</option>
                </select>

                {/* Enable / Disable Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={p.enabled}
                    onChange={e => onTogglePolicy(p.id, e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-5.5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
