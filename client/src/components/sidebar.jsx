import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

const mainItems = [
  { id: 'dashboard', label: 'Panel operativo', path: '/dashboard', icon: 'fa-solid fa-chart-line' },
  { id: 'projects', label: 'Proyectos', path: '/projects', icon: 'fa-solid fa-list-check' },
  { id: 'calendar', label: 'Calendario', path: '/calendar', icon: 'fa-regular fa-calendar-days' },
  { id: 'pendings', label: 'Pendientes', path: '/pendings', icon: 'fa-regular fa-clock' },
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
  const [isOpen, setIsOpen] = useState(false);
  const items = [...mainItems, ...settingsItems];
  const activeItem = items
    .filter((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]?.id || 'dashboard';

  useEffect(() => setIsOpen(false), [location.pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('menu-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  const goTo = (path) => {
    setIsOpen(false);
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
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${active ? 'bg-cyan-400/15 text-white ring-1 ring-cyan-300/20' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
        <span className="grid h-6 w-6 shrink-0 place-items-center">
          <i className={`${item.icon} text-[14px] ${active ? 'text-cyan-200' : 'text-white/55'}`} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">{item.label}</span>
      </button>
    );
  });

  return (
    <>
      <div className="h-14 shrink-0 lg:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-white/10 bg-[#0c0f14]/95 px-3 backdrop-blur lg:hidden">
        <button type="button" onClick={() => setIsOpen(true)} aria-label="Abrir menu principal" aria-expanded={isOpen} aria-controls="main-navigation"
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/5 text-white">
          <i className="fa-solid fa-bars" aria-hidden="true" />
        </button>
        <span className="ml-3 text-base font-semibold tracking-wide">Scandia</span>
      </div>

      <button type="button" aria-label="Cerrar menu principal" onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />

      <aside id="main-navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(86vw,20rem)] flex-col overflow-y-auto border-r border-white/10 bg-linear-to-b from-[#1d222d] via-[#151922] to-[#0f131b] p-4 text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-5 lg:z-auto lg:h-[calc(100vh-2.5rem)] lg:w-75 lg:shrink-0 lg:translate-x-0 lg:rounded-2xl lg:border ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <h1 className="text-2xl font-semibold tracking-wide">Scandia</h1>
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar menu principal"
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white/75 lg:hidden">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-w-0 items-center gap-3 border-b border-white/10 pb-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10">
            <i className="fa-regular fa-user text-white/70" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name || 'Usuario'}</p>
            <p className="truncate text-xs text-white/60">{user?.email}</p>
          </div>
          <button type="button" onClick={() => goTo('/profile')} className="rounded-md border border-white/15 px-2 py-1 text-[11px] text-white/80 hover:bg-white/10">Perfil</button>
        </div>

        <div className="border-b border-white/10 py-4">
          <label htmlFor="company-selector" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">Empresa</label>
          {companies?.length > 1 ? (
            <select id="company-selector" value={activeCompany?._id || ''} onChange={handleCompanyChange}
              className="w-full rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/70">
              {companies.map((membership) => (
                <option key={membership.companyId} value={membership.companyId} className="bg-[#111723] text-white">
                  {membership.company?.name || 'Empresa'}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <p className="truncate text-sm font-medium">{activeCompany?.name || 'Empresa'}</p>
              <p className="mt-0.5 text-xs text-white/45">{companyRole || 'sin rol'}</p>
            </div>
          )}
        </div>

        <nav className="mt-4 space-y-1" aria-label="Navegacion principal">{renderItems(mainItems)}</nav>
        <p className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Sistema</p>
        <nav className="space-y-1" aria-label="Opciones del sistema">{renderItems(settingsItems)}</nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rose-200/80 hover:bg-rose-400/10 hover:text-rose-100"
            onClick={async () => { try { await signOut(); } finally { navigate('/login'); } }}>
            <span className="grid h-6 w-6 place-items-center"><i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" /></span>
            Cerrar sesion
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
