"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Настраиваем громкость фона и зацикливание (loop)
    audio.volume = 0.45;
    audio.loop = true;

    // Функция попытки воспроизведения
    const attemptPlay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          // Убираем слушатели после успешного запуска
          removeInteractionListeners();
        })
        .catch(() => {
          // Если браузер заблокировал автовоспроизведение до первого клика
          setIsPlaying(false);
        });
    };

    // Слушатели взаимодействия пользователя для снятия блокировки автоплея
    const handleUserInteraction = () => {
      attemptPlay();
    };

    const addInteractionListeners = () => {
      window.addEventListener("click", handleUserInteraction, { once: true });
      window.addEventListener("touchstart", handleUserInteraction, { once: true });
      window.addEventListener("keydown", handleUserInteraction, { once: true });
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };

    // 1. Пытаемся воспроизвести сразу при монтировании
    attemptPlay();

    // 2. Если браузер заблокировал, ждем любого первого клика/тапа пользователя
    addInteractionListeners();

    return () => {
      removeInteractionListeners();
    };
  }, []);

  // Переключение воспроизведения пользователем
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Play blocked:", err));
    }
  };

  return (
    <>
      {/* Скрытый тег audio с зацикливанием */}
      <audio
        ref={audioRef}
        src="/audio/aitys_bg.mp3"
        preload="auto"
        loop
        playsInline
      />

      {/* Плавающая стилизованная кнопка управления фоновой музыкой (в правом верхнем углу) */}
      <div className="fixed top-4 right-4 z-50">
        <button
          type="button"
          onClick={togglePlay}
          title={isPlaying ? "Фондық музыканы тоқтату" : "Фондық музыканы қосу"}
          className={`flex items-center gap-2 px-3 py-2 rounded-2xl backdrop-blur-md border-2 transition-all duration-300 shadow-xl cursor-pointer ${
            isPlaying
              ? "bg-teal-800/90 hover:bg-teal-900 border-yellow-400 text-yellow-300 ring-2 ring-yellow-400/40"
              : "bg-slate-800/80 hover:bg-slate-900 border-slate-600 text-slate-300"
          }`}
          aria-label="Фондық музыка"
        >
          {/* Анимированные полоски звука при воспроизведении */}
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-4 w-4">
              <span className="w-1 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
              <span className="w-1 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.15s] h-4" />
              <span className="w-1 bg-yellow-400 rounded-full animate-bounce h-2" />
            </div>
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}

          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isPlaying ? "Айтыс сазы" : "Музыка өшірулі"}
            </span>
          </div>
        </button>
      </div>
    </>
  );
}
