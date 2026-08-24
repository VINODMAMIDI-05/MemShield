import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Cpu, 
  Database, 
  Save, 
  Check,
  Palette
} from 'lucide-react';
import type { ThemeMode } from '../../types';

interface SettingsTabProps {
  protectionEnabled: boolean;
  onToggleGlobalProtection: () => void;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  protectionEnabled,
  onToggleGlobalProtection,
  currentTheme,
  onSelectTheme
}) => {
  const [detectionMode, setDetectionMode] = useState("strict");
  const [aiProvider, setAiProvider] = useState("openai");
  const [modelName, setModelName] = useState("gpt-4o-mini");
  const [auditRetentionDays, setAuditRetentionDays] = useState("90");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fadeIn">
      
      {/* Control Center Form */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
        
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-sky-400" />
            <span>MemShield Control Center & Engine Security</span>
          </h3>
          <p className="text-xs text-slate-350 mt-1">
            Configure global runtime policies, fail-closed thresholds, and upstream LLM proxy endpoints.
          </p>
        </div>

        <div className="space-y-6 divide-y divide-slate-800">
          
          {/* Setting 1: Global Shield State */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div className="max-w-md">
              <h4 className="text-xs font-bold uppercase text-white tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Global Protection State (Fail-Closed)</span>
              </h4>
              <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                When active, all unauthenticated or high-risk credential streams are strictly blocked before reaching upstream AI models.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={protectionEnabled}
                onChange={onToggleGlobalProtection}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
            </label>
          </div>

          {/* Setting 2: Sensitivity Engine Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
            <div className="max-w-md">
              <h4 className="text-xs font-bold uppercase text-white tracking-wide">
                Detection Sensitivity Mode
              </h4>
              <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                Strict mode evaluates Luhn checksums, Shannon entropy for secret tokens, and deep keyword context.
              </p>
            </div>

            <select
              value={detectionMode}
              onChange={e => setDetectionMode(e.target.value)}
              className="bg-[#070A18] border border-slate-700 px-4 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-bold cursor-pointer"
            >
              <option value="strict">Strict Zero-Trust (Recommended)</option>
              <option value="standard">Standard Detection</option>
              <option value="permissive">Permissive (Audit Only)</option>
            </select>
          </div>

          {/* Setting 3: Upstream AI Gateway Provider */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
            <div className="max-w-md">
              <h4 className="text-xs font-bold uppercase text-white tracking-wide flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Upstream LLM Provider Endpoint</span>
              </h4>
              <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                Target AI system to which sanitized payloads are forwarded.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={aiProvider}
                onChange={e => setAiProvider(e.target.value)}
                className="bg-[#070A18] border border-slate-700 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-bold cursor-pointer"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic Claude</option>
                <option value="gemini">Google Gemini</option>
                <option value="ollama">Local Ollama / vLLM</option>
              </select>

              <input
                type="text"
                value={modelName}
                onChange={e => setModelName(e.target.value)}
                placeholder="Model name"
                className="bg-[#070A18] border border-slate-700 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono w-32"
              />
            </div>
          </div>

          {/* Setting 4: Audit Log Retention */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
            <div className="max-w-md">
              <h4 className="text-xs font-bold uppercase text-white tracking-wide flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Forensic Audit Ledger Retention</span>
              </h4>
              <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                Number of days immutable SHA-256 event hashes are maintained for compliance audits.
              </p>
            </div>

            <select
              value={auditRetentionDays}
              onChange={e => setAuditRetentionDays(e.target.value)}
              className="bg-[#070A18] border border-slate-700 px-4 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-bold cursor-pointer"
            >
              <option value="30">30 Days</option>
              <option value="90">90 Days (SOC 2 Standard)</option>
              <option value="365">365 Days (1 Year)</option>
              <option value="unlimited">Indefinite Immutable</option>
            </select>
          </div>

          {/* Setting 5: Interface Security Theme */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
            <div className="max-w-md">
              <h4 className="text-xs font-bold uppercase text-white tracking-wide flex items-center gap-2">
                <Palette className="w-4 h-4 text-sky-400" />
                <span>Security Console Visual Theme</span>
              </h4>
              <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                Choose between high-contrast daylight mode, deep space indigo, matrix emerald, or midnight cyber.
              </p>
            </div>

            <select
              value={currentTheme}
              onChange={e => onSelectTheme(e.target.value as ThemeMode)}
              className="bg-[#070A18] border border-slate-700 px-4 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-bold cursor-pointer"
            >
              <option value="cyber">🌙 Midnight Cyber (Default)</option>
              <option value="indigo">🔮 Deep Space Indigo</option>
              <option value="emerald">⚡ Matrix Zero-Trust</option>
              <option value="light">☀️ Enterprise Daylight</option>
            </select>
          </div>

        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_2px_12px_rgba(14,165,233,0.3)] flex items-center gap-2 cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? "Configuration Saved!" : "Save Engine Settings"}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
