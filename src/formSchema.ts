// Схема форм спряжения корейских глаголов.
// Порядок groups/forms соответствует порядку колонок в исходном CSV
// (public/Формы_глаголов.csv), используется конвертером scripts/convert-csv.mjs.

export interface FormDef {
  id: string;
  label: string;
}

export interface FormGroup {
  id: string;
  label: string;
  forms: FormDef[];
}

export const FORM_GROUPS: FormGroup[] = [
  {
    id: "present",
    label: "Настоящее время",
    forms: [
      { id: "ovs", label: "ОВС — официально-вежливый (~습니다)" },
      { id: "nvs", label: "НВС — неофициально-вежливый (~어요)" },
      { id: "kfs", label: "КФС — книжно-фамильярный (~다/~니?)" },
      { id: "rfs", label: "РФС — разговорно-фамильярный (~어)" },
    ],
  },
  {
    id: "past",
    label: "Прошедшее время (만들었-)",
    forms: [
      { id: "ovs", label: "ОВС — официально-вежливый (~습니다)" },
      { id: "nvs", label: "НВС — неофициально-вежливый (~어요)" },
      { id: "kfs", label: "КФС — книжно-фамильярный (~다/~니?)" },
      { id: "rfs", label: "РФС — разговорно-фамильярный (~어)" },
    ],
  },
  {
    id: "future_intent",
    label: "Будущее-намерение (만들겠-)",
    forms: [
      { id: "ovs", label: "ОВС — официально-вежливый (~습니다)" },
      { id: "nvs", label: "НВС — неофициально-вежливый (~어요)" },
      { id: "kfs", label: "КФС — книжно-фамильярный (~다/~니?)" },
      { id: "rfs", label: "РФС — разговорно-фамильярный (~어)" },
    ],
  },
  {
    id: "future_assume",
    label: "Будущее-предположение (-(으)ㄹ 것, ㄹ+ㄹ→ㄹ)",
    forms: [
      { id: "ovs", label: "ОВС — официально-вежливый (~습니다)" },
      { id: "nvs", label: "НВС — неофициально-вежливый (~어요)" },
      { id: "kfs", label: "КФС — книжно-фамильярный (~다/~니?)" },
      { id: "rfs", label: "РФС — разговорно-фамильярный (~어)" },
    ],
  },
  {
    id: "imperative",
    label: "Повелительное наклонение",
    forms: [
      { id: "ovs", label: "ОВС — официально-вежливый (~습니다)" },
      { id: "nvs", label: "НВС — неофициально-вежливый (~어요)" },
      { id: "rfs", label: "РФС — разговорно-фамильярный (~어)" },
    ],
  },
  {
    id: "propositive",
    label: "Пригласительное наклонение",
    forms: [
      { id: "ovs", label: "ОВС — официально-вежливый (~습니다)" },
      { id: "nvs", label: "НВС — неофициально-вежливый (~어요)" },
      { id: "rfs", label: "РФС — разговорно-фамильярный (~어)" },
    ],
  },
  {
    id: "honorific",
    label: "С почтительным суффиксом -(으)시-",
    forms: [
      { id: "ovs", label: "ОВС — официально-вежливый (~습니다)" },
      { id: "nvs", label: "НВС — неофициально-вежливый (~어요)" },
      { id: "kfs", label: "КФС — книжно-фамильярный (~다/~니?)" },
      { id: "rfs", label: "РФС — разговорно-фамильярный (~어)" },
    ],
  },
  {
    id: "attributive",
    label: "Атрибутивные формы",
    forms: [
      { id: "present", label: "Настоящее время (который делает)" },
      { id: "past", label: "Прошедшее время (который сделал)" },
      { id: "retrospective", label: "Ретроспектива (который делал, незавершенное в прошлом)" },
      { id: "past_perfect", label: "Прошедшее завершенное (который сделал, завершенное)" },
      { id: "future", label: "Будущее время (который сделает)" },
    ],
  },
  {
    id: "constructions",
    label: "Прикладные конструкции",
    forms: [
      { id: "continuous", label: "Продолжительное действие" },
      { id: "want", label: "Желание" },
      { id: "ability", label: "Возможность" },
      { id: "after", label: "После действия" },
      { id: "before", label: "Перед действием" },
      { id: "simultaneous", label: "Одновременность действия" },
      { id: "connective", label: "Соединение" },
    ],
  },
];

// Полный список ключей форм в порядке колонок CSV (group.form), напр. "present.ovs"
export const FORM_KEYS: string[] = FORM_GROUPS.flatMap((g) =>
  g.forms.map((f) => `${g.id}.${f.id}`)
);

export function getFormLabel(key: string): string {
  const [groupId, formId] = key.split(".");
  const group = FORM_GROUPS.find((g) => g.id === groupId);
  const form = group?.forms.find((f) => f.id === formId);
  if (!group || !form) return key;
  return `${group.label} · ${form.label}`;
}
