import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { TOPICS } from "./ScreenTopic";
import { CharacterType } from "./ScreenCharacter";
import {
  Send,
  ChevronLeft,
  Bot,
  Sparkles,
  Music,
  RotateCcw,
  BookOpen,
  Award,
  Mic2,
  Volume2,
} from "lucide-react";

import { analyzeMeter, detectRhymeScheme } from "@/lib/aitysNlp";

interface Message {
  id: string;
  sender: "host" | "ai" | "user";
  text: string;
  timestamp: string;
  analysis?: {
    syllables: number[];
    meter: string;
    rhyme: string;
  };
}

interface ScreenBattleProps {
  selectedCharacter: CharacterType;
  selectedTopic: string | null;
  onBack: () => void;
  onRestart: () => void;
}

// Ресми жүргізушінің (Адина) сөзі
const HOST_ANNOUNCEMENT = `Армысыздар, құрметті көрермендер! «Өнерлі өрендер айтысы» айдарына қош келдіңіздер! Бүгінгі сөз жарысымыз «Ұстазы жақсының ұстанымы жақсы» тақырыбына арналады. Сахна төрінде – ардақты ұстаздарын жырға қосып, өнер көрсететін өрендеріміз Санжар мен Раяна! Қос жүйрікке сәттілік тілеп, бірге тамашалайық!`;

// 1-е сообщение-приветствие от ИИ (Санжар)
const INITIAL_AI_GREETING = `Армысың, досым Раяна,
Өнерің тасып өрлеген.
Ұстаздың еңбек, асылын
Жырлайық бүгін өлеңмен.`;

// 2-й стих-ответ от ИИ через 1.5 сек
const SECOND_AI_RESPONSE = `Ұстаз бізге білім беріп,
Жақсылыққа баулиды.
Тәрбиесін санаға құйсаң,
Болашағың жарқырайды!`;

// Дополнительные стихи для диалога
const EXTRA_AI_RESPONSES = [
  `Сөзің маржан, ойың кең,
Айтыс десе жалындар.
Білім менен тәрбиені
Қатар ұста, ғалым бол!`,
  `Өнеріңе риза болдым,
Тұлпардайын жүйріксің.
Сөз сайыста тайсалмай,
Биік шыңға самға, дос!`,
  `Ата дәстүр салтымыз,
Жырдан моншақ тағамыз.
Айтыс десе қуанып,
Шаттық күйге батамыз!`,
];

export function ScreenBattle({
  selectedCharacter,
  selectedTopic,
  onBack,
  onRestart,
}: ScreenBattleProps) {
  const topicObj = TOPICS.find((t) => t.id === selectedTopic);
  const currentTopicName = topicObj ? topicObj.label : "Білім";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "host-intro",
      sender: "host",
      text: HOST_ANNOUNCEMENT,
      timestamp: "Ресми ашылу",
    },
    {
      id: "ai-initial",
      sender: "ai",
      text: INITIAL_AI_GREETING,
      timestamp: "Қазір",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiResponseCount, setAiResponseCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) return;

    const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);
    const meterRes = analyzeMeter(lines);
    const rhymeRes = detectRhymeScheme(lines);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      analysis:
        lines.length > 1
          ? {
              syllables: meterRes.counts,
              meter: meterRes.meter,
              rhyme: rhymeRes.scheme,
            }
          : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = SECOND_AI_RESPONSE;
      if (aiResponseCount > 0) {
        const extraIndex = (aiResponseCount - 1) % EXTRA_AI_RESPONSES.length;
        replyText = EXTRA_AI_RESPONSES[extraIndex];
      }

      const aiReply: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
      setAiResponseCount((prev) => prev + 1);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const userPhoto =
    selectedCharacter === "boy" ? "/images/kazakh_boy.jpg" : "/images/kazakh_girl.jpg";
  const userLabel = selectedCharacter === "boy" ? "Ұл (Сері жігіт)" : "Қыз (Ақын қыз)";

  return (
    <div className="flex flex-col h-screen w-full bg-amber-50 relative overflow-hidden">
      {/* 1. ВЕРХНЯЯ ПАНЕЛЬ (Widescreen 16:9) */}
      <header className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b-4 border-yellow-400 shadow-xl px-4 sm:px-8 py-3 text-white z-20 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-teal-900/80 hover:bg-teal-950 text-yellow-300 transition-all border border-yellow-400/40 cursor-pointer"
              aria-label="Артқа қайту"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400 shadow-md">
                <Image
                  src="/images/ai_opponent.jpg"
                  alt="AI Айтыскер"
                  fill
                  sizes="40px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                    AI Айтыскер (Санжар)
                  </h1>
                  <span className="text-[10px] font-bold bg-yellow-400 text-teal-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Виртуалды Ақын
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-yellow-200">
                  <span>Тақырып:</span>
                  <span className="font-bold underline decoration-yellow-400">
                    «{currentTopicName}»
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Центральный бейдж Жүргізуші */}
          <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-teal-900/80 border border-yellow-400/50 shadow-inner">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-yellow-400">
              <Image
                src="/images/host_adina.jpg"
                alt="Адина"
                fill
                sizes="28px"
                className="object-cover object-top"
              />
            </div>
            <div className="text-left text-xs">
              <span className="block text-[10px] text-yellow-300 font-bold uppercase tracking-wider flex items-center gap-1">
                <Mic2 className="w-3 h-3 text-yellow-400" />
                Жүргізуші
              </span>
              <span className="font-black text-white">Адина</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onRestart}
              className="p-2 px-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-yellow-300 transition-all border border-yellow-400/40 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Қайта бастау</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. ОСНОВНАЯ ОБЛАСТЬ (3-колоночная 16:9 Арена с Жүргізуші, Игроком и Оппонентом) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* ЛЕВАЯ КОЛОНКА: Профиль вашего персонажа */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col justify-between bg-white/90 backdrop-blur-md rounded-3xl p-5 border-2 border-amber-200 shadow-xl overflow-hidden">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-300">
              <Award className="w-3.5 h-3.5 text-teal-700" />
              <span>Сіздің кейіпкер</span>
            </div>

            {/* Реалистичный портрет */}
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-md">
              <Image
                src={userPhoto}
                alt={userLabel}
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center">
                <span className="block text-sm font-black text-yellow-300 drop-shadow-sm">
                  {userLabel}
                </span>
                <span className="text-[11px] text-white/90 font-medium">Раяна (Бас ақын)</span>
              </div>
            </div>

            {/* Поэтический статус */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-teal-950">
                <span>Өнер түрі:</span>
                <span className="text-teal-700 font-bold">Суырыпсалма айтыс</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-teal-950">
                <span>Аспап:</span>
                <span className="text-teal-700 font-bold">Қазақ домбырасы 🪕</span>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500 italic pt-2 border-t border-amber-100">
            «Сөз тапқанға қолқа жоқ»
          </div>
        </aside>

        {/* ЦЕНТРАЛЬНАЯ КОЛОНКА: Окно Чат-баттла */}
        <main className="lg:col-span-6 flex flex-col bg-white/95 rounded-3xl border-2 border-yellow-400 shadow-2xl overflow-hidden">
          
          {/* Верхняя строка чата: Тема и статус арены */}
          <div className="px-4 py-2.5 bg-amber-100/70 border-b border-amber-200 flex items-center justify-between text-xs font-bold text-teal-900 shrink-0">
            <div className="flex items-center gap-1.5">
              <Music className="w-4 h-4 text-teal-700" />
              <span>Тақырып: «{currentTopicName}»</span>
            </div>
            <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              «Өнерлі өрендер айтысы»
            </span>
          </div>

          {/* Список сообщений (автоскролл) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 kazakh-pattern-bg min-h-0">
            {messages.map((msg) => {
              // 1. БЛОК ЖҮРГІЗУШІ (АДИНА) — Ресми сахналық ашылу сөзі
              if (msg.sender === "host") {
                return (
                  <div
                    key={msg.id}
                    className="w-full my-2 bg-gradient-to-br from-amber-50 via-teal-50/80 to-amber-100 border-2 border-yellow-400 rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden"
                  >
                    {/* Фоновые декоративные узоры */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl pointer-events-none" />

                    {/* Шапка ведущей */}
                    <div className="flex items-center gap-3.5 mb-3 border-b border-amber-200 pb-2.5">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-md shrink-0">
                        <Image
                          src="/images/host_adina.jpg"
                          alt="Жүргізуші Адина"
                          fill
                          sizes="48px"
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm sm:text-base text-teal-950">
                            Жүргізуші (Адина)
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-600 text-yellow-300 text-[10px] font-bold">
                            <Mic2 className="w-3 h-3" />
                            Сахна төрі
                          </span>
                        </div>
                        <span className="text-[11px] text-teal-700 font-semibold block">
                          «Өнерлі өрендер айтысы» айдары
                        </span>
                      </div>
                    </div>

                    {/* Текст ведущей (точно из запроса) */}
                    <div className="relative pl-3 border-l-3 border-yellow-400 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-white/60 p-3 rounded-r-2xl shadow-inner">
                      <p className="italic">
                        «{msg.text}»
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-teal-800/80 font-bold px-1">
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                        Айтыс ресми түрде ашық деп жарияланды
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                );
              }

              const isAI = msg.sender === "ai";

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-3 ${
                    isAI ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Мини-аватар ИИ слева */}
                  {isAI && (
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-yellow-400 shadow-sm shrink-0 mb-1">
                      <Image
                        src="/images/ai_opponent.jpg"
                        alt="AI"
                        fill
                        sizes="36px"
                        className="object-cover object-top"
                      />
                    </div>
                  )}

                  {/* Баббл сообщения */}
                  <div
                    className={`max-w-[85%] rounded-3xl p-4 sm:p-5 shadow-lg relative transition-all ${
                      isAI
                        ? "bg-teal-700 text-white rounded-bl-xs border border-teal-500/60"
                        : "bg-yellow-400 text-teal-950 font-medium rounded-br-xs border-2 border-yellow-500 shadow-amber-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5 border-b pb-1 border-white/20">
                      <span
                        className={`text-xs font-black uppercase tracking-wider ${
                          isAI ? "text-yellow-300" : "text-teal-950"
                        }`}
                      >
                        {isAI ? "AI Ақын (Санжар)" : "Раяна (Сіз)"}
                      </span>
                      <span
                        className={`text-[10px] ${
                          isAI ? "text-teal-200" : "text-teal-900/70"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base leading-relaxed font-sans whitespace-pre-line tracking-wide">
                      {msg.text}
                    </p>

                    {/* Анализ слогов */}
                    {msg.analysis && (
                      <div className="mt-2.5 pt-2 border-t border-teal-950/20 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="bg-amber-100 text-teal-950 font-bold px-2 py-0.5 rounded-lg border border-amber-300">
                          {msg.analysis.syllables.join("-")} буын
                        </span>
                        <span className="bg-teal-800 text-yellow-300 font-semibold px-2 py-0.5 rounded-lg">
                          {msg.analysis.meter}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Мини-аватар пользователя справа */}
                  {!isAI && (
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-yellow-500 shadow-sm shrink-0 mb-1">
                      <Image
                        src={userPhoto}
                        alt="User"
                        fill
                        sizes="36px"
                        className="object-cover object-top"
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Индикатор «печатает...» */}
            {isTyping && (
              <div className="flex items-end gap-3 justify-start animate-fade-in">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-yellow-400 shadow-sm shrink-0 mb-1">
                  <Image
                    src="/images/ai_opponent.jpg"
                    alt="AI"
                    fill
                    sizes="36px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="bg-teal-700 text-white rounded-3xl rounded-bl-xs px-5 py-3.5 shadow-lg border border-teal-500/60 flex items-center gap-3">
                  <span className="text-xs text-yellow-200 font-medium">
                    AI ақын Санжар ойланып, жауап жазуда
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Нижняя панель ввода (textarea + кнопка «Жіберу») */}
          <footer className="p-3 sm:p-4 bg-white border-t-2 border-amber-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-3"
            >
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Өлең жолдарын жазыңыз... (Enter — жіберу)"
                  disabled={isTyping}
                  className="w-full resize-none p-3 sm:p-3.5 rounded-2xl bg-amber-50/70 border-2 border-amber-300 focus:border-teal-600 focus:bg-white focus:outline-none text-slate-800 text-sm placeholder:text-slate-400 transition-all disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`h-[58px] px-6 rounded-2xl font-black text-base tracking-wide border-2 flex items-center justify-center gap-2 transition-all duration-200 shrink-0 ${
                  inputText.trim() && !isTyping
                    ? "bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-teal-950 border-yellow-500 shadow-lg hover:shadow-xl cursor-pointer"
                    : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60 shadow-none"
                }`}
              >
                <span>Жіберу</span>
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </footer>
        </main>

        {/* ПРАВАЯ КОЛОНКА: Профиль AI-оппонента (Санжар) и визитка Жүргізуші (Адина) */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col justify-between space-y-4">
          
          {/* Верхний блок: AI Айтыскер (Санжар) */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border-2 border-amber-200 shadow-xl overflow-hidden space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-300">
              <Bot className="w-3.5 h-3.5 text-teal-700" />
              <span>Виртуалды қарсылас</span>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-md">
              <Image
                src="/images/ai_opponent.jpg"
                alt="AI Айтыскер"
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <span className="block text-xs font-black text-yellow-300 drop-shadow-sm">
                  Санжар (AI Айтыскер)
                </span>
                <span className="text-[10px] text-white/90 font-medium">Жасанды интеллект ақыны</span>
              </div>
            </div>
          </div>

          {/* Нижний блок: Визитная карточка Жүргізуші (Адина) */}
          <div className="bg-gradient-to-br from-amber-50 to-teal-50/60 rounded-3xl p-4 border-2 border-yellow-400 shadow-xl overflow-hidden space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-md shrink-0">
                <Image
                  src="/images/host_adina.jpg"
                  alt="Адина"
                  fill
                  sizes="48px"
                  className="object-cover object-top"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-teal-700 tracking-wider flex items-center gap-1">
                  <Mic2 className="w-3 h-3 text-yellow-600" />
                  Сахна модераторы
                </span>
                <h4 className="font-extrabold text-sm text-teal-950 truncate">
                  Жүргізуші (Адина)
                </h4>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200 text-[11px] text-slate-700 leading-snug">
              «Өнерлі өрендер айтысы» сахнасында сөз сайысын үйлестіруші және қазылар алқасының жетекшісі.
            </div>

            {/* Айтыс ережесі */}
            <div className="pt-1 text-[10px] text-teal-900 font-semibold flex items-center justify-between border-t border-amber-200">
              <span>📏 7-8 & 11 буын</span>
              <span>🎵 а-а-б-а ұйқас</span>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
