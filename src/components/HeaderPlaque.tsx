import React from "react";
import { KazakhOrnamentHeader } from "./KazakhOrnament";
import { ChevronLeft } from "lucide-react";

interface HeaderPlaqueProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function HeaderPlaque({ title, onBack, showBack = false }: HeaderPlaqueProps) {
  return (
    <header className="relative w-full z-10">
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700 border-b-4 border-yellow-400 shadow-xl px-6 py-4 rounded-b-3xl flex items-center justify-between relative overflow-hidden max-w-7xl mx-auto">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-radial-gradient from-teal-400/20 to-transparent pointer-events-none" />

        {/* Back button on the left */}
        <div className="w-12 flex items-center justify-start z-10">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-teal-800/80 hover:bg-teal-900 text-yellow-300 hover:text-white transition-all active:scale-95 border border-yellow-400/40 shadow-md cursor-pointer flex items-center gap-1 group"
              aria-label="Артқа қайту"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Center Title and Kazakh ornament */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
          <div className="text-yellow-400 mb-1">
            <KazakhOrnamentHeader className="max-w-[260px] h-5" />
          </div>
          <h1 className="font-extrabold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white tracking-wider uppercase drop-shadow-md">
            {title}
          </h1>
          <div className="w-24 h-1.5 bg-yellow-400 rounded-full mt-2 shadow-xs" />
        </div>

        {/* Right side balance spacer */}
        <div className="w-12 z-10 flex justify-end">
          <span className="text-yellow-400 text-lg font-serif">✦</span>
        </div>
      </div>
    </header>
  );
}
