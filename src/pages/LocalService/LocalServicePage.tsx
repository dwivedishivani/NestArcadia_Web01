import type { Page } from '../../App';
import { resolveSiteImage } from '../../utils/siteImages';

export interface LocalServiceConfig {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  area: string;
  heroImage: string;
  introLabel: string;
  introTitle: string;
  intro: string;
  insights: Array<{ title: string; body: string }>;
  services: string[];
  fit: string[];
  process: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ href: string; label: string }>;
}

const image = (id: string) => resolveSiteImage(id);

export const localServicePages: LocalServiceConfig[] = [
  {
    path: '/interior-design-greater-noida-west',
    eyebrow: 'Greater Noida West · Interior Design',
    title: 'Interior Design in Greater Noida West',
    description: 'Interior design and turnkey execution for apartments, villas and new-possession homes in Greater Noida West — with practical planning for storage, kitchens, lighting and site execution.',
    area: 'Greater Noida West',
    heroImage: image('photo-1600210492486-724fe5c67fb0'),
    introLabel: 'A local design brief',
    introTitle: 'A new home deserves more than a package of finishes',
    intro: 'Greater Noida West has grown around apartment living, new possessions and fast-changing family needs. The interior brief is rarely just about how the home should look. It is about where the dining table can actually sit, how much storage a family needs, whether the kitchen works every day, and which electrical and lighting decisions should be made before the walls are finished. We start there — with the property and the people who will use it.',
    insights: [
      { title: 'New-possession planning', body: 'The best time to resolve kitchen layouts, wardrobes, lighting and electrical points is before execution gathers speed. Early planning reduces avoidable changes later.' },
      { title: 'Storage without crowding', body: 'Apartment interiors need storage, but not at the cost of circulation. We look at full-height opportunities, furniture scale and what needs to stay accessible every day.' },
      { title: 'A home that feels personal', body: 'A local interior should still feel like your home, not a model apartment. Materials, colour, furniture and details are developed around your routines and preferences.' },
    ],
    services: ['2BHK, 3BHK and 4BHK apartment interior planning','Turnkey interior design and site coordination','Modular kitchens, wardrobes and custom storage','Lighting, material and finish planning','Vastu-led layout discussions when requested','Commercial office interiors for local businesses'],
    fit: ['New-possession apartments where electrical, lighting and storage decisions need to be made before execution','Families that need flexible rooms, concealed storage and practical everyday circulation','Homeowners who want a single design direction carried through drawings, materials and site work','Small commercial teams planning a client-facing office in Greater Noida West'],
    process: ['Property and brief review — understand the layout, possession status, household and scope.','Space planning — resolve circulation, storage, kitchen, furniture and major services before styling.','Design development — material palette, 3D visualisation, drawings and execution decisions.','Execution coordination — align vendors, craftsmen, site work and quality checks.','Handover — review the completed work against the agreed scope and practical use.'],
    faqs: [
      { question: 'Do you design 2BHK and 3BHK interiors in Greater Noida West?', answer: 'Yes. NestArcadia plans interiors for 2BHK, 3BHK and 4BHK apartments, with the scope shaped around the actual layout, household routines, storage needs and material choices.' },
      { question: 'Can you handle turnkey execution in Greater Noida West?', answer: 'Depending on the project scope, turnkey work can include design development, material coordination, custom and modular furniture, site coordination, lighting and final handover.' },
      { question: 'When should I contact an interior designer for a new-possession flat?', answer: 'Ideally before civil work and major service decisions begin. Early planning gives the design team more control over electrical points, kitchen planning, storage, lighting and sequencing.' },
    ],
    related: [
      { href: '/interior-design-services', label: 'Explore interior design and turnkey services' },
      { href: '/journal/buying-new-flat-interior-checklist', label: 'Read the new-flat interior checklist' },
      { href: '/journal/space-saving-interiors-noida', label: 'Read the space-saving guide for NCR apartments' },
    ],
  },
  {
    path: '/interior-design-noida-extension',
    eyebrow: 'Noida Extension · Interior Design',
    title: 'Interior Design for Homes in Noida Extension',
    description: 'Practical residential interior design for Noida Extension apartments, from space planning and modular kitchens to custom storage, lighting and turnkey execution.',
    area: 'Noida Extension',
    heroImage: image('photo-1618221195710-dd6b41faaea6'),
    introLabel: 'Designing for apartment life',
    introTitle: 'Start with the floor plan. Then make it feel like home.',
    intro: 'Noida Extension is largely an apartment-led market, which means good interiors have to respect the realities of the builder plan. A mood board can establish a direction, but it cannot tell you whether a wardrobe will steal circulation, whether the sofa is the right scale, or whether the kitchen has enough usable storage. Our design process brings those practical decisions forward, then builds the visual language around them.',
    insights: [
      { title: 'Make every square foot work', body: 'Compact rooms benefit from deliberate furniture sizes, vertical storage and clear circulation. The goal is not to fill the apartment; it is to make it easier to live in.' },
      { title: 'Design around real routines', body: 'Work-from-home, guests, children, appliances and everyday storage all compete for space. We plan the home around how your household actually moves through it.' },
      { title: 'Plan before the site gets busy', body: 'Drawings, materials, lighting and service decisions are easier to coordinate before execution starts. That creates a clearer brief for the people building the work.' },
    ],
    services: ['2BHK, 3BHK and 4BHK apartment interiors','Space planning and furniture layouts','Modular kitchen and wardrobe planning','Custom storage for compact apartments','Lighting and material selection','Turnkey design-to-handover coordination'],
    fit: ['New homeowners preparing a flat for possession','Compact apartments where every storage decision affects circulation','Families combining work-from-home, guest and everyday living needs','Homeowners who want a clear scope before committing to execution'],
    process: ['Understand the property — review drawings, site conditions, household requirements and budget direction.','Plan the space — define room roles, circulation, storage and fixed-service requirements.','Develop the design — visualise the palette and document the details needed for execution.','Coordinate execution — manage the sequence of civil, electrical, ceiling, joinery and finish work.','Review handover — check the finished space for function, fit and agreed scope.'],
    faqs: [
      { question: 'Can you design a compact 2BHK in Noida Extension?', answer: 'Yes. Compact homes benefit from early space planning, especially around entry storage, kitchen workflow, wardrobes, flexible rooms and furniture scale.' },
      { question: 'Do you work with new-possession apartments?', answer: 'Yes. Early involvement can help coordinate layout, electrical, lighting, storage and material decisions before execution begins.' },
      { question: 'Do you provide only design, or execution too?', answer: 'The scope can be tailored. You can discuss focused design support or a broader turnkey process depending on the project requirements.' },
    ],
    related: [
      { href: '/interior-design-services', label: 'See the full service scope' },
      { href: '/journal/modular-kitchen-noida', label: 'Read the modular kitchen guide' },
      { href: '/journal/apartment-renovation-noida', label: 'Read the apartment renovation sequence' },
    ],
  },
  {
    path: '/commercial-interior-design-greater-noida-west',
    eyebrow: 'Greater Noida West · Commercial Interiors',
    title: 'Commercial Interior Design in Greater Noida West',
    description: 'Commercial office interior design in Greater Noida West focused on workflow, client experience, lighting, acoustics, storage and practical execution.',
    area: 'Greater Noida West',
    heroImage: image('photo-1497366811353-6870744d04b2'),
    introLabel: 'A commercial design brief',
    introTitle: 'An office should work on an ordinary Tuesday, not only in photographs',
    intro: 'A commercial interior has to support the working day. That means understanding how people arrive, where focused work happens, how meetings are handled, where documents and equipment live, and what a visitor experiences in the first few minutes. For offices in Greater Noida West, we balance those operational requirements with a considered visual environment rather than treating the office as a collection of decorative finishes.',
    insights: [
      { title: 'Workflow before styling', body: 'The position of reception, workstations, meeting rooms and support spaces affects the whole office. Zoning is resolved before materials and visual details take over.' },
      { title: 'Privacy and acoustics matter', body: 'A meeting room can look polished and still perform badly. Privacy, sound control, lighting and furniture placement need to be considered together.' },
      { title: 'Plan for the business you are becoming', body: 'A growing team may need more desks, storage or flexible meeting space later. Good planning leaves sensible room for change instead of locking every square foot into one use.' },
    ],
    services: ['Office space planning and zoning','Reception and client-facing areas','Meeting rooms and privacy planning','Workstation, storage and circulation planning','Lighting and acoustic considerations','Material coordination and execution support'],
    fit: ['Startups and professional teams moving into a new office','Growing businesses that need clearer zoning and storage','Client-facing offices where reception and meeting spaces matter','Teams looking to balance a considered brand environment with practical daily use'],
    process: ['Brief and site review — understand team size, workflow, visitors, services and constraints.','Zoning — separate arrival, focused work, collaboration, meeting and support areas.','Design development — coordinate materials, lighting, furniture, storage and visual identity.','Execution planning — resolve drawings, materials and sequence before site work begins.','Handover review — check the space against operational requirements and agreed scope.'],
    faqs: [
      { question: 'What does commercial office interior design include?', answer: 'Depending on scope, it can include space planning, reception and meeting-room design, workstation planning, storage, lighting, material selection and execution coordination.' },
      { question: 'Can you design a compact office in Greater Noida West?', answer: 'Yes. Compact offices benefit from disciplined zoning, circulation planning, multi-purpose spaces and storage that does not consume valuable work area.' },
      { question: 'Do you also handle execution?', answer: 'Execution support can be included where the project scope calls for it. The exact responsibilities, materials and handover requirements are agreed during project planning.' },
    ],
    related: [
      { href: '/interior-design-services', label: 'Explore commercial and turnkey services' },
      { href: '/journal/commercial-office-interior-greater-noida-west', label: 'Read the commercial office design guide' },
      { href: '/journal/office-reception-design-ncr', label: 'Read the office reception guide' },
    ],
  },
];


const gallery = [
  image('photo-1600210492486-724fe5c67fb0'),
  image('photo-1618221195710-dd6b41faaea6'),
  image('photo-1600607687920-4e2a09cf159d'),
  image('photo-1600566753086-00f18fb6b3ea'),
];

const additionalLocationPages: LocalServiceConfig[] = [
  {
    path: '/interior-design-greater-noida',
    eyebrow: 'Greater Noida · Interior Design',
    title: 'Interior Design in Greater Noida',
    description: 'Thoughtful residential and commercial interiors in Greater Noida, with practical space planning, custom storage, material direction and turnkey execution.',
    area: 'Greater Noida',
    heroImage: gallery[0],
    introLabel: 'Designed around real life',
    introTitle: 'Good interiors begin with the way a space is actually used.',
    intro: 'Greater Noida brings together new apartments, independent homes, villas and growing workspaces. NestArcadia approaches each brief from the floor plan, the people using it and the decisions that matter on site—then builds a visual language that feels distinctly yours.',
    insights: [
      { title: 'Plan before you style', body: 'Storage, circulation, kitchen workflow and electrical points should be resolved before finishes take over the conversation.' },
      { title: 'Keep the home personal', body: 'We use materials, colour, furniture and Indian craft references selectively, rather than turning every room into a catalogue.' },
      { title: 'Design with execution in mind', body: 'Drawings and material decisions are developed so the design can survive contact with a real site.' },
    ],
    services: ['2BHK, 3BHK and 4BHK home interiors','Villa and farmhouse interior planning','Modular kitchens, wardrobes and custom storage','Lighting, material and finish direction','Vastu-led planning when requested','Turnkey design and execution coordination'],
    fit: ['New-possession apartments and independent homes','Families planning a complete interior before moving in','Homeowners who need a clear design and execution scope','Small businesses planning a considered workspace'],
    process: ['Share the property and brief.','Resolve layout, storage, furniture and services.','Develop the visual direction and execution drawings.','Coordinate site work, materials and vendors.','Review the finished space and handover.'],
    faqs: [
      { question: 'Do you design homes in Greater Noida?', answer: 'Yes. NestArcadia works on apartments, villas and other residential interiors in Greater Noida, with scope shaped around the property and household.' },
      { question: 'Can you manage turnkey execution?', answer: 'Turnkey execution can be included where the project scope calls for it, from design decisions through site coordination and handover.' },
    ],
    related: [{ href: '/interior-design-services', label: 'See all interior design services' }, { href: '/start-your-project', label: 'Share your project brief' }],
    gallery,
  },
  {
    path: '/interior-design-noida',
    eyebrow: 'Noida · Interior Design',
    title: 'Interior Design in Noida',
    description: 'Residential and commercial interior design in Noida for apartments, villas and workspaces—planned for everyday use, not just the final photograph.',
    area: 'Noida',
    heroImage: gallery[1],
    introLabel: 'A practical design approach',
    introTitle: 'Make the space work first. Then make it memorable.',
    intro: 'From established sectors to new apartment developments, Noida homes and offices come with very different constraints. NestArcadia keeps the process grounded in layout, storage, lighting, materials and the realities of execution, while giving the finished space a warm Indian identity.',
    insights: [
      { title: 'Space planning', body: 'Furniture scale, circulation and storage are resolved early so the finished room does not feel over-designed or under-used.' },
      { title: 'Material intelligence', body: 'We choose finishes for how they age, clean and perform—not only for how they look on a mood board.' },
      { title: 'A clear execution brief', body: 'The design is translated into decisions that vendors and craftsmen can actually build.' },
    ],
    services: ['Apartment and villa interiors','2BHK, 3BHK and 4BHK planning','Office and commercial interiors','Custom furniture and storage','Lighting and material planning','Turnkey execution coordination'],
    fit: ['Apartment owners renovating or starting from bare possession','Families balancing aesthetics with storage and daily routines','Professionals creating a home office or flexible room','Businesses needing a polished but practical workspace'],
    process: ['Understand the property and priorities.','Plan the space and major services.','Develop materials, furniture and visual direction.','Prepare the execution scope and coordinate site work.','Complete review and handover.'],
    faqs: [
      { question: 'What type of projects do you take in Noida?', answer: 'Residential apartments, villas and selected commercial or office interiors, depending on project scope and requirements.' },
      { question: 'Can you help with both design and execution?', answer: 'Yes. The engagement can cover design only or extend through execution coordination and handover.' },
    ],
    related: [{ href: '/interior-design-services', label: 'Explore our services' }, { href: '/start-your-project', label: 'Start a project conversation' }],
    gallery,
  },
  {
    path: '/interior-design-ghaziabad',
    eyebrow: 'Ghaziabad · Interior Design',
    title: 'Interior Design in Ghaziabad',
    description: 'Home and commercial interior design in Ghaziabad with practical planning for apartments, storage, kitchens, lighting, materials and execution.',
    area: 'Ghaziabad',
    heroImage: gallery[2],
    introLabel: 'NCR, without the generic look',
    introTitle: 'An interior should belong to the people living or working there.',
    intro: 'Ghaziabad has everything from compact apartments to larger family homes and growing commercial spaces. NestArcadia builds the brief around the actual property, then uses proportion, material and Indian design references to make the space feel considered rather than copied.',
    insights: [
      { title: 'Use the plan intelligently', body: 'We look for better circulation, usable storage and furniture placement before adding decorative layers.' },
      { title: 'Keep maintenance realistic', body: 'Every finish has a life beyond the handover photograph. Materials are considered for daily use and upkeep.' },
      { title: 'One design direction', body: 'The kitchen, wardrobes, lighting and furniture should feel like parts of one home rather than separate purchases.' },
    ],
    services: ['Residential interior design','2BHK and 3BHK apartment planning','Kitchen, wardrobe and storage design','Commercial and office interiors','Material and lighting selection','Turnkey execution support'],
    fit: ['Apartment homeowners and families','Renovation projects needing a clearer design direction','New-possession homes preparing for execution','Businesses setting up a client-facing office'],
    process: ['Property review and project brief.','Space planning and scope definition.','Design, materials and drawings.','Execution coordination and quality checks.','Final review and handover.'],
    faqs: [
      { question: 'Do you take residential projects in Ghaziabad?', answer: 'Yes, subject to project scope and location. We focus on practical residential interiors and can discuss the property before defining the engagement.' },
      { question: 'Do you also work on offices?', answer: 'Yes. Commercial work can include zoning, reception, meeting areas, workstations, storage, lighting and execution coordination.' },
    ],
    related: [{ href: '/interior-design-services', label: 'View interior design services' }, { href: '/start-your-project', label: 'Discuss your property' }],
    gallery,
  },
  {
    path: '/interior-design-indirapuram',
    eyebrow: 'Indirapuram · Interior Design',
    title: 'Interior Design in Indirapuram',
    description: 'Residential interior design in Indirapuram focused on apartment planning, storage, kitchens, lighting, custom furniture and practical execution.',
    area: 'Indirapuram',
    heroImage: gallery[0],
    introLabel: 'Apartment living, better planned',
    introTitle: 'More usable space without making the home feel busy.',
    intro: 'Indirapuram apartments often need to balance family storage, work-from-home needs and everyday circulation within a fixed builder layout. NestArcadia brings those constraints into the design early, then creates a warmer, more personal visual direction.',
    insights: [
      { title: 'Storage with breathing room', body: 'Full-height storage and better furniture proportions can add capacity without closing down circulation.' },
      { title: 'Flexible rooms', body: 'Guest rooms, study corners and work-from-home requirements can be planned to adapt over time.' },
      { title: 'Details that last', body: 'Materials and joinery are selected with everyday use, cleaning and maintenance in mind.' },
    ],
    services: ['2BHK and 3BHK apartment interiors','Modular kitchen and wardrobe planning','Custom storage and furniture','Lighting and material direction','Vastu-led planning when requested','Turnkey execution coordination'],
    fit: ['Apartment renovations and new interiors','Families needing more storage without visual clutter','Work-from-home households','Homeowners who want one design direction from brief to site'],
    process: ['Review the layout and household needs.','Resolve space planning and storage.','Develop design and material direction.','Coordinate execution and site decisions.','Review and handover.'],
    faqs: [
      { question: 'Can you redesign an existing Indirapuram apartment?', answer: 'Yes. Existing homes can be reviewed for layout, storage, lighting, furniture and finish improvements before the scope is defined.' },
      { question: 'Do you provide custom storage?', answer: 'Yes. Storage can be planned around the room, furniture scale and what the household actually needs to keep accessible.' },
    ],
    related: [{ href: '/interior-design-services', label: 'Explore home interior services' }, { href: '/start-your-project', label: 'Share your project brief' }],
    gallery,
  },
  {
    path: '/interior-design-crossing-republik',
    eyebrow: 'Crossing Republik · Interior Design',
    title: 'Interior Design in Crossing Republik',
    description: 'Apartment interior design in Crossing Republik with practical space planning, kitchens, wardrobes, lighting and turnkey execution support.',
    area: 'Crossing Republik',
    heroImage: gallery[1],
    introLabel: 'Designed for the apartment you have',
    introTitle: 'A fixed floor plan still leaves room for a thoughtful home.',
    intro: 'Crossing Republik has a strong apartment-led character. The design opportunity is in getting the everyday decisions right—furniture scale, storage, kitchen workflow, lighting and the small details that make a builder layout feel personal.',
    insights: [
      { title: 'Better circulation', body: 'We protect movement through the home instead of filling every wall with cabinetry.' },
      { title: 'Useful storage', body: 'Storage is planned around actual possessions, not arbitrary modules.' },
      { title: 'A coherent palette', body: 'Materials and colours are kept disciplined so the home feels calm and connected.' },
    ],
    services: ['2BHK and 3BHK apartment interiors','Kitchen and wardrobe design','Custom storage and furniture','Lighting and finish planning','Home office and flexible-room planning','Turnkey execution support'],
    fit: ['New-possession apartments','Existing homes ready for a redesign','Families with storage-heavy requirements','Homeowners seeking a clear execution scope'],
    process: ['Review property and requirements.','Plan rooms, circulation and storage.','Develop design and materials.','Coordinate execution.','Review the completed home.'],
    faqs: [
      { question: 'Do you design apartments in Crossing Republik?', answer: 'Yes. Apartment interiors are planned around the actual floor plan, family needs, storage and budget direction.' },
      { question: 'Can you work on a partial renovation?', answer: 'Yes. The scope can be focused on selected rooms or expanded into a broader interior project.' },
    ],
    related: [{ href: '/interior-design-services', label: 'Explore our services' }, { href: '/start-your-project', label: 'Start your project' }],
    gallery,
  },
  {
    path: '/interior-design-faridabad',
    eyebrow: 'Faridabad · Interior Design',
    title: 'Interior Design in Faridabad',
    description: 'Residential and commercial interior design in Faridabad, balancing practical planning, Indian material character and execution-ready detailing.',
    area: 'Faridabad',
    heroImage: gallery[3],
    introLabel: 'Thoughtful NCR interiors',
    introTitle: 'Contemporary does not have to mean characterless.',
    intro: 'Whether the brief is an apartment, independent home or workspace, NestArcadia looks for the balance between modern function and a sense of place. The result is planned around the property and the people using it, not a fixed style package.',
    insights: [
      { title: 'Function first', body: 'Layout, storage, lighting and furniture decisions are made before decorative layers.' },
      { title: 'Material with meaning', body: 'Indian craft and natural material references can add warmth without making the interior feel themed.' },
      { title: 'Execution matters', body: 'A beautiful concept is useful only when its important details can be built correctly.' },
    ],
    services: ['Home interior design','Villa and independent-home planning','Office and commercial interiors','Custom furniture and storage','Material and lighting selection','Turnkey execution coordination'],
    fit: ['Families starting a new interior','Independent homes and larger properties','Commercial spaces needing clear zoning','Clients wanting design and execution aligned'],
    process: ['Brief and site review.','Space planning and scope.','Design development.','Execution coordination.','Handover review.'],
    faqs: [
      { question: 'Do you work on independent homes in Faridabad?', answer: 'Yes. Larger homes can be planned room by room while keeping the overall material and design language coherent.' },
      { question: 'Can the project include commercial interiors?', answer: 'Yes. Office and selected commercial projects can be discussed based on scope and requirements.' },
    ],
    related: [{ href: '/interior-design-services', label: 'View our services' }, { href: '/start-your-project', label: 'Discuss your project' }],
    gallery,
  },
  {
    path: '/interior-design-delhi',
    eyebrow: 'Delhi · Interior Design',
    title: 'Interior Design in Delhi',
    description: 'Residential and commercial interior design in Delhi with a focus on practical layouts, custom furniture, materials, lighting and a distinctly Indian sense of place.',
    area: 'Delhi',
    heroImage: gallery[0],
    introLabel: 'Design with a point of view',
    introTitle: 'Modern Indian interiors, without losing the human part.',
    intro: 'Delhi homes can range from compact apartments to larger independent properties, each carrying different spatial and material realities. NestArcadia creates a clear design direction around the client’s lifestyle, the architecture and what needs to work every day.',
    insights: [
      { title: 'Respect the architecture', body: 'Existing proportions, light, circulation and structural realities shape the design rather than being ignored.' },
      { title: 'Make storage deliberate', body: 'Custom storage is used where it solves a real problem, not simply because an empty wall is available.' },
      { title: 'Bring craft in carefully', body: 'Indian materials, textures and details can create identity without turning the home into a theme.' },
    ],
    services: ['Apartment and home interiors','Independent-home and villa interiors','Office and commercial interiors','Custom furniture and storage','Lighting and material direction','Turnkey execution coordination'],
    fit: ['Homeowners looking for a complete design direction','Renovations where existing architecture matters','Families needing custom storage and flexible rooms','Businesses planning a polished workspace'],
    process: ['Understand the property and brief.','Plan space, storage and services.','Develop the design and materials.','Coordinate execution.','Review and handover.'],
    faqs: [
      { question: 'Do you take interior projects in Delhi?', answer: 'Yes, project scope and location are reviewed before confirming the engagement.' },
      { question: 'What makes NestArcadia different from a package interior?', answer: 'The design starts from the property and the client’s routines, rather than a fixed package of finishes and furniture.' },
    ],
    related: [{ href: '/interior-design-services', label: 'Explore interior design services' }, { href: '/start-your-project', label: 'Start a project conversation' }],
    gallery,
  },
  {
    path: '/interior-design-east-delhi',
    eyebrow: 'East Delhi · Interior Design',
    title: 'Interior Design in East Delhi',
    description: 'Practical home and commercial interiors in East Delhi, from apartment planning and storage to lighting, custom furniture and execution.',
    area: 'East Delhi',
    heroImage: gallery[2],
    introLabel: 'Local context, considered design',
    introTitle: 'Use the space better without losing what makes it yours.',
    intro: 'East Delhi properties often demand smart use of available space. NestArcadia focuses on circulation, storage, furniture scale and light first, then builds a visual language that feels personal rather than over-styled.',
    insights: [
      { title: 'Compact does not mean compromised', body: 'Better proportions and vertical planning can create room without adding visual clutter.' },
      { title: 'Storage that earns its place', body: 'Every major storage element should solve a real household need.' },
      { title: 'A calm visual language', body: 'A disciplined palette helps smaller spaces feel connected and easier to live with.' },
    ],
    services: ['Apartment interiors','2BHK and 3BHK planning','Kitchen and wardrobe design','Custom storage','Lighting and material selection','Turnkey coordination'],
    fit: ['Apartment renovations','New interiors for family homes','Homes with limited storage','Clients wanting design-to-execution clarity'],
    process: ['Property review.','Space and storage planning.','Design and materials.','Execution coordination.','Handover.'],
    faqs: [
      { question: 'Can you optimise storage in a smaller East Delhi home?', answer: 'Yes. Storage is planned around circulation, furniture scale and the household’s actual needs.' },
      { question: 'Do you handle complete interiors?', answer: 'The scope can cover design through execution coordination depending on the project.' },
    ],
    related: [{ href: '/interior-design-services', label: 'See interior design services' }, { href: '/start-your-project', label: 'Share your brief' }],
    gallery,
  },
  {
    path: '/interior-design-south-delhi',
    eyebrow: 'South Delhi · Interior Design',
    title: 'Interior Design in South Delhi',
    description: 'Refined residential and commercial interiors in South Delhi, combining practical planning with thoughtful materials, custom furniture and Indian design character.',
    area: 'South Delhi',
    heroImage: gallery[3],
    introLabel: 'Quietly distinctive interiors',
    introTitle: 'The goal is not more design. It is better decisions.',
    intro: 'South Delhi projects can have very different architectural contexts, from apartments to independent homes. NestArcadia keeps the brief grounded in proportion, material quality, storage, light and the client’s everyday life.',
    insights: [
      { title: 'Proportion over decoration', body: 'Furniture, joinery and room scale are resolved so the space feels composed without being crowded.' },
      { title: 'Material restraint', body: 'A smaller, considered material palette often creates more character than a room full of competing finishes.' },
      { title: 'Details you notice later', body: 'Lighting, hardware, joinery lines and storage planning shape how the home feels every day.' },
    ],
    services: ['Apartment and independent-home interiors','Villa interiors','Custom furniture and storage','Kitchen and wardrobe design','Lighting and material direction','Turnkey execution support'],
    fit: ['Homeowners seeking a tailored design direction','Renovations with existing architectural character','Families planning custom furniture','Clients who care about material and detailing'],
    process: ['Brief and property review.','Space and furniture planning.','Material and design development.','Execution coordination.','Final review.'],
    faqs: [
      { question: 'Can the design be highly customised?', answer: 'Yes. Customisation can extend from space planning and furniture to materials, lighting and detailing, depending on scope.' },
      { question: 'Do you provide turnkey execution?', answer: 'Turnkey execution can be included where appropriate and is defined as part of the project scope.' },
    ],
    related: [{ href: '/interior-design-services', label: 'Explore our services' }, { href: '/start-your-project', label: 'Discuss your project' }],
    gallery,
  },
  {
    path: '/interior-design-gurugram',
    eyebrow: 'Gurugram · Interior Design',
    title: 'Interior Design in Gurugram',
    description: 'Contemporary residential and commercial interior design in Gurugram, planned around modern routines, materials, storage and execution.',
    area: 'Gurugram',
    heroImage: gallery[1],
    introLabel: 'Designed for modern routines',
    introTitle: 'A polished interior still needs to work on a normal day.',
    intro: 'Gurugram homes and offices often combine demanding work schedules, compact layouts and a strong expectation for finish quality. NestArcadia brings structure to the brief—planning function, storage, lighting and materials before refining the visual identity.',
    insights: [
      { title: 'Work and home can coexist', body: 'Flexible rooms and discreet storage help interiors adapt to changing routines.' },
      { title: 'Finish quality starts early', body: 'Good detailing depends on decisions made before fabrication and site work begin.' },
      { title: 'Brand-aware commercial spaces', body: 'Offices should communicate the business while still supporting focused work and meetings.' },
    ],
    services: ['2BHK, 3BHK and 4BHK interiors','Premium apartment and villa planning','Office interiors','Custom furniture and storage','Lighting, materials and finishes','Turnkey execution coordination'],
    fit: ['Professionals setting up a new home','Premium apartment interiors','Growing businesses and offices','Clients who want a single design-to-execution direction'],
    process: ['Brief and site review.','Space planning and scope.','Design and material development.','Execution coordination.','Handover.'],
    faqs: [
      { question: 'Do you work on residential interiors in Gurugram?', answer: 'Yes, subject to project scope and location. Residential and selected commercial briefs can be discussed.' },
      { question: 'Can you coordinate the full project?', answer: 'The scope can extend from design development through execution coordination and handover.' },
    ],
    related: [{ href: '/interior-design-services', label: 'See the service scope' }, { href: '/start-your-project', label: 'Start your project' }],
    gallery,
  },
  {
    path: '/interior-design-dadri',
    eyebrow: 'Dadri · Interior Design',
    title: 'Interior Design in Dadri',
    description: 'Residential interior design in Dadri with practical planning for homes, kitchens, storage, materials, lighting and execution.',
    area: 'Dadri',
    heroImage: gallery[0],
    introLabel: 'Closer to the property',
    introTitle: 'Design should respond to the home, not force a template onto it.',
    intro: 'Dadri sits within a rapidly changing NCR belt where new homes and evolving family requirements meet. NestArcadia keeps the process straightforward: understand the property, solve the practical decisions and build a design language around the people who will use it.',
    insights: [
      { title: 'Start with the plan', body: 'The layout tells us where design can create genuine improvement.' },
      { title: 'Plan for everyday use', body: 'Storage, furniture, lighting and finishes are selected for real routines.' },
      { title: 'Keep the scope clear', body: 'A clear brief makes design and execution easier to coordinate.' },
    ],
    services: ['Home interior design','Apartment and independent-home planning','Kitchen and wardrobe design','Custom storage','Lighting and materials','Turnkey execution support'],
    fit: ['New homes and renovations','Families planning complete interiors','Clients needing practical storage','Homeowners wanting a clear project scope'],
    process: ['Property and brief.','Space planning.','Design development.','Execution coordination.','Handover.'],
    faqs: [
      { question: 'Do you take projects in Dadri?', answer: 'Projects can be discussed based on location, scope and site requirements.' },
      { question: 'Can you help with the full interior?', answer: 'Yes. The scope can cover design and, where agreed, execution coordination.' },
    ],
    related: [{ href: '/interior-design-services', label: 'Explore our services' }, { href: '/start-your-project', label: 'Share your project brief' }],
    gallery,
  },
  {
    path: '/interior-design-jewar',
    eyebrow: 'Jewar · Interior Design',
    title: 'Interior Design in Jewar',
    description: 'Interior design for homes and selected commercial spaces in Jewar, with practical planning, custom storage, materials and execution support.',
    area: 'Jewar',
    heroImage: gallery[2],
    introLabel: 'Designing for what comes next',
    introTitle: 'As a place changes, homes and workspaces change with it.',
    intro: 'Jewar and the surrounding Yamuna Expressway belt are developing quickly. For new homes and emerging workspaces, early design decisions can make a meaningful difference to layout, storage, lighting and future flexibility.',
    insights: [
      { title: 'Plan early', body: 'Early involvement gives more control over electrical, lighting, kitchen and storage decisions.' },
      { title: 'Build for flexibility', body: 'Spaces can be planned to adapt as household or business needs change.' },
      { title: 'Keep execution practical', body: 'A strong concept is translated into a scope that can be built and reviewed.' },
    ],
    services: ['Residential interior planning','2BHK, 3BHK and larger homes','Kitchen, wardrobe and storage design','Custom furniture','Office and commercial planning','Turnkey execution coordination'],
    fit: ['New homes in the developing NCR belt','Families planning before possession','Growing businesses and offices','Clients who want future flexibility'],
    process: ['Understand property and future needs.','Plan space and services.','Develop design and materials.','Coordinate execution.','Review and handover.'],
    faqs: [
      { question: 'Do you design new homes in Jewar?', answer: 'Yes, subject to project scope and site requirements. Early planning can be especially useful for new construction or possession-stage homes.' },
      { question: 'Can you plan for future changes?', answer: 'Yes. Flexible rooms, storage and service planning can be considered where the property and brief allow it.' },
    ],
    related: [{ href: '/interior-design-services', label: 'Explore our services' }, { href: '/start-your-project', label: 'Discuss your project' }],
    gallery,
  },
  {
    path: '/interior-design-yamuna-expressway',
    eyebrow: 'Yamuna Expressway · Interior Design',
    title: 'Interior Design along Yamuna Expressway',
    description: 'Interior design for homes and selected commercial spaces across the Yamuna Expressway belt, with practical planning and execution-ready detailing.',
    area: 'Yamuna Expressway',
    heroImage: gallery[3],
    introLabel: 'A growing design corridor',
    introTitle: 'Plan the interior before the property starts dictating the decisions.',
    intro: 'The Yamuna Expressway belt is developing into a broader residential and commercial corridor. NestArcadia helps clients turn a property into a usable space through clear planning, materials, storage, lighting and a design direction that can grow with the place.',
    insights: [
      { title: 'Think beyond the handover', body: 'The first design decisions should support how the property will actually be used over the next few years.' },
      { title: 'Keep rooms adaptable', body: 'Flexible furniture and storage can make a new home easier to adapt.' },
      { title: 'Coordinate the build', body: 'A clear sequence reduces avoidable changes once site work begins.' },
    ],
    services: ['Apartment and home interiors','Villa and larger-home planning','Kitchen and storage design','Custom furniture','Commercial and office interiors','Turnkey execution support'],
    fit: ['New-possession homes','Independent homes and larger properties','Emerging offices and commercial spaces','Clients planning ahead of execution'],
    process: ['Property review.','Space planning.','Design and materials.','Execution coordination.','Handover.'],
    faqs: [
      { question: 'Do you cover the Yamuna Expressway area?', answer: 'Projects can be discussed based on the exact site, scope and execution requirements.' },
      { question: 'Can you help before possession?', answer: 'Yes. Early planning can help resolve layout, storage, kitchen, lighting and material decisions before execution starts.' },
    ],
    related: [{ href: '/interior-design-services', label: 'View interior design services' }, { href: '/start-your-project', label: 'Share your project brief' }],
    gallery,
  },
  {
    path: '/interior-design-delhi-ncr',
    eyebrow: 'Delhi NCR · Interior Design',
    title: 'Interior Design across Delhi NCR',
    description: 'NestArcadia designs residential and commercial interiors across Delhi NCR, with practical planning, Indian material character and turnkey execution support.',
    area: 'Delhi NCR',
    heroImage: gallery[0],
    introLabel: 'Our wider service area',
    introTitle: 'One design philosophy. Different homes, different cities.',
    intro: 'NestArcadia is rooted in Greater Noida West but works with clients across the wider NCR region. The location changes; the principle does not: understand the property, understand the people, solve the practical problems and create an interior with a point of view.',
    insights: [
      { title: 'Local context matters', body: 'Apartment constraints, independent homes and commercial spaces each need a different response.' },
      { title: 'The design stays human', body: 'We design around routines, storage, comfort and how people actually live or work.' },
      { title: 'Execution is part of the thinking', body: 'Materials, detailing and drawings are considered with the build process in mind.' },
    ],
    services: ['Residential interior design','2BHK, 3BHK and 4BHK interiors','Villa and farmhouse planning','Office and commercial interiors','Custom furniture and storage','Turnkey execution coordination'],
    fit: ['Homeowners across NCR','New-possession and renovation projects','Independent homes and villas','Businesses setting up or upgrading a workspace'],
    process: ['Share the property and brief.','Plan the space and scope.','Develop the design and materials.','Coordinate execution.','Review and handover.'],
    faqs: [
      { question: 'Where in NCR does NestArcadia work?', answer: 'The studio is rooted in Greater Noida West and can discuss projects across Noida, Greater Noida, Ghaziabad, Delhi, Faridabad, Gurugram and nearby NCR markets.' },
      { question: 'Can the project be design-only?', answer: 'Yes. The engagement can be tailored to design, documentation or a broader turnkey scope depending on what the project needs.' },
    ],
    related: [{ href: '/interior-design-services', label: 'Explore the full service scope' }, { href: '/start-your-project', label: 'Start a project conversation' }],
    gallery,
  },
];

localServicePages.push(...additionalLocationPages);

export const getLocalServicePage = (pathname: string) =>
  localServicePages.find((page) => pathname.replace(/\/+$/, '') === page.path) ?? null;

export default function LocalServicePage({ config, setPage }: { config: LocalServiceConfig; setPage: (p: Page) => void }) {
  const photos = config.gallery?.length ? config.gallery : gallery.filter(src => src !== config.heroImage).slice(0, 4);
  return (
    <div className="pt-20 lg:pt-[90px]">
      <header className="relative overflow-hidden bg-[#1C3A5A]">
        <img src={config.heroImage} alt="" aria-hidden="true" width="1600" height="800" fetchPriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-[#1C3A5A]/55" />
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-20 py-24 lg:py-32">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-5">{config.eyebrow}</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.6rem)] text-white leading-[1.04] max-w-4xl">{config.title}</h1>
          <p className="text-white/70 text-sm leading-[1.8] max-w-2xl mt-5">{config.description}</p>
          <a href="/start-your-project" onClick={(e) => { e.preventDefault(); setPage('project'); }} className="inline-flex mt-7 bg-white text-[#1C3A5A] px-7 py-3 text-[13px] font-semibold hover:bg-[#2D8C7E] hover:text-white transition-colors">Discuss Your Project →</a>
        </div>
      </header>

      <main>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16 lg:py-20">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E] mb-4">{config.introLabel}</p>
              <h2 className="font-display text-[clamp(2rem,3.8vw,3.2rem)] text-[#1A1714] leading-[1.08]">{config.introTitle}</h2>
            </div>
            <p className="text-[#6B5E4E] text-[15px] leading-[1.9] lg:pt-1">{config.intro}</p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-6 lg:px-20 pb-16 lg:pb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {photos.slice(0, 4).map((src, i) => (
              <img key={src + i} src={src} alt={i === 0 ? `${config.area} interior design reference by NestArcadia` : 'NestArcadia interior design reference'} width="800" height="900" loading="lazy" decoding="async" className={`w-full h-[220px] lg:h-[300px] object-cover ${i === 1 ? 'mt-8 lg:mt-12' : ''} `} />
            ))}
          </div>
          <p className="text-[11px] text-[#8A7B69] mt-3">Design references from NestArcadia’s visual language — not presented as a local project claim.</p>
        </section>

        <section className="bg-[#EAE4DA] px-6 lg:px-20 py-16 lg:py-20">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {config.insights.map((item, i) => (
                <article key={item.title} className="border-t border-[#D4CBBB] pt-5">
                  <p className="font-display text-[#2D8C7E] text-lg mb-2">0{i + 1}</p>
                  <h2 className="font-display text-xl text-[#1A1714] leading-tight mb-2">{item.title}</h2>
                  <p className="text-[13px] text-[#6B5E4E] leading-[1.8]">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-[1100px] mx-auto px-6 lg:px-20 py-16 lg:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div><p className="text-[10px] uppercase tracking-[0.25em] text-[#2D8C7E] mb-3">What we can help with</p><h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] text-[#1A1714]">A focused scope, not a package.</h2></div>
            <p className="text-[13px] leading-7 text-[#6B5E4E] max-w-md">We shape the scope around the property, priorities and level of execution support you actually need.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {config.services.map(item => <div key={item} className="border border-[#D4CBBB] px-5 py-4 text-[13px] leading-6 text-[#1A1714]">{item}</div>)}
          </div>
        </section>

        <section className="bg-[#1C3A5A] px-6 lg:px-20 py-14 lg:py-16">
          <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div><p className="text-[10px] uppercase tracking-[0.25em] text-white/45 mb-3">Ready when you are</p><h2 className="font-display text-2xl lg:text-3xl text-white">Have the property already?</h2><p className="text-white/60 text-sm mt-2">Send us the layout, location and what you want the space to do better.</p></div>
            <a href="/start-your-project" onClick={(e) => { e.preventDefault(); setPage('project'); }} className="shrink-0 border border-white/40 text-white px-7 py-3 text-[13px] font-semibold hover:bg-white hover:text-[#1C3A5A] transition-colors">Share Your Project Brief →</a>
          </div>
        </section>

        <section className="max-w-[1100px] mx-auto px-6 lg:px-20 py-16 lg:py-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#2D8C7E] mb-3">A few useful answers</p>
              <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] text-[#1A1714] mb-7">Before you reach out</h2>
              <div className="space-y-1">{config.faqs.map(faq => <details key={faq.question} className="border-t border-[#D4CBBB] py-4"><summary className="cursor-pointer text-[14px] font-medium text-[#1A1714]">{faq.question}</summary><p className="text-[13px] leading-[1.8] text-[#52677E] mt-2 max-w-2xl">{faq.answer}</p></details>)}</div>
            </div>
            <div className="bg-[#EAE4DA] p-7 lg:p-9 h-fit">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#2D8C7E] mb-4">Your next step</p>
              <h2 className="font-display text-2xl text-[#1A1714]">Tell us what you are working with.</h2>
              <p className="text-[13px] leading-[1.8] text-[#6B5E4E] mt-3">Property type, approximate size, location and what you need help with is enough to start the conversation.</p>
              <a href="/start-your-project" onClick={(e) => { e.preventDefault(); setPage('project'); }} className="inline-flex mt-6 bg-[#2D8C7E] text-white px-6 py-3 text-[13px] font-semibold hover:bg-[#1C3A5A] transition-colors">Start Your Project →</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
