import { useEffect, useMemo, useState } from 'react';
import {
  cleanValue,
  normalisePhone,
  parseSource,
  societyFromMessage,
  tierNameFor,
} from '../../lib/leadModel';

export interface Enquiry {
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
  service?: string | null;
  status: string;
  notes: string;
  created_at: string;
}

interface Props {
  enquiries: Enquiry[];
  loading: boolean;
  onRefresh: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const STATUSES = [
  ['new', 'New'], ['contacted', 'Contacted'], ['qualified', 'Qualified'], ['site_visit', 'Site Visit'],
  ['proposal', 'Proposal'], ['won', 'Won'], ['lost', 'Lost'],
] as const;

type SortKey = 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc';

interface Row {
  e: Enquiry;
  isQuick: boolean;
  service: string;
  from: string;
  email: string;
  city: string;
  projectType: string;
  configuration: string;
  budget: string;
  tier: string;
  timeline: string;
  style: string;
  society: string;
  phoneDigits: string;
}

function toRow(e: Enquiry): Row {
  const meta = parseSource(e.source);
  const configuration = e.configuration ?? '';
  const budget = cleanValue(e.budget);
  return {
    e,
    isQuick: meta.isQuick,
    service: e.service || meta.service || 'General enquiry',
    from: meta.from,
    email: cleanValue(e.email),
    city: cleanValue(e.city),
    projectType: cleanValue(e.project_type),
    configuration,
    budget,
    tier: tierNameFor(configuration, budget),
    timeline: cleanValue(e.timeline),
    style: cleanValue(e.design_style),
    society: societyFromMessage(e.message),
    phoneDigits: normalisePhone(e.phone ?? ''),
  };
}

const selectClass = 'text-[13px] px-3 py-2 border border-[#D4CBBB] bg-white outline-none focus:border-[#2D8C7E]';

function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function exportCsv(rows: Row[]) {
  const head = ['Date', 'Lead type', 'Name', 'Phone', 'Email', 'City', 'Society', 'Project type', 'Home size', 'Budget', 'Tier', 'Timeline', 'Style', 'Service', 'Guide', 'Status', 'Message'];
  const lines = rows.map((r) => [
    new Date(r.e.created_at).toISOString(), r.isQuick ? 'Quick callback' : 'Full brief', r.e.name, r.e.phone, r.email, r.city, r.society,
    r.projectType, r.configuration, r.budget, r.tier, r.timeline, r.style, r.service, r.from, r.e.status, r.e.message ?? '',
  ].map((v) => csvCell(String(v ?? ''))).join(','));
  const blob = new Blob([[head.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nestarcadia-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function LeadBadge({ quick }: { quick: boolean }) {
  return (
    <span className={`inline-block text-[11px] px-2.5 py-1 border ${quick ? 'bg-[#B2552E]/10 text-[#8A3F1F] border-[#B2552E]/30' : 'bg-[#1C3A5A]/10 text-[#1C3A5A] border-[#1C3A5A]/25'}`}>
      {quick ? 'Quick callback' : 'Full brief'}
    </span>
  );
}

export default function EnquiriesPanel({ enquiries, loading, onRefresh, onStatusChange, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [leadType, setLeadType] = useState('all');
  const [home, setHome] = useState('all');
  const [budget, setBudget] = useState('all');
  const [city, setCity] = useState('all');
  const [service, setService] = useState('all');
  const [sort, setSort] = useState<SortKey>('date_desc');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(() => enquiries.map(toRow), [enquiries]);
  const selected = rows.find((r) => r.e.id === selectedId) ?? null;

  const options = useMemo(() => {
    const uniq = (values: string[]) => Array.from(new Set(values.filter(Boolean))).sort();
    return {
      cities: uniq(rows.map((r) => r.city)),
      services: uniq(rows.map((r) => r.service)),
      homes: uniq(rows.map((r) => r.configuration)),
      budgets: uniq(rows.map((r) => r.budget)),
    };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = rows.filter((r) => {
      if (q) {
        const hay = [r.e.name, r.email, r.e.phone, r.city, r.society, r.configuration, r.budget, r.service, r.e.message].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (status !== 'all' && r.e.status !== status) return false;
      if (leadType !== 'all' && (leadType === 'quick') !== r.isQuick) return false;
      if (home !== 'all' && r.configuration !== home) return false;
      if (budget !== 'all' && r.budget !== budget) return false;
      if (city !== 'all' && r.city !== city) return false;
      if (service !== 'all' && r.service !== service) return false;
      return true;
    });
    list.sort((a, b) => {
      switch (sort) {
        case 'date_asc': return new Date(a.e.created_at).getTime() - new Date(b.e.created_at).getTime();
        case 'name_asc': return a.e.name.localeCompare(b.e.name);
        case 'name_desc': return b.e.name.localeCompare(a.e.name);
        default: return new Date(b.e.created_at).getTime() - new Date(a.e.created_at).getTime();
      }
    });
    return list;
  }, [rows, search, status, leadType, home, budget, city, service, sort]);

  const stats = useMemo(() => ({
    total: rows.length,
    fresh: rows.filter((r) => r.e.status === 'new').length,
    quick: rows.filter((r) => r.isQuick).length,
    full: rows.filter((r) => !r.isQuick).length,
    bhk2: rows.filter((r) => r.configuration === '2 BHK').length,
    bhk3: rows.filter((r) => r.configuration === '3 BHK').length,
  }), [rows]);

  const filtersActive = Boolean(search) || [status, leadType, home, budget, city, service].some((v) => v !== 'all');
  const clearFilters = () => {
    setSearch(''); setStatus('all'); setLeadType('all'); setHome('all'); setBudget('all'); setCity('all'); setService('all');
  };

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelectedId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  const statCards: Array<[string, number, () => void]> = [
    ['All leads', stats.total, clearFilters],
    ['New', stats.fresh, () => { clearFilters(); setStatus('new'); }],
    ['Quick', stats.quick, () => { clearFilters(); setLeadType('quick'); }],
    ['Full briefs', stats.full, () => { clearFilters(); setLeadType('full'); }],
    ['2 BHK', stats.bhk2, () => { clearFilters(); setHome('2 BHK'); }],
    ['3 BHK', stats.bhk3, () => { clearFilters(); setHome('3 BHK'); }],
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E]">Lead pipeline</p>
          <p className="text-[13px] text-[#6B5E4E] mt-1">Quick callbacks need a fast call. Full briefs include home size and budget tier.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => exportCsv(filtered)} disabled={filtered.length === 0} className="border border-[#D4CBBB] bg-[#EAE4DA] text-[#1A1714] text-[13px] px-4 py-2 hover:border-[#2D8C7E] disabled:opacity-50 transition-colors">
            ⤓ Export CSV
          </button>
          <button type="button" onClick={onRefresh} disabled={loading} className="border border-[#D4CBBB] bg-[#EAE4DA] text-[#1A1714] text-[13px] px-4 py-2 hover:border-[#2D8C7E] disabled:opacity-50 transition-colors">
            {loading ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {loading && enquiries.length === 0 ? (
        <div className="text-center py-20 text-[#6B5E4E]">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-20 border border-[#D4CBBB]" style={{ background: '#EAE4DA' }}>
          <p className="text-[#6B5E4E]">No enquiries yet</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
            {statCards.map(([label, value, onClick]) => (
              <button key={label} type="button" onClick={onClick} className="text-left border border-[#D4CBBB] px-4 py-3 hover:border-[#2D8C7E] transition-colors" style={{ background: '#EAE4DA' }}>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B5E4E] truncate">{label}</p>
                <p className="font-display text-xl text-[#1A1714] mt-1">{value}</p>
              </button>
            ))}
          </div>

          <div className="mb-6 p-4 border border-[#D4CBBB]" style={{ background: '#EAE4DA' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input type="text" aria-label="Search enquiries" placeholder="Search name, phone, society, city..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-[13px] px-3 py-2 border border-[#D4CBBB] bg-white outline-none focus:border-[#2D8C7E] lg:col-span-2" />
              <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                <option value="all">All status</option>
                {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <select aria-label="Lead type" value={leadType} onChange={(e) => setLeadType(e.target.value)} className={selectClass}>
                <option value="all">All lead types</option>
                <option value="quick">Quick callback</option>
                <option value="full">Full brief</option>
              </select>
              <select aria-label="Home size" value={home} onChange={(e) => setHome(e.target.value)} className={selectClass}>
                <option value="all">All home sizes</option>
                {options.homes.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              <select aria-label="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={selectClass}>
                <option value="all">All budgets</option>
                {options.budgets.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <select aria-label="City" value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
                <option value="all">All cities</option>
                {options.cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select aria-label="Service" value={service} onChange={(e) => setService(e.target.value)} className={selectClass}>
                <option value="all">All services</option>
                {options.services.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectClass}>
                <option value="date_desc">Newest first</option>
                <option value="date_asc">Oldest first</option>
                <option value="name_asc">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
              </select>
            </div>
            <div className="mt-3 flex justify-between items-center text-[12px] text-[#6B5E4E]">
              <span>Showing {filtered.length} of {enquiries.length} enquiries</span>
              {filtersActive && <button type="button" onClick={clearFilters} className="text-[#2D8C7E] hover:text-[#1C3A5A]">Clear filters</button>}
            </div>
          </div>

          <div className="border border-[#D4CBBB] overflow-hidden" style={{ background: '#EAE4DA' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#D4CBBB]">
                    {['Client', 'Contact', 'Lead', 'Home', 'Budget', 'Status', 'Date'].map((h) => (
                      <th key={h} scope="col" className="text-left text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">{h}</th>
                    ))}
                    <th scope="col" className="text-right text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="px-6 py-10 text-center text-[13px] text-[#6B5E4E]">No enquiries match these filters.</td></tr>
                  )}
                  {filtered.map((r) => (
                    <tr key={r.e.id} onClick={() => setSelectedId(r.e.id)} className="border-b border-[#D4CBBB] last:border-b-0 cursor-pointer hover:bg-[#F2EDE4] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-[14px] text-[#1A1714] font-medium">{r.e.name}</p>
                        <p className="text-[12px] text-[#6B5E4E] mt-0.5">{[r.society, r.city].filter(Boolean).join(', ') || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        {r.email && <p className="text-[13px] text-[#1A1714]">{r.email}</p>}
                        <p className="text-[12px] text-[#6B5E4E] mt-0.5">{r.e.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <LeadBadge quick={r.isQuick} />
                        <p className="text-[12px] text-[#6B5E4E] mt-1.5">{r.service}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] text-[#1A1714]">{r.configuration || r.projectType || '—'}</p>
                        {r.configuration && r.projectType && <p className="text-[12px] text-[#6B5E4E] mt-0.5">{r.projectType}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] text-[#1A1714]">{r.budget || '—'}</p>
                        {r.tier && <p className="text-[12px] text-[#6B5E4E] mt-0.5">{r.tier}</p>}
                      </td>
                      <td className="px-6 py-4" onClick={(event) => event.stopPropagation()}>
                        <select aria-label={`Status for ${r.e.name}`} value={r.e.status} onChange={(e) => onStatusChange(r.e.id, e.target.value)} className="text-[12px] bg-transparent border border-[#D4CBBB] px-2 py-1 outline-none focus:border-[#2D8C7E]">
                          {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#6B5E4E] whitespace-nowrap">{new Date(r.e.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <a href={`tel:${r.e.phone}`} onClick={(event) => event.stopPropagation()} className="text-[13px] text-[#1C3A5A] hover:text-[#2D8C7E] mr-4">Call</a>
                        <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(r.e.id); }} className="text-[13px] text-red-600 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => setSelectedId(null)}>
          <div role="dialog" aria-modal="true" aria-label={`Enquiry from ${selected.e.name}`} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#D4CBBB] p-6 lg:p-8" style={{ background: '#F2EDE4' }} onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B5E4E]">Enquiry</p>
                <h3 className="font-display text-2xl text-[#1A1714] mt-1">{selected.e.name}</h3>
                <p className="text-[12px] text-[#6B5E4E] mt-1">{new Date(selected.e.created_at).toLocaleString()}</p>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} className="text-[#6B5E4E] hover:text-[#1A1714] text-xl" aria-label="Close enquiry">×</button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <LeadBadge quick={selected.isQuick} />
              <span className="text-[11px] px-2.5 py-1 bg-[#2D8C7E]/10 text-[#1C3A5A] border border-[#2D8C7E]/20">{selected.service}</span>
              <span className="text-[11px] px-2.5 py-1 border border-[#D4CBBB]">{selected.e.status}</span>
              {selected.from && <span className="text-[11px] px-2.5 py-1 border border-[#D4CBBB]">Guide: {selected.from}</span>}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                ['Phone', selected.e.phone, `tel:${selected.e.phone}`],
                ['Email', selected.email, selected.email ? `mailto:${selected.email}` : ''],
                ['City', selected.city, ''],
                ['Society / locality', selected.society, ''],
                ['Project type', selected.projectType, ''],
                ['Home size', selected.configuration, ''],
                ['Budget', selected.budget ? `${selected.budget}${selected.tier ? ` (${selected.tier})` : ''}` : '', ''],
                ['Timeline', selected.timeline, ''],
                ['Design style', selected.style, ''],
                ['Source', selected.e.source, ''],
              ].map(([label, value, href]) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B5E4E]">{label}</p>
                  {href && value
                    ? <a className="text-[14px] text-[#1C3A5A] hover:text-[#2D8C7E] break-all" href={href}>{value}</a>
                    : <p className="text-[14px] text-[#1A1714] break-words">{value || '—'}</p>}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#D4CBBB]">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B5E4E] mb-2">Message</p>
              <p className="text-[14px] leading-relaxed text-[#1A1714] whitespace-pre-wrap">{selected.e.message || 'No message provided.'}</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-7">
              <a href={`tel:${selected.e.phone}`} className="bg-[#1C3A5A] text-white text-[13px] px-5 py-2.5 hover:bg-[#2D8C7E] transition-colors">Call client</a>
              {selected.phoneDigits.length === 10 && (
                <a href={`https://wa.me/91${selected.phoneDigits}?text=${encodeURIComponent(`Hello ${selected.e.name}, this is NestArcadia. Thank you for your interest in interiors for your home.`)}`} target="_blank" rel="noopener noreferrer" className="bg-[#2D8C7E] text-white text-[13px] px-5 py-2.5 hover:bg-[#1C3A5A] transition-colors">WhatsApp client</a>
              )}
              {selected.email && <a href={`mailto:${selected.email}`} className="border border-[#D4CBBB] text-[#1A1714] text-[13px] px-5 py-2.5 hover:border-[#2D8C7E] transition-colors">Email client</a>}
              <button type="button" onClick={() => setSelectedId(null)} className="border border-[#D4CBBB] text-[#6B5E4E] text-[13px] px-5 py-2.5 hover:border-[#1A1714] transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
