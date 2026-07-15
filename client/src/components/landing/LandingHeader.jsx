import { Link } from 'react-router-dom';

const navigationItems = [
  { label: 'Que es', href: '#que-es' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Capacidades', href: '#capacidades' },
  { label: 'Planes', href: '#planes' },
];

function LandingHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#090d13]/95 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="flex min-h-10 shrink-0 items-center gap-2.5 text-white" aria-label="MiObra, ir al inicio">
          <span className="grid h-8 w-8 place-items-center border border-cyan-300/60 text-sm text-cyan-200"><i className="fa-solid fa-helmet-safety" aria-hidden="true" /></span>
          <span className="hidden text-sm font-semibold tracking-[0.18em] min-[370px]:inline">MIOBRA</span>
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegacion principal">
          {navigationItems.map((item) => <a key={item.href} href={item.href} className="inline-flex min-h-10 items-center border-b border-transparent py-2 text-sm text-white/55 transition-colors hover:border-cyan-300/50 hover:text-white">{item.label}</a>)}
        </nav>
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <Link to="/login" className="inline-flex min-h-10 items-center px-2 py-2 text-xs font-medium text-white/65 transition-colors hover:text-white sm:px-3 sm:text-sm">Ingresar</Link>
          <Link to="/register" className="inline-flex min-h-10 items-center bg-cyan-300 px-3 py-2 text-xs font-semibold text-[#071017] transition-colors hover:bg-cyan-200 active:bg-cyan-100 sm:px-4 sm:text-sm">Crear cuenta</Link>
        </div>
      </div>
    </header>
  );
}

export default LandingHeader;
