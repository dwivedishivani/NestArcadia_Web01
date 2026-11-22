/**
 * Shared lead model for the public "Start Your Project" form and the admin
 * enquiries panel.
 *
 * No database change is needed: everything is stored in the existing
 * `enquiries_078be9eb` columns.
 *   configuration -> home size, e.g. "2 BHK"
 *   budget        -> the tier label chosen, e.g. "₹7L – ₹9.5L"
 *   source        -> "start-your-project[:quick][|from:<guide>][|service:<x>]"
 *
 * Quick callback leads only collect name + phone. The table's insert policy
 * requires the other text columns to be non-empty, so those are filled with
 * the explicit placeholder below and hidden again in the admin panel.
 */

export const NOT_PROVIDED = 'Not provided';
export const QUICK_PROJECT_TYPE = 'Callback request';
export const QUICK_TIMELINE = 'Call me back';

export interface BudgetTier {
  label: string;
  tier: string;
}

export const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK+', 'Studio', 'Duplex', 'Other'] as const;

const TIERS_2BHK: BudgetTier[] = [
  { label: '₹5L – ₹7L', tier: 'Essential' },
  { label: '₹7L – ₹9.5L', tier: 'Mid-range' },
  { label: '₹9.5L – ₹12L', tier: 'Premium' },
  { label: '₹12L+', tier: 'Custom' },
];

const TIERS_3BHK: BudgetTier[] = [
  { label: '₹7L – ₹11L', tier: 'Essential' },
  { label: '₹11L – ₹16L', tier: 'Mid-range' },
  { label: '₹16L – ₹22L', tier: 'Premium' },
  { label: '₹22L+', tier: 'Custom' },
];

const TIERS_GENERAL: BudgetTier[] = [
  { label: '₹5L – ₹10L', tier: '' },
  { label: '₹10L – ₹25L', tier: '' },
  { label: '₹25L – ₹50L', tier: '' },
  { label: '₹50L – ₹1Cr', tier: '' },
  { label: '₹1Cr+', tier: '' },
];

export const NOT_SURE_BUDGET = 'Not sure yet';

export function budgetTiersFor(configuration: string): BudgetTier[] {
  if (configuration === '2 BHK') return TIERS_2BHK;
  if (configuration === '3 BHK') return TIERS_3BHK;
  return TIERS_GENERAL;
}

export function isValidBudgetFor(configuration: string, budget: string): boolean {
  return budget === NOT_SURE_BUDGET || budgetTiersFor(configuration).some((t) => t.label === budget);
}

/** Query params understood by /start-your-project/ so guides can pre-fill it. */
export function parseConfigurationParam(raw: string | null): string {
  if (!raw) return '';
  const cleaned = raw.trim().toLowerCase().replace(/\s+/g, '');
  const map: Record<string, string> = {
    '1': '1 BHK', '1bhk': '1 BHK', '2': '2 BHK', '2bhk': '2 BHK', '3': '3 BHK', '3bhk': '3 BHK',
    '4': '4 BHK', '4bhk': '4 BHK', '5': '5 BHK+', '5bhk': '5 BHK+',
  };
  return map[cleaned] ?? '';
}

export function buildSource(opts: { quick?: boolean; service?: string; from?: string }): string {
  const parts = [`start-your-project${opts.quick ? ':quick' : ''}`];
  if (opts.from) parts.push(`from:${opts.from}`);
  if (opts.service) parts.push(`service:${opts.service}`);
  return parts.join('|').slice(0, 200);
}

export interface LeadMeta {
  isQuick: boolean;
  from: string;
  service: string;
}

export function parseSource(source: string | null | undefined): LeadMeta {
  const parts = (source ?? '').split('|');
  const head = parts[0] ?? '';
  const meta: LeadMeta = { isQuick: head.endsWith(':quick'), from: '', service: '' };
  for (const part of parts.slice(1)) {
    if (part.startsWith('from:')) meta.from = part.slice(5);
    if (part.startsWith('service:')) meta.service = part.slice(8);
  }
  // Older leads used "services:<name>" as the whole source value.
  if (head.startsWith('services:')) meta.service = head.slice(9);
  return meta;
}

export function isPlaceholder(value: string | null | undefined): boolean {
  return !value || value === NOT_PROVIDED || value === QUICK_PROJECT_TYPE || value === QUICK_TIMELINE;
}

export function cleanValue(value: string | null | undefined): string {
  return isPlaceholder(value) ? '' : (value as string);
}

/** Tier name ("Mid-range") for a stored budget label, when the BHK is known. */
export function tierNameFor(configuration: string, budget: string): string {
  return budgetTiersFor(configuration).find((t) => t.label === budget)?.tier ?? '';
}

/** Digits-only Indian mobile number, with an optional leading 91 removed. */
export function normalisePhone(raw: string): string {
  return raw.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
}

export function isValidIndianMobile(raw: string): boolean {
  return /^[6-9]\d{9}$/.test(normalisePhone(raw));
}

const SOCIETY_PREFIX = 'Society / locality: ';

export function withSociety(message: string, society: string): string {
  const clean = society.trim();
  const body = message.trim();
  return [clean ? `${SOCIETY_PREFIX}${clean}` : '', body].filter(Boolean).join('\n\n');
}

export function societyFromMessage(message: string | null | undefined): string {
  const first = (message ?? '').split('\n')[0] ?? '';
  return first.startsWith(SOCIETY_PREFIX) ? first.slice(SOCIETY_PREFIX.length).trim() : '';
}
