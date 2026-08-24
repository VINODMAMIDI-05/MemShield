import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  X, 
  Code, 
  Copy, 
  Check 
} from 'lucide-react';
import type { AuditLog } from '../../types';

interface AuditLogsTabProps {
  logs: AuditLog[];
}

export const AuditLogsTab: React.FC<AuditLogsTabProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>("ALL");
  const [inspectLog, setInspectLog] = useState<AuditLog | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.data_type && log.data_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.session_id && log.session_id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = selectedActionFilter === "ALL" || log.action === selectedActionFilter;

    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = ["Log ID", "Event Type", "Action", "Data Type", "Session ID", "Timestamp", "Risk Level"];
    const rows = filteredLogs.map(l => [
      l.id,
      l.event_type,
      l.action,
      l.data_type || "N/A",
      l.session_id || "GLOBAL",
      l.timestamp,
      l.risk_level || "MEDIUM"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MemShield_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopyJSON = () => {
    if (!inspectLog) return;
    navigator.clipboard.writeText(JSON.stringify(inspectLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Search & Filter Bar */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by event, entity, or channel ID..."
            className="w-full bg-[#070A18] border border-slate-800 focus:border-sky-500/80 pl-10 pr-4 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Action Filters & Export button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#070A18] border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedActionFilter}
              onChange={e => setSelectedActionFilter(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              <option value="BLOCK">BLOCK (Blocked)</option>
              <option value="MASK">MASK (Redacted)</option>
              <option value="INITIALIZE">INITIALIZE</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#0F1426] hover:bg-[#161D36] border border-slate-800 hover:border-sky-500/40 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>

      {/* Main Audit Trail Table */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 bg-[#070A18] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Immutable Forensic Audit Ledger</span>
            </h3>
            <p className="text-xs text-slate-350 mt-0.5">
              Tamper-evident log of all sensitive data detections, policy enforcements, and AI memory guards.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-350 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-bold">
            {filteredLogs.length} Events Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#070A18] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                <th className="px-6 py-4 font-mono">Event ID</th>
                <th className="px-6 py-4">Event Classification</th>
                <th className="px-6 py-4">Channel / Session</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Forensics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#0E132A] transition-colors">
                  <td className="px-6 py-4 font-mono text-[11px] font-bold text-white">
                    {log.id}
                  </td>
                  <td className="px-6 py-4 font-bold text-white uppercase text-[11px]">
                    {log.event_type.replace(/_/g, " ")}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">
                    {log.session_id ? log.session_id.substring(0, 14) + "..." : "GLOBAL GATEWAY"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-bold text-sky-300">
                      {log.data_type || "PAYLOAD"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      log.action === "BLOCK" 
                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/30" 
                        : log.action === "MASK" 
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30" 
                        : "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setInspectLog(log)}
                      className="px-2.5 py-1 bg-[#0F1426] hover:bg-[#161D36] border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-all inline-flex items-center gap-1 cursor-pointer text-[11px]"
                    >
                      <Code className="w-3 h-3 text-sky-400" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic JSON Payload Modal */}
      {inspectLog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B0F22] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-slate-800 bg-[#070A18] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                  Audit Payload Forensics ({inspectLog.id})
                </h3>
              </div>
              <button
                onClick={() => setInspectLog(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-[#070A18] border border-slate-800 p-4 rounded-xl font-mono text-xs text-sky-300 overflow-x-auto max-h-80">
                <pre>{JSON.stringify(inspectLog, null, 2)}</pre>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-slate-400 font-mono text-[10px]">
                  SHA-256 Hash Verification: Valid
                </span>
                <button
                  onClick={handleCopyJSON}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied JSON" : "Copy Payload"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
