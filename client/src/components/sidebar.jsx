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
]

const settingsItems = [
    { id: 'settings', label: 'Configuracion', path: '/settings', icon: 'fa-solid fa-gears' },
]

const Icon = ({ name, active }) => {
    const color = active ? 'text-white' : 'text-white/60'
    return <i className={`${name} ${color} text-[14px]`} aria-hidden="true" />
}

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoading, signOut } = useAuth();
    const items = [...mainItems, ...settingsItems];
    const activeItem = items
        .filter((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
        .sort((a, b) => b.path.length - a.path.length)[0]?.id || 'dashboard';

    if (isLoading) return null;

    return (
        <aside className="relative w-full shrink-0 rounded-xl border border-white/5 bg-linear-to-b from-[#1d222d] via-[#151922] to-[#0f131b] px-3 pb-3 pt-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-300 lg:w-75 lg:rounded-2xl lg:px-4 lg:pb-5 lg:pt-6">
            <div className="mb-3 gap-3 border-b border-white/10 pb-3 text-center lg:mb-5">
                <h1 className="text-2xl font-semibold tracking-wide text-white">Scandia</h1>
            </div>

            <div className="flex min-w-0 items-center gap-3 border-b border-white/10 pb-4 lg:pb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10">
                    <i className="fa-regular fa-user text-white/70" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{user?.name}</p>
                    <p className="truncate text-xs text-white/60">{user?.email}</p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="shrink-0 rounded-md border border-white/15 px-2 py-1 text-[11px] text-white/80 transition hover:bg-white/10"
                >
                    Ver perfil
                </button>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
                {mainItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition lg:w-full lg:shrink ${activeItem === item.id
                            ? 'bg-white/10 text-white'
                            : 'text-white/70 hover:bg-white/5'
                            }`}
                    >
                        <Icon name={item.icon} active={activeItem === item.id} />
                        <span className="whitespace-nowrap text-left lg:flex-1 lg:whitespace-normal">{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 lg:mt-7">
                Sistema
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
                {settingsItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition lg:w-full lg:shrink ${activeItem === item.id
                            ? 'bg-white/10 text-white'
                            : 'text-white/70 hover:bg-white/5'
                            }`}
                    >
                        <Icon name={item.icon} active={activeItem === item.id} />
                        <span className="whitespace-nowrap text-left lg:flex-1 lg:whitespace-normal">{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-auto space-y-3 border-t border-white/10 pt-4 text-sm">

                <button className="flex items-center gap-3 px-3 py-2 text-rose-200/80 hover:text-rose-200" onClick={async () => {
                    await signOut();
                    navigate('/login');
                }}>
                    <span className="grid h-6 w-6 place-items-center">
                        <Icon name="fa-solid fa-arrow-right-to-bracket" active={true} />
                    </span>         
                    Cerrar sesion
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
