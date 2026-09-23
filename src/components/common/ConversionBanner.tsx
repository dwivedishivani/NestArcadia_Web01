import type { Page } from '../../App';

interface Props { page: Page; setPage: (page: Page) => void; }

const content: Partial<Record<Page, { image: string; eyebrow: string; title: string; text: string; cta: string }>> = {
  home: { image: 'photo-1761679296802-09d4d4687723', eyebrow: 'Make the first decision easier', title: 'Planning a home in Noida or Greater Noida West?', text: 'Tell us your property type, possession timeline and what you want the space to do better. We will help you find the right starting point.', cta: 'Plan Your Home Interior' },
  cultures: { image: 'photo-1758448511320-05d7d28f4298', eyebrow: 'Find your design language', title: 'Bring a rooted point of view to your new home.', text: 'From one crafted detail to a complete interior direction, we translate what you respond to into a practical, personal plan.', cta: 'Discuss Your Design Direction' },
  services: { image: 'photo-1723639904882-cb83cb0629e8', eyebrow: 'From scope to handover', title: 'Need a clear plan before you begin?', text: 'We can help you understand the right scope for a 2BHK, 3BHK, villa, office or newly handed-over property.', cta: 'Get a Project Consultation' },
  story: { image: 'photo-1764923431150-c97f3f9e6813', eyebrow: 'A considered next step', title: 'Your home deserves more than a generic interior.', text: 'Share how you live today and where you want the home to take you. NestArcadia will shape a design process around it.', cta: 'Start a Conversation' },
  journal: { image: 'photo-1600210491892-03d54c0aaf87', eyebrow: 'Turn ideas into a real plan', title: 'Seen something that feels like your home?', text: 'Bring the material, layout or idea you saved to a consultation. We will help you make it work for your own space and routine.', cta: 'Discuss Your Project' },
  homes: { image: 'photo-1729108281317-a6c01b07ed92', eyebrow: 'Your home can be next', title: 'Start with your rooms, routines and requirements.', text: 'Whether you are taking possession or renovating, we can translate the way you live into a clear interior plan.', cta: 'Get an Interior Estimate' },
  project: { image: 'photo-1722605090433-41d1183a792d', eyebrow: 'A better brief starts here', title: 'Already know what you want to improve?', text: 'Share the essentials now. We will use them to guide the next conversation and project scope.', cta: 'Complete Your Brief' },
};

export default function ConversionBanner({ page, setPage }: Props) {
  const item = content[page];
  if (!item) return null;
  const source = `https://images.unsplash.com/${item.image}?w=1440&h=460&fit=crop&auto=format&q=85`;
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 pb-16 lg:px-20 lg:pb-20">
      <div className="relative min-h-72 overflow-hidden bg-[#1C3A5A]">
        <img src={source} alt="NestArcadia interior design consultation" width="1440" height="460" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C3A5A]/90 via-[#1C3A5A]/65 to-[#1C3A5A]/20" />
        <div className="relative flex min-h-72 max-w-2xl flex-col justify-center px-7 py-10 lg:px-14">
          <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/60">{item.eyebrow}</p>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] leading-tight text-white">{item.title}</h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/75">{item.text}</p>
          <button onClick={() => setPage('project')} className="mt-7 w-fit border border-white/50 px-6 py-3 text-[14px] text-white transition-colors hover:border-[#2D8C7E] hover:bg-[#2D8C7E]">{item.cta} →</button>
        </div>
      </div>
    </section>
  );
}
