import { useState } from 'react';
import type { Page } from '../../App';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface Props { setPage: (p: Page) => void; }

const cities = [
  'New Delhi', 'Noida', 'Greater Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad',
  'Mumbai', 'Navi Mumbai', 'Thane', 'Pune',
  'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
  'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Chandigarh',
  'Dehradun', 'Bhopal', 'Indore', 'Nagpur', 'Kochi',
  'Other / Not Listed',
];

const configurations = [
  '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK+',
  'Villa', 'Penthouse', 'Studio', 'Duplex', 'Other',
];

const projectTypes = ['Apartment / Flat', 'Independent Villa', 'Penthouse / Duplex', 'Weekend / Holiday Home', 'Commercial Space'];
const budgets = ['₹10L – ₹25L', '₹25L – ₹50L', '₹50L – ₹1Cr', '₹1Cr+', 'Not sure yet'];
const timelines = ['Within 3 Months', '3–6 Months', '6+ Months', 'Just Exploring'];
const stylePrefs = [
  'North Indian Heritage', 'South Indian Elegance', 'East Indian Craft',
  'West Indian Colour', 'Rajasthani Elements', 'Contemporary Minimal',
  'Japandi / Wabi-sabi', 'Modern Indian', 'Mix & Match',
];

export default function StartProject({ setPage }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '', projectType: '',
    configuration: '', budget: '', timeline: '', style: '', message: '',
  });

  const showConfig = form.projectType === 'Apartment / Flat' || form.projectType === 'Penthouse / Duplex';

  const setField = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  const toggle = (key: keyof typeof form, val: string) =>
    setForm(f => ({ ...f, [key]: f[key] === val ? '' : val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-078be9eb/enquiries`, {
        method: 'POST',
        headers: {
          apikey: publicAnonKey,
          Authorization: `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          project_type: form.projectType,
          configuration: form.configuration,
          budget: form.budget,
          timeline: form.timeline,
          design_style: form.style,
          message: form.message,
          source: 'start-your-project',
        }),
      });

      if (!response.ok) throw new Error('Unable to submit your project brief. Please try again.');
      setSubmitted(true);
    } catch {
      setSubmissionError('We could not submit your brief right now. Please try again or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full bg-transparent border border-[#D4CBBB] px-4 py-3 text-[15px] text-[#1A1714] placeholder:text-[#6B5E4E] outline-none focus:border-[#2D8C7E] transition-colors`;
  const chipClass = (active: boolean) =>
    `text-[13px] px-4 py-2 border cursor-pointer transition-all select-none ${
      active
        ? 'bg-[#1C3A5A] border-[#1C3A5A] text-white'
        : 'border-[#D4CBBB] text-[#6B5E4E] hover:border-[#2D8C7E] hover:text-[#2D8C7E]'
    }`;

  if (submitted) {
    return (
      <div className="pt-20 lg:pt-[90px] min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 border border-[#2D8C7E] flex items-center justify-center mx-auto mb-8 text-[#2D8C7E] text-xl">✓</div>
          <h2 className="font-display text-3xl text-[#1A1714] mb-4">We will be in touch.</h2>
          <p className="text-[#6B5E4E] text-[15px] leading-relaxed mb-8">
            Thank you{form.name ? `, ${form.name}` : ''}. We have received your brief and will reach out within 24 hours to schedule a discovery call.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setPage('home')}
              className="text-[14px] text-[#1A1714] border border-[#1A1714] px-7 py-3 hover:bg-[#1C3A5A] hover:border-[#1C3A5A] hover:text-white transition-all"
            >
              Back to Home
            </button>
            <a
              href={`https://wa.me/918448061997?text=${encodeURIComponent('Hello NestArcadia, I just submitted a project brief. Looking forward to hearing from you.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-white bg-[#2D8C7E] border border-[#2D8C7E] px-7 py-3 hover:bg-[#1C3A5A] hover:border-[#1C3A5A] transition-all"
            >
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-[90px]">
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 pt-16 pb-12 border-b border-[#D4CBBB]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E] mb-4">Let's Begin</p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-[#1A1714] leading-[1.05]">
          Start Your Project
        </h1>
        <p className="text-[#6B5E4E] text-[15px] mt-3 max-w-md leading-relaxed">
          Tell us about your space, your life, and what matters most to you. Your requirements come first — always.
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24">

            {/* Left: Contact + Type */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-display text-xl text-[#1A1714] mb-6">Your Details</h2>
                <div className="flex flex-col gap-4">
                  <input className={inputClass} placeholder="Full Name *" value={form.name} onChange={setField('name')} required />
                  <input className={inputClass} placeholder="Email Address *" type="email" value={form.email} onChange={setField('email')} required />
                  <input className={inputClass} placeholder="Phone Number *" type="tel" value={form.phone} onChange={setField('phone')} required />

                  {/* City dropdown */}
                  <select
                    className={`${inputClass} appearance-none cursor-pointer`}
                    value={form.city}
                    onChange={setField('city')}
                    required
                  >
                    <option value="" disabled>Select City</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Project Type */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-4">Project Type</h3>
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map(t => (
                    <button key={t} type="button" className={chipClass(form.projectType === t)} onClick={() => toggle('projectType', t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration — only for apartment/penthouse */}
              {showConfig && (
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-4">Home Configuration</h3>
                  <div className="flex flex-wrap gap-2">
                    {configurations.map(c => (
                      <button key={c} type="button" className={chipClass(form.configuration === c)} onClick={() => toggle('configuration', c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-4">Budget Range</h3>
                <div className="flex flex-wrap gap-2">
                  {budgets.map(b => (
                    <button key={b} type="button" className={chipClass(form.budget === b)} onClick={() => toggle('budget', b)}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Preferences + Message */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-display text-xl text-[#1A1714] mb-6">Your Preferences</h2>

                {/* Timeline */}
                <div className="mb-8">
                  <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-4">Timeline</h3>
                  <div className="flex flex-wrap gap-2">
                    {timelines.map(t => (
                      <button key={t} type="button" className={chipClass(form.timeline === t)} onClick={() => toggle('timeline', t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style preference */}
                <div className="mb-8">
                  <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-4">Design Style Preference</h3>
                  <div className="flex flex-wrap gap-2">
                    {stylePrefs.map(s => (
                      <button key={s} type="button" className={chipClass(form.style === s)} onClick={() => toggle('style', s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Open message */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-3">Tell Us Anything Else</h3>
                  <p className="text-[13px] text-[#6B5E4E] mb-3 leading-relaxed">
                    Vastu requirements, specific materials, a reference image, a feeling you want to capture — anything helps.
                  </p>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={6}
                    placeholder="E.g. We want South Indian traditional influence with modern storage solutions. Work-from-home area needed. Vastu compliance important..."
                    value={form.message}
                    onChange={setField('message')}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full bg-[#1C3A5A] text-white text-[14px] py-4 hover:bg-[#2D8C7E] transition-colors font-medium"
              >
                {isSubmitting ? 'Submitting Your Brief…' : 'Submit Your Brief →'}
              </button>
              {submissionError && (
                <p role="alert" className="text-[12px] text-[#6B5E4E] text-center -mt-4">
                  {submissionError}
                </p>
              )}
              <p className="text-[12px] text-[#6B5E4E] text-center -mt-4">
                We respond within 24 hours. Or{' '}
                <a
                  href={`https://wa.me/918448061997`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2D8C7E] underline"
                >
                  WhatsApp us directly
                </a>{' '}
                for a faster response.
              </p>
            </div>
          </div>
        </form>

        {/* Qualitative credibility — no fake numbers */}
        <div className="mt-20 pt-16 border-t border-[#D4CBBB]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-10">Why NestArcadia</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Experience Across Diverse Spaces',
                desc: 'From compact 1BHK apartments in NCR to sprawling villas and commercial environments — our experience spans a wide range of residential and commercial projects.',
              },
              {
                title: 'Your Requirement Comes First',
                desc: 'We do not impose a house style. If you want minimal luxury, we build that. If you want South Indian influence, we interpret it. The brief always belongs to you.',
              },
              {
                title: 'Heritage Craft + Modern Function',
                desc: 'We work directly with Indian artisans — weavers, carpenters, plaster specialists — to bring authentic craft into every project without sacrificing modern liveability.',
              },
              {
                title: 'One Team, Entire Journey',
                desc: 'Design, execution, furniture, lighting, decor — one team manages all of it, from your first call to the day you move in.',
              },
            ].map(c => (
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
