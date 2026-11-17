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
