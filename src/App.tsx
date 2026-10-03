import { Component, lazy, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, useNavigate, useRouteError } from 'react-router';
import Nav from './components/navigation/Nav';
import Footer from './components/layout/Footer';
import WhatsApp from './components/layout/WhatsApp';
import MobileConversionBar from './components/layout/MobileConversionBar';
import Home from './pages/Home/Home';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EditorialContext from './components/common/EditorialContext';
import ConversionBanner from './components/common/ConversionBanner';
import logoImg from './assets/images/branding/nestarcadia-logo-transparent.png';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { getLocalServicePage, type LocalServiceConfig, default as LocalServicePage } from './pages/LocalService/LocalServicePage';

const DesignCultures = lazy(() => import('./pages/DesignCultures/DesignCultures'));
const Services = lazy(() => import('./pages/Services/Services'));
const OurStory = lazy(() => import('./pages/OurStory/OurStory'));
const Journal = lazy(() => import('./pages/Journal/Journal'));
const Homes = lazy(() => import('./pages/Homes/Homes'));
const StartProject = lazy(() => import('./pages/StartProject/StartProject'));
const FAQs = lazy(() => import('./pages/FAQs/FAQs'));

export type Page = 'home' | 'cultures' | 'services' | 'story' | 'journal' | 'homes' | 'project' | 'faq' | 'admin';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/bright-api/make-server-078be9eb`;

const SITE_URL = 'https://nestarcadia.com';
const SOCIAL_IMAGE = 'https://images.unsplash.com/photo-1603901622056-0a5bee231395?w=1200&h=630&fit=crop&auto=format&q=85';

class SiteErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('NestArcadia page error:', error, info);
    const message = String(error?.message || '').toLowerCase();
    const isChunkError = /chunk|loading css|failed to fetch dynamically imported module|importing a module script failed/.test(message);
    if (isChunkError && !sessionStorage.getItem('nestarcadia_chunk_retry')) {
      sessionStorage.setItem('nestarcadia_chunk_retry', '1');
      window.location.reload();
    }
  }

  handleRetry = () => {
    sessionStorage.removeItem('nestarcadia_chunk_retry');
    const url = new URL(window.location.href);
    url.searchParams.set('_na_reload', String(Date.now()));
    window.location.replace(url.toString());
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-[#F2EDE4] text-[#1A1714] flex items-center justify-center px-6 py-24">
        <div className="max-w-xl text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E] mb-5">NestArcadia</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-5">Something interrupted this page.</h1>
          <p className="text-[#6B5E4E] text-sm leading-7 mb-8">The site is still available. Please try the page again, or return to the homepage.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={this.handleRetry} className="bg-[#1C3A5A] text-white px-6 py-3 text-sm font-semibold hover:bg-[#2D8C7E] transition-colors">Reload Page</button>
            <a href="/" className="border border-[#1C3A5A] text-[#1C3A5A] px-6 py-3 text-sm font-semibold hover:bg-[#1C3A5A] hover:text-white transition-colors">Go to Home</a>
          </div>
        </div>
      </div>
    );
  }
}

const pagePaths: Record<Page, string> = {
  home: '/',
  cultures: '/design-cultures',
  services: '/interior-design-services',
  story: '/our-story',
  journal: '/journal',
  homes: '/our-projects',
  project: '/start-your-project',
  faq: '/faqs',
  admin: '/admin',
};

const pageMeta: Record<Page, { title: string; description: string }> = {
  home: { title: 'NestArcadia | Interior Designers in Noida & Greater Noida', description: 'NestArcadia creates heritage-inspired, contemporary interiors for 2BHK, 3BHK, 4BHK apartments, villas and farmhouses in Noida, Greater Noida, Greater Noida West and NCR.' },
  cultures: { title: 'Indian Design Cultures for Modern Homes', description: 'Discover how North, South, East, West and Central Indian design traditions shape contemporary homes in Noida, Greater Noida and NCR.' },
  services: { title: 'Interior Design Services in Noida, Greater Noida & NCR', description: 'Residential and commercial interior design, turnkey execution, custom furniture, Vastu-led planning and decor for Noida, Greater Noida West, Noida Extension, Ghaziabad, Faridabad, Delhi and Gurugram.' },
  story: { title: 'Our Story | Ancient Craft, Modern Indian Interiors', description: 'Meet NestArcadia, an interior design studio translating India’s material heritage into homes made for modern living.' },
  journal: { title: 'Interior Design Journal for Noida & Greater Noida Homes', description: 'Practical design ideas for 2BHK, 3BHK and 4BHK homes in Noida, Greater Noida and Greater Noida West — from materials and space planning to site execution.' },
  homes: { title: 'Our Projects | NestArcadia Interior Design', description: 'Explore NestArcadia’s selected interior design projects and residential design studies across India.' },
  project: { title: 'Start an Interior Design Project in Noida & NCR', description: 'Talk to NestArcadia about a 2BHK, 3BHK, 4BHK, villa, farmhouse, office or commercial interior project in Noida, Greater Noida, Greater Noida West and NCR.' },
  faq: { title: 'Interior Design Cost, Services & FAQs | Noida & NCR', description: 'Answers about 2BHK and 3BHK interior design, costs, modular kitchens, turnkey execution, Vastu planning and commercial interiors across Noida, Greater Noida and NCR.' },
  admin: { title: 'Admin Dashboard', description: 'NestArcadia admin dashboard for managing content and enquiries.' },
};

function pageFromPath(pathname: string): Page {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/design-cultures')) return 'cultures';
  if (pathname.startsWith('/interior-design-services')) return 'services';
  if (pathname.startsWith('/our-story')) return 'story';
  if (pathname.startsWith('/journal')) return 'journal';
  if (pathname.startsWith('/our-projects')) return 'homes';
  if (pathname.startsWith('/start-your-project')) return 'project';
  if (pathname.startsWith('/faqs')) return 'faq';
  return 'home';
}

function SeoManager({ page, localService }: { page: Page; localService?: LocalServiceConfig | null }) {
  const location = useLocation();
  const articleSlug = page === 'journal' ? location.pathname.match(/^\/journal\/([^/]+)\/?$/)?.[1] : undefined;
  const [article, setArticle] = useState<{ id: string; title: string; excerpt: string; img: string; category: string; author: string; publishedAt: string | null; modifiedAt: string | null } | null>(null);

  useEffect(() => {
    let active = true;
    if (!articleSlug) { setArticle(null); return; }
    const loadArticleMeta = async () => {
      try {
        const params = new URLSearchParams({
          select: 'slug,title,excerpt,category,author,image_url,published_at,created_at,updated_at',
          slug: 'eq.' + articleSlug,
          status: 'eq.published',
          limit: '1',
        });
        const response = await fetch(
          'https://' + projectId + '.supabase.co/rest/v1/blogs_078be9eb?' + params.toString(),
          { headers: { apikey: publicAnonKey, Authorization: 'Bearer ' + publicAnonKey } }
        );
        if (response.ok) {
          const rows = await response.json();
          if (Array.isArray(rows) && rows[0]) {
            const row = rows[0];
            if (active) setArticle({
              id: row.slug || articleSlug,
              title: row.title || 'NestArcadia Journal',
              excerpt: row.excerpt || '',
              img: row.image_url || SOCIAL_IMAGE,
              category: row.category || 'Journal',
              author: row.author || 'NestArcadia',
              publishedAt: row.published_at || row.created_at || null,
              modifiedAt: row.updated_at || row.published_at || row.created_at || null,
            });
            return;
          }
        }
      } catch {
        // Fall through to the bundled article metadata.
      }
      import('./pages/Journal/Journal').then(({ getJournalArticle }) => {
        if (!active) return;
        const fallback = getJournalArticle(articleSlug);
        setArticle(fallback ? {
          id: fallback.id,
          title: fallback.title,
          excerpt: fallback.excerpt,
          img: fallback.img,
          category: fallback.category,
          author: fallback.author,
          publishedAt: null,
          modifiedAt: null,
        } : null);
      });
    };
    loadArticleMeta();
    return () => { active = false; };
  }, [articleSlug]);

  useEffect(() => {
    const pathname = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '');
    const activeArticle = article?.id === articleSlug ? article : undefined;
    const meta = localService
      ? { title: localService.title + ' | NestArcadia', description: localService.description, image: SOCIAL_IMAGE, type: 'website' }
      : activeArticle
        ? { title: activeArticle.title + ' | NestArcadia Journal', description: activeArticle.excerpt, image: activeArticle.img, type: 'article' }
        : { ...pageMeta[page], image: SOCIAL_IMAGE, type: 'website' };
    const canonical = `${SITE_URL}${pathname}`;
    document.title = meta.title;
    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) { element = document.createElement('meta'); element.setAttribute(property ? 'property' : 'name', name); document.head.appendChild(element); }
      element.content = content;
    };
    setMeta('description', meta.description);
    setMeta('author', 'NestArcadia');
    setMeta('geo.region', 'IN-UP');
    setMeta('geo.placename', 'Greater Noida West, Noida Extension, Greater Noida, Noida, Ghaziabad, Faridabad, Delhi NCR, Gurugram');
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('og:title', meta.title, true);
    setMeta('og:description', meta.description, true);
    setMeta('og:type', meta.type, true);
    setMeta('og:url', canonical, true);
    setMeta('og:image', meta.image, true);
    setMeta('og:image:alt', activeArticle ? `${activeArticle.title} — NestArcadia Journal` : 'NestArcadia heritage-inspired modern interior', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', meta.image);
    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;
    let schema = document.getElementById('nestarcadia-schema');
    if (!schema) { schema = document.createElement('script'); schema.id = 'nestarcadia-schema'; schema.setAttribute('type', 'application/ld+json'); document.head.appendChild(schema); }
    const businessSchema = { '@type': 'ProfessionalService', name: 'NestArcadia', url: SITE_URL, image: SOCIAL_IMAGE, description: meta.description, serviceType: ['Interior Design', 'Turnkey Interior Execution', 'Custom Furniture Design', 'Commercial Office Interior Design'], areaServed: ['Greater Noida West', 'Noida Extension', 'Greater Noida', 'Noida', 'Ghaziabad', 'Indirapuram', 'Crossing Republik', 'Faridabad', 'Delhi', 'East Delhi', 'South Delhi', 'Gurugram', 'Dadri', 'Jewar', 'Yamuna Expressway', 'Delhi NCR'], sameAs: ['https://www.instagram.com/nestarcadia/', 'https://www.facebook.com/people/Nest-Arcadia/61577890484320/', 'https://www.linkedin.com/company/nest-arcadia', 'https://www.youtube.com/@NestArcadiaOfficial'] };
    const publisher = { '@type': 'Organization', name: 'NestArcadia', url: SITE_URL, logo: { '@type': 'ImageObject', url: new URL(logoImg, SITE_URL).toString() } };
    const articleAuthor = activeArticle && (activeArticle.author === 'NestArcadia'
      ? { '@type': 'Organization', name: 'NestArcadia', url: SITE_URL }
      : { '@type': 'Person', name: activeArticle.author });
    const articleSchema = activeArticle && { '@type': 'BlogPosting', headline: activeArticle.title, description: activeArticle.excerpt, image: activeArticle.img, author: articleAuthor, publisher, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }, articleSection: activeArticle.category, ...(activeArticle.publishedAt ? { datePublished: activeArticle.publishedAt } : {}), ...(activeArticle.modifiedAt ? { dateModified: activeArticle.modifiedAt } : {}) };
    const localServiceSchema = localService && { '@type': 'Service', name: localService.title, description: localService.description, serviceType: localService.eyebrow, areaServed: { '@type': 'Place', name: localService.area }, provider: { '@type': 'ProfessionalService', name: 'NestArcadia', url: SITE_URL } };
    const websiteSchema = page === 'home' && !localService ? { '@type': 'WebSite', name: 'NestArcadia', url: SITE_URL } : null;
    const faqSchema = page === 'faq' && !localService ? {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Which areas does NestArcadia serve?', acceptedAnswer: { '@type': 'Answer', text: 'NestArcadia serves Greater Noida West, Noida Extension, Greater Noida, Noida and nearby NCR markets including Ghaziabad, Faridabad, Delhi and Gurugram.' } },
        { '@type': 'Question', name: 'Do you design 2BHK, 3BHK and 4BHK interiors?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. NestArcadia plans interiors for 2BHK, 3BHK and 4BHK apartments, villas and farmhouses, with the scope adapted to the property and household requirements.' } },
        { '@type': 'Question', name: 'How much does a 2BHK or 3BHK interior cost in Greater Noida West?', acceptedAnswer: { '@type': 'Answer', text: 'The cost depends on the property condition, scope, materials, furniture and level of customisation. NestArcadia can define a project scope and budget after reviewing the property and requirements.' } },
        { '@type': 'Question', name: 'Do you provide turnkey interior design and execution?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Depending on the project, NestArcadia can manage planning and design through materials, site execution and final handover.' } },
        { '@type': 'Question', name: 'Do you design commercial office interiors?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Commercial work can include office space planning, reception, meeting rooms, workstations, storage, lighting, acoustics and execution coordination.' } }
      ]
    } : null;
    const breadcrumbSchema = activeArticle && { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/journal` },
      { '@type': 'ListItem', position: 3, name: activeArticle.title, item: canonical },
    ] };
      const localBreadcrumb = localService && { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: localService.area, item: canonical },
    ] };
    schema.textContent = JSON.stringify(localService
      ? { '@context': 'https://schema.org', '@graph': [businessSchema, localServiceSchema, localBreadcrumb].filter(Boolean) }
      : (articleSchema
        ? { '@context': 'https://schema.org', '@graph': [businessSchema, articleSchema, breadcrumbSchema].filter(Boolean) }
        : { '@context': 'https://schema.org', '@graph': [businessSchema, ...(websiteSchema ? [websiteSchema] : []), ...(faqSchema ? [faqSchema] : [])] }));
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
      page_type: localService ? 'local_service' : page,
      content_group: localService ? 'local_service' : (page === 'journal' && location.pathname !== '/journal' ? 'journal_article' : page),
    });
  }, [location.pathname, page, article, articleSlug, localService]);
  return null;
}

declare global { interface Window { dataLayer?: Record<string, unknown>[] } }

function RouteFallback() {
  return <div className="min-h-[52vh] animate-pulse bg-[#F2EDE4] px-6 pt-36 lg:px-20"><div className="mx-auto h-3 w-28 bg-[#D4CBBB]" /><div className="mx-auto mt-6 h-12 max-w-xl bg-[#EAE4DA]" /><div className="mx-auto mt-10 h-64 max-w-[1440px] bg-[#EAE4DA]" /></div>;
}

function RouteErrorElement() {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : String(error ?? '');
  const isChunkError = /chunk|loading css|failed to fetch dynamically imported module|importing a module script failed/i.test(message);

  useEffect(() => {
    if (!isChunkError || sessionStorage.getItem('nestarcadia_chunk_retry')) return;
    sessionStorage.setItem('nestarcadia_chunk_retry', '1');
    const url = new URL(window.location.href);
    url.searchParams.set('_na_reload', String(Date.now()));
    window.location.replace(url.toString());
  }, [isChunkError]);

  const retry = () => {
    sessionStorage.removeItem('nestarcadia_chunk_retry');
    const url = new URL(window.location.href);
    url.searchParams.set('_na_reload', String(Date.now()));
    window.location.replace(url.toString());
  };

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#1A1714] flex items-center justify-center px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E] mb-5">NestArcadia</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-5">Something interrupted this page.</h1>
        <p className="text-[#6B5E4E] text-sm leading-7 mb-8">
          This usually happens while the site is updating. We have tried to refresh the latest version automatically.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={retry} className="bg-[#1C3A5A] text-white px-6 py-3 text-sm font-semibold hover:bg-[#2D8C7E] transition-colors">Reload Latest Version</button>
          <a href="/" className="border border-[#1C3A5A] text-[#1C3A5A] px-6 py-3 text-sm font-semibold hover:bg-[#1C3A5A] hover:text-white transition-colors">Go to Home</a>
        </div>
      </div>
    </div>
  );
}

function AdminShell() {
  const navigate = useNavigate();
  const [adminPassword, setAdminPassword] = useState<string | null>(sessionStorage.getItem('admin_password'));
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (password: string) => {
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: publicAnonKey, Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem('admin_password', password);
        setAdminPassword(password);
      } else {
        setLoginError('Invalid password. Please try again.');
      }
    } catch {
      setLoginError('Unable to connect. Please try again.');
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_password');
    setAdminPassword(null);
    navigate('/');
  };

  if (!adminPassword) {
    return <AdminLogin onLogin={handleLogin} error={loginError} loading={loginLoading} />;
  }
  return <AdminDashboard adminPassword={adminPassword} onLogout={handleLogout} />;
}


function SiteShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const page = pageFromPath(location.pathname);
  const localService = getLocalServicePage(location.pathname);
  const articleId = location.pathname.startsWith('/journal/') ? location.pathname.split('/')[2] : undefined;
  const setPage = (next: Page) => { navigate(pagePaths[next]); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (page === 'admin') return <AdminShell />;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F2EDE4' }}>
      <SeoManager page={page} localService={localService} />
      <Nav page={page} setPage={setPage} forceSolid={Boolean(localService)} />
      <main className="flex-1 pb-24 sm:pb-0">
        {localService ? <LocalServicePage config={localService} setPage={setPage} /> : page === 'home' && <Home setPage={setPage} />}
        <Suspense fallback={<RouteFallback />}>
          {page === 'cultures' && <DesignCultures setPage={setPage} />}
          {page === 'services' && <Services setPage={setPage} />}
          {page === 'story' && <OurStory setPage={setPage} />}
          {page === 'journal' && <Journal setPage={setPage} articleId={articleId} setArticleId={(id) => navigate(id ? `/journal/${id}` : '/journal')} />}
          {page === 'homes' && <Homes setPage={setPage} />}
          {page === 'project' && <StartProject setPage={setPage} />}
          {page === 'faq' && <FAQs setPage={setPage} />}
        </Suspense>
        {!localService && <EditorialContext page={page} />}
        {!localService && <ConversionBanner page={page} setPage={setPage} />}
      </main>
      <Footer setPage={setPage} />
      <WhatsApp />
      <MobileConversionBar setPage={setPage} />
    </div>
  );
}

const router = createBrowserRouter([{ path: '*', Component: SiteShell, errorElement: <RouteErrorElement /> }]);

export default function App() { return <SiteErrorBoundary><RouterProvider router={router} /></SiteErrorBoundary>; }
