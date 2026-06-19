import Sidebar from '../sidebar';

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen flex-col items-stretch gap-4 px-3 py-3 sm:px-5 lg:flex-row lg:items-start lg:px-6 lg:py-5">
        <Sidebar />
        <section className="min-w-0 flex-1 p-0 sm:p-3">{children}</section>
      </div>
    </div>
  );
}

export default PageShell;
