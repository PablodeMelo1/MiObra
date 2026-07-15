function MetricTile({ label, value, detail, tone = 'neutral', icon }) {
  const tones = {
    neutral: 'border-white/15 text-white',
    cyan: 'border-cyan-300/35 text-cyan-100',
    amber: 'border-amber-300/35 text-amber-100',
    rose: 'border-rose-300/35 text-rose-100',
    emerald: 'border-emerald-300/35 text-emerald-100',
  };

  return (
    <div className={`min-h-24 border-l-2 bg-white/[0.018] px-4 py-3 ${tones[tone] || tones.neutral}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-white/55">{label}</p>
        {icon ? <i className={`${icon} text-sm text-white/55`} aria-hidden="true" /> : null}
      </div>
      <p className="mt-3 text-2xl font-semibold leading-none tabular-nums">{value}</p>
      {detail ? <p className="mt-2 text-xs text-white/60">{detail}</p> : null}
    </div>
  );
}

export default MetricTile;
