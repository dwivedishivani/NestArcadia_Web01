const WA_URL = 'https://wa.me/918448061997?text=Hi%20NestArcadia%2C%20I%20would%20like%20to%20discuss%20interior%20design%20for%20my%20home%20in%20Noida%2FGreater%20Noida.';

export default function WhatsApp() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with a NestArcadia designer on WhatsApp"
      className="group fixed bottom-[88px] right-6 z-50 flex items-center gap-2.5 bg-[#25D366] px-3.5 py-3 text-white shadow-[0_10px_26px_rgba(37,211,102,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(37,211,102,0.4)] sm:bottom-6 sm:right-6"
    >
      {/* WhatsApp SVG icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="white"
        className="shrink-0"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.93 1.395 5.6L0 24l6.585-1.371A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.36-.213-3.712.974.991-3.625-.235-.373A9.818 9.818 0 012.182 12c0-5.421 4.397-9.818 9.818-9.818 5.421 0 9.818 4.397 9.818 9.818 0 5.421-4.397 9.818-9.818 9.818z" />
      </svg>

      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-36 group-hover:opacity-100 sm:block">Chat with Designer</span>
      <span className="sr-only">Chat with Designer</span>
    </a>
  );
}
