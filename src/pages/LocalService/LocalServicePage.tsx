import type { Page } from '../../App';

export interface LocalServiceConfig {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  area: string;
  intro: string;
  services: string[];
  fit: string[];
  process: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ href: string; label: string }>;
}

export const localServicePages: LocalServiceConfig[] = [
  {
    path: '/interior-design-greater-noida-west',
    eyebrow: 'Greater Noida West · Interior Design',
    title: 'Interior Design in Greater Noida West, Planned for Real Homes',
    description: 'Interior design and turnkey execution for apartments, villas and new-possession homes in Greater Noida West — with practical planning for storage, kitchens, lighting and site execution.',
    area: 'Greater Noida West',
    intro: 'Greater Noida West has a distinctive interior brief: many homes are new-possession apartments, layouts are largely fixed by the builder, and homeowners need the design to solve storage, electrical planning, kitchen functionality and execution in a coordinated sequence. NestArcadia approaches the project from the plan outward, rather than starting with finishes alone.',
    services: ['2BHK, 3BHK and 4BHK apartment interior planning','Turnkey interior design and site coordination','Modular kitchens, wardrobes and custom storage','Lighting, material and finish planning','Vastu-led layout discussions when requested','Commercial office interiors for local businesses'],
    fit: ['New-possession apartments where electrical, lighting and storage decisions need to be made before execution','Families that need flexible rooms, concealed storage and practical everyday circulation','Homeowners who want a single design direction carried through drawings, materials and site work','Small commercial teams planning a client-facing office in Greater Noida West'],
    process: ['Property and brief review — understand the layout, possession status, household and scope.','Space planning — resolve circulation, storage, kitchen, furniture and major services before styling.','Design development — material palette, 3D visualisation, drawings and execution decisions.','Execution coordination — align vendors, craftsmen, site work and quality checks.','Handover — review the completed work against the agreed scope and practical use.'],
    faqs: [
      { question: 'Do you design 2BHK and 3BHK interiors in Greater Noida West?', answer: 'Yes. NestArcadia plans interiors for 2BHK, 3BHK and 4BHK apartments, with the scope shaped around the actual layout, household routines, storage needs and material choices.' },
      { question: 'Can you handle turnkey execution in Greater Noida West?', answer: 'Depending on the project scope, turnkey work can include design development, material coordination, custom and modular furniture, site coordination, lighting and final handover.' },
      { question: 'When should I contact an interior designer for a new-possession flat?', answer: 'Ideally before civil work and major service decisions begin. Early planning gives the design team more control over electrical points, kitchen planning, storage, lighting and sequencing.' },
    ],
    related: [
      { href: '/interior-design-services', label: 'Explore interior design and turnkey services' },
      { href: '/journal/buying-new-flat-interior-checklist', label: 'Read the new-flat interior checklist' },
      { href: '/journal/space-saving-interiors-noida', label: 'Read the space-saving guide for NCR apartments' },
    ],
  },
  {
    path: '/interior-design-noida-extension',
    eyebrow: 'Noida Extension · Interior Design',
    title: 'Interior Design in Noida Extension for 2BHK, 3BHK and 4BHK Homes',
    description: 'Practical residential interior design for Noida Extension apartments, from space planning and modular kitchens to custom storage, lighting and turnkey execution.',
    area: 'Noida Extension',
    intro: 'Noida Extension is largely an apartment-led market, so interior decisions have to work within real structural and service constraints. A useful design brief starts with the floor plan, not a mood board: where furniture can move, where storage can go, what the kitchen needs to hold, and which decisions must be finalised before site work begins.',
    services: ['2BHK, 3BHK and 4BHK apartment interiors','Space planning and furniture layouts','Modular kitchen and wardrobe planning','Custom storage for compact apartments','Lighting and material selection','Turnkey design-to-handover coordination'],
    fit: ['New homeowners preparing a flat for possession','Compact apartments where every storage decision affects circulation','Families combining work-from-home, guest and everyday living needs','Homeowners who want a clear scope before committing to execution'],
    process: ['Understand the property — review drawings, site conditions, household requirements and budget direction.','Plan the space — define room roles, circulation, storage and fixed-service requirements.','Develop the design — visualise the palette and document the details needed for execution.','Coordinate execution — manage the sequence of civil, electrical, ceiling, joinery and finish work.','Review handover — check the finished space for function, fit and agreed scope.'],
    faqs: [
      { question: 'Can you design a compact 2BHK in Noida Extension?', answer: 'Yes. Compact homes benefit from early space planning, especially around entry storage, kitchen workflow, wardrobes, flexible rooms and furniture scale.' },
      { question: 'Do you work with new-possession apartments?', answer: 'Yes. Early involvement can help coordinate layout, electrical, lighting, storage and material decisions before execution begins.' },
      { question: 'Do you provide only design, or execution too?', answer: 'The scope can be tailored. You can discuss focused design support or a broader turnkey process depending on the project requirements.' },
    ],
    related: [
      { href: '/interior-design-services', label: 'See the full service scope' },
      { href: '/journal/modular-kitchen-noida', label: 'Read the modular kitchen guide' },
      { href: '/journal/apartment-renovation-noida', label: 'Read the apartment renovation sequence' },
    ],
  },
  {
    path: '/commercial-interior-design-greater-noida-west',
    eyebrow: 'Greater Noida West · Commercial Interiors',
    title: 'Commercial Interior Design in Greater Noida West',
    description: 'Commercial office interior design in Greater Noida West focused on workflow, client experience, lighting, acoustics, storage and practical execution.',
    area: 'Greater Noida West',
    intro: 'A commercial interior has to work during the working day, not just during a photography session. In Greater Noida West, that can mean planning a compact office, a growing team workspace or a client-facing suite around circulation, meeting privacy, storage, lighting, acoustics and the way visitors actually move through the space.',
    services: ['Office space planning and zoning','Reception and client-facing areas','Meeting rooms and privacy planning','Workstation, storage and circulation planning','Lighting and acoustic considerations','Material coordination and execution support'],
    fit: ['Startups and professional teams moving into a new office','Growing businesses that need clearer zoning and storage','Client-facing offices where reception and meeting spaces matter','Teams looking to balance a considered brand environment with practical daily use'],
    process: ['Brief and site review — understand team size, workflow, visitors, services and constraints.','Zoning — separate arrival, focused work, collaboration, meeting and support areas.','Design development — coordinate materials, lighting, furniture, storage and visual identity.','Execution planning — resolve drawings, materials and sequence before site work begins.','Handover review — check the space against operational requirements and agreed scope.'],
    faqs: [
      { question: 'What does commercial office interior design include?', answer: 'Depending on scope, it can include space planning, reception and meeting-room design, workstation planning, storage, lighting, material selection and execution coordination.' },
      { question: 'Can you design a compact office in Greater Noida West?', answer: 'Yes. Compact offices benefit from disciplined zoning, circulation planning, multi-purpose spaces and storage that does not consume valuable work area.' },
      { question: 'Do you also handle execution?', answer: 'Execution support can be included where the project scope calls for it. The exact responsibilities, materials and handover requirements are agreed during project planning.' },
    ],
    related: [
      { href: '/interior-design-services', label: 'Explore commercial and turnkey services' },
      { href: '/journal/commercial-office-interior-greater-noida-west', label: 'Read the commercial office design guide' },
      { href: '/journal/office-reception-design-ncr', label: 'Read the office reception guide' },
    ],
  },
];

export const getLocalServicePage = (pathname: string) =>
  localServicePages.find((page) => pathname.replace(/\/+$/, '') === page.path) ?? null;

export default function LocalServicePage({ config, setPage }: { config: LocalServiceConfig; setPage: (p: Page) => void }) {
  return (
    <div className="pt-20 lg:pt-[90px]">
      <header className="bg-[#1C3A5A] px-6 lg:px-20 py-20">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/55 mb-4">{config.eyebrow}</p>
          <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.05] text-white max-w-4xl">{config.title}</h1>
          <p className="text-white/65 text-[15px] leading-[1.8] max-w-2xl mt-6">{config.description}</p>
          <a href="/start-your-project" onClick={(event) => { event.preventDefault(); setPage('project'); }} className="inline-flex mt-8 bg-white text-[#1C3A5A] px-7 py-3 text-[13px] font-semibold hover:bg-[#2D8C7E] hover:text-white transition-colors">Discuss Your Project →</a>
        </div>
      </header>
      <main>
        <section className="max-w-[1100px] mx-auto px-6 lg:px-20 py-20">
          <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-14 items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#2D8C7E] mb-4">A local design brief</p>
              <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#1A1714] leading-tight mb-6">Designed around the property, not a generic package</h2>
              <p className="text-[#52677E] text-[15px] leading-[1.9]">{config.intro}</p>
            </div>
            <div className="border border-[#D4CBBB] p-7 bg-[#EAE4DA]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6B5E4E] mb-3">Primary service area</p>
              <p className="font-display text-2xl text-[#1C3A5A]">{config.area}</p>
              <p className="text-xs text-[#6B5E4E] leading-relaxed mt-3">Projects are scoped around the property, service requirements, material choices and execution conditions rather than a fixed universal package.</p>
            </div>
          </div>
        </section>
        <section className="bg-[#EAE4DA] px-6 lg:px-20 py-20">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#1A1714] mb-10">What we can help with</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.services.map((item) => <div key={item} className="border border-[#D4CBBB] bg-[#F2EDE4] p-6 text-[14px] leading-relaxed text-[#1A1714]">{item}</div>)}
            </div>
          </div>
        </section>
        <section className="max-w-[1100px] mx-auto px-6 lg:px-20 py-20">
          <div className="grid lg:grid-cols-2 gap-14">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#2D8C7E] mb-4">Who this fits</p>
              <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] text-[#1A1714] mb-8">Useful when the details matter</h2>
              <ul className="space-y-4">{config.fit.map((item) => <li key={item} className="flex gap-3 text-[14px] leading-[1.8] text-[#52677E]"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#2D8C7E] shrink-0" />{item}</li>)}</ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#2D8C7E] mb-4">Process</p>
              <ol className="space-y-5">{config.process.map((item, index) => <li key={item} className="flex gap-4"><span className="font-display text-[#2D8C7E]">{String(index + 1).padStart(2, '0')}</span><span className="text-[14px] leading-[1.8] text-[#52677E]">{item}</span></li>)}</ol>
            </div>
          </div>
        </section>
        <section className="bg-[#1C3A5A] px-6 lg:px-20 py-16">
          <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div><h2 className="font-display text-2xl text-white">Have the property already?</h2><p className="text-white/60 text-sm mt-2">Share the layout, configuration and what you want the space to do better.</p></div>
            <a href="/start-your-project" onClick={(event) => { event.preventDefault(); setPage('project'); }} className="border border-white/40 text-white px-7 py-3 text-[13px] font-semibold hover:bg-white hover:text-[#1C3A5A] transition-colors">Share Your Project Brief →</a>
          </div>
        </section>
        <section className="max-w-[1100px] mx-auto px-6 lg:px-20 py-20">
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] text-[#1A1714] mb-8">Questions homeowners and businesses ask</h2>
          <div className="space-y-4">{config.faqs.map((faq) => <details key={faq.question} className="border-t border-[#D4CBBB] py-5"><summary className="cursor-pointer text-[15px] font-medium text-[#1A1714]">{faq.question}</summary><p className="text-[14px] leading-[1.8] text-[#52677E] mt-3 max-w-3xl">{faq.answer}</p></details>)}</div>
        </section>
        <section className="max-w-[1100px] mx-auto px-6 lg:px-20 pb-24">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#2D8C7E] mb-5">Continue exploring</p>
          <div className="grid sm:grid-cols-3 gap-4">{config.related.map((link) => <a key={link.href} href={link.href} className="border border-[#D4CBBB] p-5 text-[13px] text-[#1C3A5A] hover:border-[#2D8C7E] hover:text-[#2D8C7E] transition-colors">{link.label} →</a>)}</div>
        </section>
      </main>
    </div>
  );
}
