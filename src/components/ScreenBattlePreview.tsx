import React from "react";
import { HeaderPlaque } from "./HeaderPlaque";
import { TOPICS } from "./ScreenTopic";
import { Swords, RotateCcw, Bot, Sparkles } from "lucide-react";

interface ScreenBattlePreviewProps {
  selectedCharacter: "girl" | "boy" | null;
  selectedTopic: string | null;
  onRestart: () => void;
  onBack: () => void;
}

export function ScreenBattlePreview({
  selectedCharacter,
  selectedTopic,
  onRestart,
  onBack,
}: ScreenBattlePreviewProps) {
  const topicObj = TOPICS.find((t) => t.id === selectedTopic);
  const TopicIcon = topicObj?.icon || Sparkles;

  return (
    <div className="flex flex-col min-h-screen bg-amber-50 justify-between max-w-md mx-auto shadow-2xl relative overflow-hidden border-x border-amber-200/60">
      {/* Верхняя плашка */}
      <HeaderPlaque
        title="ЧАТ-БАТТЛ АЛАҢЫ"
        showBack={true}
        onBack={onBack}
      />

      <main className="flex-1 flex flex-col justify-center px-5 py-6 space-y-6 text-center">
        {/* Battle matchup card */}
        <div className="bg-white/90 border-2 border-yellow-400 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600 text-yellow-300 text-xs font-bold mb-4 shadow-sm">
            <Swords className="w-3.5 h-3.5" />
            <span>АЙТЫСҚА ДАЙЫНДЫҚ</span>
          </div>

          {/* Matchup row */}
          <div className="flex items-center justify-around gap-2 my-2">
            {/* Player */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 border-2 border-teal-600 flex items-center justify-center font-black text-2xl text-teal-800 shadow-md">
                {selectedCharacter === "girl" ? "👧" : "👦"}
              </div>
              <span className="mt-2 text-xs font-bold text-teal-900">
                {selectedCharacter === "girl" ? "Қыз ақын" : "Ұл ақын"}
              </span>
              <span className="text-[10px] text-teal-600 font-medium">Сіздің кейіпкер</span>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-teal-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-white">
                VS
              </span>
            </div>

            {/* AI Opponent */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-yellow-500 flex items-center justify-center font-black text-2xl text-amber-800 shadow-md">
                <Bot className="w-8 h-8 text-teal-700" />
              </div>
              <span className="mt-2 text-xs font-bold text-teal-900">
                AI Айтыскер
              </span>
              <span className="text-[10px] text-amber-700 font-medium">Виртуалды қарсылас</span>
            </div>
          </div>

          {/* Topic Badge */}
          {topicObj && (
            <div className="mt-5 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center gap-2">
              <TopicIcon className="w-5 h-5 text-teal-700" />
              <div className="text-left">
                <span className="text-[10px] block uppercase font-bold text-slate-400">Таңдалған тақырып</span>
                <span className="text-sm font-black text-teal-900">{topicObj.label}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status message */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs sm:text-sm text-teal-900 leading-relaxed shadow-sm">
          <p className="font-semibold text-teal-950 mb-1">
            🎉 Экран 1, 2 және 3 сәтті аяқталды!
          </p>
          <p className="text-slate-600">
            «Digital Aitys» бастапқы навигациясы мен UI/UX базасы толық дайын. Чат-баттл диалогы мен жасанды интеллект өлең сайысы келесі кезеңде (Промпт №2) іске қосылады.
          </p>
        </div>
      </main>

      {/* Restart Button */}
      <footer className="p-5 pb-8 bg-gradient-to-t from-amber-100/80 to-transparent">
        <button
          type="button"
          onClick={onRestart}
          className="w-full py-4 px-6 rounded-2xl bg-yellow-400 hover:bg-yellow-500 active:scale-[0.98] text-teal-950 font-black text-base tracking-wider border-2 border-yellow-500 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>ҚАЙТА БАСТАУ</span>
        </button>
      </footer>
    </div>
  );
}
