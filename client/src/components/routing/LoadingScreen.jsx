function LoadingScreen({ message = 'Cargando...' }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#0c0f14] px-4 text-white">
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#111723] px-4 py-3 text-sm text-white/80">
        <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-300" />
        <span>{message}</span>
      </div>
    </div>
  );
}

export default LoadingScreen;
