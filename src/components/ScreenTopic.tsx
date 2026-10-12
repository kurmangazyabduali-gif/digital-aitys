import React from "react";
import { HeaderPlaque } from "./HeaderPlaque";
import {
  Flag,
  GraduationCap,
  Hammer,
  Rocket,
  Bot,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export interface TopicItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge: string;
}

export const TOPICS: TopicItem[] = [
  {
    id: "otan",
    label: "Отан",
    icon: Flag,
    description: "Туған жер, елге сүйіспеншілік пен бірлік тақырыбы",
    badge: "Ел мен жер",
  },
  {
    id: "bilim",
    label: "Білім",
    icon: GraduationCap,
    description: "Ғылым, өнер, ұстаз мәртебесі және кітап оқу",
    badge: "Өнер-білім",
  },
  {
    id: "enbek",
    label: "Еңбек",
    icon: Hammer,
    description: "Адал еңбек, кәсіп пен адал маңдай тердің қадірі",
    badge: "Адал кәсіп",
  },
  {
    id: "bolashaq",
    label: "Болашақ",
    icon: Rocket,
    description: "Жаңа заман, арман-мақсат, жастар және өркениет",
    badge: "Ертеңгі күн",
  },
  {
    id: "ai",
    label: "Жасанды интеллект",
    icon: Bot,
    description: "Технологиялар, цифрлық дәуір мен ғылыми жаңалықтар",
    badge: "Цифрлық дәуір",
  },
];

interface ScreenTopicProps {
  selectedTopic: string | null;
  onSelectTopic: (topicId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ScreenTopic({
  selectedTopic,
  onSelectTopic,
  onNext,
  onBack,
}: ScreenTopicProps) {
  return (
    <div className="flex flex-col min-h-screen bg-amber-50 justify-between w-full relative overflow-x-hidden">
      {/* 1. Верхняя плашка (Widescreen) */}
      <HeaderPlaque
        title="АЙТЫСТЫҢ ТАҚЫРЫБЫН ТАҢДАҢЫЗ:"
        showBack={true}
        onBack={onBack}
      />

      {/* 2. Основная рабочая область в формате 16:9 для десктопа */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-center">
        <div className="text-center mb-6">
          <p className="text-sm sm:text-base font-bold text-teal-800 uppercase tracking-widest inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/80 border border-teal-300">
            <Sparkles className="w-4 h-4 text-yellow-600" />
            <span>Сөз сайысының басты тақырыбын белгілеңіз</span>
          </p>
        </div>

        {/* Сетка из 5 кнопок с иконками Lucide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto w-full">
          {TOPICS.map((topic) => {
            const Icon = topic.icon;
            const isSelected = selectedTopic === topic.id;

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelectTopic(topic.id)}
                className={`flex flex-col justify-between p-5 sm:p-6 rounded-3xl border-3 transition-all duration-200 text-left group cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 border-yellow-400 text-white shadow-2xl ring-4 ring-yellow-400/60 scale-[1.03]"
                    : "bg-white/90 hover:bg-amber-100/80 border-amber-200 hover:border-yellow-400 text-slate-800 shadow-md hover:shadow-xl hover:scale-[1.01]"
                }`}
              >
                {/* Верхняя строка карточки: Иконка и индикатор */}
                <div className="flex items-center justify-between w-full mb-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-yellow-400 text-teal-950 shadow-lg"
                        : "bg-teal-50 text-teal-700 group-hover:bg-yellow-100 group-hover:text-yellow-800 border border-teal-200"
                    }`}
                  >
                    <Icon className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      isSelected
                        ? "bg-teal-900/80 text-yellow-300 border border-yellow-400/40"
                        : "bg-slate-100 text-slate-500 group-hover:bg-amber-200/80 group-hover:text-amber-900"
                    }`}
                  >
                    {topic.badge}
                  </span>
                </div>

                {/* Название и описание темы */}
                <div className="space-y-1.5 my-2">
                  <h3
                    className={`font-black text-xl sm:text-2xl tracking-wide ${
                      isSelected ? "text-yellow-300" : "text-teal-950"
                    }`}
                  >
                    {topic.label}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isSelected ? "text-teal-100" : "text-slate-600"
                    }`}
                  >
                    {topic.description}
                  </p>
                </div>

                {/* Нижняя строчка: статус выбора */}
                <div className="pt-3 mt-2 border-t border-black/5 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? "text-yellow-200" : "text-slate-400"}>
                    {isSelected ? "Таңдалды" : "Таңдау үшін басыңыз"}
                  </span>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-yellow-300 fill-teal-900" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* 3. Кнопка внизу «ЖАЛҒАСТЫРУ >» */}
      <footer className="p-4 sm:p-6 bg-gradient-to-t from-amber-100/90 to-transparent">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={onNext}
            disabled={!selectedTopic}
            className={`w-full py-4 px-8 rounded-2xl font-black text-lg sm:text-xl tracking-wider border-2 flex items-center justify-center gap-3 transition-all duration-200 group ${
              selectedTopic
                ? "bg-yellow-400 hover:bg-yellow-500 active:scale-[0.98] text-teal-950 border-yellow-500 shadow-xl hover:shadow-2xl cursor-pointer"
                : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60 shadow-none"
            }`}
          >
            <span>ЖАЛҒАСТЫРУ</span>
            <span
              className={`text-2xl transition-transform duration-200 ${
                selectedTopic ? "group-hover:translate-x-1.5" : ""
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
