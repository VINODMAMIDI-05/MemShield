import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import type { ThemeMode } from '../types';

interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme
}) => {
  const [clicked, setClicked] = useState(false);

  const themeCycle: { id: ThemeMode; name: string; glowClass: string; textClass: string; iconColor: string }[] = [
    {
      id: "cyber",
      name: "Midnight Cyber",
      glowClass: "shadow-[0_0_15px_rgba(14,165,233,0.6)] bg-sky-500/15 border-sky-500/40",
      textClass: "text-sky-400",
      iconColor: "#38BDF8"
    },
    {
      id: "light",
      name: "Enterprise Daylight",
      glowClass: "shadow-[0_0_15px_rgba(245,158,11,0.6)] bg-amber-500/15 border-amber-500/40",
      textClass: "text-amber-400",
      iconColor: "#F59E0B"
    },
    {
      id: "indigo",
      name: "Deep Space Indigo",
      glowClass: "shadow-[0_0_15px_rgba(99,102,241,0.6)] bg-indigo-500/15 border-indigo-500/40",
      textClass: "text-indigo-400",
      iconColor: "#818CF8"
    },
    {
      id: "emerald",
      name: "Matrix Zero-Trust",
      glowClass: "shadow-[0_0_15px_rgba(16,185,129,0.6)] bg-emerald-500/15 border-emerald-500/40",
      textClass: "text-emerald-400",
      iconColor: "#34D399"
    }
  ];

  const currentThemeObj = themeCycle.find(t => t.id === currentTheme) || themeCycle[0];

  const handleToggle = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300);

    const currentIndex = themeCycle.findIndex(t => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % themeCycle.length;
    onSelectTheme(themeCycle[nextIndex].id);
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative group p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${currentThemeObj.glowClass} ${
        clicked ? "scale-90" : "hover:scale-105 active:scale-95"
      }`}
      title={`Theme: ${currentThemeObj.name} (Click to switch theme)`}
      aria-label="Toggle Theme"
    >
      <Lightbulb 
        className={`w-4 h-4 transition-all duration-300 ${currentThemeObj.textClass} ${
          currentTheme === "light" ? "fill-amber-400 text-amber-400" : "fill-current"
        }`} 
      />

      {/* Floating Tooltip */}
      <span className="absolute -bottom-8 right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-[10px] font-bold text-white px-2 py-0.5 rounded shadow-lg border border-slate-700 whitespace-nowrap z-50">
        {currentThemeObj.name}
      </span>
    </button>
  );
};
