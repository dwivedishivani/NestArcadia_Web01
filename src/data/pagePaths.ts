import type { Page } from '../App';

/**
 * Canonical in-app destinations for top-level page navigation.
 * Keep route definitions in App.tsx and this shared map in sync.
 */
export const pagePaths: Record<Page, string> = {
  home: '/',
  cultures: '/design-cultures/',
  services: '/interior-design-services/',
  story: '/our-story/',
  journal: '/journal/',
  homes: '/our-projects/',
  project: '/start-your-project/',
  faq: '/faqs/',
  privacy: '/privacy-policy/',
  admin: '/admin/',
};
