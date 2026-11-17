import { useEffect, useRef, useState } from "react";
import type { Pair } from "../pairSelection";
import { getFormLabel } from "../formSchema";

export interface Feedback {
  correct: boolean;
  correctAnswer: string;
  translation: string;
}

interface Props {
  pair: Pair | null;
  feedback: Feedback | null;
  onSubmit: (answer: string) => void;
  onNext: () => void;
  onOpenSettings: () => void;
}

export function TrainingScreen({
  pair,
  feedback,
  onSubmit,
  onNext,
  onOpenSettings,
}: Props) {
  const [answer, setAnswer] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnswer("");
    inputRef.current?.focus();
  }, [pair]);

  if (!pair) {
    return (
      <div className="screen training-screen">
        <p className="hint">
          Нет выбранных форм для тренировки. Откройте настройки и выберите хотя
          бы одну форму.
        </p>
        <button className="btn btn-primary" onClick={onOpenSettings}>
          Открыть настройки
        </button>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (feedback) {
      inputRef.current?.blur();
      onNext();
      return;
    }
    if (answer.trim() === "") return;
    inputRef.current?.blur();
    inputRef.current?.focus();
    onSubmit(answer);
  }

  return (
    <div className="screen training-screen">
      <div className="screen-header">
        <h1>Тренажёр спряжений</h1>
        <button className="btn btn-secondary" onClick={onOpenSettings}>
          ⚙ Настройки
        </button>
      </div>

      <div className="card">
        <div className="dictionary-form">{pair.verb.dictionary}</div>
        <div className="form-label">{getFormLabel(pair.formKey)}</div>

        <form onSubmit={handleSubmit} className="answer-form">
          <input
            ref={inputRef}
            className={
              "answer-input" +
              (feedback ? (feedback.correct ? " correct" : " incorrect") : "")
            }
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            readOnly={!!feedback}
            placeholder="Введите форму глагола"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button type="submit" className="btn btn-primary">
            {feedback ? "Далее" : "Проверить"}
          </button>
        </form>

        {feedback && (
          <div
            className={"feedback " + (feedback.correct ? "correct" : "incorrect")}
          >
            <div className="feedback-status">
              {feedback.correct ? "Верно!" : "Неправильно"}
            </div>
            <div className="feedback-answer">{feedback.correctAnswer}</div>
            <div className="feedback-translation">{feedback.translation}</div>
          </div>
        )}
      </div>
    </div>
  );
}
