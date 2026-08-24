import React, { useState } from 'react';
import { 
  History, 
  Eye, 
  Download, 
  Plus, 
  FileText, 
  BrainCircuit, 
  ArrowLeft, 
  RefreshCw 
} from 'lucide-react';
import type { Session } from '../../types';
import { api } from '../../services/api';

interface SessionsTabProps {
  token: string | null;
  sessions: Session[];
  onCreateSession: () => void;
  onRefreshSessions?: () => void;
}

export const SessionsTab: React.FC<SessionsTabProps> = ({
  token,
  sessions,
  onCreateSession
}) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = async (sessionId: string) => {
    setDownloading(true);
    setDownloadSuccess(false);
    try {
      await api.downloadSessionPDF(token, sessionId);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      // ignore
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {selectedSession ? (
        /* SESSION DRILLDOWN INSPECTION VIEW */
        <div className="space-y-6">
          
          {/* Header Bar */}
          <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1.5 uppercase tracking-wider mb-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Session Vault</span>
              </button>

              <div className="flex items-center gap-3">
                <h2 className="text-base sm:text-lg font-black text-white font-mono">
                  Channel Audit: {selectedSession.id}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                  selectedSession.status === "ACTIVE" 
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse" 
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}>
                  {selectedSession.status}
                </span>
              </div>

              <p className="text-xs text-slate-350 mt-1">
                Started: {new Date(selectedSession.started_at).toLocaleString()} • Target: {selectedSession.ai_model || "gpt-4o-mini"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownloadPDF(selectedSession.id)}
                disabled={downloading}
                className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_2px_12px_rgba(14,165,233,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {downloading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{downloadSuccess ? "Report Downloaded!" : "Download PDF Forensic Report"}</span>
              </button>
            </div>
          </div>

          {/* 3 Metric Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#0B0F22]/90 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-350 uppercase">Total Detections</span>
              <p className="text-xl font-black text-white mt-1">{selectedSession.total_detected}</p>
            </div>
            <div className="bg-[#0B0F22]/90 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-350 uppercase">Entities Redacted</span>
              <p className="text-xl font-black text-amber-400 mt-1">{selectedSession.total_masked}</p>
            </div>
            <div className="bg-[#0B0F22]/90 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-350 uppercase">Credentials Blocked</span>
              <p className="text-xl font-black text-rose-400 mt-1">{selectedSession.total_blocked}</p>
            </div>
          </div>

          {/* Transcript & AI Logs Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Sanitized Ingestion Stream</span>
              </h3>
              <div className="bg-[#070A18] border border-slate-800 p-4 rounded-xl text-xs font-mono text-slate-300 leading-relaxed min-h-[140px] whitespace-pre-wrap">
                User requested customer sync for account: [EMAIL REDACTED] with security pin: [PASSWORD BLOCKED]. All other database keys were verified through local MemShield proxy.
              </div>
            </div>

            <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span>AI Gateway Upstream Exchange</span>
              </h3>
              <div className="bg-[#070A18] border border-slate-800 p-4 rounded-xl text-xs font-mono text-slate-300 leading-relaxed min-h-[140px] border-l-4 border-l-sky-500">
                [MemShield Guard]: Intercepted 1 plain password and sanitized 1 email. Upstream model returned confirmation without memory poisoning.
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* SESSIONS VAULT TABLE */
        <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          
          {/* Vault Top Bar */}
          <div className="p-6 border-b border-slate-800 bg-[#070A18] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                <History className="w-4 h-4 text-sky-400" />
                <span>Protected Channel Vault</span>
              </h3>
              <p className="text-xs text-slate-350 mt-0.5">
                Complete history of secured communication channels and AI interaction contexts.
              </p>
            </div>

            <button
              onClick={onCreateSession}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_2px_10px_rgba(14,165,233,0.3)] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Spawn New Session</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#070A18] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                  <th className="px-6 py-4 font-mono">Channel ID</th>
                  <th className="px-6 py-4">Ingestion Source</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Started At</th>
                  <th className="px-6 py-4 text-center">Detections</th>
                  <th className="px-6 py-4 text-center">Redacted / Blocked</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {sessions.map(s => (
                  <tr key={s.id} className="hover:bg-[#0E132A] transition-colors">
                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-white">
                      {s.id.substring(0, 16)}...
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-slate-300">
                      {s.source.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        s.status === "ACTIVE" 
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" 
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                      {new Date(s.started_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-white font-mono">
                      {s.total_detected}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold">
                      <span className="text-amber-400">{s.total_masked}</span> / <span className="text-rose-400">{s.total_blocked}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedSession(s)}
                        className="px-3 py-1.5 bg-[#0F1426] hover:bg-[#161D36] border border-slate-700 hover:border-sky-500/40 rounded-lg text-slate-300 hover:text-white transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>Inspect Vault</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
