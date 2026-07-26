import { useEffect, useState } from "react";
import type { Verb } from "./types";
import type { Progress } from "./storage";
import {
  loadProgress,
  loadSelectedForms,
  pairKey,
  saveProgress,
  saveSelectedForms,
} from "./storage";
import { pickNextPair, type Pair } from "./pairSelection";
import { SettingsScreen } from "./components/SettingsScreen";
import { TrainingScreen, type Feedback } from "./components/TrainingScreen";
import "./App.css";

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

type Screen = "settings" | "training";

function App() {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [selectedForms, setSelectedForms] = useState<string[]>(() =>
    loadSelectedForms()
  );
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [screen, setScreen] = useState<Screen>(() =>
    loadSelectedForms().length > 0 ? "training" : "settings"
  );
  const [pair, setPair] = useState<Pair | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    fetch("/verbs.json")
      .then((res) => res.json())
      .then((data: Verb[]) => setVerbs(data));
  }, []);

  useEffect(() => {
    if (screen === "training" && !pair && verbs.length > 0) {
      setPair(pickNextPair(verbs, selectedForms, progress));
    }
  }, [screen, pair, verbs, selectedForms, progress]);

  function handleSelectedFormsChange(next: string[]) {
    setSelectedForms(next);
    saveSelectedForms(next);
  }

  function handleStart() {
    setPair(pickNextPair(verbs, selectedForms, progress));
    setFeedback(null);
    setScreen("training");
  }

  function handleOpenSettings() {
    setScreen("settings");
  }

  function handleBackToTraining() {
    if (pair && !selectedForms.includes(pair.formKey)) {
      setPair(pickNextPair(verbs, selectedForms, progress));
      setFeedback(null);
    }
    setScreen("training");
  }

  function handleSubmit(answer: string) {
    if (!pair) return;
    const correctAnswer = pair.verb.forms[pair.formKey] ?? "";
    const isCorrect = normalize(answer) === normalize(correctAnswer);
    const key = pairKey(pair.verb.id, pair.formKey);

    const nextProgress: Progress = {
      ...progress,
      [key]: isCorrect ? (progress[key] ?? 0) + 1 : 0,
    };
    setProgress(nextProgress);
    saveProgress(nextProgress);

    setFeedback({
      correct: isCorrect,
      correctAnswer,
      translation: pair.verb.translation,
    });
  }

  function handleNext() {
    setFeedback(null);
    setPair((current) => pickNextPair(verbs, selectedForms, progress, current));
  }

  return (
    <div className="app">
      {screen === "settings" ? (
        <SettingsScreen
          selectedForms={selectedForms}
          onChange={handleSelectedFormsChange}
          onStart={handleStart}
          canGoBack={pair !== null}
          onBack={handleBackToTraining}
        />
      ) : (
        <TrainingScreen
          pair={pair}
          feedback={feedback}
          onSubmit={handleSubmit}
          onNext={handleNext}
          onOpenSettings={handleOpenSettings}
        />
      )}
    </div>
  );
}

export default App;
