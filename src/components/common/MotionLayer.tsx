import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { initMotion } from '../../lib/motion';

// Mounted once inside the router. Re-initialises when the route changes so every page gets
// its own reveals, and replays a soft entrance on the new page.
export default function MotionLayer() {
  const { pathname } = useLocation();
  useEffect(() => {
    const main = document.querySelector('main');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (main && !reduce && !pathname.startsWith('/admin')) {
      main.classList.remove('mx-route');
      void main.offsetWidth;
      main.classList.add('mx-route');
    }
    const dispose = initMotion();
    return () => { dispose(); };
  }, [pathname]);
  return null;
}
