// Motion layer: scroll-triggered reveals, pointer-driven hover effects, parallax and a
// scroll-progress bar. Pure progressive enhancement:
//   * nothing runs for prefers-reduced-motion, so those visitors get the plain static site;
//   * only transform/opacity/translate/scale are animated (no layout shift, no CLS);
//   * content is never hidden in the HTML. A reveal class is added by JS only to blocks that
//     are still below the fold, and a failsafe timer reveals anything that was missed, so
//     crawlers, print and slow devices always end up with every block visible.
// Styles live in src/styles/motion.css.

const REVEAL_SELECTOR = [
  'main section h2',
  'main section h3',
  'main section .label-editorial',
  'main section .label-track',
  'main section :is(.grid, [class*="grid-cols"]) > *',
  'main section article',
  'main section details',
  'main section blockquote',
  'footer > div > div',
].join(',');

const FRAME_SELECTOR = 'main .overflow-hidden';
const CARD_SELECTOR = 'main section :is(.grid, [class*="grid-cols"]) > :is(a, article, div, li)';
const BUTTON_SELECTOR = 'main :is(a, button)[class*="px-"][class*="py-"]';
const INTERACTIVE = 'a, button, summary, [role="button"], label[for], select';
const TEXT_FIELD = 'input, textarea';

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface TiltState {
  el: HTMLElement;
  rect: DOMRect;
  rx: number; ry: number;
  trx: number; try_: number;
}

export function initMotion(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (window.location.pathname.startsWith('/admin')) return () => {};

  const root = document.documentElement;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wide = () => window.matchMedia('(min-width: 768px)').matches;
  const cleanups: Array<() => void> = [];
  root.classList.add('js-motion');
  cleanups.push(() => root.classList.remove('js-motion'));

  // ── Scroll reveal ──────────────────────────────────────────────────────────────────────────────
  let revealObserver: IntersectionObserver | null = null;
  const pending = new Set<HTMLElement>();

  const finishReveal = (el: HTMLElement) => {
    // Drop the reveal classes once the transition is done so the element's own
    // hover/transition utilities take over again.
    window.setTimeout(() => {
      el.classList.remove('rv', 'rv-in', 'rv-img');
      el.style.removeProperty('--rv-d');
      pending.delete(el);
    }, 1400);
  };

  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      let i = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.style.setProperty('--rv-d', `${Math.min(i, 5) * 80}ms`);
        el.classList.add('rv-in');
        revealObserver?.unobserve(el);
        finishReveal(el);
        i += 1;
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  }

  const revealAllNow = () => {
    pending.forEach((el) => { el.classList.add('rv-in'); finishReveal(el); });
    revealObserver?.disconnect();
  };
  // Failsafe: nothing may stay hidden, whatever happens (print, background tab, bots).
  const failsafe = window.setTimeout(revealAllNow, 9000);
  const onBeforePrint = () => revealAllNow();
  window.addEventListener('beforeprint', onBeforePrint);
  cleanups.push(() => { window.clearTimeout(failsafe); window.removeEventListener('beforeprint', onBeforePrint); });

  const belowFold = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return r.top > window.innerHeight - 40 && r.height > 0;
  };

  const tag = (el: HTMLElement, imageFrame = false) => {
    if (!revealObserver) return;
    if (el.dataset.noMotion !== undefined || el.closest('[data-no-motion], nav, header[class*="fixed"]')) return;
    if (el.classList.contains('rv') || el.dataset.mx === '1') return;
    if (el.parentElement?.closest('.rv')) return; // nested inside an already-revealing block
    if (!belowFold(el)) return;                    // already visible: leave it alone
    el.dataset.mx = '1';
    el.classList.add('rv');
    if (imageFrame) el.classList.add('rv-img');
    pending.add(el);
    revealObserver.observe(el);
  };

  // ── Parallax ──────────────────────────────────────────────────────────────────────────────
  const parallaxImgs = new Set<HTMLImageElement>();
  const tagParallax = (scope: ParentNode) => {
    scope.querySelectorAll<HTMLImageElement>('main img').forEach((img) => {
      if (parallaxImgs.has(img) || img.dataset.noMotion !== undefined) return;
      const frame = img.parentElement;
      if (!frame) return;
      const cs = getComputedStyle(img);
      const fcs = getComputedStyle(frame);
      if (cs.position !== 'absolute' || fcs.overflow !== 'hidden') return;
      if (frame.getBoundingClientRect().height < 220) return;
      img.classList.add('mx-parallax');
      parallaxImgs.add(img);
    });
  };

  // ── Cards, buttons, frames ────────────────────────────────────────────────────────────
  const tagInteractive = (scope: ParentNode) => {
    if (!finePointer) return;
    scope.querySelectorAll<HTMLElement>(CARD_SELECTOR).forEach((el) => {
      if (el.dataset.fx) return;
      const r = el.getBoundingClientRect();
      if (r.width < 200 || r.width > 640 || r.height < 140 || r.height > 760) return;
      if (getComputedStyle(el).transform !== 'none') return;
      if (el.closest('[data-no-motion], nav')) return;
      el.dataset.fx = 'card';
    });
    scope.querySelectorAll<HTMLElement>(BUTTON_SELECTOR).forEach((el) => {
      if (el.dataset.fx || el.closest('[data-no-motion], nav, form')) return;
      if (getComputedStyle(el).transform !== 'none') return;
      const r = el.getBoundingClientRect();
      if (r.width < 90 || r.width > 420 || r.height > 90) return;
      el.dataset.fx = 'magnet';
    });
  };

  const scan = (scope: ParentNode = document) => {
    scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => tag(el));
    scope.querySelectorAll<HTMLElement>(FRAME_SELECTOR).forEach((el) => {
      if (el.querySelector('img')) tag(el, true);
    });
    tagInteractive(scope);
    if (wide()) tagParallax(scope);
  };

  const main = document.querySelector('main');
  let scanTimer: number | undefined;
  const scheduleScan = () => {
    window.clearTimeout(scanTimer);
    scanTimer = window.setTimeout(() => scan(document), 120);
  };
  scan(document);
  const mutation = new MutationObserver(scheduleScan);
  mutation.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  cleanups.push(() => { mutation.disconnect(); window.clearTimeout(scanTimer); revealObserver?.disconnect(); });

  // ── Scroll progress bar + scroll-linked parallax ─────────────────────────────────────
  const bar = document.createElement('div');
  bar.className = 'mx-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  cleanups.push(() => bar.remove());

  let ticking = false;
  const heroCandidate = main?.querySelector<HTMLImageElement>('section img[data-site-image-key]') ?? null;
  // Only zoom an image that is clipped by an overflow:hidden ancestor, so it can never bleed
  // over neighbouring sections.
  const clipped = (img: HTMLImageElement | null) => {
    for (let n: HTMLElement | null = img?.parentElement ?? null, i = 0; n && i < 4; n = n.parentElement, i += 1) {
      if (getComputedStyle(n).overflow === 'hidden') return true;
    }
    return false;
  };
  const hero = clipped(heroCandidate) ? heroCandidate : null;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? clamp(window.scrollY / h, 0, 1) : 0})`;
      const vh = window.innerHeight;
      parallaxImgs.forEach((img) => {
        const frame = img.parentElement;
        if (!frame || !img.isConnected) { parallaxImgs.delete(img); return; }
        const r = frame.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 around viewport centre
        img.style.setProperty('--py', `${(clamp(p, -1, 1) * -28).toFixed(1)}px`);
      });
      if (hero && hero.isConnected) {
        const t = clamp(window.scrollY / vh, 0, 1);
        hero.style.setProperty('--hero-zoom', (1 + t * 0.08).toFixed(3));
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
  cleanups.push(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  });

  // ── Pointer effects (mouse / trackpad only) ────────────────────────────────────────
  if (finePointer) {
    const aura = document.createElement('div');
    aura.className = 'mx-aura';
    const ring = document.createElement('div');
    ring.className = 'mx-ring';
    aura.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(aura, ring);
    cleanups.push(() => { aura.remove(); ring.remove(); });

    let tx = -200, ty = -200;            // pointer target
    let ax = -200, ay = -200;            // aura (slow)
    let rx = -200, ry = -200;            // ring (quicker)
    let raf = 0;
    let idleUntil = 0;
    let tilt: TiltState | null = null;
    let magnet: { el: HTMLElement; rect: DOMRect; x: number; y: number } | null = null;
    const settling = new Set<TiltState>();

    const applyTilt = (s: TiltState) => {
      s.el.style.transform = `perspective(900px) rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg)`;
    };

    const frame = (now: number) => {
      ax = lerp(ax, tx, 0.09); ay = lerp(ay, ty, 0.09);
      rx = lerp(rx, tx, 0.28); ry = lerp(ry, ty, 0.28);
      aura.style.transform = `translate3d(${ax - 210}px, ${ay - 210}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;

      if (tilt) { tilt.rx = lerp(tilt.rx, tilt.trx, 0.18); tilt.ry = lerp(tilt.ry, tilt.try_, 0.18); applyTilt(tilt); }
      settling.forEach((s) => {
        s.rx = lerp(s.rx, 0, 0.18); s.ry = lerp(s.ry, 0, 0.18);
        if (Math.abs(s.rx) < 0.05 && Math.abs(s.ry) < 0.05) { s.el.style.removeProperty('transform'); settling.delete(s); }
        else applyTilt(s);
      });
      if (magnet) {
        magnet.el.style.transform = `translate3d(${magnet.x.toFixed(1)}px, ${magnet.y.toFixed(1)}px, 0)`;
      }
      if (now < idleUntil || tilt || settling.size || magnet) raf = requestAnimationFrame(frame);
      else raf = 0;
    };
    const wake = () => {
      idleUntil = performance.now() + 1600;
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const leaveCard = () => {
      if (!tilt) return;
      tilt.el.style.removeProperty('--sx');
      tilt.el.style.removeProperty('--sy');
      tilt.el.classList.remove('mx-hot');
      tilt.trx = 0; tilt.try_ = 0;
      settling.add(tilt);
      tilt = null;
    };
    const releaseMagnet = () => {
      if (!magnet) return;
      const m = magnet; magnet = null;
      m.el.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
      m.el.style.transform = 'translate3d(0,0,0)';
      window.setTimeout(() => { m.el.style.removeProperty('transition'); m.el.style.removeProperty('transform'); }, 480);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      tx = e.clientX; ty = e.clientY;
      if (!root.classList.contains('mx-live')) { ax = rx = tx; ay = ry = ty; root.classList.add('mx-live'); }
      const target = e.target as Element | null;

      ring.classList.toggle('is-link', !!target?.closest(INTERACTIVE));
      ring.classList.toggle('is-hidden', !!target?.closest(TEXT_FIELD));

      // Card tilt + spotlight
      const card = target?.closest<HTMLElement>('[data-fx="card"]') ?? null;
      if (card !== tilt?.el) {
        leaveCard();
        if (card) {
          const existing = [...settling].find((s) => s.el === card);
          if (existing) settling.delete(existing);
          tilt = existing ?? { el: card, rect: card.getBoundingClientRect(), rx: 0, ry: 0, trx: 0, try_: 0 };
          tilt.rect = card.getBoundingClientRect();
          card.classList.add('mx-hot');
        }
      }
      if (tilt) {
        const r = tilt.rect;
        const px = clamp((e.clientX - r.left) / r.width, 0, 1);
        const py = clamp((e.clientY - r.top) / r.height, 0, 1);
        tilt.try_ = (px - 0.5) * 7;
        tilt.trx = (0.5 - py) * 6;
        tilt.el.style.setProperty('--sx', `${(px * 100).toFixed(1)}%`);
        tilt.el.style.setProperty('--sy', `${(py * 100).toFixed(1)}%`);
      }

      // Magnetic buttons
      const btn = target?.closest<HTMLElement>('[data-fx="magnet"]') ?? null;
      if (btn !== magnet?.el) {
        releaseMagnet();
        if (btn) {
          btn.style.removeProperty('transition');
          magnet = { el: btn, rect: btn.getBoundingClientRect(), x: 0, y: 0 };
        }
      }
      if (magnet) {
        const r = magnet.rect;
        magnet.x = clamp((e.clientX - (r.left + r.width / 2)) * 0.22, -10, 10);
        magnet.y = clamp((e.clientY - (r.top + r.height / 2)) * 0.28, -8, 8);
      }
      wake();
    };
    const onLeaveWindow = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      root.classList.remove('mx-live');
      leaveCard(); releaseMagnet(); wake();
    };
    const refreshRects = () => {
      if (tilt) tilt.rect = tilt.el.getBoundingClientRect();
      if (magnet) magnet.rect = magnet.el.getBoundingClientRect();
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseout', onLeaveWindow);
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('scroll', refreshRects, { passive: true });
    cleanups.push(() => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseout', onLeaveWindow);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      window.removeEventListener('scroll', refreshRects);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove('mx-live');
    });
  }

  return () => { cleanups.reverse().forEach((fn) => fn()); };
}
