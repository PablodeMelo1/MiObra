function LoadingScreen({ message = 'Cargando...' }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#0a0e14] px-4 text-white" role="status" aria-live="polite">
      <div className="flex items-center gap-3 border-l-2 border-cyan-300/60 bg-[#101620] px-4 py-3 text-sm text-white/80">
        <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-300" />
        <span>{message}</span>
      </div>
    </div>
  );
}

export default LoadingScreen;
