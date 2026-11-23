import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { Page } from '../../App';
import logoImg from '../../assets/images/branding/nestarcadia-logo-transparent.png';
import logoWhiteImg from '../../assets/images/branding/nestarcadia-logo-white.png';

interface NavProps {
  page: Page;
  forceSolid?: boolean;
}

const links: { label: string; page: Page }[] = [
  { label: 'Our Projects', page: 'homes' },
  { label: 'Design Cultures', page: 'cultures' },
  { label: 'Our Services', page: 'services' },
  { label: 'Our Story', page: 'story' },
  { label: 'Journal', page: 'journal' },
];

export default function Nav({ page, forceSolid = false }: NavProps) {
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
    terms: '/terms/',
    contact: '/contact/',
    admin: '/admin/',
  };
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => setMenuOpen(false), [page]);

  const isHome = page === 'home';
  const transparent = isHome && !scrolled && !forceSolid;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: transparent ? 'transparent' : '#F2EDE4',
          borderBottom: transparent ? '1px solid transparent' : '1px solid #B8D8D1',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-14 flex items-center justify-between h-20 lg:h-[90px]">

          {/* Logo */}
          <Link to="/" className="flex items-center text-left shrink-0" aria-label="NestArcadia Home">
            <span className="flex h-14 sm:h-16 lg:h-[78px] w-[112px] sm:w-[128px] lg:w-[156px] shrink-0 items-center justify-start overflow-hidden">
              <img
                src={transparent ? logoWhiteImg : logoImg}
                width="200"
                height="200"
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                className="block h-full w-full object-contain object-left"
                style={{ fontSize: 0, lineHeight: 0 }}
              />
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.page}
                to={pagePaths[l.page]}
                className="text-[14px] tracking-[0.01em] transition-colors hover:text-[#17665B]"
                style={{
                  color: page === l.page
                    ? (transparent ? '#B8D8D1' : '#17665B')
                    : transparent
                    ? 'rgba(255,255,255,0.80)'
                    : '#1C3A5A',
                  fontWeight: page === l.page ? 700 : 500,
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            {/* On transparent hero: teal fill for visibility; on solid: navy outline */}
            <Link
              to="/start-your-project/"
              className="hidden lg:block text-[13px] font-semibold tracking-[0.02em] px-5 py-2.5 transition-all"
              style={{
                color: transparent ? '#ffffff' : '#ffffff',
                background: transparent ? '#17665B' : '#1C3A5A',
                border: transparent ? '1px solid #17665B' : '1px solid #1C3A5A',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#0f4f46';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#0f4f46';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = transparent ? '#17665B' : '#1C3A5A';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = transparent ? '#17665B' : '#1C3A5A';
              }}
            >
              Start Your Project →
            </Link>

            <button
              className="lg:hidden flex min-h-11 min-w-11 flex-col items-center justify-center gap-[6px] p-2"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <span className="block h-0.5 w-6" style={{ background: transparent ? '#ffffff' : '#1C3A5A' }} />
              <span className="block h-0.5 w-4" style={{ background: transparent ? '#ffffff' : '#1C3A5A' }} />
              <span className="block h-0.5 w-6" style={{ background: transparent ? '#ffffff' : '#1C3A5A' }} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          id="mobile-nav-drawer"
          className="lg:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: menuOpen ? '460px' : '0',
            background: '#F2EDE4',
            borderTop: menuOpen ? '1px solid #B8D8D1' : 'none',
          }}
        >
          <div className="px-6 py-7 flex flex-col gap-5">
            {links.map(l => (
              <Link
                key={l.page}
                to={pagePaths[l.page]}
                className="text-left text-[17px] font-semibold transition-colors"
                style={{ color: page === l.page ? '#17665B' : '#1C3A5A' }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/start-your-project/"
              className="text-[13px] px-5 py-3 bg-[#17665B] text-white text-left mt-1 hover:bg-[#0f4f46] transition-all font-semibold"
            >
              Start Your Project →
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
