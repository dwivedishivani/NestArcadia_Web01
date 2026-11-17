import { Link } from 'react-router';

export default function MobileConversionBar() {
  const message = 'Hi%20NestArcadia%2C%20I%20would%20like%20to%20discuss%20interior%20design%20for%20my%20home%20in%20Noida%2FGreater%20Noida.';
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px border-t border-border-mint bg-cream p-2 sm:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <a href={`https://wa.me/918448061997?text=${message}`} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center bg-brand-forest px-3 text-center text-[13px] font-semibold text-white">
        WhatsApp Us
      </a>
      <Link to="/start-your-project/" className="flex min-h-12 items-center justify-center bg-brand-navy px-3 text-center text-[13px] font-semibold text-white">
        Get a Consultation
      </Link>
    </div>
  );
}
