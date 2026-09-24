import { useEffect, useState } from 'react';
import type { Page } from '../../App';
import FeaturedResidences from '../../components/common/FeaturedResidences';

interface Props { setPage: (p: Page) => void; }

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

const IMG = {
  hero:     u('photo-1713192706971-03900dcf5706', 1920, 1080),
  north:    u('photo-1713192706955-6ef5c71811bd', 600, 760),
  south:    u('photo-1713192704825-74a0017f585d', 600, 760),
  east:     u('photo-1713192707527-13b598f4adca', 600, 760),
  west:     u('photo-1713192707656-11e779929375', 600, 760),
  central:  u('photo-1690629979559-898c1b23ae3d', 600, 760),
  classics: u('photo-1643148636639-c4f28543a5cc', 960, 640),
  rattan:   u('photo-1781232756080-c81ff43ff8f7', 600, 400),
  wicker:   u('photo-1758486561455-ebd0d3ba7423', 600, 400),
  door:     u('photo-1773846012618-0d05a562d792', 600, 400),
  modern:   u('photo-1667375186016-db03fabfc259', 960, 700),
  home1:    u('photo-1699800900071-ae073285ca02', 700, 560),
  home2:    u('photo-1629946488804-217c002178cf', 700, 560),
  villa:    u('photo-1613490493576-7fde63acd811', 1920, 1080),
  home3:    u('photo-1644057501622-dfa7dd26dbfb', 700, 560),
  home4:    u('photo-1642541070065-3912f347e7c6', 700, 560),
  cta:      u('photo-1786596552312-cd6a3e6ae24a', 1440, 600),
};

const cultures = [
  { name: 'North', desc: 'Warmth. Grandeur. Rich textures.', img: 'north' as const },
  { name: 'South', desc: 'Wood. Light. Timeless elegance.', img: 'south' as const },
  { name: 'East',  desc: 'Art. Craft. Soulful simplicity.', img: 'east' as const },
  { name: 'West',  desc: 'Colour. Character. Craftsmanship.', img: 'west' as const },
  { name: 'Central', desc: 'Raw. Earthy. Grounded.', img: 'central' as const },
];

const heroSlides = [
  { image: IMG.hero, eyebrow: 'Tradition Meets Tomorrow', title: <>We Bring<br />Timeless Culture<br />to Modern Living</>, description: <>Ancient craftsmanship. Thoughtful design.<br />Contemporary spaces.<br />Homes that carry your story forward.</> },
  { image: IMG.villa, eyebrow: 'A Royal Sense of Arrival', title: <>A Villa Where<br />Everyday Living<br />Feels Grand</>, description: <>Sun-washed verandahs. Tailored details.<br />A farmhouse spirit, finished with quiet grandeur.</> },
  { image: IMG.home3, eyebrow: 'Rooted, Not Repeated', title: <>Heritage Details.<br />A Home That<br />Feels Like Yours.</>, description: <>Indian craft, interpreted with restraint.<br />Designed for your life, not a passing trend.</> },
];

const allTrends = [
  {
    name: 'Rattan Mesh',
    tag: 'Natural Materials',
    desc: 'Light, breezy, and perennial. Rattan weave has returned to contemporary Indian homes as a material that breathes — both literally and aesthetically. From room dividers to bed frames, it brings warmth without weight.',
    img: IMG.rattan,
  },
  {
    name: 'Lime Plaster',
    tag: 'Surfaces',
    desc: "The ancient wall finish of India's havelis is being rediscovered for its texture, breathability, and quiet beauty. Lime plaster ages with character — every wall becomes a slow portrait of time and light.",
    img: IMG.wicker,
  },
  {
    name: 'Antique Doors',
    tag: 'Craft & Salvage',
    desc: 'A carved teak door from a demolished haveli finds new life as the entrance to a Bengaluru apartment. Heritage, repurposed with intention — the most storied element of any room.',
    img: IMG.door,
  },
  {
    name: 'Jaali Screens',
    tag: 'Architectural Detail',
    desc: 'The geometric lattice of traditional Indian architecture — filtering light, air, and view — has become the defining interior detail of our time. Cut in metal, carved in wood, or pressed in plaster.',
    img: u('photo-1775113895544-40f0efa4dac4', 600, 400),
  },
  {
    name: 'Athangudi Tiles',
    tag: 'Flooring',
    desc: "Hand-cast in Tamil Nadu's Chettinad region for over a century, these richly patterned floor tiles are moving from heritage homes into contemporary kitchens, bathrooms, and entryways.",
    img: u('photo-1693362335015-34a7ca00aa37', 600, 400),
  },
  {
    name: 'Hand-blocked Linen',
    tag: 'Textiles',
    desc: "Jaipur's centuries-old block-printing tradition, now translated into natural linen curtains, cushions, and bedcovers for the modern home. Each piece carries the irregularity of the human hand.",
    img: u('photo-1643785450216-2f4fb7d38fb6', 600, 400),
  },
];

const services = [
  { icon: '◇', name: 'Interior Design', desc: 'Thoughtful, functional and timeless spaces.' },
  { icon: '◎', name: 'Turnkey Execution', desc: 'From design to handover, seamlessly.' },
  { icon: '▣', name: 'Modular & Custom Furniture', desc: 'Made for your space, made for your story.' },
  { icon: '◈', name: 'Vastu-led Design', desc: 'Balance. Positive energy. Better living.' },
  { icon: '◉', name: 'Lighting & Decor', desc: 'Atmosphere that feels like home.' },
  { icon: '⬡', name: 'Space Planning', desc: 'Smarter spaces for modern lives.' },
];

const homes = [
  { name: 'The Calm Retreat', loc: '3BHK · Noida', desc: 'Modern minimalism with traditional accents.', img: 'home1' as const },
  { name: 'The Courtyard Within', loc: 'Villa · Bengaluru', desc: 'Open spaces, natural light, rooted design.', img: 'home2' as const },
  { name: 'The Modern Heirloom', loc: '3BHK · Pune', desc: 'Rattan, wood and warm contemporary living.', img: 'home3' as const },
  { name: 'The Earthy Home', loc: '2BHK · Ahmedabad', desc: 'Textured, layered, timeless.', img: 'home4' as const },
];

const faqs = [
  { question: 'Which areas does NestArcadia serve?', answer: 'NestArcadia serves Noida, Greater Noida, Greater Noida West, Delhi, Gurgaon, Faridabad and Ghaziabad for residential and commercial interior design projects.' },
  { question: 'Do you design 2BHK, 3BHK and 4BHK interiors?', answer: 'Yes. We plan and execute interiors for 2BHK, 3BHK and 4BHK apartments, as well as villas, farmhouses and commercial offices. Every project is tailored to the layout, lifestyle and budget.' },
  { question: 'What services are included in a turnkey interior project?', answer: 'A turnkey project can include space planning, 3D visualisation, material selection, modular and custom furniture, lighting, decor, site coordination and final handover.' },
  { question: 'When should I contact an interior designer?', answer: 'Ideally, contact us before possession or before any civil work begins. Early planning gives more flexibility for electrical points, storage, lighting, kitchen layout and material decisions.' },
];

export default function Home({ setPage }: Props) {
  const [trendStart, setTrendStart] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const timer = window.setInterval(() => setHeroSlide(current => (current + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  const n = allTrends.length;
  const visible = [
    allTrends[trendStart % n],
    allTrends[(trendStart + 1) % n],
    allTrends[(trendStart + 2) % n],
  ];
  const nextTrend = () => setTrendStart(s => (s + 1) % n);
  const prevTrend = () => setTrendStart(s => (s - 1 + n) % n);
  const currentHero = heroSlides[heroSlide];

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative h-screen min-h-[640px] flex items-end">
        <div className="absolute inset-0 bg-[#1C3A5A]">
          <img src={currentHero.image} alt="NestArcadia modern Indian interior design for Noida and Greater Noida homes" width="1920" height="1080" loading="eager" fetchPriority="high" decoding="async" className="w-full h-full object-cover transition-opacity duration-700" />
        </div>
        <div
          className={heroSlide === 1
            ? 'absolute inset-0 bg-gradient-to-r from-[#18100a]/80 via-[#4a3019]/45 to-[#b18a4b]/10'
            : 'absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10'}
        />

        {/* Side label */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3">
          <span className="text-white/50 text-[8px] uppercase tracking-[0.28em] [writing-mode:vertical-rl] rotate-180">
            Heritage in Every Detail
          </span>
          <span className="block w-px h-16 bg-white/20" />
          <span className="text-white/50 text-[8px] uppercase tracking-[0.28em] [writing-mode:vertical-rl] rotate-180">
            A Life for Today
          </span>
        </div>

        <div className="relative w-full pb-28 px-6 lg:px-20 max-w-[1440px] mx-auto">
          <p className="text-white/55 text-[10px] uppercase tracking-[0.32em] mb-5">{currentHero.eyebrow}</p>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.25rem)] text-white leading-[1.04] mb-7">
            {currentHero.title}
          </h1>
          <p className="text-white/65 text-[15px] leading-relaxed mb-9 max-w-[300px]">
            {currentHero.description}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => setPage('homes')}
              className="text-[14px] text-white border border-white/50 px-7 py-3 transition-all hover:bg-white hover:text-[#1A1714]"
            >
              Explore Our Homes →
            </button>
            <button
              onClick={() => setPage('story')}
              className="flex items-center gap-2.5 text-white/75 text-[14px] hover:text-white transition-colors"
            >
              <span className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-[10px]">▶</span>
              Watch Our Story
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 lg:left-20 flex items-center gap-3">
          <span className="text-white text-xs tracking-widest">{String(heroSlide + 1).padStart(2, '0')}</span>
          <span className="block w-12 h-px bg-white/25" />
          <span className="text-white/40 text-xs tracking-widest">03</span>
        </div>
      </section>

      {/* ── Rooted in Tradition ──────────────────────── */}
      <section className="py-24 lg:py-32 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E] mb-5">Every Home Has a Story</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#1A1714] leading-[1.08]">
              Rooted in Tradition.<br />Designed for You.
            </h2>
          </div>
          <div className="flex flex-col justify-between gap-8 lg:pt-8">
            <p className="text-[#6B5E4E] text-[15px] leading-[1.9]">
              We take inspiration from India's rich design heritage — its materials, crafts and ways of living — and reimagine them for modern homes. Not as replicas of the past, but as living spaces that carry its spirit forward.
            </p>
            <button
              onClick={() => setPage('story')}
              className="text-[14px] text-[#1C3A5A] border-b border-[#1C3A5A] pb-px self-start hover:text-[#2D8C7E] hover:border-[#2D8C7E] transition-colors"
            >
              Our Story →
            </button>
          </div>
        </div>
      </section>

      {/* ── Design Cultures ──────────────────────────── */}
      <section className="pb-24 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#1A1714]">Design Cultures</h2>
            <p className="text-[#6B5E4E] text-[15px] mt-1.5">Same roots. Endless possibilities.</p>
          </div>
          <button onClick={() => setPage('cultures')} className="hidden sm:block text-[14px] text-[#1A1714] hover:text-[#2D8C7E] transition-colors">
            Explore All →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {cultures.map(c => (
            <button
              key={c.name}
              onClick={() => setPage('cultures')}
              className="relative overflow-hidden group bg-[#1C3A5A]"
              style={{ aspectRatio: '3/4' }}
            >
              <img
                src={IMG[c.img]}
                alt={`${c.name} Indian interior design inspiration for Noida and Greater Noida homes`}
                loading="lazy"
                decoding="async"
                width="600"
                height="760"
                className="absolute inset-0 w-full h-full object-cover opacity-75 transition-all duration-700 group-hover:opacity-90 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 min-h-[118px] p-5 text-left flex flex-col justify-between">
                <p className="font-display text-xl text-white font-medium leading-tight">{c.name}</p>
                <p className="text-white/65 text-[13px] leading-relaxed min-h-10">{c.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Classics + Trending (Functional Carousel) ─ */}
      <section className="grid lg:grid-cols-2">
        {/* Left */}
        <div className="relative overflow-hidden bg-[#1C3A5A]" style={{ minHeight: '520px' }}>
          <img src={IMG.classics} alt="Heritage-inspired wood and craft interior design for Noida homes" loading="lazy" decoding="async" width="1200" height="800" className="absolute inset-0 w-full h-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1714]/65 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-10 lg:p-16 text-white min-h-[520px]">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight mb-4">
              The Classics<br />Reimagined
            </h2>
            <p className="text-white/65 text-[15px] leading-relaxed max-w-xs mb-8">
              From rattan mesh to jaali screens, from carved wood to natural stone — we bring back what is meaningful, with a modern sensibility.
            </p>
            <button
              onClick={() => setPage('cultures')}
              className="text-[14px] text-white border border-white/45 px-6 py-2.5 self-start transition-all hover:bg-white hover:text-[#1A1714]"
            >
              Explore Trends →
            </button>
          </div>
        </div>

        {/* Right — functional carousel */}
        <div className="bg-[#F2EDE4] p-10 lg:p-16 flex flex-col">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] text-[#1A1714] leading-tight">
                What's<br />Trending Again
              </h2>
              <p className="text-[#6B5E4E] text-[13px] mt-2">
                {trendStart + 1}–{Math.min(trendStart + 3, n)} of {n} trends
              </p>
            </div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={prevTrend}
                className="w-9 h-9 border border-[#D4CBBB] flex items-center justify-center text-sm text-[#1A1714] hover:bg-[#2D8C7E] hover:border-[#2D8C7E] hover:text-white transition-all"
                aria-label="Previous trends"
              >
                ←
              </button>
              <button
                onClick={nextTrend}
                className="w-9 h-9 border border-[#D4CBBB] flex items-center justify-center text-sm text-[#1A1714] hover:bg-[#2D8C7E] hover:border-[#2D8C7E] hover:text-white transition-all"
                aria-label="Next trends"
              >
                →
              </button>
            </div>
          </div>

          {/* 3 visible trend cards */}
          <div className="grid grid-cols-3 gap-4 flex-1">
            {visible.map((t, i) => (
              <button
                key={t.name + trendStart}
                onClick={() => setPage('cultures')}
                className="text-left group"
                style={{
                  opacity: 1,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <div className="overflow-hidden bg-[#D4CBBB] mb-3" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={t.img}
                    alt={`${t.name} interior design trend for Greater Noida West homes`}
                    loading="lazy"
                    decoding="async"
                    width="600"
                    height="450"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2D8C7E] mb-1">{t.tag}</p>
                <p className="text-[13px] font-medium text-[#1A1714] group-hover:text-[#2D8C7E] transition-colors">{t.name}</p>
                {i === 0 && (
                  <p className="text-[11px] text-[#6B5E4E] mt-1 leading-relaxed line-clamp-3">
                    {t.desc}
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5 mt-8">
            {allTrends.map((_, i) => (
              <button
                key={i}
                onClick={() => setTrendStart(i)}
                className="h-1 transition-all rounded-full"
                style={{
                  width: i === trendStart ? '24px' : '6px',
                  background: i === trendStart ? '#2D8C7E' : '#D4CBBB',
                }}
                aria-label={`Go to trend ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Services ─────────────────────────────── */}
      <section className="py-24 lg:py-28 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5 mb-14">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#1A1714]">Our Services</h2>
            <p className="text-[#6B5E4E] text-[15px] mt-1.5">
              End-to-end interior solutions, inspired by heritage, designed for modern living.
            </p>
          </div>
          <button onClick={() => setPage('services')} className="hidden sm:block text-[14px] text-[#1A1714] pt-2 hover:text-[#2D8C7E] transition-colors">
            View All Services →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-start gap-x-8 gap-y-10 lg:gap-6">
          {services.map(s => (
            <button key={s.name} onClick={() => setPage('services')} className="group flex h-full flex-col text-left">
              <div className="w-10 h-10 border border-[#D4CBBB] flex items-center justify-center text-[#2D8C7E] mb-4 transition-all group-hover:bg-[#2D8C7E] group-hover:border-[#2D8C7E] group-hover:text-white">
                <span className="text-base">{s.icon}</span>
              </div>
              <p className="min-h-12 text-[14px] font-medium text-[#1A1714] mb-1.5">{s.name}</p>
              <p className="min-h-[4.1rem] text-[13px] text-[#6B5E4E] leading-relaxed">{s.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Modern Homes. Deeper Roots. ──────────────── */}
      <section className="grid lg:grid-cols-2">
        <div className="relative overflow-hidden bg-[#1C3A5A]" style={{ minHeight: '460px' }}>
          <img src={IMG.modern} alt="Modern Indian home interior design for Noida and Greater Noida families" loading="lazy" decoding="async" width="1200" height="800" className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C3A5A]/60 to-transparent" />
          <div className="relative flex flex-col justify-end p-10 lg:p-16 text-white min-h-[460px]">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight mb-4">
              Modern Homes.<br />Deeper Roots.
            </h2>
            <p className="text-white/60 text-[15px] leading-relaxed mb-7 max-w-xs">
              We do not simply decorate the square footage you have. We rethink how every square foot works.
            </p>
            <button
              onClick={() => setPage('homes')}
              className="text-[14px] text-white border border-white/45 px-6 py-2.5 self-start transition-all hover:bg-white hover:text-[#1A1714]"
            >
              Explore a Home →
            </button>
          </div>
        </div>
        <div className="bg-[#1C3A5A] flex flex-col justify-center px-10 lg:px-16 py-16">
          {[
            'Inspired by the craft and wisdom of the past',
            "Designed for today's ways of living",
            'Personalised to the way you use your home',
            'Delivered with care, everywhere in India',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-7 py-6 border-b border-white/[0.08] last:border-b-0">
              <span className="font-display text-[#2D8C7E] text-sm shrink-0 mt-px">0{i + 1}</span>
              <p className="text-white/75 text-[15px] leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Homes ───────────────────────────── */}
      <section className="py-24 lg:py-28 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#1A1714]">Featured Homes</h2>
            <p className="text-[#6B5E4E] text-[15px] mt-1.5">Real spaces. Real people. Real stories.</p>
          </div>
          <button onClick={() => setPage('homes')} className="hidden sm:block text-[14px] text-[#1A1714] hover:text-[#2D8C7E] transition-colors">
            Explore All Homes →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {homes.map(h => (
            <button key={h.name} onClick={() => setPage('homes')} className="text-left group">
              <div className="overflow-hidden bg-[#D4CBBB] mb-4" style={{ aspectRatio: '4/3' }}>
                <img src={IMG[h.img]} alt={`NestArcadia ${h.name} ${h.loc} home interior design`} loading="lazy" decoding="async" width="800" height="600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <p className="font-display text-lg text-[#1A1714]">{h.name}</p>
              <p className="text-[13px] text-[#2D8C7E] mt-1 mb-1.5">{h.loc}</p>
              <p className="text-[13px] text-[#6B5E4E] leading-relaxed">{h.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Local expertise ─────────────────────────── */}
      <section className="px-6 lg:px-20 pb-24 lg:pb-28 max-w-[1440px] mx-auto">
        <div className="border-t border-[#D4CBBB] pt-12 grid lg:grid-cols-[0.9fr_1.4fr] gap-8 lg:gap-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E] mb-4">Designed for NCR living</p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-[#1A1714]">Interior design that understands where you live.</h2>
          </div>
          <div className="lg:pt-2">
            <p className="text-[15px] leading-[1.9] text-[#6B5E4E] mb-5">
              NestArcadia designs 2BHK, 3BHK and 4BHK interiors, villas and farmhouses across Noida, Greater Noida and Greater Noida West. We pair a practical understanding of apartment living with India’s material heritage — from efficient storage and modular kitchens to calm, characterful living spaces.
            </p>
            <p className="text-[15px] leading-[1.9] text-[#6B5E4E]">
              Our interior design and turnkey execution services also support homes and commercial spaces in Delhi, Gurgaon, Faridabad and Ghaziabad. Every project begins with the way you live and ends with a home or workplace that feels personal, functional and made to last.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQs ────────────────────────────────────── */}
      <FeaturedResidences />

      {/* ── FAQs ────────────────────────────────────── */}
      <section className="px-6 lg:px-20 pb-24 lg:pb-28 max-w-[1440px] mx-auto">
        <div className="border-t border-[#D4CBBB] pt-12 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E] mb-4">Helpful answers</p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-[#1A1714]">Questions before you begin.</h2>
          </div>
          <div className="border-t border-[#D4CBBB]">
            {faqs.map((faq, i) => (
              <div key={faq.question} className="border-b border-[#D4CBBB]">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] font-medium text-[#1A1714]"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  {faq.question}
                  <span className="text-xl font-normal text-[#2D8C7E]" aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p className="max-w-2xl pb-5 pr-10 text-[14px] leading-[1.8] text-[#6B5E4E]">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1C3A5A]" style={{ minHeight: '340px' }}>
        <img src={IMG.cta} alt="NestArcadia interior design consultation for Noida, Greater Noida and Greater Noida West homes" loading="lazy" decoding="async" width="1200" height="800" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-20 py-20 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] text-white leading-tight mb-3">
              Let's Create a Home<br />That Belongs to You
            </h2>
            <p className="text-white/55 text-[15px] mb-8">Your requirement comes first. Always.</p>
            <button
              onClick={() => setPage('project')}
              className="text-[14px] text-white border border-white/45 px-7 py-3 transition-all hover:bg-[#2D8C7E] hover:border-[#2D8C7E]"
            >
              Start Your Project →
            </button>
          </div>
          <div className="hidden lg:flex flex-col gap-4">
            {[
              'Minimal luxury — we build that',
              'Traditional Indian influence — we interpret that',
              'More storage — we solve it',
              'Compact apartment — we maximise every inch',
            ].map(f => (
              <div key={f} className="flex items-center gap-3 text-white/65 text-[15px]">
                <span className="text-[#2D8C7E]">◎</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
