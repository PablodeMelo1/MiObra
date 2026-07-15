import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

const mainItems = [
  { id: 'dashboard', label: 'Panel operativo', path: '/dashboard', icon: 'fa-solid fa-chart-line' },
  { id: 'projects', label: 'Proyectos', path: '/projects', icon: 'fa-solid fa-list-check' },
  { id: 'calendar', label: 'Calendario', path: '/calendar', icon: 'fa-regular fa-calendar-days' },
  { id: 'pendings', label: 'Pendientes', path: '/pendings', icon: 'fa-regular fa-clock' },
  { id: 'employees', label: 'Empleados', path: '/employees', icon: 'fa-solid fa-users-gear' },
  { id: 'inventory', label: 'Inventario', path: '/inventory', icon: 'fa-solid fa-screwdriver-wrench' },
  { id: 'inventory-history', label: 'Historial inventario', path: '/inventory/history', icon: 'fa-solid fa-timeline' },
  { id: 'material-requests', label: 'Peticiones de materiales', path: '/material-requests', icon: 'fa-regular fa-calendar' },
  { id: 'suppliers', label: 'Proveedores', path: '/suppliers', icon: 'fa-solid fa-truck-field-un' },
];

const settingsItems = [
  { id: 'settings', label: 'Configuracion', path: '/settings', icon: 'fa-solid fa-gears' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, companies, activeCompany, companyRole, switchCompany } = useAuth();
  const [openSession, setOpenSession] = useState(null);
  const [renderedPathname, setRenderedPathname] = useState(location.pathname);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const focusFrameRef = useRef(null);
  if (renderedPathname !== location.pathname) {
    setRenderedPathname(location.pathname);
    setOpenSession(null);
  }
  const isOpen = renderedPathname === location.pathname && openSession?.pathname === location.pathname;
  const isDrawerOpen = !isDesktop && isOpen;
  const isDrawerInert = !isDesktop && !isOpen;
  const items = [...mainItems, ...settingsItems];
  const activeItem = items
    .filter((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]?.id;

  const scheduleFocus = useCallback((targetRef) => {
    if (focusFrameRef.current) cancelAnimationFrame(focusFrameRef.current);
    focusFrameRef.current = requestAnimationFrame(() => targetRef.current?.focus());
  }, []);

  const closeMenu = useCallback(() => {
    setOpenSession(null);
    scheduleFocus(menuButtonRef);
  }, [scheduleFocus]);

  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && closeMenu();
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('menu-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('menu-open');
    };
  }, [closeMenu, isDrawerOpen]);

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 1024px)');
    const handleBreakpointChange = (event) => {
      setIsDesktop(event.matches);
      if (event.matches) {
        setOpenSession(null);
      }
    };
    desktopMedia.addEventListener('change', handleBreakpointChange);
    return () => desktopMedia.removeEventListener('change', handleBreakpointChange);
  }, []);

  useEffect(() => () => {
    if (focusFrameRef.current) cancelAnimationFrame(focusFrameRef.current);
  }, []);

  const openMenu = () => {
    setOpenSession({ pathname: location.pathname });
    scheduleFocus(closeButtonRef);
  };

  const goTo = (path) => {
    setOpenSession(null);
    navigate(path);
  };

  const handleCompanyChange = async (event) => {
    const companyId = event.target.value;
    if (!companyId) return;
    await switchCompany(companyId);
  };

  const renderItems = (menuItems) => menuItems.map((item) => {
    const active = activeItem === item.id;
    return (
      <button key={item.id} type="button" onClick={() => goTo(item.path)} aria-current={active ? 'page' : undefined}
        className={`group relative flex min-h-10 w-full items-center gap-3 border-l-2 px-3 py-2.5 text-left text-sm transition-colors lg:min-h-8 lg:gap-2.5 lg:px-2.5 lg:py-1.5 ${active ? 'border-cyan-300 bg-white/[0.055] text-white' : 'border-transparent text-white/60 hover:border-white/20 hover:bg-white/[0.035] hover:text-white'}`}>
        <span className="grid h-5 w-5 shrink-0 place-items-center">
          <i className={`${item.icon} text-[13px] transition-colors ${active ? 'text-cyan-200' : 'text-white/40 group-hover:text-white/65'}`} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
      </button>
    );
  });

  return (
    <>
      <div className="h-14 shrink-0 lg:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-white/10 bg-[#0c0f14]/95 px-3 backdrop-blur-lg lg:hidden">
        <button ref={menuButtonRef} type="button" onClick={openMenu} aria-label="Abrir menu principal" aria-expanded={isDrawerOpen} aria-controls="main-navigation"
          className="grid h-10 w-10 place-items-center border border-white/15 text-white/80 transition-colors hover:border-white/30 hover:text-white">
          <i className="fa-solid fa-bars" aria-hidden="true" />
        </button>
        <span className="ml-3 text-sm font-semibold tracking-[0.16em]">MIOBRA</span>
      </div>

      <button type="button" aria-label="Cerrar menu principal" onClick={closeMenu}
        aria-hidden={!isDrawerOpen} tabIndex={isDrawerOpen ? 0 : -1}
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity motion-reduce:transition-none lg:hidden ${isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />

      <aside id="main-navigation" aria-hidden={isDrawerInert || undefined} inert={isDrawerInert || undefined}
        className={`app-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(88vw,19rem)] flex-col overflow-y-auto border-r border-white/10 bg-[#101620] p-4 text-white shadow-2xl shadow-black/40 transition-transform duration-300 motion-reduce:transition-none lg:sticky lg:top-3 lg:z-auto lg:h-[calc(100vh-1.5rem)] lg:w-64 lg:shrink-0 lg:translate-x-0 lg:p-3 lg:shadow-none ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4 lg:mb-3 lg:pb-2.5">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center border border-cyan-300/50 text-sm text-cyan-200"><i className="fa-solid fa-helmet-safety" aria-hidden="true" /></span>
            <div>
              <h1 className="text-sm font-semibold tracking-[0.18em]">MIOBRA</h1>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-white/60">Gestion operativa</p>
            </div>
          </div>
          <button ref={closeButtonRef} type="button" onClick={closeMenu} aria-label="Cerrar menu principal"
            className="grid h-10 w-10 place-items-center border border-white/15 text-white/65 transition-colors hover:border-white/30 hover:text-white lg:hidden">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-w-0 items-center gap-3 border-b border-white/10 pb-5 lg:gap-2.5 lg:pb-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center border border-white/15 bg-white/[0.04]">
            <i className="fa-regular fa-user text-sm text-white/60" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name || 'Usuario'}</p>
            <p className="mt-0.5 truncate text-[11px] text-white/65">{user?.email}</p>
          </div>
          <button type="button" onClick={() => goTo('/profile')} aria-label="Abrir perfil"
            className="grid h-10 w-10 shrink-0 place-items-center border border-white/15 text-xs text-white/55 transition-colors hover:border-white/30 hover:text-white">
            <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
          </button>
        </div>

        <div className="border-b border-white/10 py-5 lg:py-3">
          <label htmlFor="company-selector" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 lg:mb-1">Empresa activa</label>
          {companies?.length > 1 ? (
            <select id="company-selector" value={activeCompany?._id || ''} onChange={handleCompanyChange}
              className="w-full border border-white/15 bg-[#0b1017] px-3 py-2.5 text-sm text-white outline-none transition-colors hover:border-white/25 focus:border-cyan-300/70 lg:py-1.5">
              {companies.map((membership) => (
                <option key={membership.companyId} value={membership.companyId} className="bg-[#111723] text-white">
                  {membership.company?.name || 'Empresa'}
                </option>
              ))}
            </select>
          ) : (
            <div className="border-l-2 border-cyan-300/50 bg-white/[0.035] px-3 py-2.5 lg:py-1.5">
              <p className="truncate text-sm font-medium">{activeCompany?.name || 'Empresa'}</p>
              <p className="mt-0.5 text-[11px] capitalize text-white/60">{companyRole || 'sin rol'}</p>
            </div>
          )}
        </div>

        <p className="mb-2 mt-5 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 lg:mb-1 lg:mt-3 lg:px-2.5">Operacion</p>
        <nav className="space-y-0.5" aria-label="Navegacion principal">{renderItems(mainItems)}</nav>
        <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 lg:mb-1 lg:mt-3 lg:px-2.5">Sistema</p>
        <nav className="space-y-0.5" aria-label="Opciones del sistema">{renderItems(settingsItems)}</nav>

        <div className="mt-auto border-t border-white/10 pt-4 lg:pt-2">
          <button type="button" className="flex min-h-10 w-full items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm text-white/45 transition-colors hover:border-rose-300/50 hover:bg-rose-400/[0.06] hover:text-rose-100 lg:min-h-8 lg:gap-2.5 lg:px-2.5 lg:py-1.5"
            onClick={async () => { try { await signOut(); } finally { navigate('/login'); } }}>
            <span className="grid h-5 w-5 place-items-center"><i className="fa-solid fa-arrow-right-from-bracket text-xs" aria-hidden="true" /></span>
            Cerrar sesion
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
