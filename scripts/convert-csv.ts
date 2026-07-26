// Конвертирует исходную таблицу глаголов (CSV, разделитель ';') в public/verbs.json.
// Запуск: npm run convert:csv -- /путь/к/файлу.csv

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { FORM_KEYS } from "../src/formSchema.ts";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Использование: npm run convert:csv -- <путь к CSV>");
  process.exit(1);
}

const raw = readFileSync(resolve(inputPath), "utf-8");

const rows: string[][] = parse(raw, {
  delimiter: ";",
  relax_column_count: true,
  skip_empty_lines: true,
});

// Первые 2 строки — заголовки групп/подформ, данные начинаются с 3-й строки (индекс 2)
const dataRows = rows.slice(2);

const seenDictionary = new Map<string, number>();

const verbs = dataRows
  .filter((row) => row[0] && row[0].trim() !== "")
  .map((row) => {
    const dictionary = row[0].trim();
    const translation = (row[1] ?? "").trim();
    const forms: Record<string, string> = {};

    FORM_KEYS.forEach((key, i) => {
      const value = row[2 + i];
      if (value !== undefined) {
        forms[key] = value.trim();
      }
    });

    // Некоторые словарные формы повторяются (омонимы с разным переводом),
    // поэтому id делаем гарантированно уникальным.
    const count = seenDictionary.get(dictionary) ?? 0;
    seenDictionary.set(dictionary, count + 1);
    const id = count === 0 ? dictionary : `${dictionary}_${count + 1}`;

    return {
      id,
      dictionary,
      translation,
      forms,
    };
  });

const outputPath = resolve("public/verbs.json");
writeFileSync(outputPath, JSON.stringify(verbs, null, 2), "utf-8");

console.log(`Сконвертировано глаголов: ${verbs.length}`);
console.log(`Записано в ${outputPath}`);
