function EmptyState({ title, detail }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#10141d] p-4 text-sm">
      <p className="font-medium text-white/80">{title}</p>
      {detail ? <p className="mt-1 text-xs text-white/55">{detail}</p> : null}
    </div>
  );
}

export default EmptyState;
