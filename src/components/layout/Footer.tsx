import type { Page } from '../../App';
import { Link } from 'react-router';
import logoImg from '../../assets/images/branding/nestarcadia-logo-transparent.png';
import { areaGroups } from '../../pages/LocalService/localServicePaths';

interface FooterProps {}

const navLinks: { label: string; page: Page }[] = [
  { label: 'Our Projects', page: 'homes' },
  { label: 'Design Cultures', page: 'cultures' },
  { label: 'Our Services', page: 'services' },
  { label: 'Our Story', page: 'story' },
  { label: 'Journal', page: 'journal' },
  { label: 'FAQs', page: 'faq' },
];

// Every published NCR location page, grouped — same directory as the Services
// page's "Where we work" section (src/pages/LocalService/localServicePaths.ts).
// This strip used to hard-code just the original 4 areas, so newer location
// pages (Ghaziabad, Delhi, Gurugram, etc.) were never linked from the footer
// that appears on every page.
const serviceAreas = areaGroups.flatMap(group => group.areas);

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/nestarcadia/', icon: <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5A4.5 4.5 0 1 0 12 16.5 4.5 4.5 0 0 0 12 7.5Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8ZM17.65 6.6a1.05 1.05 0 1 0 0-2.1 1.05 1.05 0 0 0 0 2.1Z" /> },
  { label: 'Facebook', href: 'https://www.facebook.com/people/Nest-Arcadia/61577890484320/', icon: <path d="M13.6 22v-8h2.75l.42-3.12H13.6V8.9c0-.9.25-1.52 1.55-1.52h1.74V4.6A23.4 23.4 0 0 0 15.2 4c-2.74 0-4.62 1.67-4.62 4.73v2.15H7.5V14h3.08v8h3.02Z" /> },
  { label: 'YouTube', href: 'https://www.youtube.com/@NestArcadiaOfficial', icon: <path d="M21.6 7.2a2.9 2.9 0 0 0-2.04-2.05C17.76 4.67 12 4.67 12 4.67s-5.76 0-7.56.48A2.9 2.9 0 0 0 2.4 7.2C1.92 9 1.92 12 1.92 12s0 3 .48 4.8a2.9 2.9 0 0 0 2.04 2.05c1.8.48 7.56.48 7.56.48s5.76 0 7.56-.48a2.9 2.9 0 0 0 2.04-2.05c.48-1.8.48-4.8.48-4.8s0-3-.48-4.8ZM10.15 15.1V8.9L15.6 12l-5.45 3.1Z" /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nest-arcadia', icon: <path d="M6.05 8.35A2.1 2.1 0 1 0 6.05 4.15a2.1 2.1 0 0 0 0 4.2ZM4.25 9.8h3.6V20H4.25V9.8Zm5.85 0h3.45v1.4h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.31 2.4 4.31 5.52V20h-3.6v-4.55c0-1.08-.02-2.47-1.5-2.47-1.51 0-1.74 1.18-1.74 2.39V20h-3.6V9.8Z" /> },
];

const pagePaths: Record<Page, string> = {
  home: '/',
  cultures: '/design-cultures/',
  services: '/interior-design-services/',
  story: '/our-story/',
  journal: '/journal/',
  homes: '/our-projects/',
  project: '/start-your-project/',
  faq: '/faqs/',
  privacy: '/privacy-policy/',
  admin: '/admin/',
};

export default function Footer({}: FooterProps) {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{ background: '#F2EDE4', borderTop: '1px solid #D4CBBB' }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-14 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 items-start">

          {/* Logo + tagline */}
          <div>
            <Link to="/" aria-label="NestArcadia home">
              <img src={logoImg} alt="NestArcadia" width="180" height="96" loading="lazy" decoding="async" className="h-24 w-auto object-contain" />
            </Link>
            <p className="text-[13px] text-[#6B5E4E] mt-4 leading-relaxed max-w-[220px]">
              Premium interior design for modern homes and spaces across Noida & NCR.
            </p>
            {/* CTA inline in footer */}
            <Link
              to="/start-your-project/"
              className="inline-block mt-6 text-[13px] font-semibold text-white bg-[#17665B] px-5 py-2.5 hover:bg-[#0f4f46] transition-colors"
            >
              Start Your Project →
            </Link>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-2.5">
            {navLinks.map(l => (
              <Link
                key={l.page}
                to={pagePaths[l.page]}
                className="text-[14px] text-[#6B5E4E] text-left hover:text-[#17665B] transition-colors py-0.5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-5 pt-5 border-t border-[#D4CBBB]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-3">Service areas</p>
              <div className="flex flex-col gap-2">
                <a href="/interior-design-greater-noida-west/" className="text-[13px] text-[#6B5E4E] hover:text-[#17665B] transition-colors">Interior design · Greater Noida West</a>
                <a href="/interior-design-noida-extension/" className="text-[13px] text-[#6B5E4E] hover:text-[#17665B] transition-colors">Interior design · Noida Extension</a>
                <a href="/commercial-interior-design-greater-noida-west/" className="text-[13px] text-[#6B5E4E] hover:text-[#17665B] transition-colors">Commercial interiors · Greater Noida West</a>
                <a href="/interior-design-cost-noida/" className="text-[13px] text-[#6B5E4E] hover:text-[#17665B] transition-colors">Interior design cost · Noida</a>
              </div>
            </div>
          </div>

          {/* Social + contact */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-4">Let's stay connected</p>
            <div className="flex flex-wrap gap-2.5 mb-7">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`NestArcadia on ${s.label}`}
                  className="w-9 h-9 border border-[#B8D8D1] text-[#1C3A5A] flex items-center justify-center hover:bg-[#17665B] hover:border-[#17665B] hover:text-white transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">{s.icon}</svg>
                </a>
              ))}
            </div>
            <a
              href="https://wa.me/918448061997?text=Hello%20NestArcadia%2C%20I%20am%20interested%20in%20discussing%20my%20interior%20design%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="border-t border-[#D4CBBB] pt-6 flex items-center gap-3 group mb-5"
            >
              <div className="w-10 h-10 bg-[#17665B] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#0f4f46] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.93 1.395 5.6L0 24l6.585-1.371A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.712.974.991-3.625-.235-.373A9.818 9.818 0 012.182 12c0-5.421 4.397-9.818 9.818-9.818 5.421 0 9.818 4.397 9.818 9.818 0 5.421-4.397 9.818-9.818 9.818z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1714] group-hover:text-[#17665B] transition-colors">WhatsApp Us</p>
                <p className="text-xs text-[#6B5E4E]">Talk to NestArcadia directly</p>
              </div>
            </a>
            <div className="flex flex-col gap-2">
              <a href="tel:+918448061997" className="inline-flex text-[14px] font-semibold text-[#1C3A5A] hover:text-[#17665B] transition-colors">
                +91 84480 61997
              </a>
              <a href="mailto:info@nestarcadia.com" className="inline-flex text-[14px] font-semibold text-[#1C3A5A] hover:text-[#17665B] transition-colors">
                info@nestarcadia.com
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=G-59%2C%20Fusion%20Ufairia%20Mall%2C%20Sector%2016B%2C%20Greater%20Noida%20West%2C%20Uttar%20Pradesh%20201310" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex max-w-[280px] text-[13px] leading-relaxed text-[#6B5E4E] hover:text-[#17665B] transition-colors">
                <span><strong className="font-semibold text-[#1A1714]">Visit our office</strong><br />G-59, Fusion Ufairia Mall, Sector 16B<br />Greater Noida West, UP 201310<br /><span className="underline underline-offset-2">Get directions</span></span>
              </a>
            </div>
          </div>
        </div>

        {/* Service areas strip */}
        <div className="mt-12 pt-8 border-t border-[#D4CBBB]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E]">Interior design across Noida &amp; NCR</p>
            <a
              href="/interior-design-delhi-ncr/"
              className="text-[12px] font-semibold text-[#17665B] hover:text-[#0f4f46] transition-colors whitespace-nowrap"
            >
              See all of NCR we serve →
            </a>
          </div>
          <nav aria-label="NestArcadia service areas" className="flex flex-wrap gap-x-2 gap-y-2">
            {serviceAreas.map(area => (
              <a
                key={area.href}
                href={area.href}
                className="whitespace-nowrap text-[13px] text-[#6B5E4E] border border-[#D4CBBB] px-3 py-1 hover:text-[#17665B] hover:border-[#17665B] transition-colors"
              >
                {area.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-[#D4CBBB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[12px] text-[#6B5E4E]">&copy; {currentYear} NestArcadia. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy/" className="text-[12px] text-[#6B5E4E] hover:text-[#17665B] transition-colors">Privacy Policy</Link>
            <Link to="/our-story/" className="text-[12px] text-[#6B5E4E] hover:text-[#17665B] transition-colors">About Us</Link>
            <Link to="/start-your-project/" className="text-[12px] text-[#6B5E4E] hover:text-[#17665B] transition-colors">Contact</Link>
            <span className="text-[12px] text-[#6B5E4E]">Crafted with care.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
