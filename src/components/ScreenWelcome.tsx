import React from "react";
import Image from "next/image";
import { HeaderPlaque } from "./HeaderPlaque";
import { Sparkles, Music, BookOpen, Feather } from "lucide-react";

interface ScreenWelcomeProps {
  onStart: () => void;
}

export function ScreenWelcome({ onStart }: ScreenWelcomeProps) {
  return (
    <div className="flex flex-col min-h-screen bg-amber-50 justify-between w-full relative overflow-x-hidden">
      {/* 1. Верхняя плашка (16:9 widescreen) */}
      <HeaderPlaque title="ВИРТУАЛДЫ АЙТЫСКЕРГЕ ҚОШ КЕЛДІҢІЗ!" />

      {/* 2. Основная рабочая область в формате 16:9 для десктопа */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Левая колонка: Реалистичное кинематографическое изображение (16:9) юрты и двух айтыскеров */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl group transition-transform duration-300 hover:scale-[1.01]">
              <Image
                src="/images/welcome_yurt_aitys.jpg"
                alt="Киіз үй және ұлттық киімдегі қос айтыскер"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              {/* Мягкий градиентный оверлей снизу */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Информационный бейдж поверх изображения */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-900/90 backdrop-blur-md text-yellow-300 text-xs sm:text-sm font-bold border border-yellow-400/50 shadow-lg">
                  <Music className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span>Киіз үй және ұлттық киімдегі қос айтыскер</span>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-yellow-400/90 text-teal-950 font-black text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>16:9 HD</span>
                </span>
              </div>
            </div>
          </div>

          {/* Правая колонка: Описание, культурные акценты и кнопка «БАСТАУ >» */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Карточка приветствия */}
            <div className="bg-white/90 backdrop-blur-md border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-300">
                <Feather className="w-4 h-4 text-teal-700" />
                <span>Қазақ халқының төл сөз өнері</span>
              </div>

              {/* Основной текст по ТЗ */}
              <h2 className="text-xl sm:text-2xl font-black text-teal-950 leading-snug">
                Айтыс өнерінің сиқырлы әлеміне қадам басыңыз!
              </h2>

              <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                Өз дарыныңызды шыңдап, ата-бабамыздың сөз өнерін меңгеріңіз.
              </p>

              {/* Преимущества / особенности платформы */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-semibold text-teal-900">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/90 border border-amber-200">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-yellow-300 flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <span>Домбыра сазы мен ұлттық нақыш</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/90 border border-amber-200">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400 text-teal-950 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span>Буын мен ұйқасты автоматты бағалау</span>
                </div>
              </div>

              {/* Культурная цитата */}
              <div className="pt-2 text-center text-xs text-teal-800/70 font-medium italic border-t border-amber-100">
                «Сөз қадірін білген – сөз ұстасы»
              </div>
            </div>

            {/* Кнопка «БАСТАУ >» */}
            <div>
              <button
                type="button"
                onClick={onStart}
                className="w-full py-4 sm:py-5 px-8 rounded-2xl bg-yellow-400 hover:bg-yellow-500 active:scale-[0.98] text-teal-950 font-black text-lg sm:text-xl tracking-wider shadow-xl hover:shadow-2xl transition-all duration-200 border-2 border-yellow-500 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span>БАСТАУ</span>
                <span className="text-2xl group-hover:translate-x-1.5 transition-transform duration-200">&gt;</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Нижний колонтитул */}
      <footer className="py-3 text-center text-xs text-slate-500 bg-amber-100/60 border-t border-amber-200/50">
        Digital Aitys © 2026 — Қазақстанның цифрлық мәдени мұрасы
      </footer>
    </div>
  );
}
