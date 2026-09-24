import { useState } from 'react';
import type { Page } from '../../App';

interface Props { setPage: (p: Page) => void; }

export const faqGroups = [
  {
    label: 'Working with NestArcadia',
    items: [
      ['Which areas does NestArcadia serve?', 'NestArcadia serves Noida, Greater Noida, Greater Noida West, Noida Extension, Delhi, Gurgaon, Faridabad and Ghaziabad for residential and commercial interior design projects.'],
      ['Do you provide turnkey interior design and execution?', 'Yes. Depending on the project scope, we can manage planning, 3D visualisation, materials, custom and modular furniture, site coordination, lighting, styling and final handover.'],
      ['When should I contact an interior designer?', 'The best time is before possession or before civil work begins. Early planning gives more flexibility for electrical points, kitchen layouts, wardrobe locations, storage and lighting.'],
      ['Can I meet the team before committing to a project?', 'Yes. A project consultation helps us understand the property, your lifestyle, expected scope and the kind of design support that will be useful.'],
    ],
  },
  {
    label: 'Homes, layouts and budgets',
    items: [
      ['Do you design 2BHK, 3BHK and 4BHK interiors?', 'Yes. We design 2BHK, 3BHK and 4BHK apartments, villas and farmhouses. The brief is tailored to the layout, carpet area, household routines, storage needs and desired level of customisation.'],
      ['What affects the cost of a 2BHK or 3BHK interior in Greater Noida West?', 'The budget depends on carpet area, number of rooms, kitchen and wardrobe requirements, materials, hardware, appliances, civil changes, false ceiling, lighting and the amount of custom furniture. We scope these factors before recommending a realistic direction.'],
      ['Can you plan space-saving interiors for a compact Noida apartment?', 'Yes. Compact homes benefit from clear circulation, storage that is sized to real belongings, adaptable furniture and a material palette that keeps rooms visually calm.'],
      ['Do you work on newly handed-over apartments in Noida Extension?', 'Yes. New-possession homes are an ideal time to plan the interior because electrical, lighting, storage and finish decisions can be considered before the family moves in.'],
    ],
  },
  {
    label: 'Buying a flat, shop or new property',
    items: [
      ['I am buying a flat in Greater Noida West. When should I plan the interiors?', 'Start the interior conversation before possession, ideally while you are finalising the purchase or reviewing the builder layout. It gives you time to understand the carpet area, furniture clearances, storage needs, electrical points and modular kitchen requirements before moving in.'],
      ['What should I check in a new 2BHK or 3BHK before buying furniture?', 'Measure the usable carpet area, door swings, window positions, beam depths, kitchen wall lengths, balcony size and likely appliance locations. These checks make it easier to plan a 2BHK or 3BHK interior that feels proportionate rather than overcrowded.'],
      ['Can you help plan interiors for a newly purchased shop or commercial space?', 'Yes. For shops, studios and offices, we plan customer flow, display or work zones, storage, lighting, signage, billing or reception points and future flexibility. Commercial interior design starts with the business model, not only the look of the space.'],
      ['What should I budget for before taking possession of a new flat?', 'Keep separate allowances for the interior scope, appliances, loose furniture, window treatments, moving and contingency. The interior budget itself depends on carpet area, kitchen and wardrobe requirements, materials, hardware, false ceiling, lighting and custom work.'],
      ['Do you work with properties in Noida Extension and new high-rise societies?', 'Yes. NestArcadia works with new-possession apartments in Noida Extension, Greater Noida West, Greater Noida and Noida. We plan around the realities of high-rise living: compact layouts, society rules, lift access, handover timelines and practical storage.'],
    ],
  },
  {
    label: 'Services and design decisions',
    items: [
      ['Do you design modular kitchens separately?', 'Yes. We can design modular kitchens as a focused scope or as part of complete home interiors. The layout, work triangle, storage, material and appliance requirements are planned around how the household actually cooks.'],
      ['Can you design custom wardrobes and storage?', 'Yes. We create custom wardrobe, TV unit, utility and invisible-storage solutions sized to the room, belongings and day-to-day routines.'],
      ['Do you offer Vastu-friendly interior planning?', 'Yes. When requested, Vastu principles are considered alongside practical layout, daylight, movement, storage and the overall design language of the home.'],
      ['Do you take up commercial office interiors?', 'Yes. We support commercial office interior design for growing NCR businesses, with attention to workflow, reception, meeting areas, acoustics, storage, branding and future flexibility.'],
    ],
  },
  {
    label: 'Timelines and next steps',
    items: [
      ['How long does a complete home interior project take?', 'The timeline varies with scope, approvals, site condition, material lead times and custom work. After understanding the project, we can outline a realistic sequence for design, execution and handover.'],
      ['Can I phase my home interior work?', 'Yes. Many homeowners complete essential items first—such as the kitchen, wardrobes, lighting and core living areas—then add loose furniture, decor or secondary rooms later. The original plan should allow for that phasing.'],
      ['How do I begin an interior design project with NestArcadia?', 'Start by sharing your property type, location, possession timeline and a little about how you want to live or work in the space. We can then guide the most appropriate next step.'],
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
          <img src="https://images.unsplash.com/photo-1682418460518-848f7aa242bb?w=1440&h=420&fit=crop&auto=format&q=85" alt="Modern apartment dining area for a new-home interior planning consultation" width="1440" height="420" loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-60" />
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
          <button onClick={() => setPage('project')} className="shrink-0 border border-white/45 px-7 py-3 text-[14px] text-white transition-colors hover:border-[#2D8C7E] hover:bg-[#2D8C7E]">Start Your Project →</button>
        </div>
      </section>
    </div>
  );
}
