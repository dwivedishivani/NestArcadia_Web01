const WHATSAPP_LAYOUT_URL = 'https://wa.me/918448061997?text=Hi%20NestArcadia%2C%20I%20would%20like%20to%20share%20my%20floor%20plan%20for%20a%20space-planning%20consultation.';

const residences = ['ATS Greens', 'Cleo County', 'Mahagun Moderne', 'Gaur City', 'Ace Parkway', 'Jaypee Greens', 'Sector 150', 'Greater Noida West'];

export default function FeaturedResidences() {
  return (
    <section className="na-featured-residences bg-[#ECE4D8] px-6 py-20 lg:px-20" aria-labelledby="featured-residences-title">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#3C6452]">Noida Extension & Greater Noida West</p>
          <h2 id="featured-residences-title" className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.06] text-[#272821]">Local Societies<br />&amp; Home Layouts</h2>
          <p className="mt-5 max-w-md text-[15px] leading-[1.85] text-[#6D685D]">We plan around each home’s actual layout—not just the society name. Room proportions, balcony access, daylight, builder-fixed services and storage needs all matter in Noida Extension and Greater Noida West.</p>
        </div>
        <div className="border-t border-[#DCD1C2] pt-5 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-12">
          <div className="flex flex-wrap gap-2.5">
            {residences.map((residence, index) => (
              <span key={residence} className={`border px-4 py-2.5 text-[13px] ${index === 0 ? 'border-[#27463D] bg-[#27463D] text-white' : 'border-[#C8BDAE] text-[#27463D]'}`}>
                {residence}
              </span>
            ))}
          </div>
          <div className="mt-8 border-l-2 border-[#1C7657] bg-[#F5F1E8] px-6 py-6">
            <p className="font-display text-xl leading-snug text-[#27463D]">Have a 2BHK, 3BHK, 4BHK or Villa floor plan?</p>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-[#6D685D]">Share your layout on WhatsApp (+91 8448061997) for a complimentary space-planning consultation.</p>
            <a href={WHATSAPP_LAYOUT_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex border-b border-[#27463D] pb-1 text-[13px] font-semibold text-[#27463D] transition-colors hover:border-[#1C7657] hover:text-[#178f46]">
              Share your floor plan on WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
