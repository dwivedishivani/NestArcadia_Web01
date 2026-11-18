import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Page } from '../../App';
import { resolveSiteImage, resolveSiteImageSrcSet } from '../../utils/siteImages';
import FeaturedResidences from '../../components/common/FeaturedResidences';

interface Props { setPage: (p: Page) => void; }

const homeDirectImageUrls: Record<string, string> = {
  'photo-1713192706971-03900dcf5706': import.meta.env.PROD ? '/images/home-hero-optimized-v2.webp' : 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-hero-carousel-hero-hero-carousel-photo-1-20261006220649229.webp',
  'photo-1613490493576-7fde63acd811': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-hero-carousel-hero-hero-carousel-photo-2-20261006220651654.webp',
  'photo-1644057501622-dfa7dd26dbfb': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-hero-carousel-hero-hero-carousel-photo-3-20261006220654107.webp',
  'photo-1604578762246-41134e37f9cc': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/designcultures/designcultures-srcpagesdesignculturesdesignculturestsx-designcultures-designcultures-image-22-20261006220546641.webp',
  'photo-1713192704825-74a0017f585d': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-4-20261006220635091.webp',
  'photo-1640357264948-24beb7df5216': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/designcultures/designcultures-srcpagesdesignculturesdesignculturestsx-designcultures-designcultures-image-24-20261006220548018.webp',
  'photo-1746439315937-79a9cb4c1521': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/designcultures/designcultures-srcpagesdesignculturesdesignculturestsx-designcultures-designcultures-image-25-20261006220550703.webp',
  'photo-1746173098001-2ae330a6a763': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/designcultures/designcultures-srcpagesdesignculturesdesignculturestsx-designcultures-designcultures-image-26-20261006220553243.webp',
  'photo-1643148636639-c4f28543a5cc': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-8-20261006220644041.webp',
  'photo-1781232756080-c81ff43ff8f7': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-9-20261006220646986.webp',
  'photo-1758486561455-ebd0d3ba7423': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-10-20261006220607705.webp',
  'photo-1773846012618-0d05a562d792': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-11-20261006220611025.webp',
  'photo-1667375186016-db03fabfc259': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-12-20261006220613000.webp',
  'photo-1699800900071-ae073285ca02': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-13-20261006220614671.webp',
  'photo-1629946488804-217c002178cf': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-14-20261006220616254.webp',
  'photo-1642541070065-3912f347e7c6': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-17-20261006220617522.webp',
  'photo-1786596552312-cd6a3e6ae24a': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-18-20261006220620742.webp',
  'photo-1775113895544-40f0efa4dac4': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-19-20261006220622580.webp',
  'photo-1693362335015-34a7ca00aa37': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-20-20261006220627040.webp',
  'photo-1643785450216-2f4fb7d38fb6': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-srcpageshomehometsx-home-home-image-21-20261006220629000.webp',
};

const u = (id: string, _w: number, _h: number) => import.meta.env.PROD
  ? resolveSiteImage(id, _w)
  : homeDirectImageUrls[id] || resolveSiteImage(id, _w);

const homeImageKeysByUrl = Object.fromEntries(Object.entries(homeDirectImageUrls).map(([key, url]) => [url, key]));
const directImageKey = (url: string) => homeImageKeysByUrl[url]
  || url.match(/photo-\d+-[a-z0-9]+/i)?.[0];

const imageSrcSet = (url: string) => {
  const key = directImageKey(url);
  return key ? resolveSiteImageSrcSet(key) : undefined;
};

const heroDirectUrls: Record<string, string> = {
  'photo-1713192706971-03900dcf5706': 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-hero-carousel-hero-hero-carousel-photo-1-20261006220649229.webp',
  'photo-1613490493576-7fde63acd811': homeDirectImageUrls['photo-1613490493576-7fde63acd811'],
  'photo-1644057501622-dfa7dd26dbfb': homeDirectImageUrls['photo-1644057501622-dfa7dd26dbfb'],
};

const IMG = {
  hero:     u('photo-1713192706971-03900dcf5706', 1920, 1080),
  north:    u('photo-1604578762246-41134e37f9cc', 600, 760),
  south:    u('photo-1713192704825-74a0017f585d', 600, 760),
  east:     u('photo-1640357264948-24beb7df5216', 600, 760),
  west:     u('photo-1746439315937-79a9cb4c1521', 600, 760),
  central:  u('photo-1746173098001-2ae330a6a763', 600, 760),
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
  { image: heroDirectUrls['photo-1713192706971-03900dcf5706'], imageId: 'photo-1713192706971-03900dcf5706', eyebrow: 'Tradition Meets Tomorrow', title: <>We Bring<br />Timeless Culture<br />to Modern Living</>, description: <>Ancient craftsmanship. Thoughtful design.<br />Contemporary spaces.<br />Homes that carry your story forward.</> },
  { image: heroDirectUrls['photo-1613490493576-7fde63acd811'], imageId: 'photo-1613490493576-7fde63acd811', eyebrow: 'A Royal Sense of Arrival', title: <>A Villa Where<br />Everyday Living<br />Feels Grand</>, description: <>Sun-washed verandahs. Tailored details.<br />A farmhouse spirit, finished with quiet grandeur.</> },
  { image: heroDirectUrls['photo-1644057501622-dfa7dd26dbfb'], imageId: 'photo-1644057501622-dfa7dd26dbfb', eyebrow: 'Rooted, Not Repeated', title: <>Heritage Details.<br />A Home That<br />Feels Like Yours.</>, description: <>Indian craft, interpreted with restraint.<br />Designed for your life, not a passing trend.</> },
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
  { num: '01', icon: '◇', name: 'Interior Design', desc: 'Thoughtful, functional and timeless spaces — from concept to material board.' },
  { num: '02', icon: '◎', name: 'Turnkey Execution', desc: 'From design to handover, seamlessly managed.' },
  { num: '03', icon: '▣', name: 'Modular & Custom Furniture', desc: 'Made for your space, made for your story.' },
  { num: '04', icon: '◈', name: 'Vastu-led Design', desc: 'Balance. Positive energy. Better living.' },
  { num: '05', icon: '◉', name: 'Lighting & Decor', desc: 'Atmosphere and mood that feels like home.' },
  { num: '06', icon: '⬡', name: 'Space Planning', desc: 'Smarter layouts for modern Indian lives.' },
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
  const [heroImageFallback, setHeroImageFallback] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const bootloader = document.getElementById('app-bootloader');
    if (!bootloader) return;
    const heroImage = document.querySelector<HTMLImageElement>(
      'main img[data-site-image-key="photo-1713192706971-03900dcf5706"]'
    );
    if (!heroImage) { bootloader.remove(); return; }
    let fallbackTimer: number | undefined;
    const removeBootloader = () => {
      bootloader.remove();
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      heroImage.removeEventListener('load', removeBootloader);
    };
    if (heroImage.complete && heroImage.naturalWidth > 0) { bootloader.remove(); return; }
    heroImage.addEventListener('load', removeBootloader, { once: true });
    fallbackTimer = window.setTimeout(removeBootloader, 2500);
    return () => {
      heroImage.removeEventListener('load', removeBootloader);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileViewport = window.matchMedia('(max-width: 767px)');
    let timer: number | undefined;
    const stop = () => { if (timer !== undefined) window.clearInterval(timer); timer = undefined; };
    const start = () => {
      stop();
      if (document.hidden || reducedMotion.matches || mobileViewport.matches) return;
      timer = window.setInterval(() => {
        if (!document.hidden) setHeroSlide(current => (current + 1) % heroSlides.length);
      }, 6500);
    };
    const onMotionChange = () => start();
    start();
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener?.('change', onMotionChange);
    mobileViewport.addEventListener?.('change', onMotionChange);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', start);
      reducedMotion.removeEventListener?.('change', onMotionChange);
      mobileViewport.removeEventListener?.('change', onMotionChange);
    };
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

  useEffect(() => { setHeroImageFallback(false); }, [heroSlide]);

  return (
    <div>
      {/* ── Hero ──────────────────────── */}
      <section className="relative h-screen min-h-[640px] flex items-end">
        <div className="absolute inset-0 bg-[#1C3A5A]">
          <picture className="absolute inset-0 block">
            {currentHero.imageId === 'photo-1713192706971-03900dcf5706' && import.meta.env.PROD && (
              <>
                <source data-site-image-optimized="true" media="(max-width: 767px)" srcSet="/images/home-hero-mobile-v2.webp" type="image/webp" />
                <source data-site-image-optimized="true" media="(min-width: 768px)" srcSet="/images/home-hero-optimized-v2.webp" type="image/webp" />
              </>
            )}
            <img
              src={heroImageFallback
                ? heroDirectUrls[currentHero.imageId]
                : (import.meta.env.PROD && currentHero.imageId === 'photo-1713192706971-03900dcf5706'
                  ? '/images/home-hero-optimized-v2.webp'
                  : currentHero.image)}
              data-site-image-key={currentHero.imageId}
              srcSet={currentHero.imageId === 'photo-1713192706971-03900dcf5706' ? undefined : resolveSiteImageSrcSet(currentHero.imageId)}
              sizes="100vw"
              data-site-image-optimized-source-url={currentHero.imageId === 'photo-1713192706971-03900dcf5706' ? 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/home/home-hero-carousel-hero-hero-carousel-photo-1-20261006220649229.webp' : undefined}
              alt="NestArcadia heritage-inspired modern Indian home interior design for Noida Extension and Greater Noida West"
              width="1920"
              height="1080"
              loading="eager"
              fetchPriority={heroSlide === 0 ? 'high' : 'auto'}
              decoding="async"
              onError={(event) => {
                event.currentTarget.removeAttribute('srcset');
                event.currentTarget.closest('picture')?.querySelectorAll('source[data-site-image-optimized="true"]')
                  .forEach((source) => source.remove());
                setHeroImageFallback(true);
              }}
              className={heroSlide === 0 ? "w-full h-full object-cover transition-none" : "w-full h-full object-cover transition-opacity duration-700"}
            />
          </picture>
        </div>
        <div
          className={heroSlide === 1
            ? 'absolute inset-0 bg-gradient-to-r from-[#18100a]/85 via-[#4a3019]/50 to-[#b18a4b]/10'
            : 'absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10'}
        />

        {/* Vertical label */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3">
          <span className="text-white/40 text-[8px] uppercase tracking-[0.28em] [writing-mode:vertical-rl] rotate-180">Heritage in Every Detail</span>
          <span className="block w-px h-16 bg-white/15" />
          <span className="text-white/40 text-[8px] uppercase tracking-[0.28em] [writing-mode:vertical-rl] rotate-180">A Life for Today</span>
        </div>

        <div className="relative w-full pb-28 px-6 lg:px-20 max-w-[1440px] mx-auto">
          <p className="text-white/70 text-[10px] uppercase tracking-[0.35em] mb-5">{currentHero.eyebrow}</p>
          <h1 className="font-display text-[clamp(2.35rem,6.5vw,4.9rem)] text-white leading-[1.04] mb-7">
            Interior Designers in<br />Noida Extension &amp;<br className="hidden sm:block" /> Greater Noida West
          </h1>
          <p className="text-white/60 text-[15px] leading-relaxed mb-10 max-w-[300px]">
            {currentHero.description}
          </p>
          {/* CTA row — primary is teal-filled for maximum contrast against the dark hero */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setPage('project')}
              className="min-h-12 text-[14px] font-semibold text-white bg-[#17665B] px-7 py-3 border border-[#17665B] transition-colors hover:bg-[#0f4f46] hover:border-[#0f4f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Plan Your Interior →
            </button>
            <button
              onClick={() => setPage('homes')}
              className="min-h-12 text-[14px] text-white border border-white/50 px-7 py-3 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Explore Design Concepts
            </button>
          </div>
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-20 sm:bottom-8 left-6 lg:left-20 flex items-center gap-3">
          <span className="text-white text-xs tracking-widest">{String(heroSlide + 1).padStart(2, '0')}</span>
          <span className="block w-12 h-px bg-white/20" />
          <span className="text-white/35 text-xs tracking-widest">03</span>
        </div>
      </section>

      {/* ── Trust strip ────────────────── */}
      <section className="bg-[#1C3A5A] border-b border-[#17665B]/30">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-5 grid grid-cols-3 divide-x divide-white/10">
          {[
            { value: '50+', label: 'Projects Delivered', accent: '#17665B' },
            { value: 'NCR', label: 'Noida, Greater Noida & Beyond', accent: '#B2552E' },
            { value: '5★', label: 'Client-Rated Design', accent: '#17665B' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center px-4 text-center">
              <span className="font-display text-[clamp(1.1rem,2.5vw,1.5rem)] text-white leading-none">{stat.value}</span>
              <span className="w-5 h-px my-1.5" style={{ background: stat.accent }} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rooted in Tradition ───────────── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image side */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', maxHeight: '540px' }}>
              <img
                src={IMG.north}
                data-site-image-key={directImageKey(IMG.north)}
                srcSet={imageSrcSet(IMG.north)}
                sizes="(max-width: 1023px) 90vw, 45vw"
                alt="Traditional Indian interior craftsmanship — warmth, texture and heritage in a modern home"
                loading="lazy" fetchPriority="low" decoding="async"
                width="600" height="760"
                className="w-full h-full object-cover"
              />
              {/* Floating mark — a service-area tag, not another repeated stat */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-3 shadow-lg flex items-center gap-3">
                <span className="rule-gold" style={{ width: '1.4rem' }} />
                <div>
                  <p className="font-display italic text-[#1C3A5A] text-base leading-tight">Noida &amp; NCR</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#6B5E4E]">Design-led interiors</p>
                </div>
              </div>
            </div>
            {/* Text side */}
            <div className="flex flex-col gap-7">
              <div>
                <p className="label-editorial text-[#B2552E] mb-4">Every home has a story</p>
                <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#1A1714] leading-[1.08]">
                  Rooted in Tradition.<br />Designed for You.
                </h2>
              </div>
              <p className="text-[#6B5E4E] text-[15px] leading-[1.9]">
                We take inspiration from India's rich design heritage — its materials, crafts and ways of living — and reimagine them for modern homes. Not as replicas of the past, but as living spaces that carry its spirit forward.
              </p>
              <div className="grid grid-cols-2 gap-5 py-6 border-t border-b border-[#D4CBBB]">
                {[
                  { h: 'Indian Craft', b: 'Materials, textures and techniques rooted in tradition.' },
                  { h: 'Modern Living', b: 'Layouts and solutions built for how you live today.' },
                ].map(item => (
                  <div key={item.h}>
                    <div className="w-6 h-0.5 bg-[#17665B] mb-3" />
                    <p className="text-[13px] font-semibold text-[#1A1714] mb-1">{item.h}</p>
                    <p className="text-[12px] text-[#6B5E4E] leading-relaxed">{item.b}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setPage('story')}
                className="text-[14px] font-semibold text-[#1C3A5A] border-b border-[#1C3A5A] pb-px self-start hover:text-[#17665B] hover:border-[#17665B] transition-colors"
              >
                Our Story →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Design Cultures ─────────────── */}
      <section className="pb-24 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="label-track text-[#6B5E4E] mb-3">Five regions, one design language</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#1A1714]">Design Cultures</h2>
          </div>
          <button onClick={() => setPage('cultures')} className="hidden sm:block text-[14px] text-[#1A1714] hover:text-[#17665B] transition-colors">
            Explore All →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {cultures.map((c, i) => {
            const accent = i % 2 === 0 ? '#17665B' : '#B2552E';
            return (
              <button
                key={c.name}
                onClick={() => setPage('cultures')}
                className="relative overflow-hidden group bg-[#1C3A5A]"
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={IMG[c.img]}
                  data-site-image-key={directImageKey(IMG[c.img])}
                  srcSet={imageSrcSet(IMG[c.img])}
                  sizes="(max-width: 639px) 48vw, (max-width: 1023px) 32vw, 19vw"
                  alt={`${c.name} Indian interior design inspiration — ${c.desc}`}
                  loading="lazy" fetchPriority="low"
                  decoding="async"
                  width="600"
                  height="760"
                  className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-700 group-hover:opacity-90 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                {/* Hover shine strip — alternates teal / terracotta instead of one flat colour across all five */}
                <div
                  className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: accent }}
                />
                <div className="absolute bottom-0 left-0 right-0 min-h-[118px] p-5 text-left flex flex-col justify-between">
                  <p className="font-display text-xl text-white font-medium leading-tight">{c.name}</p>
                  <p className="text-white/60 text-[13px] leading-relaxed min-h-10">{c.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Classics + Trending ───────────── */}
      <section className="grid lg:grid-cols-2">
        {/* Left */}
        <div className="relative overflow-hidden bg-[#1C3A5A]" style={{ minHeight: '520px' }}>
          <img src={IMG.classics} data-site-image-key={directImageKey(IMG.classics)} srcSet={imageSrcSet(IMG.classics)} sizes="(max-width: 1023px) 100vw, 50vw" alt="Heritage-inspired Indian woodwork, natural materials and craft details in a contemporary interior" loading="lazy" fetchPriority="low" decoding="async" width="1200" height="800" className="absolute inset-0 w-full h-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1714]/70 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-10 lg:p-16 text-white min-h-[520px]">
            <p className="label-editorial text-[#d9a978] mb-4">Timeless, and current</p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight mb-4">
              The Classics<br />Reimagined
            </h2>
            <p className="text-white/60 text-[15px] leading-relaxed max-w-xs mb-8">
              From rattan mesh to jaali screens, from carved wood to natural stone — we bring back what is meaningful, with a modern sensibility.
            </p>
            <button
              onClick={() => setPage('cultures')}
              className="text-[14px] font-semibold text-white bg-[#17665B] border border-[#17665B] px-6 py-3 self-start transition-all hover:bg-[#0f4f46] hover:border-[#0f4f46]"
            >
              Explore Trends →
            </button>
          </div>
        </div>

        {/* Right — carousel */}
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
                className="min-h-11 min-w-11 border border-[#D4CBBB] flex items-center justify-center text-sm text-[#1A1714] hover:bg-[#17665B] hover:border-[#17665B] hover:text-white transition-all"
                aria-label="Previous trends"
              >
                ←
              </button>
              <button
                onClick={nextTrend}
                className="min-h-11 min-w-11 border border-[#D4CBBB] flex items-center justify-center text-sm text-[#1A1714] hover:bg-[#17665B] hover:border-[#17665B] hover:text-white transition-all"
                aria-label="Next trends"
              >
                →
              </button>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0">
            {visible.map((t, i) => (
              <button
                key={t.name + trendStart}
                onClick={() => setPage('cultures')}
                className="min-w-[78%] snap-start text-left group sm:min-w-0"
              >
                <div className="overflow-hidden bg-[#D4CBBB] mb-3" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={t.img}
                    data-site-image-key={directImageKey(t.img)}
                    srcSet={imageSrcSet(t.img)}
                    sizes="(max-width: 639px) 78vw, (max-width: 1023px) 33vw, 18vw"
                    alt={`${t.name}: ${t.tag} interior design inspiration`}
                    loading="lazy" fetchPriority="low"
                    decoding="async"
                    width="600"
                    height="450"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#17665B] mb-1">{t.tag}</p>
                <p className="text-[13px] font-medium text-[#1A1714] group-hover:text-[#17665B] transition-colors">{t.name}</p>
                {i === 0 && (
                  <p className="text-[11px] text-[#6B5E4E] mt-1 leading-relaxed line-clamp-3">
                    {t.desc}
                  </p>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 mt-8">
            {allTrends.map((_, i) => (
              <button
                key={i}
                onClick={() => setTrendStart(i)}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-offset-0"
                aria-label={`Go to trend ${i + 1}`}
                aria-current={i === trendStart ? 'true' : undefined}
              >
                <span
                  aria-hidden="true"
                  className="block rounded-full transition-all"
                  style={{
                    width: i === trendStart ? '24px' : '6px',
                    height: '4px',
                    background: i === trendStart ? '#17665B' : '#8A7B69',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Services ────────────────── */}
      <section className="py-24 lg:py-28 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5 mb-14">
          <div>
            <p className="label-track text-[#17665B] mb-3">What we do</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#1A1714]">Our Services</h2>
            <p className="text-[#6B5E4E] text-[15px] mt-1.5">
              End-to-end interior solutions, inspired by heritage, designed for modern living.
            </p>
          </div>
          <button onClick={() => setPage('services')} className="hidden sm:block text-[14px] text-[#1A1714] pt-2 hover:text-[#17665B] transition-colors">
            View All Services →
          </button>
        </div>
        {/* 2×3 grid gives each card more room to breathe. Icon tiles alternate
            teal / terracotta on hover instead of one flat colour for all six. */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((s, i) => {
            const variant = i % 2 === 0 ? 'service-tile--teal' : 'service-tile--clay';
            const accent = i % 2 === 0 ? '#17665B' : '#B2552E';
            return (
              <button
                key={s.name}
                onClick={() => setPage('services')}
                className={`group relative text-left border border-transparent hover:border-[#D4CBBB] transition-colors p-6 -m-6 rounded-sm ${variant}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="service-tile-icon w-12 h-12 border border-[#D4CBBB] flex items-center justify-center transition-all">
                    <span className="text-lg">{s.icon}</span>
                  </div>
                  <span className="service-tile-num font-display text-[#D4CBBB] text-sm transition-colors">{s.num}</span>
                </div>
                <p className="text-[14px] font-semibold text-[#1A1714] mb-2">{s.name}</p>
                <p className="text-[13px] text-[#6B5E4E] leading-relaxed">{s.desc}</p>
                {/* Accent underline reveals on hover, matching the alternating accent colour */}
                <span
                  className="absolute left-6 right-6 bottom-6 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ background: accent }}
                />
              </button>
            );
          })}
        </div>
        <div className="mt-10 sm:hidden">
          <button onClick={() => setPage('services')} className="text-[14px] text-[#1A1714] hover:text-[#17665B] transition-colors">View All Services →</button>
        </div>
      </section>

      {/* ── Modern Homes. Deeper Roots. ─────────── */}
      <section className="grid lg:grid-cols-2">
        <div className="relative overflow-hidden bg-[#1C3A5A]" style={{ minHeight: '480px' }}>
          <img src={IMG.modern} data-site-image-key={directImageKey(IMG.modern)} srcSet={imageSrcSet(IMG.modern)} sizes="(max-width: 1023px) 100vw, 50vw" alt="Modern Indian home interior design for Noida and Greater Noida families" loading="lazy" fetchPriority="low" decoding="async" width="1200" height="800" className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C3A5A]/65 to-transparent" />
          <div className="relative flex flex-col justify-end p-10 lg:p-16 text-white min-h-[480px]">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight mb-4">
              Modern Homes.<br />Deeper Roots.
            </h2>
            <p className="text-white/60 text-[15px] leading-relaxed mb-7 max-w-xs">
              We do not simply decorate the square footage you have. We rethink how every square foot works.
            </p>
            <button
              onClick={() => setPage('homes')}
              className="text-[14px] font-semibold text-white bg-[#17665B] border border-[#17665B] px-6 py-3 self-start transition-all hover:bg-[#0f4f46]"
            >
              Explore a Home →
            </button>
          </div>
        </div>
        {/* Right: warm proof statements replacing cold numbered list */}
        <div className="bg-[#1C3A5A] flex flex-col justify-center px-10 lg:px-16 py-16 gap-6">
          {[
            { lead: 'Heritage craft', rest: 'inspired by the material wisdom of the past' },
            { lead: 'Modern thinking', rest: "shaped around today's ways of living" },
            { lead: 'Personalised entirely', rest: 'to the way you use your home' },
            { lead: 'Delivered with care', rest: 'across Noida, Greater Noida & NCR' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-5 group">
              <span className="w-6 h-px bg-[#17665B] mt-[11px] shrink-0 transition-all group-hover:w-10" />
              <p className="text-white/80 text-[15px] leading-relaxed">
                <span className="text-white font-semibold">{item.lead}</span> {item.rest}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Home Concepts ───────────── */}
      <section className="py-24 lg:py-28 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#1A1714]">Featured Home Concepts</h2>
            <p className="text-[#6B5E4E] text-[15px] mt-1.5">Selected design studies for apartments, villas and family homes.</p>
          </div>
          <button onClick={() => setPage('homes')} className="hidden sm:block text-[14px] text-[#1A1714] hover:text-[#17665B] transition-colors">
            Explore All Homes →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {homes.map(h => (
            <button key={h.name} onClick={() => setPage('homes')} className="text-left group flex h-full flex-col">
              <div className="overflow-hidden bg-[#D4CBBB] mb-4 shrink-0 relative" style={{ aspectRatio: '4/3' }}>
                <img src={IMG[h.img]} data-site-image-key={directImageKey(IMG[h.img])} srcSet={imageSrcSet(IMG[h.img])} sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 25vw" alt={`${h.name}: ${h.desc.split(/[.!?]/)[0]} (${h.loc}) — selected interior design concept`} loading="lazy" fetchPriority="low" decoding="async" width="800" height="600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {/* Hover teal overlay strip at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#17665B] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
              <p className="font-display text-lg text-[#1A1714] group-hover:text-[#17665B] transition-colors">{h.name}</p>
              <p className="text-[12px] text-[#17665B] mt-1 mb-1.5 font-medium">{h.loc}</p>
              <p className="text-[13px] text-[#6B5E4E] leading-relaxed">{h.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Local expertise ───────────── */}
      <section className="px-6 lg:px-20 pb-24 lg:pb-28 max-w-[1440px] mx-auto">
        <div className="border-t border-[#D4CBBB] pt-12 grid lg:grid-cols-[0.9fr_1.4fr] gap-8 lg:gap-20">
          <div>
            <p className="label-editorial text-[#B2552E] mb-4">Designed for NCR living</p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-[#1A1714]">Interior design that understands where you live.</h2>
          </div>
          <div className="lg:pt-2">
            <p className="text-[15px] leading-[1.9] text-[#6B5E4E] mb-5">
              NestArcadia designs 2BHK, 3BHK and 4BHK interiors, villas and farmhouses with a primary focus on Noida Extension and Greater Noida West, alongside nearby Noida and Greater Noida. We pair practical apartment planning with India's material heritage — from efficient storage and modular kitchens to calm, characterful living spaces.
            </p>
            <p className="text-[15px] leading-[1.9] text-[#6B5E4E]">
              Our primary local service focus is Noida Extension and Greater Noida West, with Noida and Greater Noida as nearby secondary markets. For a property elsewhere in NCR, share its location and scope so the team can confirm whether the project is a fit.
            </p>
            {/* Area links as pill badges */}
            <div className="mt-7 flex flex-wrap gap-3">
              {[
                { label: 'Noida Extension', href: '/interior-design-noida-extension/' },
                { label: 'Greater Noida West', href: '/interior-design-greater-noida-west/' },
                { label: 'Noida', href: '/interior-design-noida/' },
                { label: 'Greater Noida', href: '/interior-design-greater-noida/' },
              ].map(a => (
                <a
                  key={a.label}
                  href={a.href}
                  className="inline-flex items-center gap-1.5 border border-[#B8D8D1] text-[#17665B] text-[13px] font-medium px-4 py-2 hover:bg-[#17665B] hover:border-[#17665B] hover:text-white transition-all"
                >
                  {a.label} →
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Residences (FeaturedResidences component) */}
      <FeaturedResidences />

      {/* ── Interior Cost Guides ────────────── */}
      <section className="px-6 lg:px-20 py-16 lg:py-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div>
            <p className="label-track text-[#17665B] mb-3">Plan with clarity</p>
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.7rem)] leading-tight text-[#1A1714]">Start with a realistic interior budget.</h2>
            <p className="text-sm text-[#6B5E4E] mt-3 max-w-2xl leading-relaxed">Understand the starting planning ranges, scope decisions and questions to ask before you compare quotations.</p>
          </div>
          <a href="/start-your-project/" className="inline-flex min-h-11 items-center text-[13px] font-semibold text-[#17665B] underline underline-offset-4 hover:text-[#1C3A5A]">Discuss your floor plan →</a>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <a href="/journal/2bhk-interior-cost-noida-extension/" className="group border border-[#D4CBBB] p-6 lg:p-8 hover:border-[#17665B] hover:bg-[#f7f4ef] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17665B]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-3">2BHK · Noida Extension</p>
            <h3 className="font-display text-xl text-[#1C3A5A] group-hover:text-[#17665B] transition-colors">What does a 2BHK interior cost?</h3>
            <p className="text-sm text-[#6B5E4E] leading-relaxed mt-3">A practical starting-budget guide, with the scope and specifications that can change the final estimate.</p>
            <span className="inline-block mt-5 text-[13px] font-semibold text-[#17665B]">Read the 2BHK budget guide →</span>
          </a>
          <a href="/journal/3bhk-interior-cost-greater-noida-west/" className="group border border-[#D4CBBB] p-6 lg:p-8 hover:border-[#17665B] hover:bg-[#f7f4ef] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17665B]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-3">3BHK · Greater Noida West</p>
            <h3 className="font-display text-xl text-[#1C3A5A] group-hover:text-[#17665B] transition-colors">How should you budget for a 3BHK?</h3>
            <p className="text-sm text-[#6B5E4E] leading-relaxed mt-3">Room-by-room priorities, kitchen and wardrobe decisions, and a clearer way to compare proposals.</p>
            <span className="inline-block mt-5 text-[13px] font-semibold text-[#17665B]">Read the 3BHK budget guide →</span>
          </a>
        </div>
      </section>

      {/* ── FAQs ───────────────────── */}
      <section className="px-6 lg:px-20 pb-24 lg:pb-28 max-w-[1440px] mx-auto">
        <div className="border-t border-[#D4CBBB] pt-12 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20">
          <div className="relative">
            {/* Terracotta accent stripe — the FAQ section closes the page on the
                second accent colour instead of returning to teal one more time */}
            <div className="absolute left-0 top-0 w-0.5 h-14 bg-[#B2552E]" />
            <div className="pl-5">
              <p className="label-editorial text-[#B2552E] mb-4">Helpful answers</p>
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-[#1A1714]">Questions before you begin.</h2>
            </div>
          </div>
          <div>
            <div className="border-t border-[#D4CBBB]">
              {faqs.map((faq, i) => (
                <div key={faq.question} className="border-b border-[#D4CBBB]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] font-medium text-[#1A1714] hover:text-[#17665B] transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    {faq.question}
                    <span
                      className="shrink-0 w-7 h-7 border border-[#D4CBBB] flex items-center justify-center text-[#17665B] transition-transform"
                      style={{ transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && <p className="max-w-2xl pb-5 pr-10 text-[14px] leading-[1.8] text-[#6B5E4E]">{faq.answer}</p>}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-6">
              <Link
                to="/faqs/"
                className="border border-[#1C3A5A] px-5 py-2.5 text-[13px] font-semibold text-[#1C3A5A] transition-colors hover:bg-[#1C3A5A] hover:text-white"
              >
                See All FAQs →
              </Link>
              <a
                href="https://wa.me/918448061997?text=Hi%20NestArcadia%2C%20I%20have%20a%20question%20about%20interior%20design%20for%20my%20home%20in%20Noida%2FGreater%20Noida."
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#1C3A5A]/40 px-5 py-2.5 text-[13px] font-semibold text-[#1C3A5A] transition-colors hover:bg-[#1C3A5A] hover:text-white"
              >
                Ask on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────── */}
      <section className="relative overflow-hidden bg-[#1C3A5A]" style={{ minHeight: '380px' }}>
        <img src={IMG.cta} data-site-image-key={directImageKey(IMG.cta)} srcSet={imageSrcSet(IMG.cta)} sizes="100vw" alt="NestArcadia interior design consultation for Noida, Greater Noida and Greater Noida West homes" loading="lazy" fetchPriority="low" decoding="async" width="1200" height="800" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C3A5A]/90 via-[#1C3A5A]/70 to-[#1C3A5A]/40" />
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-20 py-20 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-4">Your home awaits</p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] text-white leading-tight mb-3">
              Let's Create a Home<br />That Belongs to You
            </h2>
            <p className="text-white/55 text-[15px] mb-9">Your requirement comes first. Always.</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setPage('project')}
                className="text-[14px] font-semibold text-white bg-[#17665B] border border-[#17665B] px-7 py-3 transition-all hover:bg-[#0f4f46]"
              >
                Tell Us About Your Space →
              </button>
              <a
                href="https://wa.me/918448061997?text=Hi%20NestArcadia%2C%20I%27d%20like%20to%20discuss%20my%20home%20interior%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-white border border-white/40 px-7 py-3 transition-all hover:bg-white/10"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
          {/* Right: 3 stat callouts — distinct from the trust strip and the
              Rooted-in-Tradition badge, not a repeat of the same number */}
          <div className="hidden lg:grid grid-cols-3 gap-4">
            {[
              { value: '5', label: 'Indian design cultures, one vision', accent: '#B2552E' },
              { value: '100%', label: 'Turnkey projects fully managed', accent: '#17665B' },
              { value: 'NCR', label: 'Noida, Greater Noida & beyond', accent: '#17665B' },
            ].map(stat => (
              <div key={stat.label} className="border border-white/15 p-5 text-center">
                <p className="font-display text-[2rem] leading-none mb-2" style={{ color: stat.accent === '#B2552E' ? '#d98257' : '#ffffff' }}>{stat.value}</p>
                <p className="text-[11px] text-white/50 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
