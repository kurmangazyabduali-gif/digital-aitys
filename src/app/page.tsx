"use client";

import { useState } from "react";
import { ScreenWelcome } from "@/components/ScreenWelcome";
import { ScreenCharacter, CharacterType } from "@/components/ScreenCharacter";
import { ScreenTopic } from "@/components/ScreenTopic";
import { ScreenBattle } from "@/components/ScreenBattle";

export type ScreenNumber = 1 | 2 | 3 | 4;

export default function DigitalAitysApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenNumber>(1);
  const [character, setCharacter] = useState<CharacterType>(null);
  const [topic, setTopic] = useState<string | null>(null);

  // Screen 1: Welcome
  if (currentScreen === 1) {
    return (
      <ScreenWelcome
        onStart={() => setCurrentScreen(2)}
      />
    );
  }

  // Screen 2: Character selection
  if (currentScreen === 2) {
    return (
      <ScreenCharacter
        selectedCharacter={character}
        onSelectCharacter={setCharacter}
        onNext={() => setCurrentScreen(3)}
        onBack={() => setCurrentScreen(1)}
      />
    );
  }

  // Screen 3: Topic selection
  if (currentScreen === 3) {
    return (
      <ScreenTopic
        selectedTopic={topic}
        onSelectTopic={setTopic}
        onNext={() => setCurrentScreen(4)}
        onBack={() => setCurrentScreen(2)}
      />
    );
  }

  // Screen 4: Interactive Chat Battle
  return (
    <ScreenBattle
      selectedCharacter={character}
      selectedTopic={topic}
      onBack={() => setCurrentScreen(3)}
      onRestart={() => {
        setCurrentScreen(1);
        setCharacter(null);
        setTopic(null);
      }}
    />
  );
}
