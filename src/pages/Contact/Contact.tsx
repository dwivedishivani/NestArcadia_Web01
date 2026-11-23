import { Link } from 'react-router';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=G-59%2C%20Fusion%20Ufairia%20Mall%2C%20Sector%2016B%2C%20Greater%20Noida%20West%2C%20Uttar%20Pradesh%20201310';
const WHATSAPP_URL =
  'https://wa.me/918448061997?text=Hello%20NestArcadia%2C%20I%20am%20interested%20in%20discussing%20my%20interior%20design%20project.';

const channels = [
  { label: 'Call', value: '+91 84480 61997', href: 'tel:+918448061997', note: 'Speak to the studio directly.' },
  { label: 'WhatsApp', value: '+91 84480 61997', href: WHATSAPP_URL, note: 'Share a floor plan or photos.', external: true },
  { label: 'Email', value: 'info@nestarcadia.com', href: 'mailto:info@nestarcadia.com', note: 'For briefs, documents and questions.' },
];

export default function Contact() {
  return (
    <div className="pt-20 lg:pt-[90px]">
      <header className="max-w-[1100px] mx-auto px-6 lg:px-20 pt-16 pb-12 border-b border-[#D4CBBB]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#17665B] mb-4">Contact</p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-[#1A1714] leading-[1.05]">Talk to NestArcadia</h1>
        <p className="text-[#6B5E4E] text-[15px] mt-4 max-w-2xl leading-relaxed">
          Interior design and turnkey execution for homes and workspaces in Noida Extension, Greater Noida West and Delhi NCR.
        </p>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 lg:px-20 py-14 lg:py-20">
        <section aria-labelledby="contact-channels">
          <h2 id="contact-channels" className="font-display text-2xl text-[#1A1714] mb-6">Reach the studio</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {channels.map((c) => (
              <li key={c.label} className="border border-[#D4CBBB] bg-white/50 p-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-2">{c.label}</p>
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="text-[15px] font-semibold text-[#1C3A5A] hover:text-[#17665B] break-words"
                >
                  {c.value}
                </a>
                <p className="text-[13px] text-[#6B5E4E] mt-2 leading-relaxed">{c.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 grid gap-8 md:grid-cols-2" aria-labelledby="contact-visit">
          <div>
            <h2 id="contact-visit" className="font-display text-2xl text-[#1A1714] mb-4">Visit our office</h2>
            <address className="not-italic text-[14px] leading-7 text-[#52677E]">
              NestArcadia<br />
              G-59, Fusion Ufairia Mall, Sector 16B<br />
              Greater Noida West, Uttar Pradesh 201310
            </address>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[14px] text-[#17665B] underline underline-offset-4">
              Open in Google Maps
            </a>
          </div>
          <div>
            <h2 className="font-display text-2xl text-[#1A1714] mb-4">Planning a project?</h2>
            <p className="text-[14px] leading-7 text-[#52677E]">
              Share your property type, location, possession timeline and what you need from the space. We will come back with the right next step.
            </p>
            <Link
              to="/start-your-project/"
              className="inline-block mt-5 text-[13px] font-semibold text-white bg-[#17665B] px-5 py-2.5 hover:bg-[#0f4f46] transition-colors"
            >
              Start Your Project →
            </Link>
          </div>
        </section>

        <nav aria-label="Related pages" className="mt-16 pt-8 border-t border-[#D4CBBB] flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          <Link to="/our-story/" className="text-[#1C3A5A] hover:text-[#17665B]">About NestArcadia</Link>
          <Link to="/terms/" className="text-[#1C3A5A] hover:text-[#17665B]">Terms of Use</Link>
          <Link to="/privacy-policy/" className="text-[#1C3A5A] hover:text-[#17665B]">Privacy Policy</Link>
          <Link to="/" className="text-[#1C3A5A] hover:text-[#17665B]">Home</Link>
        </nav>
      </main>
    </div>
  );
}
