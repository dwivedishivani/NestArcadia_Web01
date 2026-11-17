import type { Page } from '../../App';

interface Props { setPage: (page: Page) => void; }

export default function MobileConversionBar({ setPage }: Props) {
  const message = 'Hi%20NestArcadia%2C%20I%20would%20like%20to%20discuss%20interior%20design%20for%20my%20home%20in%20Noida%2FGreater%20Noida.';
  return (
    <div
      className="na-mobile-conversion fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px border-t border-[#DCD1C2] bg-[#F5F1E8] sm:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <a
        href={`https://wa.me/918448061997?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 items-center justify-center bg-[#3C6452] px-3 text-center text-[13px] font-semibold text-white active:bg-[#294D40]"
      >
        WhatsApp Us
      </a>
      <button
        onClick={() => setPage('project')}
        className="min-h-12 bg-[#27463D] px-3 text-center text-[13px] font-semibold text-white active:bg-[#1C352D]"
      >
        Plan Your Interior
      </button>
    </div>
  );
}
