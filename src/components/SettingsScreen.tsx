import { FORM_GROUPS } from "../formSchema";

interface Props {
  selectedForms: string[];
  onChange: (forms: string[]) => void;
  onStart: () => void;
  canGoBack: boolean;
  onBack: () => void;
}

export function SettingsScreen({
  selectedForms,
  onChange,
  onStart,
  canGoBack,
  onBack,
}: Props) {
  const selectedSet = new Set(selectedForms);

  function toggleForm(key: string) {
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange([...next]);
  }

  function toggleGroup(groupId: string, checked: boolean) {
    const group = FORM_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    const next = new Set(selectedSet);
    for (const form of group.forms) {
      const key = `${groupId}.${form.id}`;
      if (checked) next.add(key);
      else next.delete(key);
    }
    onChange([...next]);
  }

  return (
    <div className="screen settings-screen">
      <div className="screen-header">
        <h1>Настройки тренировки</h1>
        {canGoBack && (
          <button className="btn btn-secondary" onClick={onBack}>
            ← Назад
          </button>
        )}
      </div>

      <p className="hint">Выберите формы глаголов, которые хотите тренировать.</p>

      <div className="form-groups">
        {FORM_GROUPS.map((group) => {
          const keys = group.forms.map((f) => `${group.id}.${f.id}`);
          const selectedCount = keys.filter((k) => selectedSet.has(k)).length;
          const allSelected = selectedCount === keys.length;
          const partiallySelected = selectedCount > 0 && !allSelected;

          return (
            <fieldset className="form-group" key={group.id}>
              <legend>
                <label className="checkbox-label group-label">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = partiallySelected;
                    }}
                    onChange={(e) => toggleGroup(group.id, e.target.checked)}
                  />
                  <span>{group.label}</span>
                </label>
              </legend>
              <div className="form-options">
                {group.forms.map((form) => {
                  const key = `${group.id}.${form.id}`;
                  return (
                    <label className="checkbox-label" key={key}>
                      <input
                        type="checkbox"
                        checked={selectedSet.has(key)}
                        onChange={() => toggleForm(key)}
                      />
                      <span>{form.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="screen-footer">
        <button
          className="btn btn-primary"
          disabled={selectedForms.length === 0}
          onClick={onStart}
        >
          Начать тренировку
        </button>
      </div>
    </div>
  );
}
