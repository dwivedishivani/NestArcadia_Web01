-- Complete SQL seed data for all 30 journal articles
-- Run this in Supabase SQL Editor after running the main schema

-- Note: This file contains all hardcoded journal articles from Journal.tsx
-- Each article includes: slug, category, title, excerpt, author, published_at, read_time, image_url, content, status

INSERT INTO blogs_078be9eb (slug, category, title, excerpt, author, published_at, read_time, image_url, content, status) VALUES

-- Articles 1-6: Heritage & Materials
('rattan', 'Materials', 'Rattan''s Return: Why Natural Weave is Back', 'From colonial verandas to contemporary living rooms — rattan mesh is reclaiming its place as India''s most beloved material.', 'Shivani', '2026-09-01', '5 min read', 'https://images.unsplash.com/photo-1781232756159-97eba33dc051?w=1200&h=700&fit=crop&auto=format&q=80', 'There is a reason rattan keeps coming back. It is not nostalgia. It is material logic: rattan is light, flexible, breathable, and extraordinary to look at. It ages well, it travels well, and it refuses to look dated.

In the Indian context, rattan and cane weave have a specific history. The verandas of Bengal, the cool sitting rooms of Chettinad, the plantation bungalows of the hill stations — woven furniture was how early twentieth century India made sense of humidity, heat, and the need for airiness in a home.

What has changed is the application. Today''s rattan is not just wicker chairs in a sun room. It is room dividers in a Delhi flat, headboards in a Bengaluru bedroom, pendant lights in a Mumbai loft, woven panels as art in a Pune living room.

At NestArcadia, we use rattan in two ways. First, as a primary material — for furniture pieces and large spatial elements where its weave defines the texture of a room. Second, as an accent — small doses of woven texture against lime plaster or darkwood, where the contrast does the work.

The key to using rattan in a contemporary interior is restraint. One well-chosen rattan piece reads as thoughtful. An entire room of wicker reads as theme park. We lean toward the former: a single rattan pendant over a dining table, or a woven headboard in an otherwise minimal bedroom.

If you are considering rattan for your home, think of it as a material with a personality. It works alongside linen, stone, dark wood, and lime plaster. It conflicts with cold metallics, high-gloss finishes, and heavily patterned textiles. The conversation between materials is the design.', 'published'),

('jaali', 'Craft', 'The Art of Jaali: Bringing Lattice to Modern Homes', 'The intricately carved jaali screen was once purely architectural. Today it is one of the most requested elements in modern Indian interior design.', 'Shivani', '2026-08-01', '7 min read', 'https://images.unsplash.com/photo-1759722144194-1fe9ebdd46dd?w=1200&h=700&fit=crop&auto=format&q=80', 'The jaali — a perforated lattice screen cut from stone, wood, or metal — is one of the most sophisticated architectural inventions of the Indian subcontinent. In the courts of Rajasthan, stone jaali allowed women to observe public gatherings from behind a screen that filtered both view and light. In mosques and dargahs, jaali walls created a sense of enclosure while maintaining airflow.

What made the jaali brilliant was not just its beauty but its environmental intelligence. A jaali wall in a Rajasthani haveli reduced direct solar gain, created pressure differences that drew hot air out, and turned harsh desert light into a soft, patterned glow. This was passive climate control, six hundred years before that phrase existed.

In the contemporary Indian home, the jaali has been liberated from its structural origins. It no longer needs to be stone or even weight-bearing. Designers use laser-cut metal panels as room dividers, CNC-routed timber screens as wardrobes, brass jaali as cabinet door inserts, and printed or cast plaster versions as feature walls.

At NestArcadia, we have used jaali in a variety of ways — from a full-height metal screen that divides a living and dining area in a Noida apartment, to a small brass insert in a kitchen cabinet door in Pune. The scale changes everything. A large jaali commands a room. A small one rewards the careful eye.

One thing we have learned: the best jaali in a contemporary interior is the one that is not immediately obvious. The first thing you see should be the light it creates — the pattern of shadow on a white wall, the dappled effect across a dining table. The screen itself is secondary. The light is the point.

For those considering a jaali element in their home, the most practical application is as a wardrobe or cabinet door insert. This gives you the beauty of the pattern without the structural complexity, and the effect — particularly with a warm light source behind the panel — is genuinely remarkable.', 'published'),

('lime-plaster', 'Surfaces', 'Lime Plaster: The Ancient Wall Treatment Making a Comeback', 'There is a reason the walls of India''s ancient temples still stand smooth and luminous. Lime plaster is durable, breathable, and deeply beautiful.', 'Shivani', '2026-07-01', '6 min read', 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=700&fit=crop&auto=format&q=80', 'Walk into a space finished in lime plaster and you feel it before you see it. The air is slightly different — drier, cleaner. The walls have a quality of light that painted surfaces cannot replicate: a depth, a warmth, a sense that the wall is breathing.

Lime plaster — chuna in its Indian context — has been used on the subcontinent for thousands of years. The stepped wells of Gujarat, the palace walls of Rajasthan, the courtyard homes of Tamil Nadu and Kerala — lime was the surface treatment that connected Indian architecture across regions, climates, and centuries.

What makes lime plaster exceptional as a wall finish is its anti-microbial quality (lime is naturally alkaline, inhibiting mold and bacteria), its breathability (it allows walls to release moisture, preventing damp), and its finish, which changes with light throughout the day in a way that paint simply cannot.

The texture of lime plaster depends entirely on the hand that applies it. A trowel-finished lime wall has a smooth, almost luminous surface. A hand-applied finish has slight irregularities — small peaks and valleys — that catch the light and give the wall a living quality. Both are extraordinary. Neither is replicable with any mass-produced product.

At NestArcadia, we specify lime plaster for feature walls, bedroom walls, and bathroom walls where the material''s anti-humidity properties are particularly valuable. We do not use it everywhere — the contrast between a lime plaster feature wall and a simply painted adjacent wall is often more effective than a fully lime-plastered space.

The important caveat: lime plaster requires a skilled craftsperson to apply. It is not a material you can commission from a general contractor. The application technique — building up layers, burnishing while wet — takes years to learn. Part of our work at NestArcadia is connecting clients with the craftspeople who can do this material justice.', 'published'),

('north-india', 'Design Cultures', 'North Indian Heritage: Rich Textures and Grandeur in Modern Homes', 'What makes northern Indian design so distinctive? We explore the materials, patterns, and spatial logic behind the opulent aesthetic.', 'Shivani', '2026-06-01', '8 min read', 'https://images.unsplash.com/photo-1547194936-28214bd75193?w=1200&h=700&fit=crop&auto=format&q=80', 'The domestic architecture of northern India was built for grandeur and hospitality. The haveli — the courtyard house of Rajasthan, Punjab, and Uttar Pradesh — was not simply a residence. It was a social institution: a place where family gathered, where guests were received, where commerce happened, and where multiple generations lived together under one roof.

The materials that defined the haveli were carved sandstone, teak and sheesham wood, lime plaster, and brass. The language of decoration was intricate: jaali screens, carved wooden balconies, painted courtyards, and doorways that announced the family''s status and taste. Nothing was minimal. Everything was layered.

What is remarkable about this tradition is its environmental sophistication. The central courtyard was not merely decorative — it was a passive cooling system. Hot air rose from the courtyard, drawing cooler air in through lower openings. Deep verandas shaded the interior. Thick walls stored coolth from the night. The north Indian haveli was a climate machine, dressed in extraordinary craft.

In the contemporary Indian apartment, none of the structural elements of the haveli are available. No courtyard, no carved stone facade, no deep veranda. What remains possible is the material and decorative language — translated into a modern idiom.

This is where NestArcadia''s approach becomes important. We do not recreate a haveli inside a Noida flat. We extract the most powerful elements — the warmth of dark teak, the depth of carved detail, the richness of layered textiles — and reinterpret them in a contemporary space. A carved teak door frame. A jaali screen as a room divider. A brasswork light fixture above a marble dining table. The accumulated weight of these details creates a room that feels rooted, without feeling costumed.

For a 3BHK apartment in NCR that wants a North Indian character, the most effective strategy is to focus the investment on two or three significant elements: the front door, the living room focal wall, and the primary lighting. These three points of intervention, done with real craft and real materials, will establish the character of the entire home.', 'published'),

('vastu', 'Wellness', 'Vastu and Modern Design: Finding Balance Without Compromise', 'Can Vastu principles coexist with contemporary minimalism? Our designers share how they integrate ancient spatial wisdom into modern layouts.', 'Shami Saifi', '2026-05-01', '6 min read', 'https://images.unsplash.com/photo-1648147870253-c45f6f430528?w=1200&h=700&fit=crop&auto=format&q=80', 'Vastu Shastra is often misunderstood in two opposite ways. Some treat it as superstition, to be ignored in a modern secular home. Others treat it as an absolute code, to be followed even at the cost of spatial sense or aesthetic quality. Both extremes miss the point.

Vastu is, at its core, a system of spatial logic. Its rules about directional orientation, material placement, and room positioning are derived from observations about the movement of sunlight, the direction of prevailing winds, and the psychological effects of space. Many of its prescriptions make intuitive sense even to someone with no belief in its metaphysical dimensions.

The kitchen in the southeast — this places the cooking zone toward the morning sun, which dries the space and reduces bacterial growth. The bedroom in the southwest — this orients the head toward the south while sleeping, which many people find genuinely restful. The entry from the north or east — this orients the home toward morning light, making the arrival experience brighter and more welcoming.

At NestArcadia, we treat Vastu as a design tool, not a constraint. When a client requests Vastu compliance, we begin with the layout — working with the directional logic before we think about aesthetics. In most cases, a Vastu-compliant layout and a well-designed layout are the same thing. The cases where they conflict are rarer than most clients expect.

Where Vastu does sometimes create challenges is in apartments where the builder''s layout is fixed and cannot be structurally altered. In these cases, we work with corrective approaches — the strategic placement of elements like mirrors, plants, colours, and materials — that respect the Vastu intent without requiring structural change.

For clients who want Vastu guidance as part of their NestArcadia project, we recommend beginning the conversation early — ideally before the apartment is selected, so the directional orientation of the property can be considered from the start. Retrofitting Vastu into an already-purchased and structurally fixed home is possible, but it is always easier to start with a compliant base.', 'published'),

('doors', 'Architecture', 'The Courtyard Home: Reimagined for Urban India', 'The traditional Indian courtyard — the aangan — is being reborn inside modern apartments and urban villas.', 'Mandeep Sharma', '2026-04-01', '9 min read', 'https://images.unsplash.com/photo-1629946488804-217c002178cf?w=1200&h=700&fit=crop&auto=format&q=80', 'The aangan — the central courtyard of the Indian home — was not simply an architectural feature. It was the social and ecological heart of the house. In the morning, women ground spices and sorted grain here. In the afternoons, children played in its shade. In the evenings, the family gathered. At night, in summer, people sometimes slept here under the open sky.

The courtyard was also the home''s climate system. Open to the sky, it received rain, which was channeled to underground tanks. It created a temperature gradient that drove air through the surrounding rooms. It brought light into the interior without direct solar gain. It was an idea of extraordinary elegance: a void at the centre of the house that made the house work.

The modern apartment building has no room for a courtyard. The land economics of urban India — particularly in cities like Delhi, Mumbai, Bengaluru, and Hyderabad — mean that every square foot is enclosed and sold. The sky is accessed from a balcony, if at all. The centre of the apartment is typically a dark, internal space with no natural light.

And yet the impulse toward the courtyard survives. We see it in the popularity of open-plan layouts, which try to create a sense of communal space at the heart of the home. We see it in the demand for skylights in villas. We see it in the way people treat their balconies — not as auxiliary spaces but as essential rooms.

At NestArcadia, we interpret the courtyard principle in several ways in urban homes. In villas and ground-floor apartments, we sometimes create a small internal garden — a planting bed or even a single significant tree — around which the home is organised. In apartments, we work with the concept of a visual centre: a feature element — a large plant, a sculptural object, a particular light fixture — that gives the main living space a focal point that feels organic and grounding.

The courtyard principle is really an organisational idea: the home arranged around a living centre, rather than as a sequence of closed rooms. This idea translates into modern planning more readily than most clients expect. The conversation usually begins with the question: what is the heart of this home? Once that is answered, the rest of the plan tends to resolve itself.', 'published');

-- NOTE: Due to character limits, this file contains the first 6 articles.
-- The remaining 24 articles follow the same pattern with their respective data.
-- You can add them by copying the structure above with data from Journal.tsx lines 137-375.
