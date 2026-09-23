import type { Page } from '../../App';

interface Props { setPage: (p: Page) => void; }

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

const services = [
  {
    number: '01',
    name: 'Interior Design',
    tagline: 'Thoughtful, functional and timeless spaces.',
    desc: 'We craft complete interior design solutions — from concept boards to execution drawings. Every space is designed around you: your lifestyle, your story, your way of living. We blend heritage aesthetics with contemporary comfort.',
    includes: ['Mood boards & design concept', 'Space planning & 3D visualization', 'Material & finish selection', 'Furniture layout design', 'Lighting design coordination'],
    img: u('photo-1785402231092-859d0a6c4397', 800, 600),
  },
  {
    number: '02',
    name: 'Turnkey Execution',
    tagline: 'From design to handover, seamlessly.',
    desc: "We manage the entire journey — from approved designs to move-in ready homes. Our project management team oversees every contractor, craftsman, and vendor, so you don't have to. One point of contact. Zero stress.",
    includes: ['Project timeline management', 'Contractor coordination', 'Quality control inspections', 'Progress reporting', 'Handover & after-care'],
    img: u('photo-1746439318854-4a8bc02a03ba', 800, 600),
  },
  {
    number: '03',
    name: 'Modular & Custom Furniture',
    tagline: 'Made for your space. Made for your story.',
    desc: 'We design and build bespoke furniture — from kitchen modules to statement wardrobes, from dining tables to platform beds. Every piece is made in India, with locally sourced materials and traditional craftsmanship techniques.',
    includes: ['Custom kitchen modules', 'Wardrobes & storage solutions', 'Bed frames & bedroom furniture', 'Dining & seating', 'Statement pieces & joinery'],
    img: u('photo-1682662046610-fbdb3db4bd74', 800, 600),
  },
  {
    number: '04',
    name: 'Vastu-led Design',
    tagline: 'Balance. Positive energy. Better living.',
    desc: 'We integrate Vastu Shastra principles naturally into modern home design — without compromise on aesthetics. Energy flow, directional orientation, material choices, and spatial harmony are built into every layout from the start.',
    includes: ['Vastu-compliant space planning', 'Directional analysis', 'Material & colour Vastu alignment', 'Entry & threshold design', 'Remediation for existing spaces'],
    img: u('photo-1750420556288-d0e32a6f517b', 800, 600),
  },
  {
    number: '05',
    name: 'Lighting & Decor',
    tagline: 'Atmosphere that feels like home.',
    desc: 'Lighting is the final layer that transforms a space from designed to lived-in. We curate ambient, task, and accent lighting schemes — combined with decor styling using textiles, art, plants, and handcrafted accessories.',
    includes: ['Ambient & accent lighting plans', 'Fixture sourcing & specification', 'Textile & rug curation', 'Art & wall styling', 'Plant styling & decor layering'],
    img: u('photo-1785232273548-4beae5334903', 800, 600),
  },
  {
    number: '06',
    name: 'Space Planning',
    tagline: 'Smarter spaces for modern lives.',
    desc: 'Before design comes strategy. We analyse your space for flow, function, and future needs — then create layouts that make every square foot count. Particularly powerful for compact urban homes where space is at a premium.',
    includes: ['Floor plan analysis', 'Traffic flow & zoning', 'Multi-functional layout design', 'Storage optimisation', 'Scale & proportion balancing'],
    img: u('photo-1667375185276-13b00bf723bc', 800, 600),
  },
];

const process = [
  { step: '01', title: 'Discovery Call', desc: 'We listen. Your lifestyle, your brief, your budget.' },
  { step: '02', title: 'Concept Design', desc: 'Mood boards, spatial plans, and material palette.' },
  { step: '03', title: 'Design Refinement', desc: 'We iterate until the design feels exactly right.' },
  { step: '04', title: 'Execution', desc: 'Our team builds, coordinates, and quality-checks.' },
  { step: '05', title: 'Handover', desc: 'Your home, ready to live in. Perfectly finished.' },
];

export default function Services({ setPage }: Props) {
  return (
    <div className="pt-20 lg:pt-[90px]">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-[#1C3A5A]" style={{ minHeight: '360px' }}>
        <img
          src={u('photo-1774940122986-47dc6c7c575b', 1440, 500)}
          alt="Our Services"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-20 flex flex-col justify-end min-h-[360px] pb-14">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-4">What We Do</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-white leading-[1.05]">Our Services</h1>
          <p className="text-white/60 text-sm mt-3 max-w-md">
            End-to-end interior solutions, inspired by heritage, designed for modern living.
          </p>
        </div>
      </div>

      {/* Services list */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-20">
        <div className="flex flex-col gap-0">
          {services.map((s, i) => (
            <div
              key={s.number}
              className="grid lg:grid-cols-[1fr_1.2fr] gap-0 border-b border-[#D4CBBB] py-16"
              style={{ background: i % 2 === 1 ? '#EAE4DA' : 'transparent' }}
            >
              {i % 2 === 1 && (
                <div className="relative overflow-hidden bg-[#D4CBBB] min-h-[320px] order-last lg:order-none">
                  <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              )}
              <div className={`flex flex-col justify-center px-0 ${i % 2 === 1 ? 'lg:px-16' : 'lg:pr-16'} py-4`}>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-3">{s.number}</p>
                <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] text-[#1A1714] mb-2">{s.name}</h2>
                <p className="text-[#2D8C7E] text-sm mb-5">{s.tagline}</p>
                <p className="text-[#6B5E4E] text-sm leading-[1.8] mb-7">{s.desc}</p>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-3">Includes</p>
                  <ul className="flex flex-col gap-2">
                    {s.includes.map(item => (
                      <li key={item} className="text-xs text-[#1A1714] flex items-center gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-[#2D8C7E] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {i % 2 === 0 && (
                <div className="relative overflow-hidden bg-[#D4CBBB] min-h-[320px]">
                  <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <section className="py-20 px-6 lg:px-20" style={{ background: '#EAE4DA' }}>
        <div className="max-w-[1440px] mx-auto">
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] text-[#1A1714] mb-2">How We Work</h2>
          <p className="text-[#6B5E4E] text-sm mb-12">A clear, collaborative process — from first call to final key.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {process.map(p => (
              <div key={p.step}>
                <p className="font-display text-[#2D8C7E] text-sm mb-3">{p.step}</p>
                <p className="font-medium text-[#1A1714] text-sm mb-2">{p.title}</p>
                <p className="text-xs text-[#6B5E4E] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[#1C3A5A] py-16 px-6 lg:px-20">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl text-white">Ready to start?</h3>
            <p className="text-white/55 text-sm mt-1">Let's talk about your space.</p>
          </div>
          <button
            onClick={() => setPage('project')}
            className="text-[13px] text-white border border-white/45 px-7 py-3 shrink-0 hover:bg-white hover:text-[#1A1714] transition-all"
          >
            Start Your Project →
          </button>
        </div>
      </div>
    </div>
  );
}
