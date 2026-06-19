import { useRef } from 'react';

function DateField({ label, value, onChange, className = '' }) {
  const inputRef = useRef(null);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;

    input.focus();

    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker();
        return;
      } catch {
        // Some browsers only allow showPicker during trusted interactions.
      }
    }

    input.click();
  };

  return (
    <label className={`space-y-1 ${className}`.trim()}>
      <span className="text-white/70">{label}</span>
      <div className="flex overflow-hidden rounded border border-white/15 bg-[#0d1119] focus-within:border-white/30">
        <input
          ref={inputRef}
          type="date"
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-8 flex-1 border-0 bg-transparent px-2 py-1.5 text-white outline-none [color-scheme:dark]"
        />
        <button
          type="button"
          onClick={openPicker}
          className="grid w-9 shrink-0 place-items-center border-l border-white/10 text-white/65 hover:bg-white/5 hover:text-white"
          title="Abrir calendario"
          aria-label={`Abrir calendario para ${label}`}
        >
          <i className="fa-regular fa-calendar-days" aria-hidden="true" />
        </button>
      </div>
    </label>
  );
}

export default DateField;
