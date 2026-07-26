export interface Verb {
  id: string;
  dictionary: string;
  translation: string;
  forms: Record<string, string>;
}

export interface Settings {
  selectedForms: string[];
}
