import { useMemo, useState } from 'react';

function CollaboratorsSelector({ users, collaborators, assignedTo, currentUserId, onChange }) {
  const [collaboratorToAdd, setCollaboratorToAdd] = useState('');

  const collaboratorUsers = useMemo(
    () => users.filter((user) => collaborators.includes(String(user._id || user.id))),
    [collaborators, users],
  );

  const availableUsersToAdd = useMemo(
    () => users.filter((user) => !collaborators.includes(String(user._id || user.id))),
    [collaborators, users],
  );

  const addCollaborator = () => {
    if (!collaboratorToAdd) return;

    const nextCollaborators = [...collaborators, collaboratorToAdd];
    onChange({
      collaborators: nextCollaborators,
      assignedTo: assignedTo || collaboratorToAdd,
    });

    setCollaboratorToAdd('');
  };

  const removeCollaborator = (userId) => {
    const nextCollaborators = collaborators.filter((collaboratorId) => collaboratorId !== userId);
    onChange({
      collaborators: nextCollaborators,
      assignedTo: assignedTo === userId ? (nextCollaborators[0] || '') : assignedTo,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          value={collaboratorToAdd}
          onChange={(event) => setCollaboratorToAdd(event.target.value)}
          className="w-full rounded border border-white/15 bg-[#0b1019] px-2 py-1.5 text-white outline-none focus:border-cyan-300/40"
        >
          <option value="">Seleccionar colaborador</option>
          {availableUsersToAdd.map((user) => {
            const id = String(user._id || user.id);
            return (
              <option key={id} value={id}>
                {user.name || user.email || id}{id === currentUserId ? ' (vos)' : ''}
              </option>
            );
          })}
        </select>

        <button
          type="button"
          onClick={addCollaborator}
          className="rounded border border-cyan-300/35 bg-cyan-500/20 px-2.5 py-1.5 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/30"
          title="Agregar colaborador"
        >
          +
        </button>
      </div>

      <div className="flex min-h-10 flex-wrap gap-1.5 rounded border border-white/10 bg-[#0b1019] p-1.5">
        {collaboratorUsers.length === 0 ? (
          <span className="text-[11px] text-white/45">Sin colaboradores</span>
        ) : (
          collaboratorUsers.map((user) => {
            const id = String(user._id || user.id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-white/80"
              >
                {user.name || user.email || id}{id === currentUserId ? ' (vos)' : ''}
                <button
                  type="button"
                  onClick={() => removeCollaborator(id)}
                  className="rounded border border-white/20 px-1 text-[10px] text-white/70 hover:text-white"
                  title="Quitar colaborador"
                >
                  x
                </button>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CollaboratorsSelector;
