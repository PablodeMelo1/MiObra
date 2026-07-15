import Sidebar from '../sidebar';

function PageShell({ children }) {
  return (
    <div className="app-shell min-h-screen bg-[#0a0e14] text-white">
      <div className="flex min-h-screen flex-col items-stretch gap-3 px-3 py-3 sm:px-5 lg:flex-row lg:items-start lg:px-4 lg:py-3 xl:px-5">
        <Sidebar />
        <main id="main-content" className="min-w-0 flex-1 p-0 sm:p-2 lg:py-1">{children}</main>
      </div>
    </div>
  );
}

export default PageShell;
