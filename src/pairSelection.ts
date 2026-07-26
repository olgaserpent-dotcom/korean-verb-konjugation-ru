import type { Verb } from "./types";
import type { Progress } from "./storage";
import { pairKey } from "./storage";

export interface Pair {
  verb: Verb;
  formKey: string;
}

/**
 * Выбирает случайную пару (глагол, форма) среди тех, у кого наименьший
 * счётчик показов. Так реже встречавшиеся пары попадаются чаще.
 */
export function pickNextPair(
  verbs: Verb[],
  selectedForms: string[],
  progress: Progress,
  avoid?: Pair | null
): Pair | null {
  if (verbs.length === 0 || selectedForms.length === 0) return null;

  const candidates: { verb: Verb; formKey: string; count: number }[] = [];

  for (const verb of verbs) {
    for (const formKey of selectedForms) {
      const value = verb.forms[formKey];
      if (!value) continue; // у этого глагола нет такой формы
      const count = progress[pairKey(verb.id, formKey)] ?? 0;
      candidates.push({ verb, formKey, count });
    }
  }

  if (candidates.length === 0) return null;

  const minCount = Math.min(...candidates.map((c) => c.count));
  let pool = candidates.filter((c) => c.count === minCount);

  // Стараемся не повторять ровно ту же пару подряд, если есть альтернатива
  if (avoid && pool.length > 1) {
    const filtered = pool.filter(
      (c) => !(c.verb.id === avoid.verb.id && c.formKey === avoid.formKey)
    );
    if (filtered.length > 0) pool = filtered;
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return { verb: chosen.verb, formKey: chosen.formKey };
}
