import { useState, useEffect } from 'react';
import type { Page } from '../../App';
import logoImg from '../../assets/images/branding/nestarcadia-logo-transparent.png';
import logoWhiteImg from '../../assets/images/branding/nestarcadia-logo-white.png';

interface NavProps {
  page: Page;
  setPage: (page: Page) => void;
}

const links: { label: string; page: Page }[] = [
  { label: 'Homes', page: 'homes' },
  { label: 'Design Cultures', page: 'cultures' },
  { label: 'Our Services', page: 'services' },
  { label: 'Our Story', page: 'story' },
  { label: 'Journal', page: 'journal' },
];

export default function Nav({ page, setPage }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => setMenuOpen(false), [page]);

  const isHome = page === 'home';
  const transparent = isHome && !scrolled;

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
          <button
            onClick={() => setPage('home')}
            className="flex items-center text-left shrink-0"
            aria-label="NestArcadia Home"
          >
            <span className="relative block h-[68px] lg:h-[78px] w-auto">
              <img
                src={logoImg}
                alt="NestArcadia — heritage Indian interiors"
                className="absolute inset-0 h-full w-auto object-contain transition-opacity duration-200"
                style={{ opacity: transparent ? 0 : 1 }}
                aria-hidden={transparent}
                loading="eager"
              />
              <img
                src={logoWhiteImg}
                alt=""
                className="absolute inset-0 h-full w-auto object-contain transition-opacity duration-200"
                style={{ opacity: transparent ? 1 : 0 }}
                aria-hidden={!transparent}
                loading="eager"
              />
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <button
                key={l.page}
                onClick={() => setPage(l.page)}
                className="text-[15px] tracking-[0.01em] transition-colors hover:text-[#2D8C7E]"
                style={{
                  color: page === l.page
                    ? '#2D8C7E'
                    : transparent
                    ? 'rgba(255,255,255,0.85)'
                    : transparent ? 'rgba(255,255,255,0.88)' : '#1C3A5A',
                  fontWeight: page === l.page ? 700 : 600,
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage('project')}
              className="hidden lg:block text-[14px] font-semibold tracking-[0.01em] px-5 py-2.5 border transition-all hover:bg-[#2D8C7E] hover:border-[#2D8C7E] hover:text-white"
              style={{
                color: transparent ? '#ffffff' : '#1C3A5A',
                borderColor: transparent ? 'rgba(255,255,255,0.62)' : '#1C3A5A',
              }}
            >
              Start Your Project →
            </button>

            <button
              className="lg:hidden flex flex-col gap-[6px] p-2"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              <span className="block h-0.5 w-6" style={{ background: transparent ? '#ffffff' : '#1C3A5A' }} />
              <span className="block h-0.5 w-4" style={{ background: transparent ? '#ffffff' : '#1C3A5A' }} />
              <span className="block h-0.5 w-6" style={{ background: transparent ? '#ffffff' : '#1C3A5A' }} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className="lg:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: menuOpen ? '420px' : '0',
            background: '#F2EDE4',
            borderTop: menuOpen ? '1px solid #B8D8D1' : 'none',
          }}
        >
          <div className="px-6 py-7 flex flex-col gap-5">
            {links.map(l => (
              <button
                key={l.page}
                onClick={() => setPage(l.page)}
                className="text-left text-[17px] font-semibold transition-colors"
                style={{ color: page === l.page ? '#2D8C7E' : '#1C3A5A' }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => setPage('project')}
              className="text-[13px] px-5 py-3 border border-[#1C3A5A] text-[#1C3A5A] text-left mt-1 hover:bg-[#2D8C7E] hover:border-[#2D8C7E] hover:text-white transition-all"
            >
              Start Your Project →
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
