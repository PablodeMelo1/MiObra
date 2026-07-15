import { Link } from 'react-router-dom';
import LandingHeader from '../components/landing/LandingHeader';
import PricingSection from '../components/landing/PricingSection';

const problems = [
  ['fa-solid fa-table-list', 'Informacion dispersa', 'Reune el seguimiento que suele quedar entre planillas, mensajes y anotaciones.'],
  ['fa-solid fa-clock', 'Decisiones tardias', 'Detecta tareas vencidas, faltantes y pedidos abiertos antes de que frenen la obra.'],
  ['fa-solid fa-people-group', 'Equipos desalineados', 'Da a cada responsable un punto comun para consultar y actualizar la operacion.'],
];

const steps = [
  ['01', 'Crea tu empresa', 'Registra la organizacion y prepara el espacio de trabajo de tu equipo.'],
  ['02', 'Carga tus obras', 'Centraliza proyectos, responsables, grupos, zonas y tareas por frente.'],
  ['03', 'Coordina recursos', 'Gestiona inventario, proveedores y solicitudes de materiales.'],
  ['04', 'Controla la operacion', 'Consulta calendario, pendientes, historial y metricas desde un unico panel.'],
];

const capabilities = [
  ['fa-solid fa-building', 'Obras y tareas', 'Organiza el trabajo por proyecto, tablero, grupos y zonas.'],
  ['fa-solid fa-boxes-stacked', 'Inventario', 'Controla existencias, movimientos y alertas de stock critico.'],
  ['fa-solid fa-truck-ramp-box', 'Materiales', 'Sigue solicitudes, estados, proveedores y fechas de llegada.'],
  ['fa-regular fa-calendar-days', 'Calendario', 'Visualiza tareas y entregas proximas para anticipar la semana.'],
  ['fa-solid fa-list-check', 'Pendientes', 'Registra asuntos operativos y asigna colaboradores responsables.'],
  ['fa-solid fa-users-gear', 'Equipos y empresas', 'Invita empleados, administra roles y cambia entre empresas.'],
];

function SectionHeading({ eyebrow, title, centered = false, children }) {
  return (
    <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
        {!centered && <span className="h-px w-8 bg-cyan-300/70" aria-hidden="true" />}
        <span>{eyebrow}</span>
      </p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">{title}</h2>
      {children}
    </div>
  );
}

function OperationsPreview() {
  const flow = [
    ['Obra', 'Organiza el proyecto y sus responsables.', 'fa-solid fa-building'],
    ['Ejecucion', 'Coordina tareas, pendientes y calendario.', 'fa-solid fa-list-check'],
    ['Recursos', 'Vincula inventario, pedidos y proveedores.', 'fa-solid fa-boxes-stacked'],
  ];

  return (
    <div className="relative border border-white/12 bg-[#0d131c] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <div className="border-b border-white/10 px-4 py-4 sm:px-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Un flujo conectado</p>
          <p className="mt-1 text-sm font-medium text-white">De la obra al control diario</p>
        </div>
      </div>
      <ol>
        {flow.map(([title, detail, icon], index) => (
          <li key={title} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-3 border-b border-white/10 px-4 py-4 last:border-b-0 sm:px-5">
            <span className="pt-0.5 text-[10px] font-semibold tabular-nums text-cyan-200">0{index + 1}</span>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-xs leading-5 text-white/50">{detail}</p>
            </div>
            <i className={`${icon} mt-1 text-sm text-cyan-200/80`} aria-hidden="true" />
          </li>
        ))}
      </ol>
      <span className="absolute -bottom-2 -right-2 -z-10 h-full w-full border border-cyan-300/15" aria-hidden="true" />
    </div>
  );
}

function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#090d13] text-white">
      <LandingHeader />
      <main>
        <section id="inicio" className="relative scroll-mt-20 overflow-hidden border-b border-white/10 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 border-l border-white/5 bg-white/[0.015] lg:block" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.78fr)] lg:gap-16">
            <div className="relative z-10">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                <span className="h-px w-8 bg-cyan-300" aria-hidden="true" />
                Gestion operativa para empresas constructoras
              </p>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[3.75rem]">
                Cada obra bajo control, desde un solo lugar.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                MiObra centraliza proyectos, tareas, materiales, inventario y equipos para que tu empresa trabaje con informacion clara y accionable.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/register" className="inline-flex min-h-11 items-center justify-center gap-3 bg-cyan-300 px-5 py-3 text-sm font-semibold text-[#071017] transition-colors hover:bg-cyan-200 active:bg-cyan-100">
                  Crear cuenta <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
                </Link>
                <a href="#como-funciona" className="inline-flex min-h-11 items-center justify-center border border-white/15 px-5 py-3 text-sm font-medium text-white/75 transition-colors hover:border-white/30 hover:text-white active:bg-white/5">
                  Ver como funciona
                </a>
              </div>
            </div>
            <OperationsPreview />
          </div>
        </section>

        <section id="que-es" className="scroll-mt-20 bg-[#0c1119] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading eyebrow="Que es MiObra" title="El centro de control para tu operacion en obra">
              <p className="mt-5 leading-7 text-white/60">Una plataforma web que conecta la planificacion diaria con los recursos, las personas y la informacion que necesita cada proyecto.</p>
            </SectionHeading>
            <div className="border-t border-white/15">
              {problems.map(([icon, title, detail], index) => (
                <article key={title} className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[3rem_0.75fr_1.25fr] sm:items-start sm:gap-5">
                  <span className="text-xs font-semibold tabular-nums text-white/30">0{index + 1}</span>
                  <h3 className="flex items-center gap-3 font-semibold text-white"><i className={`${icon} w-4 text-cyan-200`} aria-hidden="true" />{title}</h3>
                  <p className="text-sm leading-6 text-white/55">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-20 border-y border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Como funciona" title="De la configuracion al control diario" />
            <ol className="mt-12 grid border-l border-white/15 sm:grid-cols-2 sm:border-t lg:grid-cols-4 lg:border-l-0">
              {steps.map(([number, title, detail]) => (
                <li key={number} className="relative border-b border-white/10 py-6 pl-6 pr-3 sm:border-r sm:px-6 sm:py-8 lg:border-b-0">
                  <span className="absolute -left-1 top-8 h-2 w-2 bg-cyan-300 sm:-top-1 sm:left-6" aria-hidden="true" />
                  <span className="text-xs font-semibold tabular-nums text-cyan-200">{number}</span>
                  <h3 className="mt-7 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="capacidades" className="scroll-mt-20 bg-[#0c1119] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Capacidades actuales" title="Lo que tu equipo necesita para avanzar" />
            <div className="mt-10 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map(([icon, title, detail], index) => (
                <article key={title} className={`group border-b border-white/10 py-6 sm:px-6 sm:first:pl-0 lg:py-8 ${index % 2 === 0 ? 'sm:border-r' : 'sm:border-r-0'} ${index % 3 !== 2 ? 'lg:border-r' : 'lg:border-r-0'} ${index % 3 === 0 ? 'lg:pl-0' : ''}`}>
                  <i className={`${icon} text-lg text-cyan-200/90`} aria-hidden="true" />
                  <h3 className="mt-5 font-semibold text-white">{title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PricingSection />

        <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="mx-auto grid max-w-7xl gap-8 border-y border-cyan-300/25 bg-[#0c131b] px-5 py-10 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12 lg:py-12">
            <div>
              <h2 className="max-w-2xl text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">Convierte la informacion de obra en decisiones claras</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">Crea el espacio de tu empresa y empieza a ordenar proyectos, recursos y responsables.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="inline-flex min-h-11 items-center justify-center bg-cyan-300 px-5 py-3 text-sm font-semibold text-[#071017] transition-colors hover:bg-cyan-200">Crear cuenta</Link>
              <Link to="/login" className="inline-flex min-h-11 items-center justify-center border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-white/30 hover:text-white">Ya tengo una cuenta</Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p><span className="font-semibold tracking-[0.16em] text-white/80">MIOBRA</span><span className="mx-2 text-white/20">/</span>Gestion operativa para la construccion.</p>
          <div className="flex gap-5"><Link to="/login" className="transition-colors hover:text-white">Ingresar</Link><Link to="/register" className="transition-colors hover:text-white">Crear cuenta</Link></div>
        </div>
      </footer>
    </div>
  );
}

export default WelcomePage;
