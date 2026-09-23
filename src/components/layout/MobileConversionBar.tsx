import type { Page } from '../../App';

interface Props { setPage: (page: Page) => void; }

export default function MobileConversionBar({ setPage }: Props) {
  const message = encodeURIComponent('Hello NestArcadia, I would like to discuss my interior design project.');
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px border-t border-[#B8D8D1] bg-[#F2EDE4] p-2 sm:hidden">
      <a href={`https://wa.me/918448061997?text=${message}`} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center bg-[#2D8C7E] px-3 text-center text-[13px] font-semibold text-white">
        WhatsApp Us
      </a>
      <button onClick={() => setPage('project')} className="min-h-12 bg-[#1C3A5A] px-3 text-center text-[13px] font-semibold text-white">
        Get a Consultation
      </button>
    </div>
  );
}
