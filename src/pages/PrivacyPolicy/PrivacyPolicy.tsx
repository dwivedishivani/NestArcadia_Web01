import { Link } from 'react-router';

const sections = [
  {
    title: '1. Information we collect',
    body: [
      'When you browse NestArcadia, we may process technical and usage information such as pages viewed, approximate location derived from network information, device/browser information and interactions with the website, depending on your consent choices.',
      'When you submit the Start Your Project form, we collect the information you choose to provide, including your name, email address, phone number, city, project type, home configuration where applicable, budget range, timeline, design style and any message you submit.',
      'We do not intentionally ask for sensitive personal information through the website. Please do not include passwords, financial account details, government ID numbers or other sensitive information in free-text fields.'
    ]
  },
  {
    title: '2. How we use information',
    body: [
      'We use enquiry information to respond to project requests, discuss requirements, provide estimates or consultations, and manage follow-up communications.',
      'We use website analytics and advertising measurement to understand website usage, improve the website and measure the performance of marketing campaigns, subject to your consent where required.',
      'We may use information to maintain website security, prevent abuse or spam, troubleshoot technical problems and comply with applicable legal obligations.'
    ]
  },
  {
    title: '3. Services and third parties',
    body: [
      'Google Analytics: NestArcadia uses Google Analytics 4 to understand website traffic, engagement and page performance. Analytics storage is initially denied and is enabled only according to your consent choice.',
      'Google Tag Manager and Google Ads: the website uses Google Tag Manager to manage measurement tags and Google Ads measurement to understand advertising performance and enquiries. Advertising-related storage and signals are controlled through Google Consent Mode.',
      'Supabase: NestArcadia uses Supabase for website data infrastructure, including enquiry records, published content and website media. Information submitted through the project form is transmitted to our Supabase-hosted backend/database so we can process the enquiry.',
      'Google Fonts: the website loads Playfair Display and DM Sans from Google Fonts. Your browser may connect to Google infrastructure to retrieve these font files.',
      'WhatsApp: the website provides optional WhatsApp links. If you choose to use WhatsApp, the interaction is handled by WhatsApp and is subject to WhatsApp\'s own privacy terms. In some form-error flows, the website can open WhatsApp with the project details you entered pre-filled; nothing is sent to WhatsApp unless you choose to open and send the message.',
      'Social media and external links: links to Instagram, Facebook, LinkedIn, YouTube and other external services take you to third-party websites. Those services operate under their own privacy policies.'
    ]
  },
  {
    title: '4. Cookies, local storage and consent',
    body: [
      'The website uses essential browser storage to remember your privacy choices. The consent preference is stored locally in your browser under the key nestarcadia_consent_v2.',
      'Google technologies are configured with Consent Mode v2. Analytics and advertising storage are denied by default and may be updated when you make a privacy choice.',
      'You can reopen Privacy Choices at any time using the Privacy choices control at the bottom-left of the website. You can also control or delete cookies and local browser storage through your browser settings.'
    ]
  },
  {
    title: '5. How we protect information',
    body: [
      'We use reasonable technical and organisational measures appropriate to the website and the information handled. Access to administrative functions is separately protected, and project enquiries are handled through our backend infrastructure.',
      'No internet transmission or storage system can be guaranteed to be completely secure. Please avoid submitting information that is not necessary for your enquiry.'
    ]
  },
  {
    title: '6. Retention',
    body: [
      'We retain enquiry and business-contact information for as long as reasonably necessary to respond to enquiries, manage ongoing client relationships, maintain business records, resolve disputes and meet applicable legal or accounting requirements. When information is no longer required, we may delete or anonymise it.'
    ]
  },
  {
    title: '7. Your choices and rights',
    body: [
      'You can choose whether to allow analytics and advertising technologies through the website\'s Privacy Choices interface.',
      'You may contact us to ask what personal information we hold about you, request correction of inaccurate information, or request deletion where applicable and subject to legal or legitimate business requirements.'
    ]
  },
  {
    title: '8. Children',
    body: [
      'NestArcadia is a general-audience interior design website and is not directed at children. We do not knowingly solicit personal information from children.'
    ]
  },
  {
    title: '9. Changes to this notice',
    body: [
      'We may update this Privacy Policy when our website, services or legal requirements change. The latest version will be published on this page with the effective date shown below.'
    ]
  }
];

export default function PrivacyPolicy() {
  return (
    <div className="pt-20 lg:pt-[90px]">
      <header className="max-w-[1100px] mx-auto px-6 lg:px-20 pt-16 pb-12 border-b border-[#D4CBBB]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#17665B] mb-4">Privacy</p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-[#1A1714] leading-[1.05]">
          Privacy Policy
        </h1>
        <p className="text-[#6B5E4E] text-[15px] mt-4 max-w-2xl leading-relaxed">
          How NestArcadia collects, uses and protects information when you use this website.
        </p>
        <p className="text-[12px] text-[#8A7B69] mt-5">Effective date: 7 October 2026</p>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 lg:px-20 py-14 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-[15px] leading-7 text-[#52677E] mb-10">
            NestArcadia respects your privacy. This notice explains what information may be collected through
            nestarcadia.com, why it is used, the external services involved, and the choices available to you.
          </p>

          <div className="space-y-12">
            {sections.map(section => (
              <section key={section.title}>
                <h2 className="font-display text-2xl text-[#1A1714] mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="text-[14px] leading-7 text-[#52677E]">{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h2 className="font-display text-2xl text-[#1A1714] mb-4">10. Contact us</h2>
              <p className="text-[14px] leading-7 text-[#52677E]">
                For privacy questions, correction or deletion requests, contact NestArcadia at{' '}
                <a href="mailto:info@nestarcadia.com" className="text-[#17665B] underline">info@nestarcadia.com</a>{' '}
                or call <a href="tel:+918448061997" className="text-[#17665B] underline">+91 84480 61997</a>.
              </p>
            </section>
          </div>

          <div className="mt-14 pt-8 border-t border-[#D4CBBB]">
            <Link to="/" className="text-[14px] font-medium text-[#1C3A5A] hover:text-[#17665B]">
              ← Back to NestArcadia
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
