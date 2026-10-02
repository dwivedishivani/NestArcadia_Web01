import type { Page } from '../../App';

export interface LocalServiceConfig {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  area: string;
  heroImage: string;
  introLabel: string;
  introTitle: string;
  intro: string;
  insights: Array<{ title: string; body: string }>;
  services: string[];
  fit: string[];
  process: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ href: string; label: string }>;
}

const image = (id: string) => `https://images.unsplash.com/${id}?w=1600&h=700&fit=crop&auto=format&q=82`;

export const localServicePages: LocalServiceConfig[] = [
  {
    path: '/interior-design-greater-noida-west',
    eyebrow: 'Greater Noida West · Interior Design',
    title: 'Interior Design in Greater Noida West, Planned for Real Homes',
    description: 'Interior design and turnkey execution for apartments, villas and new-possession homes in Greater Noida West — with practical planning for storage, kitchens, lighting and site execution.',
    area: 'Greater Noida West',
    heroImage: image('photo-1600210492486-724fe5c67fb0'),
    introLabel: 'A local design brief',
    introTitle: 'A new home deserves more than a package of finishes',
    intro: 'Greater Noida West has grown around apartment living, new possessions and fast-changing family needs. The interior brief is rarely just about how the home should look. It is about where the dining table can actually sit, how much storage a family needs, whether the kitchen works every day, and which electrical and lighting decisions should be made before the walls are finished. We start there — with the property and the people who will use it.',
    insights: [
      { title: 'New-possession planning', body: 'The best time to resolve kitchen layouts, wardrobes, lighting and electrical points is before execution gathers speed. Early planning reduces avoidable changes later.' },
      { title: 'Storage without crowding', body: 'Apartment interiors need storage, but not at the cost of circulation. We look at full-height opportunities, furniture scale and what needs to stay accessible every day.' },
      { title: 'A home that feels personal', body: 'A local interior should still feel like your home, not a model apartment. Materials, colour, furniture and details are developed around your routines and preferences.' },
    ],
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
    heroImage: image('photo-1618221195710-dd6b41faaea6'),
    introLabel: 'Designing for apartment life',
    introTitle: 'Start with the floor plan. Then make it feel like home.',
    intro: 'Noida Extension is largely an apartment-led market, which means good interiors have to respect the realities of the builder plan. A mood board can establish a direction, but it cannot tell you whether a wardrobe will steal circulation, whether the sofa is the right scale, or whether the kitchen has enough usable storage. Our design process brings those practical decisions forward, then builds the visual language around them.',
    insights: [
      { title: 'Make every square foot work', body: 'Compact rooms benefit from deliberate furniture sizes, vertical storage and clear circulation. The goal is not to fill the apartment; it is to make it easier to live in.' },
      { title: 'Design around real routines', body: 'Work-from-home, guests, children, appliances and everyday storage all compete for space. We plan the home around how your household actually moves through it.' },
      { title: 'Plan before the site gets busy', body: 'Drawings, materials, lighting and service decisions are easier to coordinate before execution starts. That creates a clearer brief for the people building the work.' },
    ],
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
    heroImage: image('photo-1497366811353-6870744d04b2'),
    introLabel: 'A commercial design brief',
    introTitle: 'An office should work on an ordinary Tuesday, not only in photographs',
    intro: 'A commercial interior has to support the working day. That means understanding how people arrive, where focused work happens, how meetings are handled, where documents and equipment live, and what a visitor experiences in the first few minutes. For offices in Greater Noida West, we balance those operational requirements with a considered visual environment rather than treating the office as a collection of decorative finishes.',
    insights: [
      { title: 'Workflow before styling', body: 'The position of reception, workstations, meeting rooms and support spaces affects the whole office. Zoning is resolved before materials and visual details take over.' },
      { title: 'Privacy and acoustics matter', body: 'A meeting room can look polished and still perform badly. Privacy, sound control, lighting and furniture placement need to be considered together.' },
      { title: 'Plan for the business you are becoming', body: 'A growing team may need more desks, storage or flexible meeting space later. Good planning leaves sensible room for change instead of locking every square foot into one use.' },
    ],
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
      <header className="relative overflow-hidden bg-[#1C3A5A] min-h-[400px] lg:min-h-[460px]">
        <img
          src={config.heroImage}
          alt=""
          aria-hidden="true"
          width="1600"
          height="700"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[#1C3A5A]/45" />
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-20 flex flex-col justify-end min-h-[400px] lg:min-h-[460px] pb-14">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/55 mb-4">{config.eyebrow}</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-white leading-[1.05] max-w-5xl">{config.title}</h1>
          <p className="text-white/65 text-sm leading-[1.8] max-w-2xl mt-4">{config.description}</p>
          <a href="/start-your-project" onClick={(event) => { event.preventDefault(); setPage('project'); }} className="inline-flex mt-7 self-start bg-white text-[#1C3A5A] px-7 py-3 text-[13px] font-semibold hover:bg-[#2D8C7E] hover:text-white transition-colors">Discuss Your Project →</a>
        </div>
      </header>

      <main>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-20 py-24 lg:py-28">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14 lg:gap-20 items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E] mb-5">{config.introLabel}</p>
              <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#1A1714] leading-[1.08]">{config.introTitle}</h2>
            </div>
            <div className="lg:pt-2">
              <p className="text-[#6B5E4E] text-[15px] leading-[1.9]">{config.intro}</p>
            </div>
          </div>
        </section>

        <section className="bg-[#EAE4DA] px-6 lg:px-20 py-20 lg:py-24">
          <div className="max-w-[1100px] mx-auto grid md:grid-cols-3 gap-10">
            {config.insights.map((item, index) => (
              <article key={item.title} className="border-t border-[#D4CBBB] pt-6">
                <p className="font-display text-[#2D8C7E] text-lg mb-3">0{index + 1}</p>
                <h2 className="font-display text-xl text-[#1A1714] leading-tight mb-3">{item.title}</h2>
                <p className="text-[13px] text-[#6B5E4E] leading-[1.8]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="max-w-[1100px] mx-auto px-6 lg:px-20 py-24">
          <h2 className="font-display text-[clamp(1.9rem,3.5vw,2.8rem)] text-[#1A1714] mb-10">What we can help with</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.services.map((item) => <div key={item} className="border border-[#D4CBBB] bg-[#F2EDE4] p-6 text-[14px] leading-relaxed text-[#1A1714]">{item}</div>)}
          </div>
        </section>

        <section className="bg-[#EAE4DA] px-6 lg:px-20 py-24">
          <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#2D8C7E] mb-4">Who this fits</p>
              <h2 className="font-display text-[clamp(1.9rem,3vw,2.5rem)] text-[#1A1714] mb-8">Useful when the details matter</h2>
              <ul className="space-y-4">
                {config.fit.map((item) => <li key={item} className="flex gap-3 text-[14px] leading-[1.8] text-[#52677E]"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#2D8C7E] shrink-0" />{item}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#2D8C7E] mb-4">Our process</p>
              <h2 className="font-display text-[clamp(1.9rem,3vw,2.5rem)] text-[#1A1714] mb-8">From first brief to a usable space</h2>
              <ol className="space-y-5">
                {config.process.map((item, index) => <li key={item} className="flex gap-4"><span className="font-display text-[#2D8C7E]">{String(index + 1).padStart(2, '0')}</span><span className="text-[14px] leading-[1.8] text-[#52677E]">{item}</span></li>)}
              </ol>
            </div>
          </div>
        </section>

        <section className="bg-[#1C3A5A] px-6 lg:px-20 py-16">
          <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div><h2 className="font-display text-2xl text-white">Have the property already?</h2><p className="text-white/60 text-sm mt-2">Share the layout, configuration and what you want the space to do better.</p></div>
            <a href="/start-your-project" onClick={(event) => { event.preventDefault(); setPage('project'); }} className="border border-white/40 text-white px-7 py-3 text-[13px] font-semibold hover:bg-white hover:text-[#1C3A5A] transition-colors">Share Your Project Brief →</a>
          </div>
        </section>

        <section className="max-w-[1100px] mx-auto px-6 lg:px-20 py-24">
          <h2 className="font-display text-[clamp(1.9rem,3vw,2.5rem)] text-[#1A1714] mb-8">Questions homeowners and businesses ask</h2>
          <div className="space-y-4">
            {config.faqs.map((faq) => <details key={faq.question} className="border-t border-[#D4CBBB] py-5"><summary className="cursor-pointer text-[15px] font-medium text-[#1A1714]">{faq.question}</summary><p className="text-[14px] leading-[1.8] text-[#52677E] mt-3 max-w-3xl">{faq.answer}</p></details>)}
          </div>
        </section>

        <section className="max-w-[1100px] mx-auto px-6 lg:px-20 pb-24">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#2D8C7E] mb-5">Continue exploring</p>
          <div className="grid sm:grid-cols-3 gap-4">{config.related.map((link) => <a key={link.href} href={link.href} className="border border-[#D4CBBB] p-5 text-[13px] text-[#1C3A5A] hover:border-[#2D8C7E] hover:text-[#2D8C7E] transition-colors">{link.label} →</a>)}</div>
        </section>
      </main>
    </div>
  );
}
