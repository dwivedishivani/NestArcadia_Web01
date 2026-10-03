import { useEffect, useState } from 'react';
import RichArticleContent from '../../components/common/RichArticleContent';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import type { Page } from '../../App';
import { resolveSiteImage, resolveSiteImageReference } from '../../utils/siteImages';

interface Props {
  setPage: (p: Page) => void;
  articleId?: string;
  setArticleId: (id: string | null) => void;
}

const u = (id: string, _w: number, _h: number) => resolveSiteImage(id, _w);

const LIME_PLASTER_SOURCES = [
  { label: 'CEPT University / UCL Open Environment — moisture buffering and mould growth in naturally ventilated lime-plastered houses (2024)', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11443221/' },
  { label: 'Indoor Environment / J-STAGE — fungal resistance of thinly applied modern lime plaster (2024)', href: 'https://www.jstage.jst.go.jp/article/siej/27/3/27_175/_article/-char/en' },
  { label: 'ScienceDirect — experimental investigation of cement and lime plaster hygrothermal behaviour (2022)', href: 'https://www.sciencedirect.com/science/article/abs/pii/S0360132322003353' },
];

export const articles = [
  {
    id: 'rattan',
    category: 'Materials',
    title: "Rattan's Return: Why Natural Weave is Back",
    excerpt: "From colonial verandas to contemporary living rooms — rattan mesh is reclaiming its place as India's most beloved material.",
    author: 'Shivani',
    date: 'Sep 2026',
    readTime: '5 min read',
    img: u('photo-1781232756159-97eba33dc051', 1200, 700),
    thumb: u('photo-1781232756159-97eba33dc051', 800, 560),
    body: [
      "There is a reason rattan keeps coming back. It is not nostalgia. It is material logic: rattan is light, flexible, breathable, and extraordinary to look at. It ages well, it travels well, and it refuses to look dated.",
      "In the Indian context, rattan and cane weave have a specific history. The verandas of Bengal, the cool sitting rooms of Chettinad, the plantation bungalows of the hill stations — woven furniture was how early twentieth century India made sense of humidity, heat, and the need for airiness in a home.",
      "What has changed is the application. Today's rattan is not just wicker chairs in a sun room. It is room dividers in a Delhi flat, headboards in a Bengaluru bedroom, pendant lights in a Mumbai loft, woven panels as art in a Pune living room.",
      "At NestArcadia, we use rattan in two ways. First, as a primary material — for furniture pieces and large spatial elements where its weave defines the texture of a room. Second, as an accent — small doses of woven texture against lime plaster or darkwood, where the contrast does the work.",
      "The key to using rattan in a contemporary interior is restraint. One well-chosen rattan piece reads as thoughtful. An entire room of wicker reads as theme park. We lean toward the former: a single rattan pendant over a dining table, or a woven headboard in an otherwise minimal bedroom.",
      "If you are considering rattan for your home, think of it as a material with a personality. It works alongside linen, stone, dark wood, and lime plaster. It conflicts with cold metallics, high-gloss finishes, and heavily patterned textiles. The conversation between materials is the design.",
    ],
    related: ['lime-plaster', 'doors'],
  },
  {
    id: 'jaali',
    category: 'Craft',
    title: 'The Art of Jaali: Bringing Lattice to Modern Homes',
    excerpt: "The intricately carved jaali screen has long been part of Indian architectural traditions. Today it is often used to introduce filtered light, privacy and pattern into contemporary interiors.",
    author: 'Shivani',
    date: 'Aug 2026',
    readTime: '7 min read',
    img: u('photo-1759722144194-1fe9ebdd46dd', 1200, 700),
    thumb: u('photo-1759722144194-1fe9ebdd46dd', 800, 560),
    body: [
      "The jaali — a perforated lattice screen cut from stone, wood, or metal — is one of the most sophisticated architectural inventions of the Indian subcontinent. In the courts of Rajasthan, stone jaali allowed women to observe public gatherings from behind a screen that filtered both view and light. In mosques and dargahs, jaali walls created a sense of enclosure while maintaining airflow.",
      "What made the jaali brilliant was not just its beauty but its environmental intelligence. In historic buildings, perforated screens could provide shade, privacy and filtered daylight while allowing air movement. The exact thermal effect depended on the screen, orientation, surrounding openings and climate, so the principle is best understood as part of a larger passive-design strategy.",
      "In the contemporary Indian home, the jaali has been liberated from its structural origins. It no longer needs to be stone or even weight-bearing. Designers use laser-cut metal panels as room dividers, CNC-routed timber screens as wardrobes, brass jaali as cabinet door inserts, and printed or cast plaster versions as feature walls.",
      "In a contemporary apartment, a jaali can be used as a full-height room divider, a wardrobe or cabinet insert, or a smaller architectural detail. The scale changes everything: a large screen becomes a spatial element, while a smaller insert can introduce pattern without dominating the room.",
      "One thing we have learned: the best jaali in a contemporary interior is the one that is not immediately obvious. The first thing you see should be the light it creates — the pattern of shadow on a white wall, the dappled effect across a dining table. The screen itself is secondary. The light is the point.",
      "For those considering a jaali element in their home, the most practical application is as a wardrobe or cabinet door insert. This gives you the beauty of the pattern without the structural complexity, and the effect — particularly with a warm light source behind the panel — is genuinely remarkable.",
    ],
    related: ['rattan', 'lime-plaster'],
  },
  {
    id: 'lime-plaster',
    category: 'Surfaces',
    title: 'Lime Plaster in Indian Interiors: What the Research Actually Says',
    excerpt: 'Lime plaster is returning to contemporary Indian interiors, but its real value is more interesting than a trend: moisture buffering, vapour permeability and fungal resistance all depend on the material, formulation and building conditions.',
    author: 'Shivani',
    date: 'Jul 2026',
    updated: 'Oct 2026',
    readTime: '10 min read',
    img: u('photo-1533628635777-112b2239b1c7', 1200, 700),
    thumb: u('photo-1533628635777-112b2239b1c7', 800, 560),
    body: [
      "Lime plaster has returned to contemporary Indian interiors for a reason that goes beyond appearance. The surface has a soft, mineral depth that changes with daylight, but it also behaves differently from many dense, film-forming finishes. Research on lime-plastered buildings has examined moisture buffering, vapour movement, hygrothermal behaviour and fungal resistance. Those findings are useful — provided we do not turn them into blanket promises.",
      "In India, lime-based finishes have a long architectural history. Lime plaster and lime mortar appear across historic buildings and conservation work, where their compatibility with traditional masonry and their ability to interact with moisture are important practical considerations. Modern interior lime plasters are not automatically identical to historic recipes, however. Thickness, binder composition, aggregates, additives, substrate and final coating can all change performance.",
      "One of the strongest research-backed characteristics is moisture buffering. A 2024 study by researchers from CEPT University examined naturally ventilated lime-plastered houses in Ahmedabad, including measurements from 45 traditional buildings. The researchers describe lime plaster as hygroscopic: it can adsorb and desorb moisture, which can moderate indoor relative humidity. They also found that surface moisture and relative-humidity conditions matter when assessing mould growth. In other words, lime can participate in the moisture balance of a building, but it is not a substitute for ventilation, waterproofing or solving a source of damp.",
      "Vapour permeability is related but slightly different. A vapour-permeable wall assembly can allow moisture vapour to move through materials rather than trapping it behind an impermeable coating. A controlled 2022 experiment comparing lime and cement plaster test cells also found that the lime-plastered cell moderated indoor relative humidity and showed different hygrothermal behaviour. The authors noted that the experiment was conducted under controlled conditions without internal heat loads, so the results should not be treated as a universal temperature or comfort guarantee for every home.",
      "Fungal resistance is another area where the evidence is more specific than the usual marketing language. A 2024 study published in Indoor Environment tested thinly applied modern lime plaster formulations against Aspergillus niger and Cladosporium sphaerospermum. The tested formulations showed strong fungal resistance, and formulations containing more than 30% slaked lime inhibited fungal growth under the study conditions. That is meaningful evidence for the material property being tested. It does not mean that every lime finish will prevent mould in every room, because real buildings also depend on moisture sources, surface temperature, ventilation, substrate and formulation.",
      "This distinction matters in bathrooms and other humid spaces. A lime finish may be appropriate where the complete wall build-up and substrate are suitable, but it should never be specified as a way to hide a leaking pipe, rising damp, failed waterproofing or persistent condensation. If moisture is entering the assembly, the cause has to be addressed first. The finish is one layer of a building system, not the system itself.",
      "The same principle applies to claims about indoor air quality. Some research discusses lime materials in relation to adsorption of certain compounds and fungal resistance, and newer experiments are investigating pollution-mitigation behaviour. That is interesting science, but it is too broad to say that a lime-plastered wall simply 'cleans the air'. Indoor air quality is influenced by ventilation, outdoor pollution, furnishings, cleaning products, combustion sources, filtration and many other factors. A responsible specification should describe the material's measured properties rather than promise a health outcome.",
      "There is also a practical reason designers continue to value lime: the finish has a distinctive visual response. Trowelled, polished and textured applications can catch light differently across a wall, and natural variation can become part of the character of the room. Unlike a perfectly uniform printed surface, a hand-applied mineral finish can show subtle changes in tone and texture. That variation is a feature for some clients and a drawback for others, which is why physical samples are essential before approval.",
      "For a Noida or Greater Noida home, we would evaluate lime plaster against the actual room and wall assembly rather than specifying it everywhere. A feature wall in a living room or bedroom may offer the visual depth clients want without making the entire interior dependent on one finish. In areas exposed to water or high humidity, the substrate, waterproofing, ventilation and exact plaster system need to be reviewed before the material is approved.",
      "Application quality matters as much as the recipe. Surface preparation, layer thickness, curing, substrate compatibility and the final finish can all affect the result. This is why lime plaster should be sampled on the actual substrate and reviewed in the home's lighting. The question is not simply 'Do we like lime plaster?' It is 'Does this particular lime system make sense for this wall, this room and this way of living?'",
      "For homeowners comparing lime plaster with conventional paint, the useful comparison is not 'natural versus chemical'. Modern paints vary widely in formulation and performance, including low-VOC options. The more useful questions are: Is the coating vapour-permeable? How will it behave with the existing wall? What maintenance does it require? What level of texture or variation do you want? And is the installer experienced with the specified system?",
      "Another point worth understanding is the difference between a material property and a building outcome. A plaster can be vapour-permeable in a laboratory measurement, yet the overall wall can behave differently if it is paired with an impermeable coating, a damp substrate or a construction detail that prevents moisture from moving as intended. The same caution applies to mould: a surface with fungal resistance can still become a problem if water is continuously available at the wall. Good interior specification therefore starts with the whole assembly and the source of moisture, not a single product label.",
      "Maintenance should also be part of the decision. Lime finishes can show variation, small marks and changes in appearance as they age. Some homeowners will see that as character; others will prefer a more uniform surface that can be touched up easily. Before approval, it is useful to discuss cleaning, repairs, future drilling, colour variation and what happens if a section of wall needs to be patched. A beautiful material becomes a better long-term choice when the homeowner understands how it will live after installation.",
      "That is ultimately why lime plaster remains interesting. Its value is not that it is a magical healthy-wall material. Its value is that it combines a distinctive mineral finish with measurable moisture and fungal-resistance characteristics in some formulations and building conditions. When the material, substrate, climate and workmanship are considered together, it can be a highly considered choice for an Indian interior.",
    ],
    related: ['rattan', 'jaali'],
    researchSources: LIME_PLASTER_SOURCES,
  },
  {
    id: 'north-india',
    category: 'Design Cultures',
    title: 'North Indian Heritage: Rich Textures and Grandeur in Modern Homes',
    excerpt: "What makes northern Indian design so distinctive? We explore the materials, patterns, and spatial logic behind the opulent aesthetic.",
    author: 'Shivani',
    date: 'Jun 2026',
    readTime: '8 min read',
    img: u('photo-1547194936-28214bd75193', 1200, 700),
    thumb: u('photo-1547194936-28214bd75193', 800, 560),
    body: ["The domestic architecture of northern India was built for grandeur and hospitality. The haveli — the courtyard house found across parts of Rajasthan, Punjab, Uttar Pradesh and other regions — was not simply a residence. It could be a social and family setting where multiple generations gathered, guests were received and daily work happened around shared spaces.", "The materials associated with many historic havelis include carved stone, timber, lime-based finishes and metalwork. The decorative language can be intricate: jaali screens, carved balconies, painted surfaces and substantial doorways. These elements were not identical across every region or period, so it is more useful to think of the haveli as a family of architectural traditions than as one fixed style.", "What is especially interesting is the relationship between form and climate. Courtyards, shaded verandas, thick walls, controlled openings and high ceilings could help manage sun, airflow and temperature in particular building types. The exact effect depended on orientation, materials, local climate and how the building was occupied. Rather than calling the haveli a universal 'climate machine', it is more accurate to see these elements as parts of a climate-responsive architectural vocabulary.", "In the contemporary Indian apartment, most of those structural conditions are unavailable. There may be no courtyard, carved stone facade or deep veranda. What remains possible is the material and spatial language — translated into a modern idiom.", "This is where NestArcadia's approach becomes useful. We do not recreate a haveli inside a Noida flat. We extract selected qualities — the warmth of timber, the depth of carved detail, the richness of layered textiles or the filtering effect of a screen — and reinterpret them at an appropriate scale. A crafted door detail, a carefully proportioned screen or a brass light can create a sense of rootedness without turning the room into a historical replica.", "For a 3BHK apartment in NCR that wants a North Indian character, a focused palette is usually more practical than trying to reproduce an entire historic vocabulary. Choose a small number of meaningful elements, then give them enough visual space to work. The result can acknowledge regional design history while still feeling like a contemporary home."], related: ['site-execution-noida', 'interior-budget-conversation'],
  },
  {
    id: 'vastu',
    category: 'Wellness',
    title: 'Vastu and Modern Design: Finding Balance Without Compromise',
    excerpt: 'A practical look at integrating traditional Vastu preferences into contemporary apartment planning without presenting belief-based guidance as building science.',
    author: 'Shami Saifi',
    date: 'May 2026',
    readTime: '6 min read',
    img: u('photo-1648147870253-c45f6f430528', 1200, 700),
    thumb: u('photo-1648147870253-c45f6f430528', 800, 560),
    body: [
      "Vastu Shastra is often approached in two very different ways: as an absolute rulebook or as something that has no place in a contemporary home. For a design brief, a more useful approach is to understand what the client actually wants from Vastu and then separate traditional guidance from measurable building performance.",
      "Vastu is a traditional Indian system of spatial planning that gives importance to orientation, room placement, entrances and relationships between parts of a dwelling. Some contemporary interpretations also connect these ideas with sunlight, airflow and the experience of space. Those interpretations should not be presented as established building-science or medical evidence. When a client asks for Vastu compliance, we treat the request as part of the design brief and document the choices clearly.",
      "Traditional Vastu guidance may influence the preferred placement of kitchens, bedrooms, entrances and other spaces. These prescriptions belong to the Vastu tradition rather than being proven causes of health, sleep quality or indoor-air outcomes. That distinction allows the design to respect the client's beliefs without making scientific claims that the evidence does not establish.",
      "At NestArcadia, the practical starting point is the floor plan. We review orientation, circulation, daylight, ventilation, storage and the builder's fixed constraints before applying the client's Vastu preferences. The aim is to find a layout that works operationally while respecting the principles the household wants to follow.",
      "Apartments can make this more nuanced because structural walls, plumbing stacks, shafts and electrical locations may already be fixed. In those situations, the design conversation becomes one of priorities: which Vastu requirements are essential to the client, which can be addressed through planning, and where a compromise is preferable to an impractical layout.",
      "For clients who want Vastu guidance as part of their NestArcadia project, starting early is useful. If the property has not yet been selected, orientation and layout can be considered before purchase. If the home is already fixed, the design can focus on achievable changes rather than promising that decorative adjustments will transform the building's physical performance.",
      "The strongest outcome is a home that is comfortable, functional and personally meaningful. Vastu can be one layer of that brief, while circulation, daylight, ventilation, storage, materials and execution remain grounded in ordinary design and construction requirements.",
    ],
    related: ['north-india', 'rattan'],
  },
  {
    id: 'doors',
    category: 'Architecture',
    title: 'The Courtyard Home: Reimagined for Urban India',
    excerpt: "The traditional Indian courtyard — the aangan — is being reborn inside modern apartments and urban villas.",
    author: 'Mandeep Sharma',
    date: 'Apr 2026',
    readTime: '9 min read',
    img: u('photo-1629946488804-217c002178cf', 1200, 700),
    thumb: u('photo-1629946488804-217c002178cf', 800, 560),
    body: [
      "The aangan — the central courtyard of the Indian home — was not simply an architectural feature. It was the social and ecological heart of the house. In the morning, women ground spices and sorted grain here. In the afternoons, children played in its shade. In the evenings, the family gathered. At night, in summer, people sometimes slept here under the open sky.",
      "The courtyard was also the home's climate system. Open to the sky, it received rain, which was channeled to underground tanks. It created a temperature gradient that drove air through the surrounding rooms. It brought light into the interior without direct solar gain. It was an idea of extraordinary elegance: a void at the centre of the house that made the house work.",
      "The modern apartment building has no room for a courtyard. The land economics of urban India — particularly in cities like Delhi, Mumbai, Bengaluru, and Hyderabad — mean that every square foot is enclosed and sold. The sky is accessed from a balcony, if at all. The centre of the apartment is typically a dark, internal space with no natural light.",
      "And yet the impulse toward the courtyard survives. We see it in the popularity of open-plan layouts, which try to create a sense of communal space at the heart of the home. We see it in the demand for skylights in villas. We see it in the way people treat their balconies — not as auxiliary spaces but as essential rooms.",
      "At NestArcadia, we interpret the courtyard principle in several ways in urban homes. In villas and ground-floor apartments, we sometimes create a small internal garden — a planting bed or even a single significant tree — around which the home is organised. In apartments, we work with the concept of a visual centre: a feature element — a large plant, a sculptural object, a particular light fixture — that gives the main living space a focal point that feels organic and grounding.",
      "The courtyard principle is really an organisational idea: the home arranged around a living centre, rather than as a sequence of closed rooms. This idea translates into modern planning more readily than most clients expect. The conversation usually begins with the question: what is the heart of this home? Once that is answered, the rest of the plan tends to resolve itself.",
    ],
    related: ['vastu', 'north-india'],
  },
  {
    id: 'space-saving-interiors-noida',
    category: 'Materials',
    title: 'Small Flat, Big Living: Space-Saving Interiors for Noida and Greater Noida West',
    excerpt: 'A practical, humane guide to making a 2BHK or compact 3BHK feel generous — with convertible furniture, disciplined storage and room to breathe.',
    author: 'Shivani',
    date: 'Sep 2026',
    readTime: '9 min read',
    img: u('photo-1771328756144-02bde5549a9a', 1200, 700),
    thumb: u('photo-1771328756144-02bde5549a9a', 800, 560),
    body: [
      'A 2BHK in Noida, Greater Noida or Greater Noida West is often asked to do a surprising amount. It is a place to work, host family, eat together, keep children’s things, store luggage, and occasionally take a quiet breath after a long day. The answer is not to fill every wall with storage. A home feels larger when it is planned around the life happening inside it, rather than around the fear of not having enough cupboards.',
      'The first design decision is to identify what truly needs a permanent home. Seasonal luggage, extra bedding, festival decor and documents need enclosed storage. Daily objects need easy access. Things that are rarely used should not occupy the most valuable shelves at eye level. This small audit changes the brief from “we need more storage” to a much more useful one: “we need the right storage in the right place.”',
      'In compact Noida apartments, the entrance is a high-value zone. A slim shoe cabinet with a ventilated front, a concealed utility drawer and a mirror can solve three everyday problems without turning the foyer into a corridor of furniture. We prefer a shallow, well-detailed unit over a deep cabinet that makes the arrival experience tight. A bench that can hold shoes or a quick grocery bag is often more useful than another decorative console.',
      'The living room is where convertible furniture earns its place. A nesting table can expand for guests and disappear when it is not needed. A sofa with a genuinely comfortable pull-out bed is useful for visiting parents. A lift-top centre table can support laptop work without introducing a permanent study desk into the room. The key word is genuinely: a convertible object should work beautifully in both positions, not merely claim to be multifunctional in a catalogue.',
      'For a 3BHK, the temptation is to treat the third room as a storeroom in disguise. Instead, we recommend a flexible guest-study: a wall bed or daybed, a compact desk, full-height cabinetry with a mix of open and closed bays, and a calm lighting plan. This lets the room become a home office on weekdays, a guest room at festivals, and a quiet reading room in between. Flexibility is not a compromise when it is designed into the architecture of the room.',
      'Bedrooms benefit from the same restraint. A hydraulic bed is useful when it stores linens or seasonal items that can be accessed without dismantling the room. It is less useful when it becomes the default home for everything. Wardrobes should combine hanging, drawers and adjustable shelves, because a single large cavity wastes more space than it saves. We also like a shallow loft only where the ceiling height can support it without making the room feel compressed.',
      'Kitchen planning is where every millimetre matters. Pull-out pantry units, corner mechanisms, drawer organisers and a dedicated place for appliances can radically improve a compact kitchen. But more hardware is not automatically better. A practical kitchen needs clear worktop space, doors that do not collide, and storage sized for the utensils a family actually uses. We ask clients to list their everyday appliances before finalising modules; this prevents the common “where will the mixer go?” surprise after handover.',
      'Visual quiet is part of space saving too. A continuous floor finish, a limited material palette and furniture that sits slightly off the floor can make a 2BHK feel more expansive. Glass or open shelving should be used with care: it can lighten a room, but it also demands tidy living. Closed storage in a warm finish is often the more forgiving choice for a busy family. The objective is not a showroom; it is a home that feels easy to maintain.',
      'Noida, Greater Noida and Greater Noida West homes deserve planning that acknowledges real routines, real budgets and real square footage. The most successful compact homes are not those with the cleverest hidden feature. They are the homes where the dining table has room to be used, the balcony feels welcoming, the cupboards open without a fight, and every family member can find what they need. Good space planning gives a home back its ease.',
    ],
    related: ['doors', 'vastu'],
  },
  {
    id: '3d-visualisation-interiors',
    category: 'Surfaces',
    title: 'What a 3D Interior Visualisation Can — and Cannot — Tell You Before Execution',
    excerpt: 'A technical perspective on using 3D design to make better decisions for homes in Noida and Greater Noida before the first site measurement is acted on.',
    author: 'Shami Saifi',
    date: 'Sep 2026',
    readTime: '9 min read',
    img: u('photo-1649688066830-a0cf04d1bc41', 1200, 700),
    thumb: u('photo-1649688066830-a0cf04d1bc41', 800, 560),
    body: [
      'For many homeowners, the first time an interior project feels real is when they see a 3D view. A plan becomes a living room; a material name becomes a wardrobe finish; a rough idea of “warm and modern” becomes something they can react to. That is exactly why 3D visualisation is valuable. It is not decoration for a presentation. It is a decision-making tool that can save time, prevent misunderstandings and reveal practical issues before execution begins.',
      'A strong visualisation starts with an accurate base. In a 2BHK, 3BHK or 4BHK apartment in Noida or Greater Noida, the builder drawing is a useful starting point, but it is not the final truth. We verify site dimensions, beam depths, sill levels, electrical points and plumbing positions. A beautiful render built on an incorrect wall measurement is only a beautiful mistake. Technical discipline behind the scene is what gives a client confidence in the image on the screen.',
      'The first question a 3D view answers is proportion. Is the sofa too deep for the room? Does the dining table leave enough circulation around it? Will a full-height TV unit make the wall feel heavy? These are difficult questions to solve from a two-dimensional plan alone, especially for clients who do not read drawings every day. A thoughtfully modelled camera view makes scale legible without pretending that a home is a photograph.',
      'It also makes material conversations more concrete. In a render, we can compare a light oak with walnut, a lime-wash wall with a painted one, or brass detailing with black metal. This is useful when the desired mood is clear but the language for it is not. We still insist on physical samples before an order is placed. Screens change colour, lighting changes perception, and the grain of real wood has a character that no texture map can fully duplicate.',
      'Lighting is another area where 3D can clarify intent. We can show how cove light, bedside reading lamps, profile lights and decorative pendants work together at different times of day. What it cannot do perfectly is predict every shadow or colour temperature in the finished home. The final effect depends on fixture specifications, paint reflectance, daylight and site conditions. A visual is a guide to the lighting hierarchy, not a substitute for an electrical and lighting plan.',
      'The most useful 3D process is iterative. We begin with the layout and volume, then settle key material directions, then refine details such as handles, trims and soft furnishings. Trying to approve every cushion before the layout is stable creates false precision. Conversely, moving a wardrobe after the joinery drawings are released creates unnecessary delay. A clear sequence lets clients focus on the decisions that matter at the right time.',
      'There is a common concern that a rendered home will look better than the final home. That can happen when the visual is treated as a sales image rather than an execution document. The safeguard is transparency: the team should show which items are custom, which are reference products, what finish is proposed, what is dependent on site conditions, and what alternatives exist. A visualisation should set accurate expectations, not make promises that disappear at the material-selection stage.',
      'For us, the strongest output is a connected set of tools: a 3D model, measured drawings, electrical plans, furniture details, material specifications and a schedule that the site team can follow. Each one serves a different purpose. The 3D model helps a family see and feel the design. The technical drawings tell craftspeople how to build it. When those two worlds are aligned, a project moves from imagination to execution with far less friction.',
      'Whether the project is a compact Greater Noida West flat or a larger Noida villa, the question to ask is not “will I get a 3D?” It is “will the 3D help me make better decisions?” A good design studio uses visualisation to test the home before it is built, explain the logic behind choices, and keep the final work close to the approved direction. That is the practical value of the technology.',
    ],
    related: ['space-saving-interiors-noida', 'lime-plaster'],
  },
  {
    id: 'interior-budget-conversation',
    category: 'Wellness',
    title: 'The Honest Budget Conversation: Planning an Interior Without Losing the Feeling You Want',
    excerpt: 'Why a transparent first conversation helps Noida and Greater Noida homeowners choose what to invest in, what to phase, and what can wait.',
    author: 'Alok Tripathi',
    date: 'Aug 2026',
    readTime: '9 min read',
    img: u('photo-1771327811795-6197403af846', 1200, 700),
    thumb: u('photo-1771327811795-6197403af846', 800, 560),
    body: [
      'Most interior conversations begin with excitement and then arrive, quite naturally, at budget. A family has saved references, imagined a better kitchen, pictured a calmer bedroom and thought about the day they move in. They also have a number in mind, often shaped by a friend’s project, a social-media video or a per-square-foot estimate. Neither the dream nor the budget is wrong. The work is to bring them into an honest, useful relationship.',
      'The first step is to talk about priorities before prices. In a 3BHK in Noida, one family may care most about a durable kitchen and storage for two children. Another may want the living room to host extended family. A third may need a quiet work-from-home room. When everything is called essential, it is impossible to allocate money intelligently. When the three most important outcomes are clear, the project can be designed around them.',
      'A transparent estimate should distinguish between fixed work, custom work and flexible styling. Civil changes, electrical corrections, waterproofing and essential joinery are usually the bones of a project; cutting corners here can create a cost later. Loose furniture, decorative lighting and accessories offer more room to adjust. This does not mean they are unimportant. It means a client can decide, consciously, whether to complete them now or in a later phase without weakening the home’s foundation.',
      'We also encourage clients to think about the lifetime of a decision. A well-made wardrobe, a kitchen that functions every day, good hardware and a correct electrical plan are used thousands of times. These are places where a small compromise can be felt repeatedly. A trendy surface, a decorative chair or a statement lamp may be worth choosing carefully, but they should not quietly consume the budget meant for practical work. Value is about daily experience, not simply the visible photograph.',
      'The phrase “we want a lot, but within budget” is completely understandable. It is also where clear communication matters. Rather than saying yes to every reference, we explain what gives a room its feeling: proportion, material balance, lighting and one or two strong focal points. A home can look composed without copying every detail in a luxury image. Often, a simpler plan with honest materials feels more refined than an overloaded plan built from too many substitutions.',
      'For families in Greater Noida and Greater Noida West, possession timelines can add pressure. There may be a short gap between handover, rent ending and a planned move. A realistic schedule should show design approvals, material lead times, site work, installation and a buffer for the unexpected. The fastest project is not always the one that begins work earliest; it is the one where key decisions are made in sequence and site conditions are checked before orders are released.',
      'A good sales conversation is not about pushing a bigger scope. It is about making the scope understandable. We discuss the difference between modular and custom furniture, where a readymade piece might make sense, why two similar laminates can perform differently, and what is included in an execution quote. Questions about money are welcome because they prevent assumptions. Clear information lets a client compare options fairly and decide with confidence.',
      'Phasing is a sensible choice for many homes. Finish the kitchen, wardrobes, essential lighting and core living-room work before moving in. Then add a media unit, soft furnishings, art or a guest-room upgrade after the family has lived in the space for a while. This can be especially helpful in a first home, where actual habits become clearer after a few months. The only requirement is that the initial design leaves room for the next phase.',
      'The best interior project is not the one with the largest number on a proposal. It is the one where the client understands what they are choosing, the team understands what matters, and the finished home feels like a responsible use of resources. A calm budget conversation creates that alignment. It makes room for ambition, but it also makes room for honesty — and both are necessary to create a home that continues to feel right long after the handover day.',
    ],
    related: ['space-saving-interiors-noida', '3d-visualisation-interiors'],
  },
  {
    id: 'site-execution-noida',
    category: 'Architecture',
    title: 'From Drawing to Handover: What Good Interior Site Execution Looks Like in NCR',
    excerpt: 'A site-led view of the checks, coordination and craftsmanship that turn an approved interior into a finished Noida or Greater Noida home.',
    author: 'Mandeep Sharma',
    date: 'Aug 2026',
    readTime: '9 min read',
    img: u('photo-1698768194564-bd8ac2f4ea94', 1200, 700),
    thumb: u('photo-1698768194564-bd8ac2f4ea94', 800, 560),
    body: [
      'An interior is not completed when the design is approved. That is the point at which the site work begins: a long series of measurements, checks, deliveries, decisions and small acts of coordination that determine whether the finished home feels effortless. On a live site in Noida, Greater Noida or Greater Noida West, the difference between a neat drawing and a good result is usually found in details that are not immediately visible in a render.',
      'The first site visit after possession is a reality check. We verify dimensions, inspect wall conditions, locate structural elements, test plumbing points and note electrical locations. Builder drawings can be close without being exact. A beam may drop lower than expected; a window sill may change the planned headboard; a shaft may affect kitchen depth. Identifying these conditions early is not a delay. It is what protects the later stages from rework.',
      'Sequence matters. Before furniture arrives, the site needs any civil work, waterproofing, plumbing alterations, electrical changes and false-ceiling preparation to be complete. Each trade depends on the one before it. If electrical points are moved after ceiling work, or a tile is selected after a niche has been built, time and materials are lost. A site schedule is not paperwork for its own sake; it is the shared map that keeps multiple craftspeople working in the right order.',
      'Joinery deserves especially careful coordination. A wardrobe may look simple, but it depends on wall plumb, floor level, shutter clearances, skirting detail, electrical points and access for installation. We review shop drawings, material samples, hardware and edge details before production. On site, modules are checked again before final fixing. This is how a custom piece feels integrated with a room rather than placed into it at the last moment.',
      'Material handling is another practical part of quality. Boards, laminates, veneer, stone, hardware and lights should be received, labelled and checked against the approved selections. Not every difference is a problem, but every difference should be seen before it becomes permanent. Natural materials, in particular, need a conversation about variation. Wood grain, stone veining and hand-applied plaster are not identical from piece to piece; their character is part of why they are chosen.',
      'Site experience also teaches the value of mock-ups. A sample of a wall finish, a portion of a fluted panel, a tile layout or a lighting test can answer questions much faster than a long discussion. It gives the client and the execution team something real to evaluate: the depth of a groove, the warmth of a light, the alignment of a joint. Small test areas prevent large surprises and respect both time and material.',
      'Cleanliness and protection are often overlooked, but they signal how a project is being managed. Floors, finished stone, glass and installed furniture need protection while other work continues. Tools should have a place. Waste should be cleared regularly. This keeps the site safer and makes it easier to spot workmanship issues. A disciplined site is not necessarily a silent site — real construction is active — but it should never feel careless.',
      'Before handover, the project needs a methodical snag check. Doors, drawers, lights, appliances, silicone joints, paint touch-ups, polish, grout lines and hardware all deserve attention. We test what can be opened, switched on, adjusted or cleaned. A short list of final corrections is normal; ignoring that list is not. Handover is the moment a site becomes a home, so the final review should be practical and thorough.',
      'Good execution is rarely dramatic. It appears in the wardrobe that closes softly, the kitchen drawer that clears the handle beside it, the light that lands exactly where it should, and the material transition that feels intentional. These details come from people who measure carefully, communicate early and care about the next trade’s work as much as their own. That is the site experience we aim to bring to every NestArcadia project.',
    ],
    related: ['3d-visualisation-interiors', 'interior-budget-conversation'],
  },
  {
    id: '4bhk-interior-design-noida', category: 'Design Cultures', title: '4BHK Interior Design in Noida: Giving Every Room a Clear Role',
    excerpt: 'A larger apartment needs more than more furniture. It needs hierarchy, personality and a plan that lets a family use every square foot well.', author: 'Shivani', date: 'Jun 2026', readTime: '7 min read',
    img: u('photo-1745301558339-44eb3217d5da', 1200, 700), thumb: u('photo-1745301558339-44eb3217d5da', 800, 560),
    pullQuote: 'Space feels luxurious when every room has a purpose — and none of them are trying to do everything.', conclusion: 'A 4BHK interior in Noida should feel generous, not generic. NestArcadia uses a clear spatial story, durable materials and personal details to create homes where scale becomes comfort rather than clutter.',
    body: [
      'A 4BHK gives a family a rare opportunity: enough room to separate activities without separating people. The challenge is that extra rooms can become vague. A guest room that is never used, a formal living area that feels untouchable, or a study that gathers unopened boxes are common outcomes when the planning starts with furniture instead of lifestyle.',
      'We begin by mapping the family’s actual week. Who works from home? How often do grandparents stay? Is the dining table used for meals, homework and celebrations? Which room catches the best morning light? These questions help assign a real role to each space. A room with a clear role is easier to design, furnish and maintain.',
      'The public areas need a sense of connection. In many Noida 4BHK apartments, living, dining and balcony zones can read as one generous sequence if the materials and lighting are coordinated. This does not mean every room needs the same finish. It means the transitions should feel intentional: a common floor tone, a repeated wood finish or a family of lights can tie the home together.',
      'Private rooms deserve their own character. A primary bedroom may be calm and tactile; a child’s room can support change over time; a guest room can pair a daybed with a compact desk. This is where personal collections, colour preference and routines should have more influence than a trend. A layered home feels richer when every person can recognise a part of themselves in it.',
      'Storage is important in a large home too, but it should remain discreet. Full-height joinery, a considered utility zone and room-specific storage prevent the home from accumulating visible clutter. The aim is not to fill a 4BHK; it is to give the family enough room for life to unfold gracefully.',
    ], related: ['space-saving-interiors-noida', 'north-india'],
  },
  {
    id: 'modular-kitchen-noida', category: 'Materials', title: 'Choosing a Modular Kitchen in Noida: The Details That Matter Every Day',
    excerpt: 'A modular kitchen should be planned around real cooking, cleaning and storage habits — not only finish swatches and catalogue modules.', author: 'Shivani', date: 'May 2026', readTime: '6 min read',
    img: u('photo-1682662044733-9120471befc7', 1200, 700), thumb: u('photo-1682662044733-9120471befc7', 800, 560),
    pullQuote: 'The best kitchen is not the one with the most modules. It is the one where every movement feels natural.', conclusion: 'For Noida, Greater Noida and Greater Noida West homes, NestArcadia treats the kitchen as a working room with a daily rhythm. Good layout, honest materials and durable hardware make that rhythm easier for years.',
    body: [
      'A modular kitchen is one of the most-used investments in a home. It has to handle heat, water, groceries, appliances, family routines and the occasional hurried morning. Before choosing a colour or a shutter profile, it is worth understanding the work triangle between sink, hob and refrigerator, as well as the storage that supports it.',
      'For 2BHK and 3BHK apartments in Noida and Greater Noida West, counter space is often the real constraint. We protect a clear preparation area and avoid treating every visible surface as storage. A kitchen with fewer but better-planned modules works more comfortably than one crowded with accessories that limit movement.',
      'Material selection should follow use. Moisture-resistant carcasses, quality edge banding, dependable hinges and easy-clean worktops are more valuable than a fashionable surface that does not suit a busy household. Samples should be viewed in the home’s light, because a warm laminate, stone or tile can look very different under kitchen lighting than it does in a showroom.',
      'Inside the drawers, organisation should remain flexible. Deep drawers for pots, a dedicated cutlery insert, a pull-out for cleaning supplies and a practical pantry can simplify daily use. The correct mix depends on cooking habits, not a standard checklist. A household that cooks frequently needs a different kitchen from one that mainly reheats and entertains.',
      'The final question is maintenance. Can the backsplash be wiped easily? Is there room to open a drawer while another person uses the hob? Where will the mixer, water purifier and waste bins live? Addressing these ordinary details before execution is what makes a finished kitchen feel quietly premium.',
    ], related: ['space-saving-interiors-noida', 'site-execution-noida'],
  },
  {
    id: 'office-reception-design-ncr', category: 'Wellness', title: 'Office Reception Design in Noida and NCR: Your First Five Minutes Matter',
    excerpt: 'A thoughtful office reception creates confidence for visitors and a smoother daily experience for the team behind it.', author: 'Alok Tripathi', date: 'Apr 2026', readTime: '6 min read',
    img: u('photo-1705909773284-bcbbad9a4023', 1200, 700), thumb: u('photo-1705909773284-bcbbad9a4023', 800, 560),
    pullQuote: 'A reception is a business conversation in physical form: clear, welcoming and prepared.', conclusion: 'Whether it serves a boutique consultancy or a growing commercial office, a well-designed reception helps people feel expected. NestArcadia uses this first touchpoint to make every commercial interior in NCR more human and more credible.',
    body: [
      'A visitor forms an impression of a company before a meeting begins. The reception is where that impression is shaped: by the ease of finding the entrance, the comfort of waiting, the clarity of the welcome and the condition of the space. It does not need to be oversized or extravagant. It needs to feel intentional.',
      'For commercial interiors in Noida, a reception plan should start with flow. Visitors need a visible point of contact, staff need a functional work surface, and the route to meeting rooms should be intuitive. A desk that is too large can become a barrier; one that is too small can make the team appear unprepared. Proportion is the first form of hospitality.',
      'Materials should reflect both the brand and the maintenance reality. A textured wall, durable stone-look surface, warm timber detail or restrained metal accent can make an arrival feel premium without requiring delicate care. Lighting is equally important: the desk needs task light, the waiting area needs comfort, and signage needs to be readable without becoming aggressive.',
      'We also recommend considering what a guest does while waiting. A comfortable chair, a small surface for a laptop or cup, access to water, and calm visual cues make a short wait feel considered. These gestures are simple, but they communicate respect for a client’s time.',
      'The most effective reception designs do not imitate a hotel lobby or a social-media set. They express the organisation’s own way of working. When the first five minutes are calm, clear and consistent, the rest of the meeting begins on better ground.',
    ], related: ['commercial-office-interior-greater-noida-west', 'interior-budget-conversation'],
  },
  {
    id: 'commercial-office-interior-greater-noida-west', category: 'Architecture', title: 'Commercial Office Interior Design in Greater Noida West: Plan for Work, Not Just Looks', excerpt: 'A practical guide to planning a commercial office around workflow, privacy, lighting, acoustics, storage and the realities of execution in Greater Noida West.', author: 'Mandeep Sharma', date: 'Jul 2026', readTime: '8 min read', img: u('photo-1746439318854-4a8bc02a03ba', 1200, 700), thumb: u('photo-1746439318854-4a8bc02a03ba', 800, 560), pullQuote: 'A good office interior has to work during the working day, not just during a photography session.', conclusion: 'NestArcadia approaches commercial interiors as coordinated working environments, balancing workflow, client experience, materials, lighting and execution.', body: ["A commercial office interior has to work during the working day, not just during a photography session. In Greater Noida West, a useful office brief starts with the people who will use the space: how they arrive, where focused work happens, how meetings are held, where equipment and documents are stored, and what a visitor should understand about the business within the first few minutes.", "The first decision is zoning. A compact office may need reception, workstations, a private cabin, one meeting area, storage and a small support zone without making the plan feel crowded. These functions should be placed according to movement and privacy rather than simply divided into equal rectangles.", "Workstations need the same attention. Desk dimensions, chair movement, monitor position, cable management and storage all affect how comfortable the space is after the novelty wears off. Furniture should be tested against the actual floor plan and team size before it is ordered.", "Lighting is another operational layer. General illumination supports movement and everyday work; task lighting can support specific work areas; accent lighting can shape reception and meeting spaces. Daylight should also be considered where available because glare and screen reflections can affect how a workspace is used.", "Acoustics deserve equal attention. Open work areas, hard ceilings and reflective surfaces can allow conversations and equipment noise to travel farther than expected. The right solution depends on the room, occupancy and construction, so formal acoustic requirements should be discussed with the relevant specialist when needed.", "Storage is often underestimated in small commercial interiors. Files, samples, equipment, cleaning supplies, stationery and personal items all need a place to go. Built-in cabinets can make a compact office feel calmer, but they should be sized around the actual inventory.", "The reception area is the first transition between the outside world and the business. Signage, seating, lighting, the reception desk, circulation and the visibility of the brand should work together without turning the space into a showroom.", "Materials also need a commercial logic. High-touch areas may need surfaces that are easier to maintain; meeting rooms may benefit from softer finishes; reception can carry more visual character. The right palette is the one that matches expected wear, maintenance and the identity of the business.", "In Greater Noida West, site coordination can be just as important as the design. Building rules, access timings, lift availability, material movement, existing services and landlord or society requirements can affect the execution sequence. These constraints should be checked early.", "A clear commercial interior process therefore looks less like a styling exercise and more like a coordinated project: brief and measured site conditions, zoning and circulation, furniture and lighting, storage and materials, documented decisions, coordinated execution and a practical handover review.", "For a growing business, the office may also need to change. Flexible furniture, sensible service planning and adaptable partitions can make future changes easier, although the right level of flexibility depends on the lease, building and business plan.", "The goal is not to make every office look like a polished corporate headquarters. A good commercial interior gives people enough clarity to work, enough privacy to concentrate, enough flexibility to collaborate and enough character to make the business feel like itself."], related: ['office-reception-design-ncr', 'interior-budget-conversation']
  },
  {
    id: 'lighting-design-noida-homes', category: 'Surfaces', title: 'Lighting Design for Noida Homes: Layering Light for 2BHK, 3BHK and 4BHK Interiors',
    excerpt: 'Good lighting is not a row of spotlights. It is a layered plan that gives a home atmosphere, comfort and practical clarity.', author: 'Shivani', date: 'Mar 2026', readTime: '6 min read',
    img: u('photo-1564078516393-cf04bd966897', 1200, 700), thumb: u('photo-1564078516393-cf04bd966897', 800, 560),
    pullQuote: 'Light should reveal how a home is lived in, not flatten it into a brighter version of itself.', conclusion: 'NestArcadia plans lighting alongside the interior, not after it. For homes across Noida and Greater Noida, that means a warmer, more useful atmosphere from the first evening at home.',
    body: [
      'Lighting is often the last decision in an interior project, yet it changes every material and every room. A well-designed 2BHK, 3BHK or 4BHK in Noida uses different kinds of light for different moments: broad ambient light for circulation, task light for work and cooking, and accent light to give a room depth after sunset.',
      'The most common mistake is relying only on downlights. They make a room bright but can leave faces shadowed, walls flat and corners forgotten. A more balanced plan combines ceiling light with lamps, concealed profiles, wall lights or pendants where they serve the room. Each layer gives the home a different mood and makes it easier to adapt through the day.',
      'Colour temperature deserves attention. Warm light generally supports bedrooms, living rooms and dining spaces; more neutral light can be helpful in kitchens, dressing areas and work zones. The goal is continuity, not uniformity. A home can have different functional zones without feeling as though every room belongs to a different building.',
      'Lighting also needs to be planned before the ceiling and electrical work are complete. Switch locations, dimming, bedside controls, art lighting and pendant positions are difficult to solve once finishes are installed. This is why we include lighting early in the design process, alongside furniture placement and material planning.',
      'Even a simple home can feel more considered with a few well-chosen lights. One reading lamp beside a favourite chair, a soft wash on a textured wall or a pendant that gives the dining table a centre of gravity can do more than an expensive grid of fittings. The aim is atmosphere with purpose.',
    ], related: ['lime-plaster', '4bhk-interior-design-noida'],
  },
  {
    id: 'interior-material-selection-ncr', category: 'Craft', title: 'How to Select Interior Materials for an NCR Home Without Being Overwhelmed',
    excerpt: 'A technical but approachable guide to comparing finishes, samples and performance before committing to a material palette.', author: 'Shami Saifi', date: 'Feb 2026', readTime: '6 min read',
    img: u('photo-1667400104764-a5fd01a919b0', 1200, 700), thumb: u('photo-1667400104764-a5fd01a919b0', 800, 560),
    pullQuote: 'A beautiful sample is only the beginning; the right material must also perform in the place where it will live.', conclusion: 'Material selection becomes manageable when it is connected to use, light and maintenance. NestArcadia helps NCR homeowners make fewer, better choices so that the finished home feels coherent rather than crowded.',
    body: [
      'Material selection can feel overwhelming because every showroom presents dozens of options at once. Laminates, veneers, stones, fabrics, tiles, metals and paints all have their own vocabulary. The useful way to begin is not with a colour board. Begin with the room: how it is used, how much light it receives, what maintenance it can realistically handle and what feeling it should create.',
      'In NCR homes, durability is a practical consideration. Kitchens and entryways need surfaces that manage daily wear; children’s rooms benefit from forgiving finishes; bathrooms require materials that respect moisture. A finish that looks premium in a sample book may not be the right choice for every application. Performance and beauty need to work together.',
      'We suggest clients look at large samples in the actual home wherever possible. Daylight, warm evening light and surrounding finishes can change the apparent tone of a material. This is especially true for wood, stone and paint. Viewing two options side by side, against the floor and wall they will meet, often makes the decision much clearer than a photograph can.',
      'A limited palette generally creates a more elegant result. Instead of choosing a different wood, metal and stone for every room, identify a family of materials that can repeat in varied ways. Repetition gives a home continuity; variation gives it character. The combination is what makes an interior feel designed rather than assembled.',
      'Technical details should not be hidden from clients. We explain where a natural veneer may vary, why a certain stone needs sealing, what type of hardware supports a heavy shutter and how a finish should be cleaned. Informed choices protect the finished design and let homeowners enjoy it with confidence.',
    ], related: ['3d-visualisation-interiors', 'site-execution-noida'],
  },
  {
    id: 'sustainable-interior-materials-noida', category: 'Materials', title: 'Sustainable Interior Materials for Noida Homes: What Is Worth Choosing?',
    excerpt: 'A practical view of low-VOC finishes, responsibly sourced wood and durable materials for modern interiors in Noida and Greater Noida.', author: 'Shivani', date: 'Jan 2026', readTime: '6 min read',
    img: u('photo-1618221195710-dd6b41faaea6', 1200, 700), thumb: u('photo-1618221195710-dd6b41faaea6', 800, 560),
    pullQuote: 'Sustainable design is less about a label and more about choosing materials that stay useful for a long time.', conclusion: 'NestArcadia helps homeowners compare material performance, durability, maintenance and emissions information so sustainability becomes a practical part of interior decisions in NCR.',
    body: ["Sustainable interior design is becoming a practical consideration for homeowners, not simply a visual trend. In a Noida apartment, useful choices often include durable finishes, repairable furniture, efficient use of materials and products whose environmental or emissions information can actually be verified.", "The most sustainable item is often one that does not need replacing quickly. A well-built wardrobe, a durable floor finish or a solid dining table can outlast several trend cycles. We encourage clients to invest in high-use elements first, then keep easier-to-change layers — textiles, artwork and accessories — more flexible.", "Indoor air quality deserves a careful, evidence-based conversation. Paints, adhesives, sealants and engineered wood products can emit volatile organic compounds (VOCs), but emissions vary by formulation and product. Rather than treating every 'chemical' finish as harmful, ask manufacturers for product information, consider low-emission options where appropriate, allow adequate ventilation during installation and follow the product's curing or occupancy guidance.", "Durability also matters because replacement has an environmental cost. A finish that can be repaired, refinished or maintained may be preferable to one that looks impressive initially but needs frequent replacement. Maintenance requirements should therefore be considered alongside recycled content, sourcing claims and the expected service life of the product.", "Responsible sourcing is another part of the picture. Wood certification, supplier transparency, locally available materials, transport distance, manufacturing processes and the amount of waste generated during fabrication can all matter. No single label makes a product universally sustainable, so the useful approach is to compare the factors that are relevant to the project.", "The goal is not a perfect material palette or a long list of eco claims. It is a home with fewer disposable decisions, durable finishes, sensible maintenance and enough flexibility to adapt over time. That approach can support both resource-conscious design and the everyday experience of living there."], related: ['interior-material-selection-ncr', 'lime-plaster'],
  },
  {
    id: 'handcrafted-textiles-modern-home', category: 'Craft', title: 'Handcrafted Textiles in Modern Indian Interiors: How to Use Them Without Overdoing It',
    excerpt: 'Block prints, handwoven fabrics and artisanal rugs can give contemporary homes in NCR depth, softness and a personal story.', author: 'Shivani', date: 'Dec 2025', readTime: '6 min read',
    img: u('photo-1640292343595-889db1c8262e', 1200, 700), thumb: u('photo-1640292343595-889db1c8262e', 800, 560),
    pullQuote: 'Craft feels most contemporary when it is given room to breathe.', conclusion: 'NestArcadia uses handcrafted textiles as a living layer within a modern home: personal, tactile and never forced.',
    body: ['Handcrafted textiles are one of the easiest ways to bring Indian craft into a contemporary interior. Linen curtains, a handwoven rug, a block-printed cushion or an upholstered bench can add warmth without changing the architecture of a room. The key is editing: one strong textile story is more powerful than several competing patterns.', 'In 2BHK and 3BHK homes across Noida and Greater Noida, we often begin with the largest soft surface. It may be curtains, a rug or upholstery. Once that choice sets the colour temperature, smaller textiles can support it through texture rather than repetition. This keeps the room calm while still allowing it to feel rooted.', 'Natural fibres have an advantage in the NCR climate because they soften light and create a more breathable visual mood. They also come with real variation, which is part of their character. The aim is not a perfectly uniform finish; it is a home that carries the small evidence of the human hand.', 'A thoughtful textile palette can evolve with the family. Cushions, throws and table linen are easy to refresh seasonally, while the foundational furniture remains steady. That balance makes handcrafted design feel lived-in rather than staged.'], related: ['rattan', 'north-india'],
  },
  {
    id: 'wall-finish-trends-india', category: 'Craft', title: 'Wall Finish Trends for Indian Homes: Lime Wash, Texture Paint and Microcement',
    excerpt: 'A clear guide to choosing a modern wall finish for bedrooms, living rooms and feature walls in Noida and Greater Noida homes.', author: 'Shami Saifi', date: 'Nov 2025', readTime: '6 min read',
    img: u('photo-1677256466027-5fdb66b1c348', 1200, 700), thumb: u('photo-1677256466027-5fdb66b1c348', 800, 560),
    pullQuote: 'A textured wall should support the room’s light and proportion, not compete with everything in it.', conclusion: 'The right wall finish is specific to the room and the way it is used. NestArcadia tests material, light and maintenance before recommending a feature surface for an NCR home.',
    body: ['Wall finishes are a high-search design topic because they change the atmosphere of a room without adding more furniture. Lime wash, microcement, textured paint and hand-applied plaster each create a different response to light. The right choice depends on the wall condition, budget and the level of variation a homeowner enjoys.', 'Lime wash and plaster have a soft, mineral depth that suits bedrooms and quiet living spaces. Microcement brings a more seamless contemporary character and can work in selected wet or high-use zones when installed by experienced applicators. Textured paint is often the more accessible option, but it still benefits from a careful sample and a restrained colour.', 'Before finalising a wall, we consider how daylight moves through the room, where artificial light will fall and what sits against that surface. A finish that looks beautiful behind a bed may overwhelm a full living-room wall. A small mock-up is one of the best ways to make the decision with confidence.', 'Current trends matter, but a wall finish should still feel right after the trend changes. The most enduring surfaces have texture, warmth and a relationship to the rest of the home rather than a need to be the loudest element in it.'], related: ['lime-plaster', 'interior-material-selection-ncr'],
  },
  {
    id: 'warm-minimalism-indian-homes', category: 'Design Cultures', title: 'Warm Minimalism for Indian Homes: A Softer Alternative to Stark Interiors',
    excerpt: 'Why warm minimal interiors are trending for 2BHK, 3BHK and 4BHK homes in Noida, and how to make the style feel personal.', author: 'Shivani', date: 'Oct 2025', readTime: '6 min read',
    img: u('photo-1631510083755-11ecb5172d81', 1200, 700), thumb: u('photo-1631510083755-11ecb5172d81', 800, 560),
    pullQuote: 'Minimalism is not the absence of personality; it is the decision to make each element count.', conclusion: 'Warm minimalism gives NestArcadia clients a way to create calm, modern homes without losing the material depth and family character that make Indian interiors meaningful.',
    body: ['Warm minimalism is one of the most durable interior trends because it answers a real need: homes should feel calm without becoming cold. Rather than relying on empty white rooms, it uses soft neutrals, timber, tactile fabrics, gentle lighting and a limited set of well-made objects.', 'For an apartment in Noida or Greater Noida West, the style works especially well when storage is integrated and visual clutter is reduced. Full-height joinery in a quiet finish, a generous sofa, a textured rug and one meaningful art piece can do more than a room filled with small decorative purchases.', 'The Indian version of warm minimalism has room for craft. A carved object, cane panel, handmade ceramic or block-printed textile can enter the room as an accent. The goal is to let these pieces feel valued rather than to turn them into a theme.', 'The result is a home that photographs well but, more importantly, feels easy to inhabit. It gives routines room, lets materials speak and supports a slower, more intentional way of living.'], related: ['4bhk-interior-design-noida', 'rattan'],
  },
  {
    id: 'biophilic-design-indian-apartments', category: 'Design Cultures', title: 'Biophilic Interior Design for Indian Apartments: Bringing Nature Into Urban Homes',
    excerpt: 'From daylight and plants to natural finishes, biophilic interior design can make city apartments in Noida feel more restorative.', author: 'Shivani', date: 'Sep 2025', readTime: '6 min read',
    img: u('photo-1592150621744-aca64f48394a', 1200, 700), thumb: u('photo-1592150621744-aca64f48394a', 800, 560),
    pullQuote: 'Nature in a home is not an accessory; it is a way of improving how a space feels to use.', conclusion: 'NestArcadia interprets biophilic design through daylight, materials, plants and planning — creating healthier-feeling urban homes without treating greenery as a decorative afterthought.',
    body: ['Biophilic design is the practice of creating stronger connections with nature inside built spaces. In urban apartments, it is often discussed through houseplants, but the idea is broader: daylight, views, natural materials, airflow, organic forms and a sense of seasonal change all contribute.', 'A Noida or Greater Noida apartment can start simply. Protect the balcony from becoming a storage zone, choose plants that suit its light, and make the view from the living room feel intentional. Natural wood, linen and stone-like finishes can add tactile warmth even where a large indoor garden is not possible.', 'The practical side matters. Plants need the right conditions and maintenance, so we avoid designing greenery that becomes a burden. We also use lighting, furniture placement and materials to create the same restorative feeling when plant care is not a priority for the household.', 'The best biophilic interiors are not jungles. They are homes where the connection to light, air and living materials feels easy, honest and supportive of daily life.'], related: ['warm-minimalism-indian-homes', 'space-saving-interiors-noida'],
  },
  {
    id: 'home-office-interior-noida', category: 'Wellness', title: 'Home Office Interior Design in Noida: Building a Workspace That Supports Focus',
    excerpt: 'A home office needs more than a desk. Learn how lighting, acoustics, storage and ergonomics can improve work-from-home interiors.', author: 'Shami Saifi', date: 'Aug 2025', readTime: '6 min read',
    img: u('photo-1653551903159-21925bd65e7a', 1200, 700), thumb: u('photo-1653551903159-21925bd65e7a', 800, 560),
    pullQuote: 'A focused workspace is designed around attention, not just a laptop-sized surface.', conclusion: 'NestArcadia plans home offices around real work patterns, helping Noida and Greater Noida residents create productive spaces that still belong within the home.',
    body: ['Remote and hybrid work have made the home office a major interior design priority. In a compact 2BHK, the workspace may share a bedroom or living area; in a 3BHK or 4BHK, it may have a dedicated room. Either way, the design should support concentration without feeling disconnected from the rest of the home.', 'Ergonomics comes first: a correctly proportioned desk, comfortable chair, screen position and task lighting make a meaningful difference to daily comfort. Storage should keep cables, papers and equipment controlled, while a background wall or shelf can make video calls feel tidy and professional.', 'Acoustics are equally valuable. Soft furnishings, curtains and a door that closes well can reduce household sound. A desk positioned to receive side light rather than glare from a window is often more comfortable for long hours and gives a better camera view for calls.', 'The best home offices can be closed at the end of the day, physically or visually. That boundary supports wellbeing and lets the rest of the home remain a place to live, rest and connect.'], related: ['space-saving-interiors-noida', '3d-visualisation-interiors'],
  },
  {
    id: 'apartment-renovation-noida', category: 'Architecture', title: 'Apartment Renovation in Noida: A Smart Order of Work Before You Move In',
    excerpt: 'Planning a renovation before possession or move-in? Start with the decisions that protect budget, timeline and the final quality of your interior.', author: 'Mandeep Sharma', date: 'Jul 2025', readTime: '6 min read',
    img: u('photo-1517581177682-a085bb7ffb15', 1200, 700), thumb: u('photo-1517581177682-a085bb7ffb15', 800, 560),
    pullQuote: 'Renovation feels smoother when the hidden work is settled before the visible work begins.', conclusion: 'A successful apartment renovation in Noida begins with sequence, clarity and site verification. NestArcadia coordinates those foundations so the final interior feels resolved rather than rushed.',
    body: ['Apartment renovation is an opportunity to correct the things that do not work before a family settles in: insufficient storage, awkward lighting, poor kitchen flow or unfinished builder surfaces. It can also become expensive when decisions are made out of sequence. A clear plan prevents decorative work from being undone by later technical changes.', 'We begin with site measurement and existing conditions, then finalise the layout, electrical plan, plumbing requirements and ceiling strategy. Only after those decisions are stable should materials and furniture details move into production. This order protects both the timeline and the quality of the final installation.', 'For Noida and Greater Noida homes, society permissions, lift access, working hours and delivery coordination should be considered early. These are practical realities of execution that affect schedule just as much as the design itself. A team with site experience plans for them rather than discovering them midway.', 'Renovation is most successful when the client can see the process clearly: what is being changed, why it is being changed and what comes next. That clarity turns a potentially stressful project into a controlled, collaborative journey.'], related: ['site-execution-noida', 'interior-budget-conversation'],
  },
  {
    id: 'buying-new-flat-interior-checklist', category: 'Architecture', title: 'Buying a New Flat in Greater Noida West? An Interior Design Checklist Before Possession',
    excerpt: 'Before you buy furniture or accept possession, use this practical checklist to plan storage, electrical points, kitchen layout and a realistic interior scope for a new NCR apartment.', author: 'Mandeep Sharma', date: 'Sep 2025', readTime: '8 min read',
    img: u('photo-1721395286594-8913b06056eb', 1200, 700), thumb: u('photo-1721395286594-8913b06056eb', 800, 560),
    pullQuote: 'The best time to plan a new home is before the first piece of furniture makes the layout harder to change.', conclusion: 'For a new Greater Noida West or Noida Extension apartment, early interior planning protects both the budget and the everyday experience of the home. NestArcadia uses the possession window to turn a blank builder flat into a considered, practical starting point.',
    body: ['Buying a new flat is usually followed by a rush of decisions: possession dates, moving plans, appliances, furniture and a long list of saved interior images. The most useful next step is to slow down long enough to understand the apartment itself. A 2BHK or 3BHK can look generous on a brochure but feel very different once wall depths, door swings, balcony widths and usable carpet area are considered.', 'Before finalising furniture, measure the rooms and record the builder-provided electrical, plumbing and service points. Check where a refrigerator can sit without blocking a passage, where a washing machine will connect, how wide the master-bedroom wall really is, and whether the living room can hold the seating you have in mind while leaving a comfortable path to the balcony. These details guide a more realistic interior plan.', 'The possession stage is also the right time to decide what should be fixed and what can wait. Kitchen modules, wardrobes, lighting, false-ceiling work and major storage need early coordination. Loose furniture, art and soft furnishings can be added later after the family has lived in the home. This phased approach keeps the first scope focused on daily function without forcing every decorative decision at once.', 'For new high-rise homes in Greater Noida West and Noida Extension, society rules matter as much as design. Lift bookings, working hours, delivery access and contractor permissions affect execution. A design team that plans around these conditions can keep the site organised and the move-in timeline clearer. The goal is not simply to fill a new flat; it is to make its first version work well enough to grow with the family.'], related: ['space-saving-interiors-noida', 'apartment-renovation-noida'],
  },
  {
    id: 'modular-kitchen-design-noida', category: 'Materials', title: 'Modern Modular Kitchen Design for Noida Apartments: Layout, Storage and Materials', excerpt: 'A focused guide to planning an L-shaped or parallel modular kitchen that works for real cooking in a 2BHK or 3BHK apartment.', author: 'Shivani', date: 'Oct 2025', readTime: '8 min read', img: u('photo-1745429523635-ad375f836bf2', 1200, 700), thumb: u('photo-1745429523635-ad375f836bf2', 800, 560), pullQuote: 'A kitchen feels premium when its daily movements are simple, not when every cabinet is filled with hardware.', conclusion: 'NestArcadia plans modular kitchens around usable counter space, believable storage and durable materials so Noida homes can cook, clean and gather with ease.', body: ['The most successful modular kitchen starts with the cooking routine rather than a finish swatch. In a Noida apartment, the available wall length, window location, appliance sizes and work triangle between the hob, sink and refrigerator determine whether a kitchen feels easy or compromised.', 'L-shaped kitchens often suit compact homes because they create a clear prep zone while leaving room for movement. Parallel kitchens can work beautifully when there is enough aisle width. The right layout is not a trend; it is the one that lets drawers open, two people pass and worktops remain useful during daily cooking.', 'Storage should support the household’s real inventory. Deep drawers for pots, organised cutlery, a dedicated pantry and space for appliances usually matter more than decorative open shelves. Choosing materials also means thinking about heat, moisture, cleaning and the longevity of hardware.', 'Before execution, finalise appliance sizes, water points, chimney position and electrical sockets. These practical decisions allow the visible design to stay clean, while the kitchen remains ready for the life that happens inside it.'], related: ['modular-kitchen-noida', 'space-saving-interiors-noida']
  },
  {
    id: 'balcony-decoration-noida', category: 'Design Cultures', title: 'Balcony Decoration Ideas for Noida Apartments: Make a Small Outdoor Space Feel Useful', excerpt: 'How to turn a compact apartment balcony into a breathable morning, evening or entertaining space without crowding it.', author: 'Shivani', date: 'Aug 2025', readTime: '7 min read', img: u('photo-1769614823844-042d6a9b95d6', 1200, 700), thumb: u('photo-1769614823844-042d6a9b95d6', 800, 560), pullQuote: 'A balcony becomes valuable when it supports a real routine, not when it becomes another storage room.', conclusion: 'NestArcadia treats the balcony as a small but meaningful room in the home: a place for air, light and an everyday pause.', body: ['In a high-rise apartment, the balcony is often the closest connection to daylight and fresh air. It should be planned with the same care as a small room: a clear purpose, appropriate seating and materials that handle sun, dust and rain.', 'Start by deciding how it will be used. A morning tea corner needs two comfortable chairs and a surface; a plant-led balcony needs the right light and drainage; a family balcony may benefit from foldable furniture that can be cleared for gatherings.', 'Avoid oversized furniture and too many planters. Compact, weather-resistant pieces and a simple layered-lighting plan can make a narrow balcony feel calmer and more open. Screens or planting can add privacy without blocking every view or breeze.', 'The best balcony decoration is practical enough to be used often. When access stays clear and maintenance remains realistic, the space can become one of the most restorative parts of an urban home.'], related: ['biophilic-design-indian-apartments', 'warm-minimalism-indian-homes']
  },
  {
    id: 'living-room-dos-donts-noida', category: 'Wellness', title: 'Living Room Design Do’s and Don’ts for Noida Apartments', excerpt: 'Create an open, breathable living room with better proportions, lighting and storage—without overfilling the space.', author: 'Mandeep Sharma', date: 'Jul 2025', readTime: '7 min read', img: u('photo-1720247520862-7e4b14176fa8', 1200, 700), thumb: u('photo-1720247520862-7e4b14176fa8', 800, 560), pullQuote: 'The most inviting living rooms leave room for people to move, not just room for more furniture.', conclusion: 'NestArcadia uses proportion, light and circulation to give Noida living rooms a calmer, more generous everyday rhythm.', body: ['A living room can feel crowded even when it is not small. The usual cause is proportion: a sofa that is too deep, a centre table that blocks circulation, a TV unit that dominates the wall or too many small objects competing for attention.', 'Do begin with the path through the room. Keep access to the balcony, dining area and seating clear before choosing furniture. Do use one or two focal points, such as a thoughtfully lit wall or a well-proportioned rug. Do let the seating arrangement support conversation rather than push every piece against a wall.', 'Do not buy furniture from a showroom without comparing its depth and scale to the actual plan. Do not rely only on ceiling downlights; use layered light to make evenings softer. Do not treat every wall as a place for storage or display.', 'An open living room is not an empty one. It has enough function for daily life, with visual rest between its essential elements. That is what makes it feel spacious and comfortable at the same time.'], related: ['space-saving-interiors-noida', 'lighting-design-noida-homes']
  },
  {
    id: 'foldable-home-bar-design-noida', category: 'Craft', title: 'Foldable Home Bar Design for Noida Homes: A Compact Entertaining Idea', excerpt: 'A stylish, compact bar cabinet can open for a party and close back into a calm living room when the evening is over.', author: 'Alok Tripathi', date: 'Jun 2025', readTime: '7 min read', img: u('photo-1783018563064-bd08fcc49f8d', 1200, 700), thumb: u('photo-1783018563064-bd08fcc49f8d', 800, 560), pullQuote: 'A small bar works best when it looks like furniture first and an entertaining station second.', conclusion: 'NestArcadia designs foldable home bars as a compact, tailored layer for entertaining—easy to store, satisfying to use and proportioned for real Noida apartments.', body: ['A home bar no longer needs a dedicated room. In a compact Noida apartment, a foldable or concealed bar cabinet can hold glassware, bottles, an ice bucket and a small serving surface while remaining quiet when it is not in use.', 'The design should begin with the closed condition. When shut, the bar can read as a slim sideboard, wall cabinet or display unit. When opened, folding shutters, a pull-out shelf and integrated warm lighting can create a useful entertaining station without taking over the living room.', 'Inside, practical details matter: bottle height, stemware support, a wipeable surface, ventilation where needed and a secure closure. The cabinet should also be positioned near a convenient serving zone without blocking circulation during a gathering.', 'A compact bar is most successful when it matches the larger interior palette. Timber, cane, metal or a softly lit niche can make it feel collected and personal rather than like a standalone product placed into the room.'], related: ['living-room-dos-donts-noida', 'interior-material-selection-ncr']
  },
];

export const getJournalArticle = (slug?: string) => articles.find((article) => article.id === slug);

const categories = ['All', 'Materials', 'Craft', 'Surfaces', 'Design Cultures', 'Wellness', 'Architecture'];

const categoryDeepDives: Record<string, string[]> = {
  Materials: [
    'A material decision should begin with the room rather than a showroom sample. In a kitchen, entry or utility zone, water resistance, cleaning and edge durability tend to matter more than an unusual grain or fashionable colour. In a bedroom or living room, touch, light and acoustic softness may matter more. NestArcadia reviews materials against the actual use of the space so a finish is not simply attractive on day one, but remains appropriate after everyday family life has begun.',
    'For NCR apartments, it is useful to separate structural materials from decorative layers. Boards, carcasses, hardware, adhesives and worktops carry the daily work of a home; veneers, laminates, textiles and accents create much of the visible mood. A premium result depends on both. Spending carefully on hidden components such as moisture-resistant boards and reliable hinges often protects the more visible choices, preventing premature swelling, sagging or repair work.',
    'Samples should be reviewed together, at a meaningful scale and in the home’s own light. A warm oak may appear grey in one room and honeyed in another; a stone may read cool beside a white wall but balanced beside a cream textile. We prefer a material board that includes floor, wall, wood, metal and fabric samples rather than isolated decisions. It helps a homeowner see the relationship between elements before orders are finalised.',
    'Maintenance is part of design quality. Natural stone may need sealing, a matte finish may show hand marks differently from a gloss surface, and a fabric may require a particular cleaning method. None of these qualities are automatically problems. They simply need to suit the household. The most successful material palettes are honest about maintenance and let the family choose where they want refinement, resilience or a little natural variation.',
    'When comparing options, ask whether a material is proportionate to the role it plays. A frequently touched wardrobe handle, a kitchen shutter near heat or a bathroom vanity surface deserves a different standard from a low-contact display shelf. This is how a home can feel considered without being over-specified. The aim is an interior that has material intelligence: beautiful, practical and clear about how it will age.',
    'It is also helpful to keep a short record of approved materials, suppliers and care instructions at handover. A home changes over time, and this information makes future repairs or additions easier to manage. It can also prevent a new contractor from introducing a close-looking substitute that behaves very differently from the original finish.',
    'Finally, material choices should leave room for the family’s own taste to evolve. A balanced foundation of floor, cabinetry and paint makes it easier to change artwork, textiles and accessories later. This is often a better long-term investment than fixing every decision around a short-lived colour or surface trend.',
  ],
  Craft: [
    'Craft-led interiors are not about filling a home with decorative objects. They are about recognising where a material or technique can add depth that a mass-produced substitute cannot. A cane panel may bring breathability to a wardrobe, a handwoven textile may soften a long wall of joinery, and a shaped metal detail may make a simple cabinet feel resolved. The effect comes from placement, proportion and restraint.',
    'A good craft decision benefits from a conversation about scale. Large patterned screens, textured plaster or prominent carved work need visual space around them. Smaller interventions—an inset, a handle, a lamp or a single woven chair—can carry the same spirit in a more compact 2BHK or 3BHK. The right scale lets the detail feel intentional instead of creating a room that is visually busy.',
    'The practical side matters as much as the story. Handmade finishes may have variation, cane needs appropriate support and ventilation, and delicate surfaces need the right cleaning routine. We explain those characteristics before specifying a craft element, because an informed homeowner is more likely to enjoy its individuality. A handmade finish should be appreciated for its life, not judged against the impossible uniformity of a printed image.',
    'Craft also works best when it belongs to a broader material conversation. Natural wood, lime-based surfaces, linen, stone and warm metals often support one another because they share a tactile quality. By contrast, combining several ornate finishes without a quiet background can make each one less visible. NestArcadia uses calm planes and carefully chosen focal details so material character remains legible.',
    'For a modern Indian interior, the question is not whether something looks traditional or contemporary. The stronger question is whether it belongs in the way the household lives now. A crafted screen that creates privacy, a handwoven rug that makes a living area more comfortable, or a textured wall that changes with daylight can all be deeply contemporary because they serve a real purpose.',
    'When commissioning a custom or handmade element, allow time for samples, fabrication and installation. These are not instant products, and that is part of their value. A clear drawing, a physical sample and an agreed tolerance for natural variation give both the craftsperson and homeowner a more successful outcome.',
    'The final measure is whether the crafted element continues to feel useful after the first impression. If it improves privacy, comfort, storage, light or a daily ritual, it will remain part of the home’s life rather than becoming an object that merely photographs well.',
  ],
  Surfaces: [
    'Surface choices set the visual temperature of a home. Walls, floors, ceilings and large cabinetry occupy more of the eye line than most furniture, so they should be decided with care. A soft mineral finish can make a room feel quiet; a timber grain can bring warmth; a darker wall can give depth when there is enough daylight. The best choice responds to the room’s orientation, scale and use.',
    'Before committing to a finish, make a small site sample wherever possible. Screens flatten texture and showroom lighting rarely matches a home. A sample lets the team inspect the colour beside the floor, see how the material behaves under morning and evening light, and confirm that the installation quality is right. This simple step prevents a large portion of avoidable disappointment during execution.',
    'Textured finishes should be chosen with maintenance in mind. A delicate hand-applied wall can be beautiful in a primary bedroom or formal living area, while a high-traffic passage might benefit from a more robust paint or panel solution. Similarly, a seamless surface can look calm but requires a skilled installer and correct substrate preparation. The finish itself is only half the decision; the site conditions matter too.',
    'Lighting and surfaces are inseparable. Grazing light can reveal the depth of plaster, profile lights can make a wall panel feel architectural, and a poorly placed downlight can exaggerate every imperfection. Planning these together is more effective than adding lights after the surface work is complete. A well-lit surface feels deliberate, while an overlit one can lose the material’s subtlety.',
    'Trends such as lime wash, microcement and fluting are most useful when they answer a specific design need. They should never be applied simply because they are popular in reference images. NestArcadia evaluates the material, room and installation method together so the final surface has the calm, durability and character the home actually needs.',
    'Surface transitions deserve the same attention as the finish itself. Where a panel meets paint, where stone meets wood or where a ceiling detail returns into a wall can make the difference between a refined room and one that feels assembled in parts. These junctions should be detailed before installation begins.',
    'A useful surface palette usually includes moments of rest. If one wall is strongly textured, adjacent planes can be simpler; if the floor is expressive, cabinetry can be calmer. This balance makes a home feel cohesive and lets each material remain visible for the right reason.',
  ],
  'Design Cultures': [
    'Design culture is not a catalogue of motifs. It is a way of understanding how climate, craft, family life and material traditions have shaped Indian homes across regions. When these ideas are translated thoughtfully, they can give a contemporary apartment warmth and identity without turning it into a themed imitation of the past.',
    'A useful starting point is to identify one or two principles rather than copying an entire visual style. The shaded layering of a North Indian verandah, the material restraint of a southern home, the colour confidence of western India or the earthy tactility of central regions can each inspire a modern design decision. The translation might appear in light, timber, textiles, a screen or a room’s spatial rhythm.',
    'Contemporary families also need modern performance. Storage, work-from-home corners, modular kitchens and easy maintenance are part of the brief. Heritage influence should support these needs rather than compete with them. A carved detail can sit beside efficient joinery; a traditional textile can work within a quiet, modern palette; a courtyard principle can guide the focal point of an apartment living room.',
    'The strongest interiors allow personal history into the room. A family heirloom, a locally made object, a meaningful textile or a preference for a particular material can shape the design more honestly than a trend board. This is why NestArcadia begins with conversations about the people who will live in a space, not only the style they have saved online.',
    'A culturally rooted home should still feel open to the present. It should have room for changing routines, new technology and everyday mess, as well as for beauty. By balancing history with practical planning, an interior can feel specific to its place and its family while remaining relaxed, contemporary and easy to use.',
    'This approach is particularly useful in high-rise NCR apartments, where the building shell may be neutral or repetitive. Materials, light and a few well-placed crafted elements can establish a sense of belonging without requiring structural change. The home becomes distinctive through lived details rather than decorative excess.',
    'A good cultural reference should invite curiosity, not demand explanation. It can be discovered slowly in the grain of wood, a textile pattern or the way a screen filters light. That quiet confidence helps a home feel lasting even as the family’s needs and tastes evolve.',
  ],
  Wellness: [
    'Wellbeing in an interior is created through many small decisions: daylight that reaches the rooms used most often, a clear route through the home, a place to put everyday belongings, lighting that changes with the evening, and materials that feel comfortable rather than clinical. It is not a single feature. It is the cumulative effect of spaces that support the body and mind during ordinary routines.',
    'Vastu-led planning, biophilic ideas, acoustic comfort and ergonomic workspaces can all be considered as part of the same larger goal: a home that feels balanced to live in. We avoid treating any one principle as a rigid formula. Instead, the design process considers orientation, function, light, airflow and the household’s own habits alongside the client’s preferences and beliefs.',
    'A calm home does not need to be empty. Families need storage, comfortable seating, work surfaces and room for children or guests. The difference is whether these elements are organised with a clear hierarchy. When daily objects have a home and a room has an understandable focal point, the environment feels less demanding even when life is busy.',
    'Lighting is especially important to everyday wellbeing. Layered lighting helps a home move from practical morning tasks to softer evenings, while good task light supports cooking, reading and work. Natural light should be protected where possible, not blocked by oversized furniture or heavy treatments. Small adjustments in placement can make a room feel noticeably more restorative.',
    'Wellness-focused interiors should be personal rather than prescriptive. A reading corner, a clear desk, a prayer space, a balcony with plants or a bedroom with fewer visual distractions can all matter, depending on the household. The design succeeds when it makes a family’s own version of comfort easier to maintain.',
    'Practical comfort also depends on details that are easy to overlook: switches that are easy to reach, storage near where items are used, safe clearances around furniture and a place to sit while putting on shoes. These decisions reduce small daily friction, which is often the most meaningful form of wellbeing in a busy household.',
    'Rather than adding every wellness trend, choose the changes that will be used consistently. One well-positioned desk, a calm bedroom lighting plan or a balcony that becomes part of the evening routine can have more value than a room full of features that are difficult to maintain.',
  ],
  Architecture: [
    'Architecture and interior design meet in the decisions that change how a space works: openings, circulation, lighting, room proportions, ceiling levels and the relationship between fixed elements and furniture. In an apartment, these choices need to respect the building’s constraints while making everyday movement easier. In a commercial space, they also need to support workflow, privacy and the experience of visitors.',
    'A measured site visit is essential before fixed work begins. Builder drawings are a valuable reference, but site conditions can reveal beam depths, services, wall deviations and window details that affect execution. Verifying these elements early helps the design team avoid changes after orders are placed and keeps custom joinery, lighting and electrical work aligned with reality.',
    'Sequence protects quality. Civil adjustments, plumbing, electrical planning, ceilings and surface preparation should be resolved before furniture installation and decorative styling. When this order is reversed, a project can become more expensive and less precise. A clear schedule also gives homeowners visibility into what is happening at site and why a particular decision needs to be made at a particular time.',
    'The best architectural interventions are often subtle. A better-positioned doorway, a more useful kitchen layout, a screen that creates privacy without blocking light, or a correctly sized reception area can transform a space more than a dramatic decorative feature. These decisions may not dominate a photograph, but they shape the everyday experience of the home or workplace.',
    'For renovation and turnkey execution, good coordination is as important as the final design. Materials, trades, access, safety, protection and snag checks all affect the handover. NestArcadia treats these practical layers as part of the design promise, because a beautiful drawing only becomes valuable when it can be executed with care.',
    'Homeowners benefit from asking early which decisions are fixed and which can remain flexible. Layout, electrical points and service locations usually need early approval; loose furniture, accessories and some soft finishes can evolve later. This distinction keeps the process moving while allowing room for thoughtful refinement.',
    'A final site review should check not only the appearance of a room but its use: doors, drawers, appliances, switches, locks, light levels and clean-up. This practical handover turns a completed site into a functioning home or workplace and gives the design its real value.',
  ],
};

export default function Journal({ setPage, articleId, setArticleId }: Props) {
  const [active, setActive] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [liveArticles, setLiveArticles] = useState<typeof articles>([]);

  useEffect(() => {
    let cancelled = false;
    const loadPublishedArticles = async () => {
      try {
        const params = new URLSearchParams({
          select: 'id,title,slug,excerpt,content,category,author,image_url,status,read_time,created_at,published_at,updated_at',
          status: 'eq.published',
          order: 'published_at.desc.nullslast,created_at.desc',
        });
        const response = await fetch(
          `https://${projectId}.supabase.co/rest/v1/blogs_078be9eb?${params.toString()}`,
          { headers: { apikey: publicAnonKey, Authorization: `Bearer ${publicAnonKey}` } }
        );
        if (!response.ok) return;
        const rows = await response.json();
        if (cancelled || !Array.isArray(rows) || rows.length === 0) return;

        const normalized = rows.map((row: any) => ({
          id: row.slug || String(row.id),
          category: row.category || 'Journal',
          title: row.title || 'Untitled article',
          excerpt: row.excerpt || '',
          author: row.author || 'NestArcadia',
          date: new Date(row.published_at || row.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          readTime: row.read_time || '5 min read',
          img: resolveSiteImageReference(row.image_url || ''),
          thumb: resolveSiteImageReference(row.image_url || ''),
          body: String(row.content || '').split(/\\n\\s*\\n/).filter(Boolean),
          related: [],
          ...(row.slug === 'lime-plaster' ? { updated: row.updated_at ? new Date(row.updated_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Oct 2026', researchSources: LIME_PLASTER_SOURCES } : {}),
        }));
        setLiveArticles(normalized);
      } catch {
        // Keep the editorial fallback bundled with the site if the public content request fails.
      }
    };
    loadPublishedArticles();
    return () => { cancelled = true; };
  }, []);

  const sourceArticles = liveArticles.length > 0 ? liveArticles : articles;

  const handleNewsletterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = newsletterEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setNewsletterState('error');
      return;
    }
    setNewsletterState('submitting');
    try {
      const response = await fetch(`https://${projectId}.supabase.co/rest/v1/newsletter_subscribers`, {
        method: 'POST',
        headers: {
          apikey: publicAnonKey,
          Authorization: `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'journal', status: 'subscribed' }),
      });
      if (response.ok || response.status === 409) {
        setNewsletterState('success');
        setNewsletterEmail('');
      } else {
        setNewsletterState('error');
      }
    } catch {
      setNewsletterState('error');
    }
  };

  const filtered = active === 'All' ? sourceArticles : sourceArticles.filter(a => a.category === active);
  const selected = sourceArticles.find(a => a.id === articleId);

  // Article detail view
  if (selected) {
    const pullQuote = 'pullQuote' in selected ? selected.pullQuote : null;
    const conclusion = 'conclusion' in selected ? selected.conclusion : null;
    const fallbackArticle = articles.find(a => a.id === selected.id);
    const relatedIds = selected.related.length > 0 ? selected.related : (fallbackArticle?.related ?? []);
    const relatedArticles = relatedIds
      .map(id => sourceArticles.find(a => a.id === id) ?? articles.find(a => a.id === id))
      .filter(Boolean) as typeof articles;

    return (
      <div className="pt-20 lg:pt-[90px]">
        {/* Hero */}
        <div className="relative overflow-hidden bg-[#1C3A5A]" style={{ height: '55vh', minHeight: '360px' }}>
          <img src={selected.img} alt={selected.title} width="1200" height="700" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/60 to-transparent" />
          <div className="relative h-full max-w-[1440px] mx-auto px-6 lg:px-20 flex flex-col justify-end pb-12">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#2D8C7E] mb-3">{selected.category}</p>
            <h1 className="font-display text-[clamp(1.75rem,4vw,3.25rem)] text-white leading-tight max-w-2xl">
              {selected.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 text-white/50 text-[13px]">
              <span>By {selected.author}</span>
              <span>·</span>
              <span>{selected.date}</span>
              <span>·</span>
              <span>{selected.readTime}</span>
              {'updated' in selected && selected.updated && (
                <>
                  <span>·</span>
                  <span>Updated {selected.updated}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Article body */}
        <div className="max-w-[780px] mx-auto px-6 py-16">
          <div className="mb-10 border-l-2 border-[#2D8C7E] pl-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#2D8C7E]">Editorial responsibility</p>
            <p className="text-[13px] leading-[1.7] text-[#6B5E4E] mt-1">
              Published by NestArcadia Journal. First-hand design observations are presented as practice notes; technical or performance claims are limited to the evidence cited on the page.
            </p>
          </div>
          <a
            href="/journal"
            onClick={(event) => { event.preventDefault(); setArticleId(null); }}
            className="text-[13px] text-[#6B5E4E] hover:text-[#2D8C7E] transition-colors mb-10 flex items-center gap-2"
          >
            ← Back to Journal
          </a>
          <p className="text-[#1A1714] text-[16px] leading-[1.9] mb-10 font-semibold">
            {selected.excerpt}
          </p>
          <RichArticleContent
            content={selected.body.join('\n\n')}
            className="journal-public-content"
          />
          <section className="mt-14 border-t border-[#D4CBBB] pt-10" aria-labelledby="practical-guide">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#2D8C7E] mb-3">NestArcadia practical guide</p>
            <h2 id="practical-guide" className="font-display text-3xl text-[#1A1714] mb-7">Planning this well in a real home</h2>
            <div className="flex flex-col gap-6">
              {(categoryDeepDives[selected.category] ?? []).map((para, i) => (
                <p key={i} className="text-[#1A1714] text-[15px] leading-[1.9]">{para}</p>
              ))}
            </div>
          </section>
          {conclusion && (
            <p className="mt-10 border-t border-[#D4CBBB] pt-8 text-[15px] leading-[1.9] text-[#1A1714]">
              <strong>Conclusion.</strong> {conclusion}
            </p>
          )}

          {/* CTA */}
          <div className="mt-16 p-8 border border-[#D4CBBB] text-center" style={{ background: '#EAE4DA' }}>
            <h3 className="font-display text-2xl text-[#1A1714] mb-2">Want to bring this into your home?</h3>
            <p className="text-[#6B5E4E] text-[14px] mb-6">Tell us about your project and we will design around what matters to you.</p>
            <a
              href="/start-your-project"
              onClick={(event) => { event.preventDefault(); setPage('project'); }}
              className="text-[14px] text-white bg-[#1C3A5A] px-8 py-3 hover:bg-[#2D8C7E] transition-colors"
            >
              Apply This to My Home →
            </a>
          </div>
        </div>

        {'researchSources' in selected && selected.researchSources?.length > 0 && (
          <section className="mt-14 border-t border-[#D4CBBB] pt-8" aria-labelledby="research-notes">
            <p id="research-notes" className="text-[10px] uppercase tracking-[0.22em] text-[#2D8C7E] mb-4">Research notes</p>
            <p className="text-[13px] leading-[1.8] text-[#6B5E4E] mb-4">
              Technical and performance claims in this article are limited to the conditions described by the cited research. Material performance can vary with formulation, substrate, installation and building conditions.
            </p>
            <ul className="space-y-2">
              {selected.researchSources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#1C3A5A] underline underline-offset-4 hover:text-[#2D8C7E]">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="max-w-[1440px] mx-auto px-6 lg:px-20 pb-20">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-8 border-t border-[#D4CBBB] pt-12">
              Related Articles
            </p>
            <div className="grid sm:grid-cols-2 gap-8">
              {relatedArticles.map(a => (
                <a key={a.id} href={`/journal/${a.id}`} onClick={(event) => { event.preventDefault(); setArticleId(a.id); window.scrollTo({top:0}); }} className="text-left group">
                  <div className="overflow-hidden bg-[#D4CBBB] mb-4" style={{ aspectRatio: '16/9' }}>
                    <img src={a.thumb} alt={a.title} loading="lazy" decoding="async" width="800" height="560" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#2D8C7E] mb-2">{a.category}</p>
                  <p className="font-display text-xl text-[#1A1714] group-hover:text-[#2D8C7E] transition-colors">{a.title}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Article listing
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="pt-20 lg:pt-[90px]">
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 pt-16 pb-12 border-b border-[#D4CBBB]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E] mb-4">Ideas & Perspectives</p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-[#1A1714] leading-[1.05]">Journal</h1>
        <p className="text-[#6B5E4E] text-[15px] mt-3">
          Heritage craft, design thinking, and the stories behind modern Indian homes.
        </p>
      </div>

      {/* Category filter */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-6 border-b border-[#D4CBBB]">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className="text-[13px] px-4 py-1.5 border transition-all"
              style={{
                background: active === c ? '#1C3A5A' : 'transparent',
                borderColor: active === c ? '#1C3A5A' : '#D4CBBB',
                color: active === c ? '#F2EDE4' : '#6B5E4E',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16">
        {/* Featured article */}
        {featured && (
          <a
            href={`/journal/${featured.id}`}
            onClick={(event) => { event.preventDefault(); setArticleId(featured.id); window.scrollTo({top:0}); }}
            className="grid lg:grid-cols-2 gap-0 mb-16 border border-[#D4CBBB] w-full text-left group"
          >
            <div className="overflow-hidden bg-[#D4CBBB]" style={{ minHeight: '380px' }}>
              <img src={featured.thumb} alt={featured.title} loading="lazy" decoding="async" width="800" height="560" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ minHeight: '380px' }} />
            </div>
            <div className="flex flex-col justify-center p-10 lg:p-14" style={{ background: '#EAE4DA' }}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-5">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#2D8C7E]">{featured.category}</span>
                <span className="text-[#D4CBBB]">·</span>
                <span className="text-[13px] text-[#6B5E4E]">{featured.date}</span>
                <span className="text-[#D4CBBB]">·</span>
                <span className="text-[13px] text-[#6B5E4E]">{featured.readTime}</span>
              </div>
              <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] text-[#1A1714] leading-tight mb-4 group-hover:text-[#2D8C7E] transition-colors">
                {featured.title}
              </h2>
              <p className="text-[#6B5E4E] text-[15px] leading-[1.8] mb-8">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#6B5E4E]">By {featured.author}</p>
                <span className="text-[14px] text-[#1C3A5A] border-b border-[#1C3A5A] pb-px group-hover:text-[#2D8C7E] group-hover:border-[#2D8C7E] transition-colors">
                  Read Article →
                </span>
              </div>
            </div>
          </a>
        )}

        {/* Article grid */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map(a => (
              <a
                key={a.id}
                href={`/journal/${a.id}`}
                onClick={(event) => { event.preventDefault(); setArticleId(a.id); window.scrollTo({top:0}); }}
                className="text-left group"
              >
                <div className="overflow-hidden bg-[#D4CBBB] mb-5" style={{ aspectRatio: '16/10' }}>
                  <img src={a.thumb} alt={a.title} loading="lazy" decoding="async" width="800" height="560" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#2D8C7E]">{a.category}</span>
                  <span className="text-[#D4CBBB] text-xs">·</span>
                  <span className="text-[13px] text-[#6B5E4E]">{a.date}</span>
                </div>
                <h3 className="font-display text-xl text-[#1A1714] leading-snug mb-3 group-hover:text-[#2D8C7E] transition-colors">
                  {a.title}
                </h3>
                <p className="text-[13px] text-[#6B5E4E] leading-relaxed mb-4">{a.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[#D4CBBB]">
                  <p className="text-[12px] text-[#6B5E4E]">{a.author} · {a.readTime}</p>
                  <span className="text-[#2D8C7E] text-sm">→</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[#6B5E4E] text-[15px]">No articles in this category yet.</p>
          </div>
        )}
      </div>

      {/* Newsletter */}
      <section className="py-16 px-6 lg:px-20 border-t border-[#D4CBBB]">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl text-[#1A1714] mb-1">Stay in the story.</h3>
            <p className="text-[#6B5E4E] text-[14px]">Design insights, craft discoveries, and new homes — in your inbox.</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-xl flex-col gap-0 border border-[#D4CBBB] sm:flex-row">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(event) => { setNewsletterEmail(event.target.value); setNewsletterState('idle'); }}
              placeholder="your@email.com"
              aria-label="Email address"
              className="w-full min-w-0 flex-1 px-5 py-3 text-[14px] bg-transparent outline-none text-[#1A1714] placeholder:text-[#6B5E4E] sm:w-60"
              disabled={newsletterState === 'submitting'}
            />
            <button type="submit" disabled={newsletterState === 'submitting'} className="w-full px-6 py-3 bg-[#1C3A5A] text-white text-[13px] hover:bg-[#2D8C7E] transition-colors disabled:opacity-60 sm:w-auto">
              {newsletterState === 'submitting' ? 'Saving…' : 'Subscribe'}
            </button>
          </form>
          {newsletterState === 'success' && <p className="mt-2 text-xs text-[#2D8C7E]">You’re on the list.</p>}
          {newsletterState === 'error' && <p className="mt-2 text-xs text-[#B64B42]">Please enter a valid email and try again.</p>}
        </div>
      </section>
    </div>
  );
}
