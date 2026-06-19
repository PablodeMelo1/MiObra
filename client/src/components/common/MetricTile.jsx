function MetricTile({ label, value, detail, tone = 'neutral', icon }) {
  const tones = {
    neutral: 'border-white/10 bg-[#111723] text-white',
    cyan: 'border-cyan-300/20 bg-cyan-500/10 text-cyan-100',
    amber: 'border-amber-300/20 bg-amber-500/10 text-amber-100',
    rose: 'border-rose-300/20 bg-rose-500/10 text-rose-100',
    emerald: 'border-emerald-300/20 bg-emerald-500/10 text-emerald-100',
  };

  return (
    <div className={`min-h-28 rounded-lg border p-3 ${tones[tone] || tones.neutral}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-white/55">{label}</p>
        {icon ? <i className={`${icon} text-sm text-white/55`} aria-hidden="true" /> : null}
      </div>
      <p className="mt-3 text-3xl font-semibold leading-none">{value}</p>
      {detail ? <p className="mt-2 text-xs text-white/60">{detail}</p> : null}
    </div>
  );
}

export default MetricTile;
