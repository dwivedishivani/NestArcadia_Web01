/**
 * Lightweight route allowlist for location service pages.
 * Keep in sync with the page configurations in LocalServicePage.tsx.
 * This file is intentionally small so non-service routes do not load all service copy.
 */
export const localServicePaths = [
  '/interior-design-greater-noida-west',
  '/interior-design-noida-extension',
  '/commercial-interior-design-greater-noida-west',
  '/interior-design-greater-noida',
  '/interior-design-noida',
  '/interior-design-ghaziabad',
  '/interior-design-indirapuram',
  '/interior-design-crossing-republik',
  '/interior-design-faridabad',
  '/interior-design-delhi',
  '/interior-design-east-delhi',
  '/interior-design-south-delhi',
  '/interior-design-gurugram',
  '/interior-design-dadri',
  '/interior-design-jewar',
  '/interior-design-yamuna-expressway',
  '/interior-design-delhi-ncr',
  '/interior-design-cost-noida',
] as const;

/**
 * Single source of truth for the grouped NCR area directory, consumed by both
 * the Services page and the site-wide Footer. Keeping this in one place is
 * what PR #122 (Services page) and the footer strip previously disagreed on:
 * the directory grew to 15 areas on Services but the footer strip never
 * picked up anything past the original 4. Add a new published location page
 * here once, and both surfaces stay in sync.
 */
export const areaGroups = [
  {
    title: 'Noida & Greater Noida',
    areas: [
      { label: 'Noida Extension', href: '/interior-design-noida-extension/' },
      { label: 'Greater Noida West', href: '/interior-design-greater-noida-west/' },
      { label: 'Noida', href: '/interior-design-noida/' },
      { label: 'Greater Noida', href: '/interior-design-greater-noida/' },
    ],
  },
  {
    title: 'Ghaziabad & East NCR',
    areas: [
      { label: 'Ghaziabad', href: '/interior-design-ghaziabad/' },
      { label: 'Indirapuram', href: '/interior-design-indirapuram/' },
      { label: 'Crossing Republik', href: '/interior-design-crossing-republik/' },
      { label: 'East Delhi', href: '/interior-design-east-delhi/' },
    ],
  },
  {
    title: 'Delhi & Gurugram',
    areas: [
      { label: 'Delhi', href: '/interior-design-delhi/' },
      { label: 'South Delhi', href: '/interior-design-south-delhi/' },
      { label: 'Gurugram', href: '/interior-design-gurugram/' },
      { label: 'Faridabad', href: '/interior-design-faridabad/' },
    ],
  },
  {
    title: 'Expanding NCR corridor',
    areas: [
      { label: 'Dadri', href: '/interior-design-dadri/' },
      { label: 'Jewar', href: '/interior-design-jewar/' },
      { label: 'Yamuna Expressway', href: '/interior-design-yamuna-expressway/' },
    ],
  },
];
