import React, { useState } from 'react';
import { 
  Cpu, 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Zap, 
  Globe
} from 'lucide-react';

export const IntegrationsTab: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const pythonSnippet = `# Drop-in OpenAI SDK integration with MemShield Security Layer
from openai import OpenAI

# Simply route base_url through MemShield Privacy Middleware
client = OpenAI(
    base_url="http://localhost:8000/api/v1",
    api_key="your-openai-api-key",  # Handled securely via MemShield
    default_headers={"X-MemShield-Session": "sess-prod-9021"}
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "Analyze customer database with private credentials..."}
    ]
)
# MemShield automatically sanitizes PII and blocks raw secrets!
print(response.choices[0].message.content)`;

  const tsSnippet = `// TypeScript / Node.js LangChain or OpenAI Client
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:8000/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'X-MemShield-Policy': 'STRICT_SOC2'
  }
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Debug database password...' }],
});`;

  const curlSnippet = `# Direct REST API Sanitization Endpoint
curl -X POST "http://localhost:8000/api/v1/protection/sanitize" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -d '{
    "session_id": "sess-prod-9021",
    "content": "My private email is alice@corp.com and key is sk-12345.",
    "source": "api_gateway"
  }'`;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              AI Gateway & SDK Integrations
            </h3>
            <p className="text-xs text-slate-350">
              Integrate MemShield transparently as an upstream proxy in 2 lines of code.
            </p>
          </div>
        </div>
      </div>

      {/* Code Snippets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Python SDK */}
        <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#070A18] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Python OpenAI SDK Drop-in</span>
            </div>
            <button
              onClick={() => handleCopy(pythonSnippet, "py")}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md transition-all cursor-pointer"
            >
              {copiedSection === "py" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === "py" ? "Copied" : "Copy Code"}</span>
            </button>
          </div>
          <div className="p-4 font-mono text-xs text-sky-200 bg-[#070A18] overflow-x-auto">
            <pre>{pythonSnippet}</pre>
          </div>
        </div>

        {/* TypeScript / JS */}
        <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#070A18] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">TypeScript / Node.js</span>
            </div>
            <button
              onClick={() => handleCopy(tsSnippet, "ts")}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md transition-all cursor-pointer"
            >
              {copiedSection === "ts" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === "ts" ? "Copied" : "Copy Code"}</span>
            </button>
          </div>
          <div className="p-4 font-mono text-xs text-emerald-200 bg-[#070A18] overflow-x-auto">
            <pre>{tsSnippet}</pre>
          </div>
        </div>

      </div>

      {/* REST API Reference */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Direct HTTP / REST Ingestion Endpoint</span>
            </h4>
            <p className="text-xs text-slate-350 mt-0.5">Use raw HTTP POST requests to sanitize any payload stream.</p>
          </div>
          <button
            onClick={() => handleCopy(curlSnippet, "curl")}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md transition-all cursor-pointer"
          >
            {copiedSection === "curl" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === "curl" ? "Copied cURL" : "Copy cURL"}</span>
          </button>
        </div>

        <div className="p-4 font-mono text-xs text-amber-200 bg-[#070A18] rounded-xl overflow-x-auto border border-slate-850">
          <pre>{curlSnippet}</pre>
        </div>
      </div>

      {/* Future Roadmap Client Connectors */}
      <div className="bg-[#0B0F22]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="mb-5 pb-3 border-b border-slate-800">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Optional Future Client Connectors (Roadmap)</span>
          </h4>
          <p className="text-xs text-slate-350 mt-0.5">
            Client-side hooks that route traffic through the MemShield backend security engine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Browser Extension", type: "Web Copilot Hook", status: "In Development", desc: "Monitors ChatGPT & Claude web apps in Chrome/Edge." },
            { name: "Microsoft Teams Bot", type: "Collab Guard", status: "Planned", desc: "Sanitizes internal transcripts before AI summary." },
            { name: "Zoom AI Companion", type: "Audio Stream Gate", status: "Planned", desc: "De-identifies meeting audio transcripts in real time." },
            { name: "Google Meet Add-on", type: "Workspace Guard", status: "Planned", desc: "Enterprise PHI/PII shield for Gemini Workspace." },
          ].map((conn, idx) => (
            <div key={idx} className="p-4 bg-[#070A18] border border-slate-850 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-400 font-bold">{conn.type}</span>
                <span className="text-[9px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 font-semibold">{conn.status}</span>
              </div>
              <h5 className="text-xs font-bold text-white">{conn.name}</h5>
              <p className="text-[11px] text-slate-350 leading-snug">{conn.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
