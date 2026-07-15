import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/dates';

function WorkloadList({ title, items, emptyTitle, getTitle, getDate, getMeta, tone = 'neutral' }) {
  return (
    <section className="border-t border-white/15 pt-3">
      <h2 className="text-sm font-semibold tracking-tight text-white">{title}</h2>

      <div className="mt-3 space-y-2">
        {items.length === 0 ? (
          <EmptyState title={emptyTitle} />
        ) : (
          items.slice(0, 6).map((item) => (
            <div key={item._id || item.id} className="border-b border-white/10 px-1 py-2.5 last:border-b-0">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 truncate text-sm font-medium text-white/85">{getTitle(item)}</p>
                <StatusBadge tone={tone}>{formatDate(getDate(item))}</StatusBadge>
              </div>
              {getMeta ? <p className="mt-1 text-xs text-white/50">{getMeta(item)}</p> : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default WorkloadList;
