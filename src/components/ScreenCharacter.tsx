import React from "react";
import Image from "next/image";
import { HeaderPlaque } from "./HeaderPlaque";
import { Check, Sparkles, Music } from "lucide-react";

export type CharacterType = "girl" | "boy" | null;

interface ScreenCharacterProps {
  selectedCharacter: CharacterType;
  onSelectCharacter: (char: CharacterType) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ScreenCharacter({
  selectedCharacter,
  selectedTopic,
  onSelectCharacter,
  onNext,
  onBack,
}: ScreenCharacterProps & { selectedTopic?: string | null }) {
  return (
    <div className="flex flex-col min-h-screen bg-amber-50 justify-between w-full relative overflow-x-hidden">
      {/* 1. Верхняя плашка (Widescreen) */}
      <HeaderPlaque
        title="АЙТЫСКЕРДІ ТАҢДАҢЫЗ:"
        showBack={true}
        onBack={onBack}
      />

      {/* 2. Основная рабочая область в формате 16:9 для десктопа */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-center">
        <div className="text-center mb-6">
          <p className="text-sm sm:text-base font-bold text-teal-800 uppercase tracking-widest inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/80 border border-teal-300">
            <Sparkles className="w-4 h-4 text-yellow-600" />
            <span>Өз айтыскер кейіпкеріңізді белгілеңіз</span>
          </p>
        </div>

        {/* Две крупные реалистичные карточки по центру */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto w-full">
          
          {/* КАРТОЧКА 1: ҚЫЗ */}
          <button
            type="button"
            onClick={() => onSelectCharacter("girl")}
            className={`relative flex flex-col items-center rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer border-4 text-left group overflow-hidden ${
              selectedCharacter === "girl"
                ? "bg-gradient-to-b from-teal-50 to-amber-100 border-teal-600 shadow-2xl ring-4 ring-yellow-400 scale-[1.02]"
                : "bg-white/90 border-amber-200 hover:border-yellow-400 hover:bg-amber-50/90 shadow-lg hover:shadow-xl hover:scale-[1.01]"
            }`}
          >
            {/* Selected Checkmark Badge */}
            {selectedCharacter === "girl" && (
              <span className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-teal-600 text-yellow-300 border-2 border-yellow-400 flex items-center justify-center shadow-lg animate-bounce">
                <Check className="w-5 h-5 stroke-[3]" />
              </span>
            )}

            {/* Реалистичный портрет девочки-айтыскера */}
            <div className="relative w-full aspect-[3/4] max-h-[340px] rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-inner mb-4">
              <Image
                src="/images/kazakh_girl.jpg"
                alt="Ақын қыз"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/90 text-yellow-300 text-xs font-bold border border-yellow-400/40">
                  <Music className="w-3.5 h-3.5" />
                  <span>Ақын қыз</span>
                </span>
              </div>
            </div>

            {/* Надпись «Қыз» и описание */}
            <div className="w-full space-y-1.5 text-center">
              <h3 className="font-black text-2xl sm:text-3xl text-teal-950 tracking-wider">
                Қыз
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">
                Сәукеле киген, домбырасы үнді, сөзге шешен ақын ару
              </p>
            </div>
          </button>

          {/* КАРТОЧКА 2: ҰЛ */}
          <button
            type="button"
            onClick={() => onSelectCharacter("boy")}
            className={`relative flex flex-col items-center rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer border-4 text-left group overflow-hidden ${
              selectedCharacter === "boy"
                ? "bg-gradient-to-b from-teal-50 to-amber-100 border-teal-600 shadow-2xl ring-4 ring-yellow-400 scale-[1.02]"
                : "bg-white/90 border-amber-200 hover:border-yellow-400 hover:bg-amber-50/90 shadow-lg hover:shadow-xl hover:scale-[1.01]"
            }`}
          >
            {/* Selected Checkmark Badge */}
            {selectedCharacter === "boy" && (
              <span className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-teal-600 text-yellow-300 border-2 border-yellow-400 flex items-center justify-center shadow-lg animate-bounce">
                <Check className="w-5 h-5 stroke-[3]" />
              </span>
            )}

            {/* Реалистичный портрет мальчика-айтыскера */}
            <div className="relative w-full aspect-[3/4] max-h-[340px] rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-inner mb-4">
              <Image
                src="/images/kazakh_boy.jpg"
                alt="Сері жігіт"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/90 text-yellow-300 text-xs font-bold border border-yellow-400/40">
                  <Music className="w-3.5 h-3.5" />
                  <span>Сері жігіт</span>
                </span>
              </div>
            </div>

            {/* Надпись «Ұл» и описание */}
            <div className="w-full space-y-1.5 text-center">
              <h3 className="font-black text-2xl sm:text-3xl text-teal-950 tracking-wider">
                Ұл
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">
                Бөрік пен шапан киген, тапқыр тілді, суырыпсалма сері джигит
              </p>
            </div>
          </button>
        </div>

        {/* Dynamic status feedback */}
        <div className="mt-6 text-center min-h-[36px] flex items-center justify-center">
          {selectedCharacter ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-600 text-yellow-300 text-sm font-bold border border-yellow-400 shadow-md">
              <Sparkles className="w-4 h-4" />
              <span>Таңдалған кейіпкер: {selectedCharacter === "girl" ? "«Қыз» бейнесі" : "«Ұл» бейнесі"}</span>
            </div>
          ) : (
            <span className="text-sm text-slate-500 italic">
              Жалғастыру үшін жоғарыдағы кейіпкерлердің бірін басыңыз
            </span>
          )}
        </div>
      </main>

      {/* 3. Кнопка внизу «КЕЛЕСІ >». Заблокирована, пока не выбран персонаж */}
      <footer className="p-4 sm:p-6 bg-gradient-to-t from-amber-100/90 to-transparent">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={onNext}
            disabled={!selectedCharacter}
            className={`w-full py-4 px-8 rounded-2xl font-black text-lg sm:text-xl tracking-wider border-2 flex items-center justify-center gap-3 transition-all duration-200 group ${
              selectedCharacter
                ? "bg-yellow-400 hover:bg-yellow-500 active:scale-[0.98] text-teal-950 border-yellow-500 shadow-xl hover:shadow-2xl cursor-pointer"
                : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60 shadow-none"
            }`}
          >
            <span>КЕЛЕСІ</span>
            <span
              className={`text-2xl transition-transform duration-200 ${
                selectedCharacter ? "group-hover:translate-x-1.5" : ""
              }`}
            >
              &gt;
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}
