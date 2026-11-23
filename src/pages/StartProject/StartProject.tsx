import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import type { Page } from '../../App';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import {
  BHK_OPTIONS,
  NOT_PROVIDED,
  NOT_SURE_BUDGET,
  QUICK_PROJECT_TYPE,
  QUICK_TIMELINE,
  budgetTiersFor,
  buildSource,
  isValidBudgetFor,
  isValidIndianMobile,
  parseConfigurationParam,
  withSociety,
} from '../../lib/leadModel';

interface Props { setPage: (p: Page) => void; }

const cities = [
  'New Delhi', 'Noida', 'Greater Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad',
  'Mumbai', 'Navi Mumbai', 'Thane', 'Pune',
  'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
  'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Chandigarh',
  'Dehradun', 'Bhopal', 'Indore', 'Nagpur', 'Kochi',
  'Other / Not Listed',
];

const projectTypes = ['Apartment / Flat', 'Independent Villa', 'Penthouse / Duplex', 'Weekend / Holiday Home', 'Commercial Space'];
const timelines = ['Within 3 Months', '3–6 Months', '6+ Months', 'Just Exploring'];
const stylePrefs = [
  'North Indian Heritage', 'South Indian Elegance', 'East Indian Craft',
  'West Indian Colour', 'Rajasthani Elements', 'Contemporary Minimal',
  'Japandi / Wabi-sabi', 'Modern Indian', 'Mix & Match', 'Not decided yet',
];

const WHATSAPP_NUMBER = '918448061997';

const initialForm = {
  name: '', email: '', phone: '', city: '', society: '', projectType: '',
  configuration: '', budget: '', timeline: '', style: '', message: '',
};

type FormState = typeof initialForm;
type FormField = keyof FormState;
type FormErrors = Partial<Record<FormField, string>>;

const needsConfiguration = (projectType: string) =>
  projectType === 'Apartment / Flat' || projectType === 'Penthouse / Duplex';

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.';
  if (!isValidIndianMobile(form.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (!form.city) errors.city = 'Please select your city.';
  if (!form.projectType) errors.projectType = 'Please choose a project type.';
  if (needsConfiguration(form.projectType) && !form.configuration) errors.configuration = 'Please choose your home size.';
  if (!form.budget) errors.budget = 'Please choose a budget range.';
  if (!form.timeline) errors.timeline = 'Please choose a timeline.';
  return errors;
}

interface LeadPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  project_type: string;
  configuration: string;
  budget: string;
  timeline: string;
  design_style: string;
  message: string;
  source: string;
}

/**
 * Primary path is a direct PostgREST insert (no cold start). The Edge Function
 * remains as a fallback; the client-generated id makes a retry idempotent.
 */
async function submitLead(payload: LeadPayload): Promise<void> {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/rest/v1/enquiries_078be9eb`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        apikey: publicAnonKey,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) return;
  } catch {
    // fall through to the Edge Function
  }

  const response = await fetch(`https://${projectId}.supabase.co/functions/v1/bright-api/make-server-078be9eb/enquiries`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
      apikey: publicAnonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('We could not submit your request right now.');
}

function trackLead(source: string, kind: 'quick' | 'full', extra: Record<string, string> = {}) {
  // One business-level event, only after the backend confirmed the enquiry.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'lead_submit', lead_source: source, lead_type: kind, page_path: window.location.pathname, ...extra });
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.('event', 'generate_lead', { lead_source: source, lead_type: kind, page_path: window.location.pathname, send_to: 'G-LDM2YL1MP5', ...extra });
}

const inputClass = (error?: string) =>
  `w-full min-h-[42px] bg-transparent border px-3 py-2 text-[14px] text-[#1A1714] placeholder:text-[#6B5E4E] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2D8C7E]/40 ${error ? 'border-[#B64B42] focus:border-[#B64B42]' : 'border-[#D4CBBB] focus:border-[#2D8C7E]'}`;

const chipClass = (active: boolean) =>
  `min-h-[38px] text-[12.5px] px-3 py-1.5 border cursor-pointer transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D8C7E]/50 ${
    active
      ? 'bg-[#1C3A5A] border-[#1C3A5A] text-white'
      : 'border-[#D4CBBB] text-[#4F4436] hover:border-[#2D8C7E] hover:text-[#17665B]'
  }`;

function FieldLabel({ htmlFor, children, optional }: { htmlFor?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-[12px] text-[#4F4436] mb-1">
      {children}
      {optional && <span className="text-[#6B5E4E]"> (optional)</span>}
    </label>
  );
}

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return <p id={id} className="mt-1.5 text-[12px] text-[#B64B42]">{children}</p>;
}

function StepHeading({ n, title, hint }: { n: string; title: string; hint?: string }) {
  return (
    <div className="mb-3">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[#B2552E] text-base">{n}</span>
        <h2 className="font-display text-lg text-[#1A1714]">{title}</h2>
      </div>
      {hint && <p className="text-[12px] text-[#6B5E4E] mt-1 leading-relaxed">{hint}</p>}
    </div>
  );
}

export default function StartProject({ setPage }: Props) {
  const location = useLocation();
  const [submittedKind, setSubmittedKind] = useState<'quick' | 'full' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<'quick' | 'full' | null>(null);
  const [submissionError, setSubmissionError] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [quickError, setQuickError] = useState('');
  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [quick, setQuick] = useState({ name: '', phone: '' });
  const [quickErrors, setQuickErrors] = useState<{ name?: string; phone?: string }>({});
  const [serviceInterest, setServiceInterest] = useState('');
  const [fromGuide, setFromGuide] = useState('');
  const [website, setWebsite] = useState('');
  const messageTouched = useRef(false);

  const showConfig = needsConfiguration(form.projectType);
  const budgetOptions = useMemo(() => budgetTiersFor(showConfig ? form.configuration : ''), [showConfig, form.configuration]);
  const isHomeSizedBudget = showConfig && (form.configuration === '2 BHK' || form.configuration === '3 BHK');

  // Context from the URL: ?service=… (services page), ?bhk=2|3 and ?from=… (budget guides).
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get('service')?.trim().slice(0, 80) ?? '';
    const from = params.get('from')?.trim().replace(/[^a-z0-9-_]/gi, '').slice(0, 60) ?? '';
    const bhk = parseConfigurationParam(params.get('bhk'));
    setServiceInterest(service);
    setFromGuide(from);
    setForm((current) => {
      let next = current;
      if (service && !current.message && !messageTouched.current) next = { ...next, message: `I would like to discuss ${service}.` };
      if (bhk && !current.configuration) next = { ...next, projectType: current.projectType || 'Apartment / Flat', configuration: bhk };
      return next;
    });
  }, [location.search]);

  // Keep the budget valid when the home size changes.
  useEffect(() => {
    setForm((current) => {
      if (!current.budget) return current;
      const configuration = needsConfiguration(current.projectType) ? current.configuration : '';
      return isValidBudgetFor(configuration, current.budget) ? current : { ...current, budget: '' };
    });
  }, [form.configuration, form.projectType]);

  useEffect(() => {
    const nextErrors = validateForm(form);
    setErrors(
      Object.fromEntries(
        Object.keys(touched)
          .filter((key) => touched[key as FormField])
          .map((key) => [key, nextErrors[key as FormField]])
          .filter(([, error]) => error),
      ) as FormErrors,
    );
  }, [form, touched]);

  const setField = (key: FormField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (key === 'message') messageTouched.current = true;
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const markTouched = (key: FormField) => setTouched((current) => ({ ...current, [key]: true }));

  const choose = (key: FormField, val: string) => {
    markTouched(key);
    setForm((f) => {
      const next = { ...f, [key]: f[key] === val ? '' : val };
      if (key === 'projectType' && !needsConfiguration(next.projectType)) next.configuration = '';
      return next;
    });
  };

  const focusField = (key: string) => {
    const el = document.getElementById(`field-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (el as HTMLElement).focus({ preventScroll: true });
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || website.trim()) return;
    const errs: { name?: string; phone?: string } = {};
    if (quick.name.trim().length < 2) errs.name = 'Please enter your name.';
    if (!isValidIndianMobile(quick.phone)) errs.phone = 'Enter a valid 10-digit mobile number.';
    setQuickErrors(errs);
    if (errs.name || errs.phone) {
      setQuickError('');
      focusField(errs.name ? 'quickName' : 'quickPhone');
      return;
    }
    setIsSubmitting('quick');
    setQuickError('');
    try {
      const source = buildSource({ quick: true, service: serviceInterest, from: fromGuide });
      const context = [serviceInterest && `Interested in: ${serviceInterest}`, fromGuide && `Came from guide: ${fromGuide}`, form.configuration && `Home size: ${form.configuration}`].filter(Boolean).join('\n');
      await submitLead({
        id: crypto.randomUUID(),
        name: quick.name.trim(),
        email: NOT_PROVIDED,
        phone: quick.phone.trim(),
        city: NOT_PROVIDED,
        project_type: QUICK_PROJECT_TYPE,
        configuration: form.configuration,
        budget: NOT_PROVIDED,
        timeline: QUICK_TIMELINE,
        design_style: NOT_PROVIDED,
        message: ['Quick callback request.', context].filter(Boolean).join('\n'),
        source,
      });
      trackLead(source, 'quick');
      setForm((f) => ({ ...f, name: quick.name.trim() }));
      setSubmittedKind('quick');
    } catch (error) {
      setQuickError(error instanceof Error ? error.message : 'We could not submit your request right now.');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || website.trim()) return;

    const validationErrors = validateForm(form);
    setTouched({ name: true, email: true, phone: true, city: true, projectType: true, configuration: true, budget: true, timeline: true });
    setErrors(validationErrors);
    setAttempted(true);
    const firstInvalid = (['name', 'email', 'phone', 'city', 'projectType', 'configuration', 'budget', 'timeline'] as FormField[]).find((k) => validationErrors[k]);
    if (firstInvalid) {
      setSubmissionError('');
      focusField(firstInvalid);
      return;
    }

    setIsSubmitting('full');
    setSubmissionError('');
    try {
      const source = buildSource({ service: serviceInterest, from: fromGuide });
      const configuration = showConfig ? form.configuration : '';
      await submitLead({
        id: crypto.randomUUID(),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city,
        project_type: form.projectType,
        configuration,
        budget: form.budget,
        timeline: form.timeline,
        design_style: form.style || NOT_SURE_BUDGET,
        message: withSociety(form.message, form.society),
        source,
      });
      trackLead(source, 'full', { configuration, budget: form.budget });
      setSubmittedKind('full');
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'We could not submit your brief right now.');
    } finally {
      setIsSubmitting(null);
    }
  };

  const whatsappFallback = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello NestArcadia, my project brief could not be submitted on the website.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCity: ${form.city}\nSociety: ${form.society || 'N/A'}\nProject: ${form.projectType}\nHome size: ${form.configuration || 'N/A'}\nBudget: ${form.budget}\nTimeline: ${form.timeline}\nStyle: ${form.style || 'N/A'}\nMessage: ${form.message || 'N/A'}`,
  )}`;

  if (submittedKind) {
    const isQuick = submittedKind === 'quick';
    return (
      <div className="pt-20 lg:pt-[90px] min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md" role="status">
          <div className="w-12 h-12 border border-[#2D8C7E] flex items-center justify-center mx-auto mb-8 text-[#17665B] text-xl" aria-hidden="true">✓</div>
          <h2 className="font-display text-3xl text-[#1A1714] mb-4">{isQuick ? 'Callback requested.' : 'We will be in touch.'}</h2>
          <p className="text-[#6B5E4E] text-[15px] leading-relaxed mb-8">
            {isQuick
              ? `Thank you${form.name ? `, ${form.name}` : ''}. Our team will call you back shortly. If you would rather chat, WhatsApp is the fastest way to reach us.`
              : `Thank you${form.name ? `, ${form.name}` : ''}. We have received your brief and will reach out within 24 hours to schedule a discovery call.`}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setPage('home')}
              className="min-h-[48px] text-[14px] text-[#1A1714] border border-[#1A1714] px-7 py-3 hover:bg-[#1C3A5A] hover:border-[#1C3A5A] hover:text-white transition-all"
            >
              Back to Home
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(isQuick ? 'Hello NestArcadia, I just requested a callback on your website.' : 'Hello NestArcadia, I just submitted a project brief. Looking forward to hearing from you.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] inline-flex items-center text-[14px] text-white bg-[#2D8C7E] border border-[#2D8C7E] px-7 py-3 hover:bg-[#1C3A5A] hover:border-[#1C3A5A] transition-all"
            >
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  const selectedTier = budgetOptions.find((b) => b.label === form.budget);
  const hasFieldErrors = Object.values(errors).some(Boolean);

  return (
    <div className="pt-20 lg:pt-[90px]">
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 pt-10 pb-6 border-b border-[#D4CBBB]">
        <p className="label-editorial text-[#B2552E] mb-3">Let's begin</p>
        <h1 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] text-[#1A1714] leading-[1.05]">Start Your Project</h1>
        <p className="text-[#6B5E4E] text-[15px] mt-3 max-w-xl leading-relaxed">
          Tell us about your home and what matters most to you. Your requirements come first — always.
        </p>
        {(serviceInterest || fromGuide) && (
          <p className="mt-5 inline-flex border border-[#2D8C7E]/35 bg-[#2D8C7E]/10 px-3 py-2 text-[12px] text-[#1C3A5A]">
            {serviceInterest ? `Exploring: ${serviceInterest}` : 'Continuing from our budget guide'}
          </p>
        )}
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8 lg:py-10">
        {/* Quick start */}
        <section aria-labelledby="quick-heading" className="border border-[#D4CBBB] bg-[#EAE4DA] p-5 lg:p-6 mb-6">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 lg:gap-12 items-start">
            <div>
              <p className="label-editorial text-[#B2552E] mb-2">Fastest way</p>
              <h2 id="quick-heading" className="font-display text-2xl text-[#1A1714]">Just want a call?</h2>
              <p className="hidden sm:block text-[13px] text-[#6B5E4E] mt-2 leading-relaxed">
                Share your name and number. We will call you back, no long form needed. You can add the full brief later.
              </p>
            </div>
            <form onSubmit={handleQuickSubmit} noValidate className="relative">
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website-quick">Website</label>
                <input id="website-quick" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="field-quickName">Your name</FieldLabel>
                  <input id="field-quickName" className={inputClass(quickErrors.name)} placeholder="Full name" autoComplete="name" value={quick.name} onChange={(e) => setQuick((q) => ({ ...q, name: e.target.value }))} aria-invalid={Boolean(quickErrors.name)} aria-describedby={quickErrors.name ? 'quickName-error' : undefined} />
                  <ErrorText id="quickName-error">{quickErrors.name}</ErrorText>
                </div>
                <div>
                  <FieldLabel htmlFor="field-quickPhone">Mobile number</FieldLabel>
                  <input id="field-quickPhone" className={inputClass(quickErrors.phone)} placeholder="10-digit mobile" type="tel" inputMode="numeric" autoComplete="tel" value={quick.phone} onChange={(e) => setQuick((q) => ({ ...q, phone: e.target.value }))} aria-invalid={Boolean(quickErrors.phone)} aria-describedby={quickErrors.phone ? 'quickPhone-error' : undefined} />
                  <ErrorText id="quickPhone-error">{quickErrors.phone}</ErrorText>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="submit" disabled={isSubmitting !== null} aria-busy={isSubmitting === 'quick'} className="min-h-[48px] bg-[#1C3A5A] text-white text-[14px] px-7 py-3 hover:bg-[#17665B] disabled:opacity-60 transition-colors font-medium">
                  {isSubmitting === 'quick' ? 'Requesting…' : 'Request a Callback →'}
                </button>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello NestArcadia, I would like to discuss my home interiors.')}`} target="_blank" rel="noopener noreferrer" className="min-h-[48px] inline-flex items-center text-[14px] text-[#17665B] border border-[#2D8C7E] px-6 py-3 hover:bg-[#2D8C7E] hover:text-white transition-colors">
                  Chat on WhatsApp
                </a>
              </div>
              <div role="alert" aria-live="assertive">
                {quickError && (
                  <p className="mt-3 text-[12px] text-[#B64B42]">
                    {quickError}{' '}
                    <a className="underline" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello NestArcadia, please call me back.\nName: ${quick.name}\nPhone: ${quick.phone}`)}`} target="_blank" rel="noopener noreferrer">Send it on WhatsApp instead</a>
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>

        <div className="flex items-center gap-4 mb-7">
          <span className="h-px flex-1 bg-[#D4CBBB]" />
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#6B5E4E]">Or share your full brief for a tailored plan</p>
          <span className="h-px flex-1 bg-[#D4CBBB]" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="relative">
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>

          <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6 lg:gap-8 items-start">
            {/* Form canvas */}
            <div className="border border-[#D4CBBB] bg-white/50 p-5 lg:p-7 flex flex-col gap-6">
              <section aria-labelledby="step-1">
                <span id="step-1" className="sr-only">About you</span>
                <StepHeading n="01" title="About you" />
                <div className="grid sm:grid-cols-2 gap-x-3 gap-y-2.5">
                  <div>
                    <FieldLabel htmlFor="field-name">Full name</FieldLabel>
                    <input id="field-name" className={inputClass(errors.name)} placeholder="Full Name *" autoComplete="name" value={form.name} onChange={setField('name')} onBlur={() => markTouched('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} aria-required="true" />
                    <ErrorText id="name-error">{errors.name}</ErrorText>
                  </div>
                  <div>
                    <FieldLabel htmlFor="field-phone">Mobile number</FieldLabel>
                    <input id="field-phone" className={inputClass(errors.phone)} placeholder="Phone Number *" type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={setField('phone')} onBlur={() => markTouched('phone')} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} aria-required="true" />
                    <ErrorText id="phone-error">{errors.phone}</ErrorText>
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel htmlFor="field-email">Email address</FieldLabel>
                    <input id="field-email" className={inputClass(errors.email)} placeholder="Email Address *" type="email" autoComplete="email" value={form.email} onChange={setField('email')} onBlur={() => markTouched('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} aria-required="true" />
                    <ErrorText id="email-error">{errors.email}</ErrorText>
                  </div>
                  <div>
                    <FieldLabel htmlFor="field-city">City</FieldLabel>
                    <select id="field-city" className={`${inputClass(errors.city)} appearance-none cursor-pointer`} value={form.city} onChange={setField('city')} onBlur={() => markTouched('city')} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? 'city-error' : undefined} aria-required="true">
                      <option value="" disabled>Select city</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ErrorText id="city-error">{errors.city}</ErrorText>
                  </div>
                  <div>
                    <FieldLabel htmlFor="field-society" optional>Society / locality</FieldLabel>
                    <input id="field-society" className={inputClass()} placeholder="e.g. Gaur City 2" autoComplete="off" maxLength={120} value={form.society} onChange={setField('society')} />
                  </div>
                </div>
              </section>

              <section aria-labelledby="step-2">
                <span id="step-2" className="sr-only">Your home</span>
                <StepHeading n="02" title="Your home" />
                <fieldset className="mb-4">
                  <legend className="text-[12px] text-[#4F4436] mb-2">Project type</legend>
                  <div id="field-projectType" tabIndex={-1} className="flex flex-wrap gap-2 outline-none">
                    {projectTypes.map((t) => (
                      <button key={t} type="button" aria-pressed={form.projectType === t} className={chipClass(form.projectType === t)} onClick={() => choose('projectType', t)}>{t}</button>
                    ))}
                  </div>
                  <ErrorText id="projectType-error">{errors.projectType}</ErrorText>
                </fieldset>
                {showConfig && (
                  <fieldset>
                    <legend className="text-[12px] text-[#4F4436] mb-2">Home size</legend>
                    <div id="field-configuration" tabIndex={-1} className="flex flex-wrap gap-2 outline-none">
                      {BHK_OPTIONS.map((c) => (
                        <button key={c} type="button" aria-pressed={form.configuration === c} className={chipClass(form.configuration === c)} onClick={() => choose('configuration', c)}>{c}</button>
                      ))}
                    </div>
                    <ErrorText id="configuration-error">{errors.configuration}</ErrorText>
                  </fieldset>
                )}
              </section>
              <section aria-labelledby="step-3">
                <span id="step-3" className="sr-only">Budget</span>
                <StepHeading
                  n="03"
                  title="Your budget"
                  hint={isHomeSizedBudget ? `Ranges for a complete ${form.configuration} interior. Our full-home interiors start at ₹5 lakh. We would rather be upfront than quote a number that changes later.` : 'Pick the range closest to your plan. We will refine it together after a site visit.'}
                />
                <fieldset>
                  <legend className="sr-only">Budget range</legend>
                  <div id="field-budget" tabIndex={-1} className="grid grid-cols-2 gap-2 outline-none">
                    {budgetOptions.map((b) => {
                      const active = form.budget === b.label;
                      return (
                        <button key={b.label} type="button" aria-pressed={active} onClick={() => choose('budget', b.label)} className={`${chipClass(active)} text-left !px-3 !py-2`}>
                          <span className="block text-[13px] font-medium">{b.label}</span>
                          {b.tier && <span className={`block text-[11px] ${active ? 'text-white/80' : 'text-[#6B5E4E]'}`}>{b.tier}</span>}
                        </button>
                      );
                    })}
                    <button type="button" aria-pressed={form.budget === NOT_SURE_BUDGET} onClick={() => choose('budget', NOT_SURE_BUDGET)} className={`${chipClass(form.budget === NOT_SURE_BUDGET)} text-left !px-3 !py-2`}>
                      <span className="block text-[13px] font-medium">Not sure yet</span>
                      <span aria-hidden="true" className={`block text-[11px] ${form.budget === NOT_SURE_BUDGET ? 'text-white/80' : 'text-[#6B5E4E]'}`}>Help me plan</span>
                    </button>
                  </div>
                  <ErrorText id="budget-error">{errors.budget}</ErrorText>
                  <p className="text-[11px] text-[#6B5E4E] mt-2 leading-relaxed">Indicative ranges. The final quote depends on the site visit, scope and materials.</p>
                </fieldset>
              </section>

              <section aria-labelledby="step-4">
                <span id="step-4" className="sr-only">Timeline</span>
                <StepHeading n="04" title="When do you want to start?" />
                <fieldset>
                  <legend className="sr-only">Timeline</legend>
                  <div id="field-timeline" tabIndex={-1} className="flex flex-wrap gap-2 outline-none">
                    {timelines.map((t) => (
                      <button key={t} type="button" aria-pressed={form.timeline === t} className={chipClass(form.timeline === t)} onClick={() => choose('timeline', t)}>{t}</button>
                    ))}
                  </div>
                  <ErrorText id="timeline-error">{errors.timeline}</ErrorText>
                </fieldset>
              </section>

          <details className="border border-[#D4CBBB] group">
            <summary className="min-h-[42px] flex items-center justify-between gap-3 px-3 py-2 cursor-pointer text-[13px] text-[#1C3A5A] list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D8C7E]/50">
              <span>Add design style or notes <span className="text-[#6B5E4E]">(optional)</span></span>
              <span aria-hidden="true" className="text-[#6B5E4E] transition-transform group-open:rotate-45 text-lg leading-none">+</span>
            </summary>
            <div className="px-4 pb-5 pt-2 grid lg:grid-cols-2 gap-6">
              <fieldset>
                <legend className="text-[12px] text-[#4F4436] mb-2">Design style</legend>
                <div className="flex flex-wrap gap-2">
                  {stylePrefs.map((st) => (
                    <button key={st} type="button" aria-pressed={form.style === st} className={chipClass(form.style === st)} onClick={() => choose('style', st)}>{st}</button>
                  ))}
                </div>
              </fieldset>
              <div>
                <FieldLabel htmlFor="field-message" optional>Notes</FieldLabel>
                <textarea id="field-message" className={`${inputClass()} resize-none`} rows={4} maxLength={2000} placeholder="E.g. 3BHK handover next month. Need a pooja unit, wardrobes in all bedrooms and a study corner." value={form.message} onChange={setField('message')} />
              </div>
            </div>
          </details>

            </div>

            {/* Live summary + submit */}
            <aside className="lg:sticky lg:top-28">
              <div className="border border-[#D4CBBB] bg-[#EAE4DA] p-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-3">Your brief</p>
                <dl className="grid gap-2.5 text-[13px]">
                  {[
                    ['Home', [form.projectType, showConfig ? form.configuration : ''].filter(Boolean).join(' · ')],
                    ['Budget', form.budget ? `${form.budget}${selectedTier?.tier ? ` (${selectedTier.tier})` : ''}` : ''],
                    ['Start', form.timeline],
                    ['Where', [form.society, form.city].filter(Boolean).join(', ')],
                    ['Style', form.style],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-[#D4CBBB] pb-2 last:border-b-0">
                      <dt className="text-[#6B5E4E]">{k}</dt>
                      <dd className={`text-right ${v ? 'text-[#1A1714]' : 'text-[#6B5E4E]/70'}`}>{v || '—'}</dd>
                    </div>
                  ))}
                </dl>
                <button type="submit" disabled={isSubmitting !== null} aria-busy={isSubmitting === 'full'} className="mt-5 w-full min-h-[48px] bg-[#1C3A5A] text-white text-[14px] py-3 hover:bg-[#17665B] disabled:opacity-60 transition-colors font-medium">
                  {isSubmitting === 'full' ? 'Submitting Your Brief…' : 'Submit Your Brief →'}
                </button>
                <div role="alert" aria-live="assertive">
                  {attempted && hasFieldErrors && (
                    <p className="mt-3 text-center text-[12px] text-[#B64B42]">Please correct the highlighted fields before submitting your brief.</p>
                  )}
                  {submissionError && (
                    <div className="mt-3 text-center">
                      <p className="text-[12px] text-[#B64B42]">{submissionError}</p>
                      <a href={whatsappFallback} target="_blank" rel="noopener noreferrer" className="inline-flex mt-2 bg-[#2D8C7E] text-white px-4 py-2.5 text-[12px] hover:bg-[#1C3A5A] transition-colors">Send Brief on WhatsApp</a>
                    </div>
                  )}
                </div>
                <p className="text-[12px] text-[#6B5E4E] text-center mt-3 leading-relaxed">
                  We respond within 24 hours. Or{' '}
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-[#17665B] underline">WhatsApp us directly</a>{' '}
                  for a faster reply.
                </p>
              </div>
            </aside>
          </div>
        </form>

        {/* Qualitative credibility — no fake numbers */}
        <div className="mt-14 pt-12 border-t border-[#D4CBBB]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-10">Why NestArcadia</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Experience Across Diverse Spaces', desc: 'From compact 1BHK apartments in NCR to sprawling villas and commercial environments — our experience spans a wide range of residential and commercial projects.' },
              { title: 'Your Requirement Comes First', desc: 'We do not impose a house style. If you want minimal luxury, we build that. If you want South Indian influence, we interpret it. The brief always belongs to you.' },
              { title: 'Heritage Craft + Modern Function', desc: 'We work directly with Indian artisans — weavers, carpenters, plaster specialists — to bring authentic craft into every project without sacrificing modern liveability.' },
              { title: 'One Team, Entire Journey', desc: 'Design, execution, furniture, lighting, decor — one team manages all of it, from your first call to the day you move in.' },
            ].map((c) => (
              <div key={c.title} className="border-t-2 border-[#2D8C7E] pt-6">
                <h3 className="font-display text-lg text-[#1A1714] mb-3">{c.title}</h3>
                <p className="text-[13px] text-[#6B5E4E] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
