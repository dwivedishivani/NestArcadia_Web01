import { useState, useEffect } from 'react';
import type { Page } from '../../App';
import FeaturedResidences from '../../components/common/FeaturedResidences';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface Props { setPage: (p: Page) => void; }

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

const gallery = (ids: string[]) => ids.map((id) => u(id, 1600, 1060));

const API_BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-078be9eb`;

const fallbackHomes = [
  {
    name: 'The Calm Retreat',
    location: 'Noida, UP',
    type: '3BHK Apartment',
    area: '1,850 sq ft',
    style: 'North',
    desc: 'Modern minimalism with traditional accents. A family home where carved teak and clean plaster lines coexist in quiet harmony.',
    gallery: gallery(['photo-1663811397007-010e535ffcd7', 'photo-1663811397207-418a92396ad5', 'photo-1696413542101-2479dd479982', 'photo-1771327811795-6197403af846', 'photo-1779648596373-274e9d81ad80', 'photo-1781473377323-fff4569c1eb2', 'photo-1663811397091-9a13493eff11', 'photo-1663811396744-f86d18cdf073', 'photo-1629737273704-5c96a46f63e6', 'photo-1663811397302-8268848ca312']),
  },
  {
    name: 'The Courtyard Within',
    location: 'Bengaluru, KA',
    type: 'Independent Villa',
    area: '3,200 sq ft',
    style: 'South',
    desc: 'Open spaces, natural light, and a central courtyard that brings the sky inside. Rosewood, granite, and cane throughout.',
    gallery: gallery(['photo-1629946488804-217c002178cf', 'photo-1620918780639-e90f2a0f40c3', 'photo-1685452216112-33faaa8a0538', 'photo-1746439318854-4a8bc02a03ba', 'photo-1559723956-c735c2e961f9', 'photo-1777036400030-8561f3d3cff6', 'photo-1758448756362-e323282ccbcc', 'photo-1721989521149-fec99df443ac', 'photo-1637081774804-92fb12241a39', 'photo-1729912316618-1c902839806f']),
  },
  {
    name: 'The Modern Heirloom',
    location: 'Pune, MH',
    type: '3BHK Apartment',
    area: '1,600 sq ft',
    style: 'West',
    desc: 'Rattan, warm wood tones, and layers of handpicked textiles. A home designed to feel like an inherited treasure.',
    gallery: gallery(['photo-1760067538299-3f58e7a99fc5', 'photo-1760067537567-f3e1f8ad7ef7', 'photo-1533044309907-0fa3413da946', 'photo-1611441085337-56f4d0ea0ae2', 'photo-1690721982174-97ef3b96a4fe', 'photo-1631515998369-d2cc18780949', 'photo-1634212926265-f84991da274d', 'photo-1730204754945-9a99cb77d4c5', 'photo-1632320666787-152f630a6e10', 'photo-1617864674650-111b885860d9']),
  },
  {
    name: 'The Earthy Home',
    location: 'Ahmedabad, GJ',
    type: '2BHK Apartment',
    area: '1,100 sq ft',
    style: 'West',
    desc: 'Textured, layered, timeless. Lime plaster walls, Athangudi-inspired tile floors, and locally woven textiles.',
    gallery: gallery(['photo-1643474003514-b1e6930405a1', 'photo-1647147304392-09a98268eb29', 'photo-1769025924204-68de9588813b', 'photo-1778500236968-293eb1ebbd48', 'photo-1601831899025-d1e0dff552d9', 'photo-1712516906492-cd1d21cd967c', 'photo-1712661201196-ea0236877293', 'photo-1789230198601-38414fda2f8c', 'photo-1647962939133-7436f05ddf7d', 'photo-1636649461056-19f6297079c0']),
  },
  {
    name: 'The Forest Dwelling',
    location: 'Dehradun, UK',
    type: 'Weekend Home',
    area: '2,400 sq ft',
    style: 'North',
    desc: 'Built in dialogue with the forest outside. Pine, stone, and earth plaster — a home that feels grown from the land.',
    gallery: gallery(['photo-1575263330299-73b1f27e0110', 'photo-1695953736762-f871c5d3f154', 'photo-1640404967780-5963a0ffbe57', 'photo-1580465874672-a34623c30beb', 'photo-1619988424774-107341c0eee5', 'photo-1735453250954-8d4b89b4498c', 'photo-1629606721948-d8f85f7d4813', 'photo-1759470293373-d5ead385a2ee', 'photo-1728629840758-74b61296eb01', 'photo-1724158384889-dc9de19292d5']),
  },
  {
    name: 'The Weavers\' House',
    location: 'Hyderabad, TS',
    type: '4BHK Apartment',
    area: '2,200 sq ft',
    style: 'South',
    desc: 'A tribute to South India\'s textile heritage. Kalamkari panels, cane furniture, and hand-woven dhurrie runners.',
    gallery: gallery(['photo-1786186733520-17215e0a3263', 'photo-1702505433756-88130191bb4b', 'photo-1631649123344-15e163eda374', 'photo-1787753650891-c6e2625071df', 'photo-1650873319227-d48183f543bf', 'photo-1650873329159-53682104c8a4', 'photo-1786186733374-7c1a52e8e24d', 'photo-1776104915028-2890255cffc3', 'photo-1773155920654-abbeec2bf708', 'photo-1665004503030-70a072535f1e']),
  },
  {
    name: 'The Urban Haveli',
    location: 'Jaipur, RJ',
    type: '3BHK Penthouse',
    area: '2,800 sq ft',
    style: 'North',
    desc: 'Arched doorways, jaali screens, and hand-painted blue pottery. A Rajasthani haveli reimagined for the twenty-first century.',
    gallery: gallery(['photo-1671520429705-ca7ed374772b', 'photo-1659397946238-2d99792b3c0c', 'photo-1712516906996-dfdbca4c3ba1', 'photo-1690107751548-da27acf0b37b', 'photo-1664087333667-d594d1fe35d1', 'photo-1772621676386-d61682401d26', 'photo-1772522253201-8b7701b7d198', 'photo-1784460843355-3005dbdaa87b', 'photo-1772621676431-e0df00b4c6e4', 'photo-1601571666853-da1081ae1017']),
  },
  {
    name: 'The Quiet Room',
    location: 'Chennai, TN',
    type: '2BHK Apartment',
    area: '980 sq ft',
    style: 'South',
    desc: 'Spare, composed, and quietly beautiful. A home designed around stillness, with materials that improve with age.',
    gallery: gallery(['photo-1576665140387-1c3072468852', 'photo-1667375186583-0e90493826c2', 'photo-1682662046457-74fd5b199b92', 'photo-1750420556288-d0e32a6f517b', 'photo-1771327811766-5f4149190b3d', 'photo-1682662046610-fbdb3db4bd74', 'photo-1667375186016-db03fabfc259', 'photo-1750762285741-6e53960ad6f6', 'photo-1735383384507-9f28f923307b', 'photo-1682662046426-f7589013d25e']),
  },
];

const styles = ['All Regions', 'North', 'South', 'East', 'West', 'Central'];
const types = ['All Types', '2BHK Apartment', '3BHK Apartment', '4BHK Apartment', 'Independent Villa', 'Weekend Home', '3BHK Penthouse'];

export default function Homes({ setPage }: Props) {
  const [style, setStyle] = useState('All Regions');
  const [type, setType] = useState('All Types');
  const [homes, setHomes] = useState<typeof fallbackHomes>(fallbackHomes);
  const [selected, setSelected] = useState<typeof fallbackHomes[number] | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await fetch(`${API_BASE}/homes`, {
          headers: { apikey: publicAnonKey, Authorization: `Bearer ${publicAnonKey}` },
        });
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          const formattedHomes = data.data.map((h: any) => ({
            name: h.name,
            location: h.location,
            type: h.type,
            area: h.area,
            style: h.style,
            desc: h.description,
            gallery: h.gallery_images || [],
          }));
          setHomes(formattedHomes);
        }
      } catch (err) {
        console.log('Using fallback homes data');
      }
    };
    fetchHomes();
  }, []);

  const filtered = homes.filter((h: any) =>
    (style === 'All Regions' || h.style === style) &&
    (type === 'All Types' || h.type === type)
  );

  if (selected) {
    return (
      <div className="pt-[72px]">
        <div className="relative overflow-hidden bg-[#D4CBBB]" style={{ aspectRatio: '1600/1060', maxHeight: '70vh' }}>
          <img src={selected.gallery[activeImage]} alt={`${selected.name}, ${selected.type} interior design project in ${selected.location} — gallery image ${activeImage + 1}`} width="1600" height="1060" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/50 to-transparent" />
          <p className="absolute right-6 bottom-5 lg:right-20 text-[11px] tracking-[0.2em] text-white/80">{String(activeImage + 1).padStart(2, '0')} / {String(selected.gallery.length).padStart(2, '0')}</p>
        </div>
        <section className="border-b border-[#D4CBBB] bg-[#EAE4DA]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6B5E4E]">Project Gallery</p>
              <p className="text-[11px] text-[#2D8C7E]">Select a view</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {selected.gallery.map((img, i) => (
                <button key={img} type="button" onClick={() => setActiveImage(i)} aria-label={`View gallery image ${i + 1} of ${selected.gallery.length}`} aria-pressed={activeImage === i} className={`shrink-0 overflow-hidden bg-[#D4CBBB] transition-all ${activeImage === i ? 'ring-2 ring-[#2D8C7E] ring-offset-2 ring-offset-[#EAE4DA]' : 'opacity-75 hover:opacity-100'}`} style={{ aspectRatio: '1600/1060', width: '128px' }}>
                  <img src={img} alt="" loading="lazy" decoding="async" width="1600" height="1060" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </section>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16">
          <button
            onClick={() => setSelected(null)}
            className="text-[13px] font-semibold text-[#52677E] hover:text-[#2D8C7E] transition-colors mb-10 flex items-center gap-2"
          >
            ← Back to Homes
          </button>
          <div className="max-w-[780px]">
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
                onClick={() => { setSelected(h); setActiveImage(0); }}
                className="text-left group"
              >
                <div className="overflow-hidden bg-[#D4CBBB] mb-4" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={h.gallery[0]}
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
