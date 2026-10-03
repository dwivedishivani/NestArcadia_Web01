import { useState } from 'react';
import type { Page } from '../../App';

interface Props { setPage: (p: Page) => void; }

export const faqGroups = [
  {
    label: 'Working with NestArcadia',
    items: [
      ['Which areas does NestArcadia serve?', 'NestArcadia serves Noida, Greater Noida, Greater Noida West, Noida Extension, Delhi, Gurgaon, Faridabad and Ghaziabad for residential and commercial interior design projects.'],
      ['Do you provide turnkey interior design and execution?', 'Yes. Depending on the project, we can manage the process from planning and design through materials, site execution and final handover.'],
      ['When should I contact an interior designer?', 'Ideally, before possession or before major civil and electrical work begins. Planning early gives you more flexibility with kitchen layouts, wardrobes, storage, lighting and electrical points.'],
      ['Can I meet the team before committing to a project?', 'Yes. A consultation helps us understand the property, your requirements and the kind of design support you need before you decide on the project.'],
      ['Why do I need an interior designer for my home?', 'An interior designer brings space planning, storage, materials, lighting and execution together. Good planning can also help avoid costly changes later, especially with electrical points, furniture sizes and built-in storage.'],
      ['Why should I choose NestArcadia for my home interiors?', 'We combine interior design, space planning and execution, with the brief shaped around your home, lifestyle and budget. For homes in Noida and Greater Noida West, we also account for compact apartment layouts, new-possession homes and practical storage.'],
    ],
  },
  {
    label: 'Homes, layouts and budgets',
    items: [
      ['Do you design 2BHK, 3BHK and 4BHK interiors?', 'Yes. We work on 2BHK, 3BHK and 4BHK apartments, villas and farmhouses, with the design adapted to the layout, carpet area, storage needs and level of customisation.'],
      ['How much does a 2BHK or 3BHK interior cost in Greater Noida West?', 'For a raw or newly handed-over apartment, a complete interior project typically starts around ₹6.5–7 lakh for a 2BHK and ₹9–10 lakh for a 3BHK. If flooring, electrical or some civil work is already completed, the cost can be lower. More customised furniture, premium materials or extensive décor can increase the budget depending on the scope.'],
      ['Can you plan space-saving interiors for a compact Noida apartment?', 'Yes. We focus on practical circulation, well-planned storage and furniture that fits the actual space, so the home feels useful without feeling overcrowded.'],
      ['Do you work on newly handed-over apartments in Noida Extension?', 'Yes. New-possession homes are a good time to plan interiors because electrical, lighting, storage and finish decisions can be addressed before you move in.'],
    ],
  },
  {
    label: 'Buying a flat, shop or new property',
    items: [
      ['I am buying a flat in Greater Noida West. When should I plan the interiors?', 'It is useful to start before possession, even while you are reviewing the builder layout. This gives you time to understand furniture clearances, storage, electrical points and kitchen requirements.'],
      ['What should I check in a new 2BHK or 3BHK before buying furniture?', 'Check the usable carpet area, door and window positions, kitchen dimensions, beam depths, balcony size and likely appliance locations. These details make furniture planning much easier later.'],
      ['Can you help plan interiors for a newly purchased shop or commercial space?', 'Yes. We plan commercial spaces around how the business will actually work, including customer movement, work areas, storage, lighting, reception or billing and future flexibility.'],
      ['What should I budget for before taking possession of a new flat?', 'Keep separate allowances for interiors, appliances, loose furniture, window treatments, moving and contingency. Your interior budget will depend on the scope, materials, furniture and level of customisation.'],
      ['Do you work with properties in Noida Extension and new high-rise societies?', 'Yes. We work with new-possession apartments in Noida Extension, Greater Noida West, Greater Noida and Noida, while planning around practical high-rise considerations such as society rules, lift access and storage.'],
    ],
  },
  {
    label: 'Services and design decisions',
    items: [
      ['Do you design modular kitchens separately?', 'Yes. A modular kitchen can be a standalone project or part of a complete home interior. We plan it around the available space, appliances, storage, cooking habits and budget.'],
      ['Can you design custom wardrobes and storage?', 'Yes. We design wardrobes, TV units, utility storage and other custom solutions around the room dimensions and what actually needs to be stored.'],
      ['Do you offer Vastu-friendly interior planning?', 'Yes. If Vastu is important to you, we can consider relevant principles alongside practical layout, daylight, movement, storage and everyday functionality.'],
      ['Do you take up commercial office interiors?', 'Yes. We work on commercial spaces including offices, studios and other business environments, with attention to workflow, meeting areas, acoustics, storage, branding and future flexibility.'],
      ['What interior design styles can NestArcadia create?', 'We work across modern, contemporary, minimalist, warm-neutral, luxury and Indian-inspired directions. The final look is shaped around the architecture, lifestyle, preferences and budget rather than applying one fixed style to every home.'],
    ],
  },
  {
    label: 'Timelines and next steps',
    items: [
      ['How long does a complete home interior project take?', 'It depends on the scope, site condition, approvals, material lead times and amount of custom work. Once we understand the project, we can give you a realistic timeline for design, execution and handover.'],
      ['Can I phase my home interior work?', 'Yes. Essential work such as the kitchen, wardrobes and core lighting can be prioritised, while décor, loose furniture or secondary rooms can be added later if the original plan allows for it.'],
      ['How do I begin an interior design project with NestArcadia?', 'Share your property type, location, possession timeline and what you need from the space. We can then guide you on the right next step.'],
      ['Can you design a 2BHK interior within a specific budget?', 'Yes. We can prioritise the parts of the home that matter most to you and allocate the budget accordingly. Some elements can also be phased later if needed.'],
    ],
  },
];

export default function FAQs({ setPage }: Props) {
  const [open, setOpen] = useState<string | null>('Which areas does NestArcadia serve?');
  return (
    <div className="pt-20 lg:pt-[90px]">
      <header className="border-b border-[#D4CBBB] bg-[#F2EDE4]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16 lg:py-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E] mb-4">NestArcadia FAQs</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] text-[#1A1714]">Interior design questions, answered clearly.</h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.9] text-[#6B5E4E]">Helpful answers for homeowners and businesses in Greater Noida West, Noida Extension, Greater Noida, Noida and NCR — from apartment interiors and modular kitchens to turnkey execution and commercial spaces.</p>
        </div>
      </header>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-20 pt-10 lg:pt-14">
        <div className="relative overflow-hidden bg-[#1C3A5A] min-h-52">
          <img src="/images/site/photo-1682418460518-848f7aa242bb.jpg" alt="Modern apartment dining area for a new-home interior planning consultation" width="1440" height="420" loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C3A5A]/85 via-[#1C3A5A]/50 to-transparent" />
          <div className="relative flex min-h-52 max-w-2xl flex-col justify-center px-7 py-8 lg:px-12">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/60 mb-3">Before possession</p>
            <h2 className="font-display text-3xl leading-tight text-white">Buying a new flat or commercial space?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-white/75">Use the questions below to plan your interior before decisions become expensive to change.</p>
          </div>
        </div>
      </section>

      <main className="max-w-[1120px] mx-auto px-6 lg:px-20 py-20 lg:py-24">
        <div className="space-y-14">
          {faqGroups.map(group => (
            <section key={group.label} aria-labelledby={group.label.replace(/\s+/g, '-').toLowerCase()}>
              <h2 id={group.label.replace(/\s+/g, '-').toLowerCase()} className="font-display text-3xl text-[#1A1714] mb-6">{group.label}</h2>
              <div className="border-t border-[#D4CBBB]">
                {group.items.map(([question, answer]) => (
                  <div key={question} className="border-b border-[#D4CBBB]">
                    <button type="button" className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium text-[#1A1714]" onClick={() => setOpen(open === question ? null : question)} aria-expanded={open === question}>
                      {question}<span className="text-xl font-normal text-[#2D8C7E]" aria-hidden="true">{open === question ? '−' : '+'}</span>
                    </button>
                    {open === question && <p className="max-w-3xl pb-6 pr-10 text-[15px] leading-[1.9] text-[#6B5E4E]">{answer}</p>}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <section className="bg-[#1C3A5A] px-6 lg:px-20 py-16">
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div><h2 className="font-display text-3xl text-white">Still have a question about your space?</h2><p className="mt-2 text-[14px] text-white/65">Tell us about your home or workplace and we will guide the next step.</p></div>
          <button onClick={() => setPage('project')} className="shrink-0 border border-white/45 px-7 py-3 text-[14px] text-white transition-colors hover:border-[#2D8C7E] hover:bg-[#2D8C7E]">Get Answers for Your Home →</button>
        </div>
      </section>
    </div>
  );
}
