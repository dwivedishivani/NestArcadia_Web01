import { useState, useEffect, useMemo } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import HomeForm from './HomeForm';
import ImageUpload from '../../components/ImageUpload';

interface Props {
  adminPassword: string;
  onLogout: () => void;
}

type AdminView = 'dashboard' | 'journal' | 'enquiries' | 'homes';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
  status: 'draft' | 'published';
  read_time: string;
  tags: string[];
  created_at: string;
  published_at: string | null;
}

interface Enquiry {
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
  status: string;
  notes: string;
  created_at: string;
}

interface Home {
  id: string;
  name: string;
  location: string;
  type: string;
  area: string;
  style: string;
  description: string;
  gallery_images: string[];
  status: 'published' | 'draft';
  display_order: number;
  created_at: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-078be9eb`;

export default function AdminDashboard({ adminPassword, onLogout }: Props) {
  const [view, setView] = useState<AdminView>('dashboard');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingHome, setEditingHome] = useState<Home | null>(null);
  const [showHomeForm, setShowHomeForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('all');
  const [enquiryCityFilter, setEnquiryCityFilter] = useState<string>('all');
  const [enquirySort, setEnquirySort] = useState<'date_desc' | 'date_asc' | 'name_asc' | 'name_desc'>('date_desc');
  const [enquirySearch, setEnquirySearch] = useState<string>('');

  const headers = {
    'Content-Type': 'application/json',
    'X-Admin-Password': adminPassword,
    apikey: publicAnonKey,
    Authorization: `Bearer ${publicAnonKey}`,
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/blogs`, { headers });
      const data = await res.json();
      setBlogs(data.data || []);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    }
    setLoading(false);
  };

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/enquiries`, { headers });
      const data = await res.json();
      setEnquiries(data.data || []);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    }
    setLoading(false);
  };

  const fetchHomes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/homes`, { headers });
      const data = await res.json();
      setHomes(data.data || []);
    } catch (err) {
      console.error('Failed to fetch homes:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (view === 'journal') fetchBlogs();
    if (view === 'enquiries') fetchEnquiries();
    if (view === 'homes') fetchHomes();
  }, [view]);

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await fetch(`${API_BASE}/admin/blogs/${id}`, { method: 'DELETE', headers });
      fetchBlogs();
    } catch (err) {
      console.error('Failed to delete blog:', err);
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await fetch(`${API_BASE}/admin/enquiries/${id}`, { method: 'DELETE', headers });
      fetchEnquiries();
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
    }
  };

  const updateEnquiryStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_BASE}/admin/enquiries/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status }),
      });
      fetchEnquiries();
    } catch (err) {
      console.error('Failed to update enquiry:', err);
    }
  };

  const deleteHome = async (id: string) => {
    if (!confirm('Are you sure you want to delete this home?')) return;
    try {
      await fetch(`${API_BASE}/admin/homes/${id}`, { method: 'DELETE', headers });
      fetchHomes();
    } catch (err) {
      console.error('Failed to delete home:', err);
    }
  };

  // Filter and sort enquiries
  const filteredEnquiries = useMemo(() => {
    let filtered = [...enquiries];

    // Search filter
    if (enquirySearch) {
      const search = enquirySearch.toLowerCase();
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(search) ||
        e.email.toLowerCase().includes(search) ||
        e.phone.includes(search) ||
        e.city.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (enquiryStatusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === enquiryStatusFilter);
    }

    // City filter
    if (enquiryCityFilter !== 'all') {
      filtered = filtered.filter(e => e.city === enquiryCityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (enquirySort) {
        case 'date_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [enquiries, enquirySearch, enquiryStatusFilter, enquiryCityFilter, enquirySort]);

  // Get unique cities for filter
  const uniqueCities = useMemo(() => 
    Array.from(new Set(enquiries.map(e => e.city))).sort(),
    [enquiries]
  );

  const navItems = [
    { id: 'dashboard' as AdminView, label: 'Dashboard', icon: '◻' },
    { id: 'journal' as AdminView, label: 'Journal', icon: '◎' },
    { id: 'enquiries' as AdminView, label: 'Enquiries', icon: '◈' },
    { id: 'homes' as AdminView, label: 'Homes', icon: '◐' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#F2EDE4' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-[#D4CBBB] flex flex-col transform transition-transform lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ background: '#EAE4DA' }}
      >
        <div className="p-6 border-b border-[#D4CBBB]">
          <h1 className="font-display text-xl text-[#1A1714]">NestArcadia</h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mt-1">Admin</p>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 mb-1 flex items-center gap-3 transition-colors ${
                view === item.id
                  ? 'bg-[#1C3A5A] text-white'
                  : 'text-[#6B5E4E] hover:bg-[#D4CBBB]/50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[14px]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#D4CBBB]">
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-3 text-[14px] text-[#6B5E4E] hover:text-[#1A1714] transition-colors flex items-center gap-3"
          >
            <span>←</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="border-b border-[#D4CBBB] px-6 py-4 flex items-center justify-between" style={{ background: '#EAE4DA' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#6B5E4E] hover:text-[#1A1714]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="font-display text-xl text-[#1A1714] capitalize">{view}</h2>
          </div>
          {view === 'journal' && (
            <button
              onClick={() => {
                setEditingBlog(null);
                setShowBlogForm(true);
              }}
              className="bg-[#1C3A5A] text-white text-[13px] px-5 py-2 hover:bg-[#2D8C7E] transition-colors"
            >
              + New Article
            </button>
          )}
        </header>

        <div className="p-6 lg:p-10">
          {/* Dashboard View */}
          {view === 'dashboard' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setView('journal')}
                className="border border-[#D4CBBB] p-8 text-left hover:border-[#2D8C7E] transition-colors group"
                style={{ background: '#EAE4DA' }}
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-2">Content</p>
                <h3 className="font-display text-2xl text-[#1A1714] group-hover:text-[#2D8C7E] transition-colors">
                  Journal
                </h3>
                <p className="text-[14px] text-[#6B5E4E] mt-2">
                  Manage blog posts, articles, and editorial content
                </p>
              </button>

              <button
                onClick={() => setView('enquiries')}
                className="border border-[#D4CBBB] p-8 text-left hover:border-[#2D8C7E] transition-colors group"
                style={{ background: '#EAE4DA' }}
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-2">Leads</p>
                <h3 className="font-display text-2xl text-[#1A1714] group-hover:text-[#2D8C7E] transition-colors">
                  Enquiries
                </h3>
                <p className="text-[14px] text-[#6B5E4E] mt-2">
                  View and manage customer project submissions
                </p>
              </button>

              <div
                className="border border-[#D4CBBB] p-8"
                style={{ background: '#EAE4DA' }}
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B5E4E] mb-2">Quick Stats</p>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] text-[#6B5E4E]">Published Articles</span>
                    <span className="font-display text-lg text-[#1A1714]">—</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] text-[#6B5E4E]">Total Enquiries</span>
                    <span className="font-display text-lg text-[#1A1714]">—</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Journal View */}
          {view === 'journal' && !showBlogForm && (
            <div>
              {loading ? (
                <div className="text-center py-20 text-[#6B5E4E]">Loading articles...</div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-20 border border-[#D4CBBB]" style={{ background: '#EAE4DA' }}>
                  <p className="text-[#6B5E4E] mb-4">No articles yet</p>
                  <button
                    onClick={() => setShowBlogForm(true)}
                    className="text-[14px] text-[#1C3A5A] border-b border-[#1C3A5A] hover:text-[#2D8C7E] hover:border-[#2D8C7E] transition-colors"
                  >
                    Create your first article →
                  </button>
                </div>
              ) : (
                <div className="border border-[#D4CBBB] overflow-hidden" style={{ background: '#EAE4DA' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#D4CBBB]">
                          <th className="text-left text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Title</th>
                          <th className="text-left text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Category</th>
                          <th className="text-left text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Status</th>
                          <th className="text-left text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Date</th>
                          <th className="text-right text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.map((blog) => (
                          <tr key={blog.id} className="border-b border-[#D4CBBB] last:border-b-0">
                            <td className="px-6 py-4">
                              <p className="text-[14px] text-[#1A1714] font-medium line-clamp-2">{blog.title}</p>
                              <p className="text-[12px] text-[#6B5E4E] mt-0.5">{blog.author}</p>
                            </td>
                            <td className="px-6 py-4 text-[13px] text-[#6B5E4E]">{blog.category}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block text-[11px] uppercase tracking-wider px-3 py-1 ${
                                  blog.status === 'published'
                                    ? 'bg-[#2D8C7E]/10 text-[#2D8C7E]'
                                    : 'bg-[#6B5E4E]/10 text-[#6B5E4E]'
                                }`}
                              >
                                {blog.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[13px] text-[#6B5E4E]">
                              {new Date(blog.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => {
                                  setEditingBlog(blog);
                                  setShowBlogForm(true);
                                }}
                                className="text-[13px] text-[#1C3A5A] hover:text-[#2D8C7E] mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteBlog(blog.id)}
                                className="text-[13px] text-red-600 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Blog Form */}
          {view === 'journal' && showBlogForm && (
            <BlogForm
              blog={editingBlog}
              headers={headers}
              onSave={() => {
                setShowBlogForm(false);
                setEditingBlog(null);
                fetchBlogs();
              }}
              onCancel={() => {
                setShowBlogForm(false);
                setEditingBlog(null);
              }}
            />
          )}

          {/* Enquiries View */}
          {view === 'enquiries' && (
            <div>
              {loading ? (
                <div className="text-center py-20 text-[#6B5E4E]">Loading enquiries...</div>
              ) : enquiries.length === 0 ? (
                <div className="text-center py-20 border border-[#D4CBBB]" style={{ background: '#EAE4DA' }}>
                  <p className="text-[#6B5E4E]">No enquiries yet</p>
                </div>
              ) : (
                <div>
                  {/* Filter Controls */}
                  <div className="mb-6 p-4 border border-[#D4CBBB]" style={{ background: '#EAE4DA' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Search */}
                      <input
                        type="text"
                        placeholder="Search name, email, phone, city..."
                        value={enquirySearch}
                        onChange={(e) => setEnquirySearch(e.target.value)}
                        className="text-[13px] px-3 py-2 border border-[#D4CBBB] bg-white outline-none focus:border-[#2D8C7E]"
                      />
                      
                      {/* Status Filter */}
                      <select
                        value={enquiryStatusFilter}
                        onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                        className="text-[13px] px-3 py-2 border border-[#D4CBBB] bg-white outline-none focus:border-[#2D8C7E]"
                      >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="site_visit">Site Visit</option>
                        <option value="proposal">Proposal</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>

                      {/* City Filter */}
                      <select
                        value={enquiryCityFilter}
                        onChange={(e) => setEnquiryCityFilter(e.target.value)}
                        className="text-[13px] px-3 py-2 border border-[#D4CBBB] bg-white outline-none focus:border-[#2D8C7E]"
                      >
                        <option value="all">All Cities</option>
                        {uniqueCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>

                      {/* Sort */}
                      <select
                        value={enquirySort}
                        onChange={(e) => setEnquirySort(e.target.value as any)}
                        className="text-[13px] px-3 py-2 border border-[#D4CBBB] bg-white outline-none focus:border-[#2D8C7E]"
                      >
                        <option value="date_desc">Newest First</option>
                        <option value="date_asc">Oldest First</option>
                        <option value="name_asc">Name A-Z</option>
                        <option value="name_desc">Name Z-A</option>
                      </select>
                    </div>
                    
                    {/* Results Count */}
                    <div className="mt-3 flex justify-between items-center text-[12px] text-[#6B5E4E]">
                      <span>Showing {filteredEnquiries.length} of {enquiries.length} enquiries</span>
                      {(enquirySearch || enquiryStatusFilter !== 'all' || enquiryCityFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setEnquirySearch('');
                            setEnquiryStatusFilter('all');
                            setEnquiryCityFilter('all');
                          }}
                          className="text-[#2D8C7E] hover:text-[#1C3A5A]"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="border border-[#D4CBBB] overflow-hidden" style={{ background: '#EAE4DA' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#D4CBBB]">
                          <th className="text-left text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Client</th>
                          <th className="text-left text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Contact</th>
                          <th className="text-left text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Project</th>
                          <th className="text-left text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Budget</th>
                          <th className="text-left text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Status</th>
                          <th className="text-left text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Date</th>
                          <th className="text-right text-[11px] uppercase tracking-[0.15em] text-[#6B5E4E] px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEnquiries.map((enquiry) => (
                          <tr key={enquiry.id} className="border-b border-[#D4CBBB] last:border-b-0">
                            <td className="px-6 py-4">
                              <p className="text-[14px] text-[#1A1714] font-medium">{enquiry.name}</p>
                              <p className="text-[12px] text-[#6B5E4E] mt-0.5">{enquiry.city}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-[13px] text-[#1A1714]">{enquiry.email}</p>
                              <p className="text-[12px] text-[#6B5E4E] mt-0.5">{enquiry.phone}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-[13px] text-[#1A1714]">{enquiry.project_type}</p>
                              <p className="text-[12px] text-[#6B5E4E] mt-0.5">{enquiry.configuration}</p>
                            </td>
                            <td className="px-6 py-4 text-[13px] text-[#6B5E4E]">{enquiry.budget}</td>
                            <td className="px-6 py-4">
                              <select
                                value={enquiry.status}
                                onChange={(e) => updateEnquiryStatus(enquiry.id, e.target.value)}
                                className="text-[12px] bg-transparent border border-[#D4CBBB] px-2 py-1 outline-none focus:border-[#2D8C7E]"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="site_visit">Site Visit</option>
                                <option value="proposal">Proposal</option>
                                <option value="won">Won</option>
                                <option value="lost">Lost</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-[13px] text-[#6B5E4E]">
                              {new Date(enquiry.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => deleteEnquiry(enquiry.id)}
                                className="text-[13px] text-red-600 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                </div>
              )}
            </div>
          )}

          {/* Homes View */}
          {view === 'homes' && (
            <div>
              {showHomeForm ? (
                <HomeForm
                  home={editingHome}
                  headers={headers}
                  onSave={() => {
                    setShowHomeForm(false);
                    setEditingHome(null);
                    fetchHomes();
                  }}
                  onCancel={() => {
                    setShowHomeForm(false);
                    setEditingHome(null);
                  }}
                />
              ) : loading ? (
                <div className="text-center py-20 text-[#6B5E4E]">Loading homes...</div>
              ) : (
                <div className="grid gap-6">
                  <div className="flex justify-between items-center">
                    <p className="text-[13px] text-[#6B5E4E]">
                      {homes.length} {homes.length === 1 ? 'home' : 'homes'} in portfolio
                    </p>
                    <button
                      onClick={() => {
                        setEditingHome(null);
                        setShowHomeForm(true);
                      }}
                      className="text-[13px] px-4 py-2 bg-[#1A1714] text-white hover:bg-[#2D8C7E] transition-colors"
                    >
                      + Add Home
                    </button>
                  </div>
                  {homes.map((home) => (
                    <div key={home.id} className="border border-[#D4CBBB] p-6" style={{ background: '#EAE4DA' }}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-[18px] text-[#1A1714] font-medium">{home.name}</h3>
                          <p className="text-[13px] text-[#6B5E4E] mt-1">{home.location} • {home.type} • {home.area}</p>
                        </div>
                        <div className="flex gap-3">
                          <span className={`text-[11px] uppercase tracking-wider px-3 py-1 ${home.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {home.status}
                          </span>
                          <button
                            onClick={() => {
                              setEditingHome(home);
                              setShowHomeForm(true);
                            }}
                            className="text-[13px] text-[#2D8C7E] hover:text-[#1A1714]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteHome(home.id)}
                            className="text-[13px] text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-[13px] text-[#1A1714] mb-3">
                        <strong>Style:</strong> {home.style} Indian
                      </p>
                      <p className="text-[13px] text-[#6B5E4E] leading-relaxed mb-4">{home.description}</p>
                      <div className="text-[12px] text-[#6B5E4E]">
                        <strong>Images:</strong> {home.gallery_images?.length || 0} photos • Order: {home.display_order}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Blog Form Component
function BlogForm({
  blog,
  headers,
  onSave,
  onCancel,
}: {
  blog: Blog | null;
  headers: Record<string, string>;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    category: blog?.category || 'Materials',
    author: blog?.author || '',
    image_url: blog?.image_url || '',
    status: blog?.status || 'draft',
    read_time: blog?.read_time || '5 min read',
    tags: blog?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Materials', 'Craft', 'Surfaces', 'Design Cultures', 'Wellness', 'Architecture'];

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const url = blog
        ? `${API_BASE}/admin/blogs/${blog.id}`
        : `${API_BASE}/admin/blogs`;
      const method = blog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save article');
      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save article');
    }
    setSaving(false);
  };

  const inputClass = 'w-full bg-transparent border border-[#D4CBBB] px-4 py-3 text-[15px] text-[#1A1714] placeholder:text-[#6B5E4E]/50 outline-none focus:border-[#2D8C7E] transition-colors';

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-display text-xl text-[#1A1714]">
          {blog ? 'Edit Article' : 'New Article'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-[14px] text-[#6B5E4E] hover:text-[#1A1714]"
        >
          ← Back to list
        </button>
      </div>

      <div className="border border-[#D4CBBB] p-8" style={{ background: '#EAE4DA' }}>
        <div className="grid gap-6">
          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Title *</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) });
              }}
              placeholder="Article title"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Slug</label>
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="url-friendly-slug"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Author *</label>
              <input
                className={inputClass}
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="Author name"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Category</label>
              <select
                className={`${inputClass} cursor-pointer`}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Read Time</label>
              <input
                className={inputClass}
                value={form.read_time}
                onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                placeholder="5 min read"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Status</label>
              <select
                className={`${inputClass} cursor-pointer`}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <ImageUpload
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            aspectRatio={1200 / 700}
            targetWidth={1200}
            targetHeight={700}
            label="Article Image"
            placeholder="Paste image URL or upload file"
          />

          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Excerpt *</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Brief description of the article"
              required
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">
              Content * <span className="normal-case tracking-normal text-[10px]">(Separate paragraphs with blank lines)</span>
            </label>
            <textarea
              className={`${inputClass} resize-none font-mono text-[13px]`}
              rows={12}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Article content. Each paragraph should be separated by a blank line."
              required
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Tags</label>
            <input
              className={inputClass}
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>

        {error && (
          <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 px-4 py-2 mt-6">
            {error}
          </p>
        )}

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1C3A5A] text-white text-[14px] px-8 py-3 hover:bg-[#2D8C7E] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : blog ? 'Update Article' : 'Create Article'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border border-[#D4CBBB] text-[#6B5E4E] text-[14px] px-8 py-3 hover:border-[#1A1714] hover:text-[#1A1714] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
