import ProjectControlPanel from './ProjectControlPanel';
import ProjectJournal from './ProjectJournal';

const tabs = [
  { id: 'summary', label: 'Resumen', icon: 'fa-solid fa-chart-simple' },
  { id: 'journal', label: 'Bitacora', icon: 'fa-regular fa-clipboard' },
];

function ProjectInfoDrawer({
  isOpen,
  activeTab,
  project,
  tasks,
  materialRequests,
  items,
  journalComments,
  journalLoading,
  journalError,
  onTabChange,
  onClose,
  onCreateJournalComment,
}) {
  if (!isOpen) return null;

  return (
    <aside className="mb-3 rounded-lg border border-white/10 bg-[#0f1520] p-3">
      <div className="mb-3 flex flex-col gap-2 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded border px-3 py-1.5 text-xs transition ${
                activeTab === tab.id
                  ? 'border-cyan-300/35 bg-cyan-500/15 text-cyan-100'
                  : 'border-white/15 bg-white/5 text-white/65 hover:text-white'
              }`}
            >
              <i className={tab.icon} aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 rounded border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
          Ocultar detalles
        </button>
      </div>

      {activeTab === 'summary' ? (
        <ProjectControlPanel
          project={project}
          tasks={tasks}
          materialRequests={materialRequests}
          items={items}
        />
      ) : null}

      {activeTab === 'journal' ? (
        <ProjectJournal
          comments={journalComments}
          loading={journalLoading}
          error={journalError}
          onCreate={onCreateJournalComment}
        />
      ) : null}
    </aside>
  );
}

export default ProjectInfoDrawer;
