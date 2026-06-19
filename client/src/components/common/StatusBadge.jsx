function StatusBadge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'border-white/15 bg-white/5 text-white/70',
    cyan: 'border-cyan-300/25 bg-cyan-500/10 text-cyan-100',
    amber: 'border-amber-300/25 bg-amber-500/10 text-amber-100',
    rose: 'border-rose-300/25 bg-rose-500/10 text-rose-100',
    emerald: 'border-emerald-300/25 bg-emerald-500/10 text-emerald-100',
  };

  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}

export default StatusBadge;
