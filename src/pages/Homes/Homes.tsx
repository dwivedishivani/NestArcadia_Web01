import { useState } from 'react';
import type { Page } from '../../App';
import FeaturedResidences from '../../components/common/FeaturedResidences';

interface Props { setPage: (p: Page) => void; }

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

const homes = [
  {
    name: 'The Calm Retreat',
    location: 'Noida, UP',
    type: '3BHK Apartment',
    area: '1,850 sq ft',
    style: 'North',
    desc: 'Modern minimalism with traditional accents. A family home where carved teak and clean plaster lines coexist in quiet harmony.',
    img: u('photo-1785845506893-70768a28ba44', 800, 620),
  },
  {
    name: 'The Courtyard Within',
    location: 'Bengaluru, KA',
    type: 'Independent Villa',
    area: '3,200 sq ft',
    style: 'South',
    desc: 'Open spaces, natural light, and a central courtyard that brings the sky inside. Rosewood, granite, and cane throughout.',
    img: u('photo-1785845506817-3a8db575a8e9', 800, 620),
  },
  {
    name: 'The Modern Heirloom',
    location: 'Pune, MH',
    type: '3BHK Apartment',
    area: '1,600 sq ft',
    style: 'West',
    desc: 'Rattan, warm wood tones, and layers of handpicked textiles. A home designed to feel like an inherited treasure.',
    img: u('photo-1735568959013-36a3bb498a61', 800, 620),
  },
  {
    name: 'The Earthy Home',
    location: 'Ahmedabad, GJ',
    type: '2BHK Apartment',
    area: '1,100 sq ft',
    style: 'West',
    desc: 'Textured, layered, timeless. Lime plaster walls, Athangudi-inspired tile floors, and locally woven textiles.',
    img: u('photo-1682662046457-74fd5b199b92', 800, 620),
  },
  {
    name: 'The Forest Dwelling',
    location: 'Dehradun, UK',
    type: 'Weekend Home',
    area: '2,400 sq ft',
    style: 'North',
    desc: 'Built in dialogue with the forest outside. Pine, stone, and earth plaster — a home that feels grown from the land.',
    img: u('photo-1667375185194-57deec7e7a00', 800, 620),
  },
  {
    name: 'The Weavers\' House',
    location: 'Hyderabad, TS',
    type: '4BHK Apartment',
    area: '2,200 sq ft',
    style: 'South',
    desc: 'A tribute to South India\'s textile heritage. Kalamkari panels, cane furniture, and hand-woven dhurrie runners.',
    img: u('photo-1645237455598-e8f02d706a4e', 800, 620),
  },
  {
    name: 'The Urban Haveli',
    location: 'Jaipur, RJ',
    type: '3BHK Penthouse',
    area: '2,800 sq ft',
    style: 'North',
    desc: 'Arched doorways, jaali screens, and hand-painted blue pottery. A Rajasthani haveli reimagined for the twenty-first century.',
    img: u('photo-1682662046426-f7589013d25e', 800, 620),
  },
  {
    name: 'The Quiet Room',
    location: 'Chennai, TN',
    type: '2BHK Apartment',
    area: '980 sq ft',
    style: 'South',
    desc: 'Spare, composed, and quietly beautiful. A home designed around stillness, with materials that improve with age.',
    img: u('photo-1633605015660-b0f2dbad3bf2', 800, 620),
  },
];

const styles = ['All Regions', 'North', 'South', 'East', 'West', 'Central'];
const types = ['All Types', '2BHK Apartment', '3BHK Apartment', '4BHK Apartment', 'Independent Villa', 'Weekend Home', '3BHK Penthouse'];

export default function Homes({ setPage }: Props) {
  const [style, setStyle] = useState('All Regions');
  const [type, setType] = useState('All Types');
  const [selected, setSelected] = useState<typeof homes[number] | null>(null);

  const filtered = homes.filter(h =>
    (style === 'All Regions' || h.style === style) &&
    (type === 'All Types' || h.type === type)
  );

  if (selected) {
    return (
      <div className="pt-[72px]">
        <div className="relative overflow-hidden bg-[#D4CBBB]" style={{ height: '60vh', minHeight: '400px' }}>
          <img src={selected.img} alt={`NestArcadia ${selected.type} interior design project in ${selected.location}`} width="800" height="620" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/50 to-transparent" />
        </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16">
          <button
            onClick={() => setSelected(null)}
            className="text-[13px] font-semibold text-[#52677E] hover:text-[#2D8C7E] transition-colors mb-10 flex items-center gap-2"
          >
            ← Back to Homes
          </button>
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-16">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#2D8C7E] mb-4">{selected.style} India · {selected.style}</p>
              <h1 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#1A1714] mb-4">{selected.name}</h1>
              <p className="text-[#6B5E4E] text-[15px] leading-[1.9] mb-8">{selected.desc}</p>
              <div className="grid grid-cols-3 gap-6 py-8 border-t border-b border-[#D4CBBB] mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-1">Location</p>
                  <p className="text-sm text-[#1A1714]">{selected.location}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-1">Type</p>
                  <p className="text-sm text-[#1A1714]">{selected.type}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-1">Area</p>
                  <p className="text-sm text-[#1A1714]">{selected.area}</p>
                </div>
              </div>
              <button
                onClick={() => setPage('project')}
                className="text-[14px] font-semibold text-white bg-[#1C3A5A] border border-[#1C3A5A] px-7 py-3 hover:bg-[#2D8C7E] hover:border-[#2D8C7E] transition-all"
              >
                Design My Home Like This →
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {[u('photo-1686569860484-b0b79f5d7959', 600, 400), u('photo-1713192707550-8748c992fc7c', 600, 400)].map((img, i) => (
                <div key={i} className="overflow-hidden bg-[#D4CBBB]" style={{ aspectRatio: '16/9' }}>
                  <img src={img} alt={`NestArcadia ${selected.type} joinery and material detail for ${selected.location}`} loading="lazy" decoding="async" width="600" height="400" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-[90px]">
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 pt-16 pb-12 border-b border-[#D4CBBB]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#6B5E4E] mb-4">Portfolio</p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-[#1A1714] leading-[1.05]">Homes</h1>
        <p className="text-[#6B5E4E] text-sm mt-3">Real spaces. Real people. Real stories.</p>
      </div>

      {/* Filters */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-6 border-b border-[#D4CBBB]">
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B5E4E] mr-1">Region</span>
            {styles.map(s => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className="text-[12px] px-3.5 py-1 border transition-all"
                style={{
                  background: style === s ? '#1A1714' : 'transparent',
                  borderColor: style === s ? '#1A1714' : '#D4CBBB',
                  color: style === s ? '#F2EDE4' : '#6B5E4E',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#6B5E4E] text-sm">No homes match this filter.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(h => (
              <button
                key={h.name}
                onClick={() => setSelected(h)}
                className="text-left group"
              >
                <div className="overflow-hidden bg-[#D4CBBB] mb-4" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={h.img}
                    alt={`NestArcadia ${h.type} interior design project in ${h.location}`}
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="620"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#2D8C7E] mb-1.5">{h.style} · {h.location}</p>
                <p className="font-display text-lg text-[#1C3A5A] group-hover:text-[#2D8C7E] transition-colors">{h.name}</p>
                <p className="text-xs text-[#6B5E4E] mt-1">{h.type} · {h.area}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <FeaturedResidences />

      {/* CTA */}
      <div className="bg-[#1C3A5A] py-16 px-6 lg:px-20">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl text-white">Want a home like this?</h3>
            <p className="text-white/55 text-sm mt-1">Let's design yours — from the ground up.</p>
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
