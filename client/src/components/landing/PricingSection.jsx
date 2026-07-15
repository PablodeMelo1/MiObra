import { Link } from 'react-router-dom';
import { SUBSCRIPTION_NOTICE, SUBSCRIPTION_PLANS } from '../../constants/subscriptionPlans';

function PricingSection() {
  return (
    <section id="planes" className="scroll-mt-20 border-t border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200"><span className="h-px w-8 bg-cyan-300/70" aria-hidden="true" />Planes propuestos</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">Una opcion para cada etapa de crecimiento</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/55 lg:justify-self-end">Empieza con la operacion esencial y amplia capacidad cuando aumenten tus obras y tu equipo.</p>
        </div>
        <div className="mt-12 grid border-t border-white/15 lg:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <article key={plan.id} className={`relative flex flex-col border-b border-white/10 px-1 py-8 sm:px-6 lg:border-r lg:px-7 lg:py-10 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0 ${plan.featured ? 'bg-white/[0.025]' : ''}`}>
              <div className="flex min-h-7 items-start justify-between gap-3">
                <p className="text-lg font-semibold text-white">{plan.name}</p>
                {plan.featured ? <span className="border border-cyan-300/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100">Recomendado</span> : null}
              </div>
              <div className="mt-6 flex items-end gap-2"><span className="pb-1 text-xs font-medium uppercase tracking-wider text-white/40">USD</span><span className="text-4xl font-semibold tracking-[-0.04em] text-white">{plan.price}</span><span className="pb-1 text-sm text-white/40">/ mes</span></div>
              <p className="mt-5 min-h-12 text-sm leading-6 text-white/55">{plan.description}</p>
              <div className="mt-6 border-y border-white/10 py-4">{plan.limits.map((limit) => <p key={limit} className="text-sm font-medium leading-6 text-cyan-100">{limit}</p>)}</div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-white/65">
                {plan.features.map((feature) => <li key={feature} className="flex gap-3"><i className="fa-solid fa-check mt-1 text-[11px] text-cyan-300" aria-hidden="true" /><span>{feature}</span></li>)}
              </ul>
              <Link to="/register" className={`mt-8 inline-flex min-h-11 items-center justify-center px-4 py-2.5 text-sm font-semibold transition-colors ${plan.featured ? 'bg-cyan-300 text-[#071017] hover:bg-cyan-200' : 'border border-white/15 text-white/80 hover:border-white/30 hover:text-white'}`}>Crear cuenta</Link>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-4xl text-xs leading-5 text-white/55">{SUBSCRIPTION_NOTICE}</p>
      </div>
    </section>
  );
}

export default PricingSection;
