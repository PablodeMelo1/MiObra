import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#0c0f14] px-4 text-white">
      <section className="w-full max-w-md rounded-xl border border-white/10 bg-[#111723] p-6 text-center shadow-2xl">
        <p className="mb-2 text-sm font-medium text-cyan-200">404</p>
        <h1 className="text-2xl font-semibold">Pagina no encontrada</h1>
        <p className="mt-2 text-sm text-white/60">
          La ruta que intentaste abrir no existe o fue movida.
        </p>
        <Link
          to="/dashboard"
          className="mt-5 inline-flex rounded-md border border-cyan-300/35 bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-500/30"
        >
          Ir al dashboard
        </Link>
      </section>
    </div>
  );
}

export default NotFound;
