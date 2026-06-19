import Sidebar from '../components/sidebar';
import { useAuth } from '../context/auth-context';

const roleRows = [
  { area: 'Panel operativo y calendario', admin: true, user: true },
  { area: 'Gestion de obras y tareas', admin: true, user: true },
  { area: 'Peticiones de materiales', admin: true, user: true },
  { area: 'Inventario y movimientos', admin: true, user: true },
  { area: 'Proveedores', admin: true, user: false },
  { area: 'Configuracion y permisos', admin: true, user: false },
];

function Settings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen flex-col items-stretch gap-4 px-3 py-3 sm:px-5 lg:flex-row lg:items-start lg:px-6 lg:py-5">
        <Sidebar />

        <section className="min-w-0 flex-1 p-0 sm:p-3">
          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-[#111723] p-5">
              <h1 className="text-lg font-semibold">Configuracion</h1>
              <p className="mt-2 text-sm text-white/60">
                Preferencias generales, permisos y parametros operativos.
              </p>
            </div>

            <section className="rounded-xl border border-white/10 bg-[#111723] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Sesion actual</h2>
                  <p className="mt-1 text-xs text-white/55">{user?.name || user?.email || 'Usuario'}</p>
                </div>
                <span className="inline-flex w-fit rounded border border-cyan-300/25 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-100">
                  Rol: {user?.role || user?.tipoUsuario || 'user'}
                </span>
              </div>
            </section>

            <section className="overflow-x-auto rounded-xl border border-white/10 bg-[#111723]">
              <table className="min-w-[620px] text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/55">
                  <tr>
                    <th className="px-3 py-2 text-left">Area</th>
                    <th className="px-3 py-2 text-center">Admin</th>
                    <th className="px-3 py-2 text-center">Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {roleRows.map((row) => (
                    <tr key={row.area} className="border-t border-white/5 text-white/80">
                      <td className="px-3 py-2">{row.area}</td>
                      <td className="px-3 py-2 text-center">{row.admin ? 'Si' : 'No'}</td>
                      <td className="px-3 py-2 text-center">{row.user ? 'Si' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
