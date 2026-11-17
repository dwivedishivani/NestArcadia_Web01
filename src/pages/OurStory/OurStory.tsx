import { Link } from 'react-router';
import { resolveSiteImageSrcSet } from '../../utils/siteImages';
import { resolveSiteImage } from '../../utils/siteImages';

const u = (id: string, _w: number, _h: number) => resolveSiteImage(id, _w);

const timeline = [
  { year: '2024', event: 'NestArcadia founded', desc: 'Built on a family background in real estate and construction, NestArcadia began as a design-focused practice for thoughtful interiors.' },
  { year: 'Today', event: 'Operating from Greater Noida West', desc: 'Our head office brings design, project coordination and practical construction understanding into one considered process.' },
  { year: 'Ahead', event: 'A vision for measured growth', desc: 'We are planning future opportunities with care, while continuing to build the foundation from our Greater Noida West base.' },
];

const values = [
  { name: 'Heritage First', desc: 'Every design begins with a conversation with India\'s past. We honour craft traditions before we innovate on them.' },
  { name: 'Personalisation', desc: 'No two homes are alike because no two families are alike. We design for people, not trends.' },
  { name: 'Craft Over Speed', desc: 'We work with skilled artisans who take time to get things right. Haste has no place in a timeless home.' },
  { name: 'Transparency', desc: 'From budgets to timelines, we believe in honest conversations. No surprises at handover.' },
];

export default function OurStory() {
  return (
    <div className="pt-20 lg:pt-[90px]">
      {/* Header */}
      <div className="relative overflow-hidden bg-brand-navy" style={{ minHeight: '400px' }}>
        <img
          src={u('photo-1735568958809-82f7696a276a', 1440, 600)}
          data-site-image-key="photo-1735568958809-82f7696a276a"
          srcSet={resolveSiteImageSrcSet('photo-1735568958809-82f7696a276a')}
          sizes="100vw"
          alt="NestArcadia interior design studio and heritage-inspired approach"
          width="1440"
          height="600"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-navy/50" />
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-20 flex flex-col justify-end min-h-[400px] pb-14">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-4">Who We Are</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-white leading-[1.05]">Our Story</h1>
          <p className="text-white/60 text-sm mt-3 max-w-md">
            Premium interior design for modern homes and spaces across Noida & NCR.
          </p>
        </div>
      </div>

      {/* Opening */}
      <section className="py-24 lg:py-32 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted mb-5">Every Home Has a Story</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-text-primary leading-[1.08]">
              Rooted in Tradition.<br />Designed for You.
            </h2>
          </div>
          <div className="lg:pt-10">
            <p className="text-text-muted text-[15px] leading-[1.9] mb-6">
              NestArcadia was born from a simple belief: that India's extraordinary design heritage — its crafts, its materials, its spatial wisdom — belongs in the homes of modern Indians.
            </p>
            <p className="text-text-muted text-[15px] leading-[1.9] mb-6">
              NestArcadia was founded in 2024, building on our family’s experience in real estate and construction. That grounding informs the way we work: with a respect for practical detail, honest materials and the lives a home has to hold.
            </p>
            <p className="text-text-muted text-[15px] leading-[1.9]">
              Today we operate from our head office in Greater Noida West, serving homeowners and businesses across Greater Noida, Noida, Delhi, Gurgaon, Faridabad and Ghaziabad. Our vision is to create meaningful opportunities through design while growing carefully, without making promises before the work is ready.
            </p>
          </div>
        </div>
      </section>

      {/* Full-width image */}
      <div className="overflow-hidden" style={{ maxHeight: '480px' }}>
        <img
          src={u('photo-1766128867730-b10474e59f1b', 1440, 600)}
          data-site-image-key="photo-1766128867730-b10474e59f1b"
          srcSet={resolveSiteImageSrcSet('photo-1766128867730-b10474e59f1b')}
          sizes="100vw"
          alt="NestArcadia studio"
          loading="lazy"
          decoding="async"
          width="1440"
          height="600"
          className="w-full h-full object-cover"
          style={{ maxHeight: '480px' }}
        />
      </div>

      {/* Values */}
      <section className="py-24 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] text-text-primary mb-2">What We Stand For</h2>
        <p className="text-text-muted text-sm mb-14">The principles that shape every decision we make.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {values.map((v, i) => (
            <div key={v.name}>
              <p className="font-display text-brand-forest text-sm mb-3">0{i + 1}</p>
              <h3 className="font-display text-xl text-text-primary mb-3">{v.name}</h3>
              <p className="text-xs text-text-muted leading-[1.8]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 lg:px-20" style={{ background: var(--color-card) }}>
        <div className="max-w-[1440px] mx-auto">
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] text-text-primary mb-2">Our Journey</h2>
          <p className="text-text-muted text-sm mb-14">A foundation built with care, and a vision for what comes next.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {timeline.map(t => (
              <div key={t.year} className="border-t border-border-subtle pt-6">
                <p className="font-display text-brand-forest text-lg mb-1">{t.year}</p>
                <p className="font-medium text-text-primary text-sm mb-2">{t.event}</p>
                <p className="text-xs text-text-muted leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split image + mission */}
      <section className="grid lg:grid-cols-2">
        <div className="relative overflow-hidden bg-border-subtle" style={{ minHeight: '420px' }}>
          <img
            src={u('photo-1746439326918-845e0486040d', 800, 600)}
            data-site-image-key="photo-1746439326918-845e0486040d"
            srcSet={resolveSiteImageSrcSet('photo-1746439326918-845e0486040d')}
            sizes="(max-width: 1023px) 100vw, 50vw"
            alt="Craft and making"
            loading="lazy"
            decoding="async"
            width="800"
            height="600"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-10 lg:px-16 py-16 bg-brand-navy">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/40 mb-5">Our Mission</p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-white leading-tight mb-6">
            Homes That Carry<br />Your Story Forward
          </h2>
          <p className="text-white/65 text-[13px] leading-[1.9] mb-8">
            We believe that when a home is designed with care — with reference to where you come from, who you are, and how you live — it becomes more than shelter. It becomes a place that sustains you.
          </p>
          <Link
            to="/start-your-project/"
            className="inline-flex text-[13px] text-white border border-white/40 px-6 py-2.5 self-start hover:bg-white hover:text-text-primary transition-all"
          >
            Tell Us Your Home Story →
          </Link>
        </div>
      </section>
    </div>
  );
}
