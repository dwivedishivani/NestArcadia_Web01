import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { Page } from '../../App';
import { pagePaths } from '../../data/pagePaths';
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => setMenuOpen(false), [page]);

  useEffect(() => {
    if (!menuOpen) return;

    const drawer = drawerRef.current;
    const getFocusable = () => drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [];
    getFocusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (drawer && activeElement && !drawer.contains(activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    triggerRef.current?.focus();
  };

  const isHome = page === 'home';
  const transparent = isHome && !scrolled && !forceSolid;

  return (
    <>
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
        />
      )}
      <nav
        aria-label="Primary navigation"
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
                className="text-[15px] tracking-[0.01em] transition-colors hover:text-[#17665B]"
                style={{
                  color: page === l.page
                    ? (transparent ? '#FFFFFF' : '#17665B')
                    : transparent
                    ? 'rgba(255,255,255,0.85)'
                    : '#1C3A5A',
                  fontWeight: page === l.page ? 700 : 600,
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              to="/start-your-project/"
              className="hidden lg:block text-[14px] font-semibold tracking-[0.01em] px-5 py-2.5 border transition-all hover:bg-[#17665B] hover:border-[#2D8C7E] hover:text-white"
              style={{
                color: transparent ? '#ffffff' : '#1C3A5A',
                borderColor: transparent ? 'rgba(255,255,255,0.62)' : '#1C3A5A',
              }}
            >
              Start Your Project →
            </Link>

            <button
              ref={triggerRef}
              type="button"
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
          ref={drawerRef}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          className="lg:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: menuOpen ? '420px' : '0',
            background: '#F2EDE4',
            borderTop: menuOpen ? '1px solid #B8D8D1' : 'none',
          }}
        >
          <div className="px-6 py-7 flex flex-col gap-5">
            {links.map(l => (
              <Link
                key={l.page}
                to={pagePaths[l.page]}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                className="text-left text-[17px] font-semibold transition-colors"
                style={{ color: page === l.page ? '#2D8C7E' : '#1C3A5A' }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/start-your-project/"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="text-[13px] px-5 py-3 border border-[#1C3A5A] text-[#1C3A5A] text-left mt-1 hover:bg-[#17665B] hover:border-[#2D8C7E] hover:text-white transition-all"
            >
              Start Your Project →
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
