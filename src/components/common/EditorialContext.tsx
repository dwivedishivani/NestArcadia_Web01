import type { Page } from '../../App';

const content: Record<Page, { title: string; label: string; paragraphs: string[] }> = {
  home: {
    label: 'The NestArcadia approach',
    title: 'Indian interior design that begins with the way you live',
    paragraphs: [
      'NestArcadia is an Indian interior design studio for homeowners who want more than a finished room. We begin with daily rituals: the first cup of chai, a child’s homework at the dining table, a grandparents’ favourite chair, the way afternoon light enters a living room. Those details guide our layouts, storage, lighting and material choices, so the result feels personal from the first day—not merely styled for a photograph.',
      'Our work brings regional craft into contemporary homes with care. A handwoven textile, a carved timber detail, lime plaster or a finely proportioned jaali can hold the memory of a place while still serving a modern apartment, villa or holiday home. We design across India and coordinate the practical work behind a beautiful home: planning, drawings, sourcing, custom furniture, site execution and finishing layers.',
      'Whether you are renovating a compact city apartment or building a family home from the ground up, our process is designed to make decisions clearer. Explore our design cultures, see completed homes, or begin with a project brief. We will help turn your requirements into an interior with a distinct sense of belonging.'
    ]
  },
  cultures: {
    label: 'A regional design lens',
    title: 'How Indian design cultures shape a more meaningful home',
    paragraphs: [
      'India does not have one interior language. It has many: the shade and carved stone of the North, the material restraint of the South, the handwork of the East, the exuberant geometry of the West and the grounded textures of Central India. NestArcadia studies these traditions as living sources of knowledge, not as a catalogue of motifs to be pasted onto a wall.',
      'For each project, we look at climate, craft, family history and the character of the architecture before choosing a regional thread. That can mean a quiet Athangudi-inspired floor, a brass detail, a cane screen that improves airflow, or textiles selected for their hand and longevity. The intention is always the same: an interior that carries cultural depth while remaining easy to inhabit today.',
      'This approach gives homeowners a useful vocabulary for their brief. You do not need to choose a single regional identity; you can borrow the qualities that resonate with you. Our interior designers translate those choices into an integrated palette, spatial plan and material story with appropriate scale and restraint.'
    ]
  },
  services: {
    label: 'Planning with confidence',
    title: 'A complete interior design service, from first idea to handover',
    paragraphs: [
      'A successful interior project makes many moving parts feel calm. NestArcadia combines interior design, project management, custom furniture and styling under one considered process. We document the decisions that matter early—layout, scope, budget range and visual direction—so the design can develop with clarity instead of costly surprises.',
      'Our designers create detailed plans around circulation, storage, daylight and the real routines of your household. We then coordinate materials, specialist craft and execution with an eye on proportion and finish. This is as valuable for a first home as it is for a larger villa: every project benefits from a clear sequence and a team accountable for the whole picture.',
      'You may choose a focused design consultation, a full interior package or turnkey execution. In every case, we explain what is included, what decisions are next and how the work will be reviewed. The goal is not just a beautiful reveal; it is a home that works well long after the final styling is complete.'
    ]
  },
  story: {
    label: 'Our point of view',
    title: 'A studio built around Indian craft, honest collaboration and lasting homes',
    paragraphs: [
      'NestArcadia was founded on a simple observation: the most memorable Indian homes are not assembled from a single trend. They are layered over time, shaped by family, climate, craft and the materials people touch every day. Our studio brings that sense of rootedness into projects with contemporary planning, careful detailing and a collaborative way of working.',
      'We partner with makers and specialists because real craft carries nuance that cannot be copied by a generic finish. At the same time, we are practical about modern life. A heritage-informed home should offer better storage, easier maintenance, comfortable light and rooms that change as a family changes. These are not competing ideas; they are the measure of good design.',
      'Our clients come to us with different styles and different homes, but they share a desire for an interior with staying power. We listen closely, give direct advice and keep the process transparent. That is how a home becomes personal rather than prescribed.'
    ]
  },
  journal: {
    label: 'Design knowledge',
    title: 'Ideas, materials and craft stories for contemporary Indian homes',
    paragraphs: [
      'The NestArcadia Journal is an ongoing field notebook for people who care about the feeling of home. We write about regional design traditions, material choices, layout ideas and the craftspeople whose work gives an interior its human texture. Each story is intended to be useful as well as inspiring—something you can take into a conversation with your designer, contractor or family.',
      'Good interior decisions become easier when you understand what a material can do. Rattan has a particular relationship to heat and air; lime plaster has a different character in changing light; a jaali can filter privacy without closing a room. We explore those practical qualities alongside the histories that make these details meaningful in the Indian context.',
      'Use the Journal to build your own point of view before starting a project. Save what resonates, notice the combinations you return to, and bring those observations to your brief. The strongest homes are not copied from a reference; they are composed from informed choices.'
    ]
  },
  homes: {
    label: 'Selected work',
    title: 'Interior design projects shaped by place, people and everyday use',
    paragraphs: [
      'Every NestArcadia home begins with an individual set of constraints and opportunities: an apartment’s daylight, a villa’s garden view, a family’s collected furniture or a city’s climate. Our portfolio shows the outcomes, but it also reflects the questions behind them—how to create privacy in an open plan, how to make a compact home feel generous, and how to introduce heritage without making a room feel overdone.',
      'Across these projects, you will find a shared design discipline. Materials are chosen for their character and performance, circulation is made clear, and the visual language is edited until it feels effortless. Some homes draw from a particular region; others take a lighter, more contemporary route. All are made to hold the lives taking place inside them.',
      'Filter by region or home type to find relevant references, then open a project for its essential details. If you see a direction that feels close to your own home, our team can help translate that mood into a plan suited to your space, budget and timeline.'
    ]
  },
  project: {
    label: 'Before we begin',
    title: 'Tell us how you want your home to feel and function',
    paragraphs: [
      'Starting an interior design project is easier when the brief begins with real life. Tell us who will use the space, what is not working today, what you want to keep and when you hope to move in. You do not need every answer yet. A clear starting point is enough for our team to recommend the right next step.',
      'The details in this form help us understand the scope: your city, property type, configuration, budget comfort and preferred timeline. They also help us prepare a more useful discovery conversation, whether you are looking for full turnkey interiors, thoughtful space planning or a heritage-led refresh of a few rooms.',
      'NestArcadia responds with care and practical clarity. After reviewing your brief, we will discuss feasibility, design direction and how our process can support your home. Prefer a conversation now? You can reach us directly by WhatsApp or email and we will take it from there.'
    ]
  },
  faq: {
    label: 'Clarity before commitment',
    title: 'Helpful answers for a more confident interior project',
    paragraphs: [
      'An interior project becomes easier when the important questions are answered early: what the scope includes, how decisions affect the budget, what will be custom, and how the work is sequenced. Our FAQs are designed to give homeowners in Greater Noida West, Noida Extension and NCR a useful starting point before a detailed consultation.',
      'Every home has different requirements, so these answers are a guide rather than a fixed promise. Carpet area, materials, hardware, appliances, site conditions and the degree of custom work all shape the final scope. A discovery conversation lets us translate those variables into a practical direction for your home or workplace.',
      'If your question is not covered, the fastest way forward is to share a little about the property, possession timeline and what you want the space to do better. NestArcadia can then recommend the most useful next step—whether that is a complete turnkey project, a focused service or an initial design consultation.'
    ]
  }
};

export default function EditorialContext({ page }: { page: Page }) {
  const item = content[page];
  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-20 pb-20" aria-labelledby={`editorial-${page}`}>
      <details className="group border-t border-[#B8D8D1] pt-6">
        <summary className="list-none cursor-pointer flex items-center justify-between gap-6 text-[#1C3A5A]">
          <span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-[#2D8C7E] mb-2">{item.label}</span>
            <span id={`editorial-${page}`} className="font-display text-2xl leading-tight">{item.title}</span>
          </span>
          <span aria-hidden="true" className="text-2xl text-[#2D8C7E] transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="grid lg:grid-cols-3 gap-6 pt-7 max-w-6xl">
          {item.paragraphs.map((paragraph) => <p key={paragraph} className="text-[15px] leading-[1.85] text-[#52677E]">{paragraph}</p>)}
        </div>
      </details>
    </section>
  );
}
