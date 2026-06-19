import { useState } from 'react';
import EmptyState from '../common/EmptyState';
import { formatDateTime } from '../../utils/dates';

function getAuthor(comment) {
  return comment.userId?.name || comment.userId?.email || 'Usuario';
}

function ProjectJournal({ comments, loading, error, onCreate }) {
  const [value, setValue] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    const cleanValue = value.trim();
    if (!cleanValue) return;
    await onCreate(cleanValue);
    setValue('');
  };

  return (
    <section className="rounded-lg border border-white/10 bg-[#111723] p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Bitacora de obra</h2>
          <p className="mt-1 text-xs text-white/50">Avances, problemas, decisiones y links a documentos o fotos.</p>
        </div>
        <i className="fa-regular fa-clipboard text-white/45" aria-hidden="true" />
      </div>

      <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={submit}>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={2}
          placeholder="Registrar avance, problema, decision o enlace..."
          className="min-h-16 flex-1 resize-none rounded border border-white/15 bg-[#0d1119] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/35"
        />
        <button
          type="submit"
          disabled={!value.trim() || loading}
          className="inline-flex items-center justify-center gap-2 rounded border border-cyan-300/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <i className="fa-solid fa-plus" aria-hidden="true" />
          Agregar
        </button>
      </form>

      {error ? <p className="mt-2 text-xs text-rose-200">{error}</p> : null}

      <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <EmptyState title="Todavia no hay registros de bitacora." detail="Usala para dejar contexto diario de la obra." />
        ) : (
          comments.map((comment) => (
            <article key={comment._id || comment.id} className="rounded border border-white/10 bg-[#0d1119] p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-white/75">{getAuthor(comment)}</p>
                <time className="text-[11px] text-white/40">{formatDateTime(comment.createdAt)}</time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-white/80">{comment.comment}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default ProjectJournal;
