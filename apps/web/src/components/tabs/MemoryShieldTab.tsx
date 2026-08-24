import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Database, 
  ShieldCheck, 
  Lock, 
  HardDrive, 
  RefreshCw 
} from 'lucide-react';
import { MOCK_MEMORY_GUARD_LOGS } from '../../data/mockData';
import type { MemoryGuardItem } from '../../types';

export const MemoryShieldTab: React.FC = () => {
  const [logs, setLogs] = useState<MemoryGuardItem[]>(MOCK_MEMORY_GUARD_LOGS);
  const [vectorStoreIsolation, setVectorStoreIsolation] = useState(true);
  const [ragEmbeddingScrub, setRagEmbeddingScrub] = useState(true);
  const [fineTuningFilter, setFineTuningFilter] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simSuccess, setSimSuccess] = useState(false);

  const handleSimulateAttack = () => {
    setSimulating(true);
    setSimSuccess(false);

    setTimeout(() => {
      const newLog: MemoryGuardItem = {
        id: `mem-${Date.now().toString(36)}`,
        timestamp: "Just now",
        entity_type: "AUTH_TOKEN",
        source_context: "Simulated Memory Injection Attack via Prompt",
        target_ai_memory: "Long-Term Vector Memory (Pinecone)",
        status: "POISON_PREVENTED",
        risk: "CRITICAL"
      };
      setLogs([newLog, ...logs]);
      setSimulating(false);
      setSimSuccess(true);
    }, 900);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Core AI Memory Protection Mission */}
      <div className="bg-gradient-to-r from-[#0C122C] via-[#0F1738] to-[#0A0D24] border border-indigo-500/30 p-6 sm:p-7 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Memory & Vector Context Security Layer</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              Preventing Sensitive Secrets from Persisting in <br />
              <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-purple-300 bg-clip-text text-transparent">
                AI Memory, Vector Stores & Fine-Tuning Caches
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-350 mt-2.5 leading-relaxed">
              When users interact with AI assistants, sensitive variables, credentials, and PII can accidentally get embedded into long-term vector databases (RAG), user memory profiles, or training corpora. MemShield inspects and sanitizes all ingestion streams before vectorization.
            </p>
          </div>

          {/* Quick Action: Simulate Memory Poisoning Attack */}
          <div className="bg-[#070A1A]/90 border border-slate-800 p-5 rounded-xl sm:min-w-[280px] shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">Security Testbench</span>
              <h4 className="text-xs font-bold text-white mt-1">Memory Poisoning Defense</h4>
              <p className="text-[11px] text-slate-350 mt-1 leading-snug">
                Simulate an adversary attempting to store master tokens into permanent AI vector memory.
              </p>
            </div>

            <button
              onClick={handleSimulateAttack}
              disabled={simulating}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_2px_10px_rgba(99,102,241,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {simulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{simulating ? "Evaluating Defense..." : "Test Memory Shield"}</span>
            </button>

            {simSuccess && (
              <span className="mt-2 text-[10px] text-emerald-400 font-bold text-center block">
                ✓ Attack successfully intercepted & blocked!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3 Core AI Memory Shield Layers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Layer 1: Long-term Vector Memory */}
        <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Long-Term Vector Memory</h3>
            <p className="text-xs text-slate-350 mt-2 leading-relaxed">
              Stops credentials, passwords, and private PII from being converted into vector embeddings inside Pinecone, Weaviate, or Chroma.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Embedding Isolation</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={vectorStoreIsolation} 
                onChange={e => setVectorStoreIsolation(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Layer 2: RAG Context & Dynamic Cache */}
        <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">RAG Context & Session Caches</h3>
            <p className="text-xs text-slate-350 mt-2 leading-relaxed">
              Sanitizes dynamic retrieval-augmented generation (RAG) prompts before chunks are assembled and passed into LLM attention windows.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Dynamic Scrubbing</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={ragEmbeddingScrub} 
                onChange={e => setRagEmbeddingScrub(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>
        </div>

        {/* Layer 3: Model Fine-Tuning & Training Data */}
        <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Telemetry & Fine-Tuning Guard</h3>
            <p className="text-xs text-slate-350 mt-2 leading-relaxed">
              Guarantees that telemetry, chat histories, or exported logs used to fine-tune future weights are 100% de-identified.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Fine-Tuning Filter</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={fineTuningFilter} 
                onChange={e => setFineTuningFilter(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

      </div>

      {/* Memory Protection Incident Log */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>AI Memory Interception Log</span>
            </h3>
            <p className="text-xs text-slate-350 mt-0.5">Real-time log of sensitive data intercepted before entering vector stores or AI memory.</p>
          </div>

          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-bold">
            {logs.length} Interceptions Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#070A18] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Sensitive Entity</th>
                <th className="px-5 py-3.5">Source Context</th>
                <th className="px-5 py-3.5">Target AI Store</th>
                <th className="px-5 py-3.5">Protection Action</th>
                <th className="px-5 py-3.5 text-right">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-[#0E132A] transition-colors">
                  <td className="px-5 py-4 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                      {log.entity_type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-300 font-medium">{log.source_context}</td>
                  <td className="px-5 py-4 text-indigo-300 font-mono text-[11px]">{log.target_ai_memory}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      log.status === "POISON_PREVENTED"
                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                        : log.status === "EMBEDDING_BLOCKED"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                    }`}>
                      {log.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className={`font-mono font-bold text-[10px] ${
                      log.risk === "CRITICAL" ? "text-rose-400" : log.risk === "HIGH" ? "text-amber-400" : "text-sky-400"
                    }`}>
                      {log.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
