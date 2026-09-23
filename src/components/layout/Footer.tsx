import type { Page } from '../../App';
import logoImg from '../../assets/images/branding/nestarcadia-logo-transparent.png';

interface FooterProps {
  setPage: (page: Page) => void;
}

const navLinks: { label: string; page: Page }[] = [
  { label: 'Homes', page: 'homes' },
  { label: 'Design Cultures', page: 'cultures' },
  { label: 'Our Services', page: 'services' },
  { label: 'Our Story', page: 'story' },
  { label: 'Journal', page: 'journal' },
  { label: 'FAQs', page: 'faq' },
];

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/nestarcadia/', icon: <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5A4.5 4.5 0 1 0 12 16.5 4.5 4.5 0 0 0 12 7.5Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8ZM17.65 6.6a1.05 1.05 0 1 0 0-2.1 1.05 1.05 0 0 0 0 2.1Z" /> },
  { label: 'Facebook', href: 'https://www.facebook.com/people/Nest-Arcadia/61577890484320/?ref=PROFILE_EDIT_xav_ig_profile_page_web', icon: <path d="M13.6 22v-8h2.75l.42-3.12H13.6V8.9c0-.9.25-1.52 1.55-1.52h1.74V4.6A23.4 23.4 0 0 0 15.2 4c-2.74 0-4.62 1.67-4.62 4.73v2.15H7.5V14h3.08v8h3.02Z" /> },
  { label: 'YouTube', href: 'https://www.youtube.com/@NestArcadiaOfficial', icon: <path d="M21.6 7.2a2.9 2.9 0 0 0-2.04-2.05C17.76 4.67 12 4.67 12 4.67s-5.76 0-7.56.48A2.9 2.9 0 0 0 2.4 7.2C1.92 9 1.92 12 1.92 12s0 3 .48 4.8a2.9 2.9 0 0 0 2.04 2.05c1.8.48 7.56.48 7.56.48s5.76 0 7.56-.48a2.9 2.9 0 0 0 2.04-2.05c.48-1.8.48-4.8.48-4.8s0-3-.48-4.8ZM10.15 15.1V8.9L15.6 12l-5.45 3.1Z" /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nest-arcadia', icon: <path d="M6.05 8.35A2.1 2.1 0 1 0 6.05 4.15a2.1 2.1 0 0 0 0 4.2ZM4.25 9.8h3.6V20H4.25V9.8Zm5.85 0h3.45v1.4h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.31 2.4 4.31 5.52V20h-3.6v-4.55c0-1.08-.02-2.47-1.5-2.47-1.51 0-1.74 1.18-1.74 2.39V20h-3.6V9.8Z" /> },
];

export default function Footer({ setPage }: FooterProps) {
  return (
    <footer style={{ background: '#F2EDE4', borderTop: '1px solid #D4CBBB' }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-14 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

          {/* Logo + tagline */}
          <button onClick={() => setPage('home')} className="text-left">
            <img src={logoImg} alt="NestArcadia — heritage Indian interiors" className="h-24 w-auto object-contain" />
            <p className="text-[13px] text-[#6B5E4E] mt-4 leading-relaxed max-w-[220px]">
              Heritage-inspired interiors, thoughtfully designed for the way modern India lives.
            </p>
          </button>

          {/* Nav */}
          <div className="flex flex-col gap-3">
            {navLinks.map(l => (
              <button
                key={l.page}
                onClick={() => setPage(l.page)}
                className="text-[14px] text-[#6B5E4E] text-left hover:text-[#2D8C7E] transition-colors"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => setPage('project')}
              className="text-[14px] text-[#2D8C7E] text-left mt-2 hover:text-[#1C3A5A] transition-colors font-medium"
            >
              Start Your Project →
            </button>
          </div>

          {/* Social + contact */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-4">Let's stay connected</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`NestArcadia on ${s.label}`}
                  className="w-9 h-9 border border-[#B8D8D1] text-[#1C3A5A] flex items-center justify-center hover:bg-[#2D8C7E] hover:border-[#2D8C7E] hover:text-white transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">{s.icon}</svg>
                </a>
              ))}
            </div>
            <div
              className="border-t border-[#D4CBBB] pt-6 flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                const phone = '918448061997';
                const msg = encodeURIComponent('Hello NestArcadia, I am interested in discussing my interior design project.');
                window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
              }}
            >
              <div className="w-10 h-10 bg-[#2D8C7E] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#1C3A5A] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.93 1.395 5.6L0 24l6.585-1.371A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.712.974.991-3.625-.235-.373A9.818 9.818 0 012.182 12c0-5.421 4.397-9.818 9.818-9.818 5.421 0 9.818 4.397 9.818 9.818 0 5.421-4.397 9.818-9.818 9.818z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1714] group-hover:text-[#2D8C7E] transition-colors">WhatsApp Us</p>
                <p className="text-xs text-[#6B5E4E]">Talk to NestArcadia</p>
              </div>
            </div>
            <a href="mailto:info@nestarcadia.com" className="mt-5 inline-flex text-[14px] font-semibold text-[#1C3A5A] hover:text-[#2D8C7E] transition-colors">
              info@nestarcadia.com
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#D4CBBB] flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-[12px] text-[#6B5E4E]">© 2026 NestArcadia. All rights reserved.</p>
          <p className="text-[12px] text-[#6B5E4E]">Crafted with care, across India.</p>
        </div>
      </div>
    </footer>
  );
}
