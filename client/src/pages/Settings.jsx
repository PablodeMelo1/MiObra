import Sidebar from '../components/sidebar';

function Settings() {
  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen items-start gap-4 px-6 py-5">
        <Sidebar />

        <section className="flex-1 p-3">
          <div className="rounded-xl border border-white/10 bg-[#111723] p-5">
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="mt-2 text-sm text-white/60">
              No hay configuraciones disponibles por el momento.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
