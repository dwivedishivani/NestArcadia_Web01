import type { Page } from '../../App';

interface Props { setPage: (page: Page) => void; }

export default function MobileConversionBar({ setPage }: Props) {
  const message = 'Hi%20NestArcadia%2C%20I%20would%20like%20to%20discuss%20interior%20design%20for%20my%20home%20in%20Noida%2FGreater%20Noida.';
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px border-t border-[#D4CBBB] bg-[#F2EDE4] sm:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <a
        href={`https://wa.me/918448061997?text=${message}`}
        data-analytics-placement="mobile_bottom_bar"
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 items-center justify-center bg-[#17665B] px-3 text-center text-[13px] font-semibold text-white active:bg-[#0f4f46]"
      >
        WhatsApp Us
      </a>
      <button
        data-analytics-event="cta_click"
        data-analytics-placement="mobile_bottom_bar"
        onClick={() => setPage('project')
        className="min-h-12 bg-[#1C3A5A] px-3 text-center text-[13px] font-semibold text-white active:bg-[#152a44]"
      >
        Plan Your Interior
      </button>
    </div>
  );
}
