const WHATSAPP_LAYOUT_URL = 'https://wa.me/918448061997?text=Hi%20NestArcadia%2C%20I%20would%20like%20to%20share%20my%20floor%20plan%20for%20a%20space-planning%20consultation.';

const residences = ['Jaypee Greens', 'ATS Greens', 'Cleo County', 'Mahagun Moderne', 'Gaur City', 'Ace Parkway', 'Sector 150', 'Greater Noida West'];

export default function FeaturedResidences() {
  return (
    <section className="bg-[#EAE4DA] px-6 py-20 lg:px-20" aria-labelledby="featured-residences-title">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E]">NCR neighbourhood knowledge</p>
          <h2 id="featured-residences-title" className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.06] text-[#1A1714]">Featured Residences<br />&amp; Societies</h2>
          <p className="mt-5 max-w-md text-[15px] leading-[1.85] text-[#6B5E4E]">From compact family apartments to larger villas, we shape interiors around the layouts, light and real routines of Noida, Greater Noida and Greater Noida West.</p>
        </div>
        <div className="border-t border-[#D4CBBB] pt-5 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-12">
          <div className="flex flex-wrap gap-2.5">
            {residences.map((residence, index) => (
              <span key={residence} className={`border px-4 py-2.5 text-[13px] ${index === 0 ? 'border-[#1C3A5A] bg-[#1C3A5A] text-white' : 'border-[#C9BFAF] text-[#1C3A5A]'}`}>
                {residence}
              </span>
            ))}
          </div>
          <div className="mt-8 border-l-2 border-[#25D366] bg-[#F2EDE4] px-6 py-6">
            <p className="font-display text-xl leading-snug text-[#1C3A5A]">Have a 2BHK, 3BHK, 4BHK or Villa floor plan?</p>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-[#6B5E4E]">Share your layout on WhatsApp (+91 8448061997) for a complimentary space-planning consultation.</p>
            <a href={WHATSAPP_LAYOUT_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex border-b border-[#1C3A5A] pb-1 text-[13px] font-semibold text-[#1C3A5A] transition-colors hover:border-[#25D366] hover:text-[#178f46]">
              Share your floor plan on WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
