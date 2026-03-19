import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const mainItems = [
    { id: 'projects', label: 'Proyectos', component: "Projects", icon: 'fa-solid fa-list-check' },
    { id: 'pendings', label: 'Pendientes', component: "pendings", icon: 'fa-regular fa-clock' },
    { id: 'inventory', label: 'Inventario', component: "Inventory", icon: 'fa-solid fa-screwdriver-wrench' },
    { id: 'material-requests', label: 'Peticiones de materiales', component: "material-requests", icon: 'fa-regular fa-calendar' },
    { id: 'suppliers', label: 'Proveedores', component: "suppliers", icon: 'fa-solid fa-truck-field-un' },
]

const settingsItems = [
    { id: 'settings', label: 'Settings', component: "settings", icon: 'fa-solid fa-gears' },
]

const Icon = ({ name, active }) => {
    const color = active ? 'text-white' : 'text-white/60'
    return <i className={`${name} ${color} text-[14px]`} aria-hidden="true" />
}

function Sidebar() {
    const [activeItem, setActiveItem] = useState('refunds')
    const navigate = useNavigate();
    const { user, isLoading, signOut } = useAuth();
    console.log('user: ', user)
    if (isLoading) return null;
    return (
        <aside className="relative w-75 rounded-2xl border border-white/5 bg-linear-to-b from-[#1d222d] via-[#151922] to-[#0f131b] px-4 pb-5 pt-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-300">
            <div className="text-center mb-5 gap-3 border-b border-white/10 pb-3">
                <h1 className="text-2xl font-semibold tracking-wide text-white">Miobra</h1>
            </div>

            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10">
                    <i className="fa-regular fa-user text-white/70" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-white/60">{user?.email}</p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="rounded-md border border-white/15 px-2 py-1 text-[11px] text-white/80 transition hover:bg-white/10"
                >
                    Ver perfil
                </button>
            </div>

            <div className="mt-3 space-y-2">
                {mainItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveItem(item.id); navigate(`/${item.component}`) }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${activeItem === item.id
                            ? 'bg-white/10 text-white'
                            : 'text-white/70 hover:bg-white/5'
                            }`}
                    >
                        <Icon name={item.icon} active={activeItem === item.id} />
                        <span className="flex-1 text-left">{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-7 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
                Settings
            </div>
            <div className="mt-3 space-y-2">
                {settingsItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveItem(item.id); navigate(`/${item.component}`) }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${activeItem === item.id
                            ? 'bg-white/10 text-white'
                            : 'text-white/70 hover:bg-white/5'
                            }`}
                    >
                        <Icon name={item.icon} active={activeItem === item.id} />
                        <span className="flex-1 text-left">{item.label}</span>
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