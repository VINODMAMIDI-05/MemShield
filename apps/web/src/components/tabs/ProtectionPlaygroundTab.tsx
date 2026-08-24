import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  BrainCircuit, 
  Zap, 
  RefreshCw,
  Mail,
  Phone,
  CreditCard,
  Lock,
  Key,
  MapPin,
  Fingerprint,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import type { Session, DetectionResult, DataType } from '../../types';
import { MOCK_TEST_SCENARIOS } from '../../data/mockData';
import { api } from '../../services/api';

interface ProtectionPlaygroundTabProps {
  token: string | null;
  activeSession: Session | null;
  onCreateSession: () => void;
  onStopSession: (id: string) => void;
  onRefreshStats: () => void;
}

export const ProtectionPlaygroundTab: React.FC<ProtectionPlaygroundTabProps> = ({
  token,
  activeSession,
  onCreateSession,
  onStopSession,
  onRefreshStats
}) => {
  const [mode, setMode] = useState<"sanitize" | "ai_prompt">("sanitize");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  
  // AI Prompt Gateway States
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiStatus, setAiStatus] = useState<string | null>(null);

  // Load a preset scenario
  const handleLoadScenario = (scenarioId: string) => {
    const s = MOCK_TEST_SCENARIOS.find(x => x.id === scenarioId);
    if (!s) return;
    if (mode === "sanitize") {
      setInputText(s.content);
    } else {
      setAiPrompt(s.content);
    }
  };

  // Run Raw Text Sanitizer
  const handleRunSanitizer = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setOutputText("");
    setDetections([]);
    
    try {
      const sessionId = activeSession ? activeSession.id : "sess-prod-9021";
      const res = await api.sanitizeText(token, sessionId, inputText);
      setOutputText(res.safe_content);
      setDetections(res.detections);
      setLatencyMs(res.latency_ms || 11);
      onRefreshStats();
    } catch {
      setOutputText("[SANITIZATION ERROR: ENGINE OFFLINE]");
    } finally {
      setLoading(false);
    }
  };

  // Run AI Gateway Interceptor
  const handleSendAIPrompt = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setAiResponse("");
    setAiStatus(null);
    
    try {
      const sessionId = activeSession ? activeSession.id : "sess-prod-9021";
      const res = await api.processAIPrompt(token, sessionId, aiPrompt);
      setAiResponse(res.ai_response);
      setAiStatus(res.shield_status);
      setLatencyMs(res.latency_ms || 42);
      onRefreshStats();
    } catch {
      setAiResponse("Network error communicating with MemShield AI Gateway.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPolicyIcon = (dataType: DataType | string) => {
    switch (dataType) {
      case "EMAIL": return <Mail className="w-3.5 h-3.5 text-sky-400" />;
      case "PHONE": return <Phone className="w-3.5 h-3.5 text-emerald-400" />;
      case "AADHAAR": case "PAN": case "CREDIT_CARD": return <CreditCard className="w-3.5 h-3.5 text-purple-400" />;
      case "PASSWORD": return <Lock className="w-3.5 h-3.5 text-rose-400" />;
      case "API_KEY": case "AUTH_TOKEN": case "PRIVATE_KEY": return <Key className="w-3.5 h-3.5 text-amber-400" />;
      case "ADDRESS": return <MapPin className="w-3.5 h-3.5 text-teal-400" />;
      case "PERSONAL_IDENTIFIER": return <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />;
      default: return <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  // Render glowing badges for redacted/blocked tokens
  const renderSanitizedContent = (text: string) => {
    if (!text) return <span className="text-slate-500 italic">No output processed yet. Input raw text above and click sanitize.</span>;
    
    const parts = text.split(/(\[[A-Z_ ]+ (?:REDACTED|BLOCKED)\])/g);
    return (
      <div className="leading-relaxed font-mono whitespace-pre-wrap text-xs">
        {parts.map((part, idx) => {
          const match = part.match(/^\[([A-Z_ ]+) (REDACTED|BLOCKED)\]$/);
          if (match) {
            const [_, type, action] = match;
            const isBlocked = action === "BLOCKED";
            return (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold font-sans mx-1 cursor-default select-none transition-all ${
                  isBlocked
                    ? "bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                    : "bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(251,191,36,0.15)]"
                }`}
                title={`Security Action: ${action} on ${type}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-rose-400" : "bg-amber-400"}`}></span>
                {type} {action}
              </span>
            );
          }
          return <span key={idx} className="text-slate-200">{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Session Channel Control Bar */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 border border-slate-700/60 rounded-xl flex items-center justify-center text-sky-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-350">Inspection Channel:</span>
              <span className="text-xs font-mono font-bold text-white">
                {activeSession ? activeSession.id : "sess-prod-9021 (Default Guard)"}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-350 mt-0.5">
              Sitting between application layer & upstream LLM memory store.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!activeSession ? (
            <button
              onClick={onCreateSession}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_2px_10px_rgba(14,165,233,0.3)] cursor-pointer"
            >
              Spawn New Isolated Session
            </button>
          ) : (
            <button
              onClick={() => onStopSession(activeSession.id)}
              className="px-4 py-2 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Seal & Close Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Quick-Load Test Scenarios */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-350">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Load Quick Threat Test Scenario:</span>
          </div>
          <span className="text-[11px] text-slate-350 font-mono">1-Click Benchmark</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MOCK_TEST_SCENARIOS.map(sc => (
            <button
              key={sc.id}
              onClick={() => handleLoadScenario(sc.id)}
              className="p-3 bg-[#070A18] hover:bg-[#0E132A] border border-slate-850 hover:border-sky-500/40 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-sky-400 uppercase">
                <span>{sc.category}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <h5 className="text-xs font-bold text-white mt-1 group-hover:text-sky-300 transition-colors line-clamp-1">
                {sc.title}
              </h5>
              <p className="text-[10px] text-slate-350 mt-1 line-clamp-2 leading-relaxed">
                {sc.content}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual-Mode Playground Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Sandbox Form */}
        <div className="lg:col-span-2 bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          
          {/* Mode Switcher Tabs */}
          <div className="bg-[#070A18] border-b border-slate-800 px-6 py-4 flex gap-6">
            <button
              onClick={() => setMode("sanitize")}
              className={`text-xs font-black uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                mode === "sanitize" 
                  ? "text-sky-400 border-b-2 border-sky-400" 
                  : "text-slate-350 hover:text-slate-200"
              }`}
            >
              1. Raw Stream Sanitization Gate
            </button>

            <button
              onClick={() => setMode("ai_prompt")}
              className={`text-xs font-black uppercase tracking-wider pb-1 transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === "ai_prompt" 
                  ? "text-sky-400 border-b-2 border-sky-400" 
                  : "text-slate-350 hover:text-slate-200"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>2. AI Prompt & Memory Interceptor</span>
            </button>
          </div>

          {/* Mode 1: Raw Text Sanitizer */}
          {mode === "sanitize" ? (
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-350">
                    Unsanitized Input Payload
                  </label>
                  <span className="text-[10px] text-slate-350 font-mono">
                    {inputText.length} characters
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Paste or write text containing passwords, API keys, Aadhaar numbers, emails, or credit cards, e.g.:
My email is sarah.connor@skyline.io, phone +1 (555) 349-2020. Database master password is MasterSecret!2026. AWS key is sk-proj-84729104859201948291048572910485."
                  className="w-full bg-[#070A18] border border-slate-800 focus:border-sky-500/80 p-4 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-mono leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleRunSanitizer}
                  disabled={loading || !inputText.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_2px_12px_rgba(14,165,233,0.3)] disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>{loading ? "Sanitizing Stream..." : "Analyze & Sanitize Stream"}</span>
                </button>

                {latencyMs !== null && (
                  <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Inspection completed in {latencyMs}ms</span>
                  </div>
                )}
              </div>

              {/* Sanitized Output Preview */}
              {outputText && (
                <div className="mt-4 pt-5 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-350">
                      Sanitized Output (Safe for Upstream AI)
                    </label>
                    <button
                      onClick={handleCopy}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy Safe Text"}</span>
                    </button>
                  </div>

                  <div className="bg-[#070A18] border border-slate-800 p-4 rounded-xl min-h-[90px]">
                    {renderSanitizedContent(outputText)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: AI Prompt & Memory Gateway */
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-350">
                    Prompt to Upstream LLM (OpenAI / Anthropic / Local)
                  </label>
                  <span className="text-[10px] text-slate-350 font-mono">
                    Proxy Target: OpenAI gpt-4o-mini
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="Write a prompt to send to the AI model. Prompts containing strictly blocked items (like passwords or API keys) will be intercepted by MemShield before reaching the LLM."
                  className="w-full bg-[#070A18] border border-slate-800 focus:border-sky-500/80 p-4 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-mono leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleSendAIPrompt}
                  disabled={loading || !aiPrompt.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_2px_12px_rgba(14,165,233,0.3)] disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                  <span>{loading ? "Intercepting & Processing..." : "Send Prompt via MemShield Shield"}</span>
                </button>

                {aiStatus && (
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    aiStatus === "BLOCKED" 
                      ? "bg-rose-500/15 text-rose-300 border border-rose-500/30" 
                      : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  }`}>
                    {aiStatus === "BLOCKED" ? "Fail-Closed Intercepted" : "Shielded Pass-through"}
                  </span>
                )}
              </div>

              {/* AI Gateway Response Output */}
              {aiResponse && (
                <div className="mt-4 pt-5 border-t border-slate-800 space-y-2.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-350">
                    Upstream LLM & Shield Response
                  </label>

                  <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
                    aiStatus === "BLOCKED" 
                      ? "bg-rose-950/20 border-rose-500/30 text-rose-200 border-l-4 border-l-rose-500" 
                      : "bg-[#070A18] border-slate-800 text-slate-200 border-l-4 border-l-emerald-500"
                  }`}>
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Col: Pipeline Diagnostics & Detection Breakdown */}
        <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Detection Diagnostics</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-350">
                {detections.length} Entities
              </span>
            </div>

            {detections.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>No active detections in buffer.</p>
                <p className="text-[10px] text-slate-600 mt-1">Load a test scenario or enter text to see parsed entities.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {detections.map((det, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-[#070A18] border border-slate-850 rounded-xl space-y-1.5 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPolicyIcon(det.type)}
                        <span className="font-extrabold text-white text-xs">{det.type.replace(/_/g, " ")}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        det.action === "BLOCK" 
                          ? "bg-rose-500/15 text-rose-300 border border-rose-500/30" 
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      }`}>
                        {det.action}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900 font-mono">
                      <span>Conf: {Math.round(det.confidence * 100)}%</span>
                      <span>Risk: {det.sensitivity}</span>
                      <span>{det.detector_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p><strong>Fail-Closed Guarantee:</strong> Any unmapped high-risk credential triggers automatic BLOCK.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
