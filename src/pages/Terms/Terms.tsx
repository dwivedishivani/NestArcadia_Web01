import { Link } from 'react-router';

const sections = [
  {
    title: '1. About these terms',
    body: [
      'These Terms of Use apply to your use of nestarcadia.com (the "website"), which is operated by NestArcadia, an interior design and turnkey execution studio serving Noida Extension, Greater Noida West and the wider Delhi NCR region. By using the website you agree to these terms. If you do not agree, please do not use the website.',
    ],
  },
  {
    title: '2. Website content',
    body: [
      'The website shares information about our services, projects, design approach and published guidance. We try to keep it accurate and current, but content is provided for general information and may change without notice.',
      'Cost ranges, timelines, examples and design ideas shown on the website are indicative. They are not a quotation, offer or guarantee. The actual scope, price and schedule of any project depend on the property, site condition, specifications and decisions agreed with you.',
    ],
  },
  {
    title: '3. Project enquiries and estimates',
    body: [
      'Submitting the Start Your Project form, calling, messaging or emailing us is an enquiry only. It does not create a contract, reserve a slot or oblige either party to proceed.',
      'A design or execution engagement begins only when you and NestArcadia agree the scope, fees, payment schedule and timeline in writing. Any estimate we share beforehand is subject to site measurement, final drawings and material selection.',
    ],
  },
  {
    title: '4. Intellectual property',
    body: [
      'The text, photographs, drawings, design concepts, logos and other material on the website belong to NestArcadia or its licensors and are protected by applicable intellectual property laws.',
      'You may view and share links to the website for personal, non-commercial purposes. You may not copy, republish, scrape for resale or use our content or imagery commercially without our prior written permission.',
    ],
  },
  {
    title: '5. Acceptable use',
    body: [
      'Please use the website lawfully and in good faith. Do not attempt to interfere with its operation, gain unauthorised access to its administrative functions, submit false or misleading enquiries, or send content that is unlawful, abusive or harmful.',
    ],
  },
  {
    title: '6. Third-party services and links',
    body: [
      'The website links to third-party services such as WhatsApp, social media platforms and maps. Those services are operated by others under their own terms and privacy practices, and we are not responsible for them.',
    ],
  },
  {
    title: '7. Disclaimer and limits of liability',
    body: [
      'The website is provided on an "as is" and "as available" basis. To the extent permitted by law, NestArcadia is not liable for losses arising from your reliance on general website content, or from interruptions or errors in the website.',
      'Nothing in these terms limits any right or liability that cannot be limited under applicable law. The terms of any signed project agreement apply to that engagement.',
    ],
  },
  {
    title: '8. Privacy',
    body: [
      'How we collect and use information is described in our Privacy Policy, which forms part of these terms.',
    ],
  },
  {
    title: '9. Governing law',
    body: [
      'These terms are governed by the laws of India. Any dispute relating to the website will be subject to the jurisdiction of the competent courts in India.',
    ],
  },
  {
    title: '10. Changes to these terms',
    body: [
      'We may update these terms from time to time. The latest version will be published on this page with its effective date. Continued use of the website after an update means you accept the revised terms.',
    ],
  },
];

export default function Terms() {
  return (
    <div className="pt-20 lg:pt-[90px]">
      <header className="max-w-[1100px] mx-auto px-6 lg:px-20 pt-16 pb-12 border-b border-[#D4CBBB]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#17665B] mb-4">Legal</p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-[#1A1714] leading-[1.05]">Terms of Use</h1>
        <p className="text-[#6B5E4E] text-[15px] mt-4 max-w-2xl leading-relaxed">
          The terms that apply when you use nestarcadia.com and enquire about a NestArcadia project.
        </p>
        <p className="text-[12px] text-[#8A7B69] mt-5">Effective date: 23 November 2026</p>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 lg:px-20 py-14 lg:py-20">
        <div className="max-w-3xl">
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-2xl text-[#1A1714] mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="text-[14px] leading-7 text-[#52677E]">
                      {paragraph}
                      {section.title.startsWith('8.') && (
                        <>
                          {' '}
                          <Link to="/privacy-policy/" className="text-[#17665B] underline">Read the Privacy Policy</Link>.
                        </>
                      )}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h2 className="font-display text-2xl text-[#1A1714] mb-4">11. Contact us</h2>
              <p className="text-[14px] leading-7 text-[#52677E]">
                Questions about these terms can be sent to{' '}
                <a href="mailto:info@nestarcadia.com" className="text-[#17665B] underline">info@nestarcadia.com</a>{' '}
                or by phone on <a href="tel:+918448061997" className="text-[#17665B] underline">+91 84480 61997</a>. You can also
                visit our <Link to="/contact/" className="text-[#17665B] underline">contact page</Link>.
              </p>
            </section>
          </div>

          <div className="mt-14 pt-8 border-t border-[#D4CBBB]">
            <Link to="/" className="text-[14px] font-medium text-[#1C3A5A] hover:text-[#17665B]">← Back to NestArcadia</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
