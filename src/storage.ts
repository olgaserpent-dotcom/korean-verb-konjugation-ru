import { FORM_KEYS } from "./formSchema";

const SETTINGS_KEY = "korean-conjugation-settings";
const PROGRESS_KEY = "korean-conjugation-progress";

export function loadSelectedForms(): string[] {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((key) => FORM_KEYS.includes(key));
    }
    return [];
  } catch {
    return [];
  }
}

export function saveSelectedForms(selectedForms: string[]): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(selectedForms));
}

export type Progress = Record<string, number>;

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as Progress;
    return {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function pairKey(verbId: string, formKey: string): string {
  return `${verbId}::${formKey}`;
}
