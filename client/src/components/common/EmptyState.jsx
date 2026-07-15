function EmptyState({ title, detail }) {
  return (
    <div className="border-l-2 border-white/15 bg-white/[0.025] px-4 py-3 text-sm">
      <p className="font-medium text-white/80">{title}</p>
      {detail ? <p className="mt-1 text-xs text-white/55">{detail}</p> : null}
    </div>
  );
}

export default EmptyState;
