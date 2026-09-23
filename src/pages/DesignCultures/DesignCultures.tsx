import type { Page } from '../../App';

interface Props { setPage: (p: Page) => void; }

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

const cultures = [
  {
    name: 'North',
    tagline: 'Warmth. Grandeur. Rich textures.',
    desc: "Northern India's design language is built on opulence and warmth — carved wood, brass accents, deep jewel tones, and heavy drapes. Spaces feel ceremonial yet welcoming, drawing from the courts of Rajasthan and the havelis of Old Delhi.",
    materials: ['Carved teak and sheesham wood', 'Brass and copper finishes', 'Jali lattice screens', 'Rich block-print textiles', 'Terracotta and sandstone floors'],
    img: u('photo-1604578762246-41134e37f9cc', 1200, 800),
    thumb: u('photo-1604578762246-41134e37f9cc', 600, 400),
    accent: '#2D8C7E',
  },
  {
    name: 'South',
    tagline: 'Wood. Light. Timeless elegance.',
    desc: 'South Indian design breathes with natural light and unadorned wood. Rosewood pillars, granite floors, and woven cane — simplicity is the luxury. Spaces are open, airy, and grounded in a deep respect for natural materials.',
    materials: ['Rosewood and teak columns', 'Granite and Athangudi tiles', 'Woven cane furniture', 'Bronze temple lamps', 'Mango wood accents'],
    img: u('photo-1746439324750-da9426ed51e7', 1200, 800),
    thumb: u('photo-1746439324750-da9426ed51e7', 600, 400),
    accent: '#2D8C7E',
  },
  {
    name: 'East',
    tagline: 'Art. Craft. Soulful simplicity.',
    desc: "Eastern India's aesthetic is rooted in artisanal craft and artistic expression. Kantha embroidery, terracotta pottery, bamboo furniture, and Madhubani murals breathe life into every surface. Design here tells a story.",
    materials: ['Bamboo and cane structures', 'Kantha-embroidered textiles', 'Terracotta pottery and tiles', 'Dokra metalwork', 'Patachitra-inspired wall art'],
    img: u('photo-1640357264948-24beb7df5216', 1200, 800),
    thumb: u('photo-1640357264948-24beb7df5216', 600, 400),
    accent: '#2D8C7E',
  },
  {
    name: 'West',
    tagline: 'Colour. Character. Craftsmanship.',
    desc: "Western India is alive with colour and craft. Mirror work, lacquer furniture, and vibrant hand-block prints create spaces that are bold yet refined. Gujarat's step-well geometry and Mumbai's Art Deco legacy sit side by side.",
    materials: ['Mirror and glass inlay (shisha)', 'Lacquered furniture', 'Block-print and bandhani textiles', 'Teak and mango wood', 'White lime plaster walls'],
    img: u('photo-1746439315937-79a9cb4c1521', 1200, 800),
    thumb: u('photo-1746439315937-79a9cb4c1521', 600, 400),
    accent: '#2D8C7E',
  },
  {
    name: 'Central',
    tagline: 'Raw. Earthy. Grounded.',
    desc: "Central India's design identity is built from the land itself — raw earth plaster, hand-carved stone, tribal textile patterns, and materials gathered from forests and rivers. It is primal, organic, and deeply rooted.",
    materials: ['Raw earth and lime plaster', 'Hand-carved stone', 'Bastar dhokra craft', 'Channapatna wooden toys as decor', 'Natural fibre weaves'],
    img: u('photo-1746173098001-2ae330a6a763', 1200, 800),
    thumb: u('photo-1746173098001-2ae330a6a763', 600, 400),
    accent: '#2D8C7E',
  },
];

const trending = [
  { name: 'Rattan Mesh', img: u('photo-1746439304975-9792af19277a', 600, 400), desc: 'Light. Breezy. Eternal.' },
  { name: 'Lime Plaster', img: u('photo-1713192707180-74d7affad614', 600, 400), desc: 'Earthy. Elegant. Modern.' },
  { name: 'Antique Doors', img: u('photo-1746812659296-69ab75a02db9', 600, 400), desc: 'A new life in modern homes.' },
];

export default function DesignCultures({ setPage }: Props) {
  return (
    <div className="pt-20 lg:pt-[90px]">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-[#1C3A5A]" style={{ minHeight: '380px' }}>
        <img
          src={u('photo-1788612994420-36d5696585ca', 1440, 500)}
          alt="Indian design cultures interpreted for modern Noida and Greater Noida homes"
          width="1440"
          height="500"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1C3A5A]/60" />
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-20 flex flex-col justify-end min-h-[380px] pb-14">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-4">India's Design Heritage</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-white leading-[1.05]">
            Design Cultures
          </h1>
          <p className="text-white/60 text-sm mt-3 max-w-md">
            Same roots. Endless possibilities. Five regions, five distinct worlds.
          </p>
        </div>
      </div>

      {/* Cultures */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        {cultures.map((c, i) => (
          <div
            key={c.name}
            className={`grid lg:grid-cols-2 gap-0 py-0 border-b border-[#D4CBBB] ${i === 0 ? 'mt-20' : ''} ${i === cultures.length - 1 ? 'mb-20' : ''}`}
          >
            {/* Image — alternates sides */}
            <div
              className={`relative overflow-hidden bg-[#D4CBBB] ${i % 2 === 1 ? 'lg:order-2' : ''}`}
              style={{ minHeight: '420px' }}
            >
              <img
                src={c.img}
                alt={`${c.name} Indian heritage interior design for Noida and Greater Noida homes`}
                loading="lazy"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <div
              className={`flex flex-col justify-center px-8 lg:px-16 py-14 ${i % 2 === 1 ? 'lg:order-1' : ''}`}
              style={{ background: i % 2 === 0 ? '#F2EDE4' : '#EAE4DA' }}
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#6B5E4E] mb-4">0{i + 1}</p>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-[#1A1714] mb-2">{c.name}</h2>
              <p className="text-[#2D8C7E] text-sm mb-6">{c.tagline}</p>
              <p className="text-[#6B5E4E] text-sm leading-[1.8] mb-8">{c.desc}</p>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-3">Signature Materials</p>
                <ul className="flex flex-col gap-1.5">
                  {c.materials.map(m => (
                    <li key={m} className="text-xs text-[#1A1714] flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#2D8C7E] rounded-full shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setPage('project')}
                className="mt-8 text-[14px] font-semibold text-[#1C3A5A] border border-[#1C3A5A] px-6 py-2.5 self-start hover:bg-[#2D8C7E] hover:border-[#2D8C7E] hover:text-white transition-all"
              >
                Design My Home in This Style →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trending section */}
      <section className="py-24 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] text-[#1A1714] mb-2">What's Trending Again</h2>
        <p className="text-[#6B5E4E] text-sm mb-10">Heritage details making a bold comeback in modern homes.</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {trending.map(t => (
            <div key={t.name} className="group cursor-default">
              <div className="overflow-hidden bg-[#D4CBBB] mb-4" style={{ aspectRatio: '16/9' }}>
                <img
                  src={t.img}
                  alt={`${t.name} detail for heritage-inspired interiors in Noida and Greater Noida`}
                  loading="lazy"
                  width="600"
                  height="400"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="font-display text-lg text-[#1A1714]">{t.name}</p>
              <p className="text-xs text-[#6B5E4E] mt-1">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <div className="bg-[#1C3A5A] py-16 px-6 lg:px-20">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl text-white">Ready to bring a culture home?</h3>
            <p className="text-white/55 text-sm mt-1">Tell us your story. We'll design around it.</p>
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
