import { Component, lazy, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, useNavigate, useRouteError } from 'react-router';
import Nav from './components/navigation/Nav';
import Footer from './components/layout/Footer';
import WhatsApp from './components/layout/WhatsApp';
import MobileConversionBar from './components/layout/MobileConversionBar';
const Home = lazy(() => import('./pages/Home/Home'));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
import EditorialContext from './components/common/EditorialContext';
import ConversionBanner from './components/common/ConversionBanner';
import logoImg from './assets/images/branding/nestarcadia-logo-transparent.png';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { getLocalServicePage, type LocalServiceConfig, default as LocalServicePage } from './pages/LocalService/LocalServicePage';
import { setSiteImageOverrides } from './utils/siteImages';

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
const SOCIAL_IMAGE = 'https://etmrhxapfvyaispuvnft.supabase.co/storage/v1/object/public/site-images/site/shared-interior-design-001.jpg';

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
  home: { title: 'NestArcadia | Interior Designers in Greater Noida West & Noida', description: 'NestArcadia creates heritage-inspired, contemporary interiors for 2BHK, 3BHK, 4BHK apartments, villas and farmhouses in Noida, Greater Noida, Greater Noida West and NCR.' },
  cultures: { title: 'Indian Design Cultures for Modern Homes', description: 'Discover how North, South, East, West and Central Indian design traditions shape contemporary homes in Noida, Greater Noida and NCR.' },
  services: { title: 'Interior Design Services in Noida, Greater Noida & NCR', description: 'Residential and commercial interior design, turnkey execution, custom furniture, Vastu-led planning and decor for Noida, Greater Noida West, Noida Extension, Ghaziabad, Faridabad, Delhi and Gurugram.' },
  story: { title: 'Our Story | Ancient Craft, Modern Indian Interiors', description: 'Meet NestArcadia, an interior design studio translating India’s material heritage into homes made for modern living.' },
  journal: { title: 'Interior Design Journal for Noida & Greater Noida Homes', description: 'Practical design ideas for 2BHK, 3BHK and 4BHK homes in Noida, Greater Noida and Greater Noida West — from materials and space planning to site execution.' },
  homes: { title: 'Our Projects | NestArcadia Interior Design', description: 'Explore NestArcadia’s selected interior design projects and residential design studies across India.' },
  project: { title: 'Start an Interior Design Project in Noida & NCR', description: 'Talk to NestArcadia about a 2BHK, 3BHK, 4BHK, villa, farmhouse, office or commercial interior project in Noida, Greater Noida, Greater Noida West and NCR.' },
  faq: { title: 'Interior Design Cost, Services & FAQs | Noida & NCR', description: 'Answers about 2BHK and 3BHK interior design, costs, modular kitchens, turnkey execution, Vastu planning and commercial interiors across Noida, Greater Noida and NCR.' },
  admin: { title: 'Admin Dashboard', description: 'NestArcadia admin dashboard for managing content and enquiries.' },
};

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\\/+$/, '');
  return normalized || '/';
}

function pageFromPath(pathname: string): Page {
  const path = normalizePathname(pathname);
  if (path === '/admin') return 'admin';
  if (path === '/design-cultures') return 'cultures';
  if (path === '/interior-design-services') return 'services';
  if (path === '/our-story') return 'story';
  if (path === '/journal' || path.startsWith('/journal/')) return 'journal';
  if (path === '/our-projects') return 'homes';
  if (path === '/start-your-project') return 'project';
  if (path === '/faqs') return 'faq';
  return 'home';
}

function isKnownPath(pathname: string) {
  const path = normalizePathname(pathname);
  if (path === '/') return true;
  if (path === '/admin') return true;
  if (path === '/design-cultures') return true;
  if (path === '/interior-design-services') return true;
  if (path === '/our-story') return true;
  if (path === '/journal' || path.startsWith('/journal/')) return true;
  if (path === '/our-projects') return true;
  if (path === '/start-your-project') return true;
  if (path === '/faqs') return true;
  return Boolean(getLocalServicePage(path));
}

function SeoManager({ page, localService }: { page: Page; localService?: LocalServiceConfig | null }) {
  const location = useLocation();
  const articleSlug = page === 'journal' ? location.pathname.match(/^\/journal\/([^/]+)\/?$/)?.[1] : undefined;
  const [article, setArticle] = useState<{ id: string; title: string; excerpt: string; img: string; category: string; author: string; publishedAt: string | null; modifiedAt: string | null } | null>(null);
  const [articleMetaLoaded, setArticleMetaLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    if (!articleSlug) {
      setArticle(null);
      setArticleMetaLoaded(false);
      return;
    }
    setArticleMetaLoaded(false);
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
            if (active) {
              setArticle({
                id: row.slug || articleSlug,
                title: row.title || 'NestArcadia Journal',
                excerpt: row.excerpt || '',
                img: row.image_url || SOCIAL_IMAGE,
                category: row.category || 'Journal',
                author: row.author || 'NestArcadia',
                publishedAt: row.published_at || row.created_at || null,
                modifiedAt: row.updated_at || row.published_at || row.created_at || null,
              });
              setArticleMetaLoaded(true);
            }
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
        setArticleMetaLoaded(true);
      });
    };
    loadArticleMeta();
    return () => { active = false; };
  }, [articleSlug]);

  useEffect(() => {
    const pathname = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '');
    const activeArticle = article?.id === articleSlug ? article : undefined;
    const invalidJournalArticle = Boolean(articleSlug) && articleMetaLoaded && !activeArticle;
    const meta = localService
      ? { title: localService.title + ' | NestArcadia', description: localService.description, image: SOCIAL_IMAGE, type: 'website' }
      : activeArticle
        ? { title: activeArticle.title + ' | NestArcadia Journal', description: activeArticle.excerpt, image: activeArticle.img, type: 'article' }
        : invalidJournalArticle
          ? { title: 'Page not found | NestArcadia', description: 'The journal article you requested does not exist on NestArcadia.', image: SOCIAL_IMAGE, type: 'website' }
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
    setMeta('robots', invalidJournalArticle ? 'noindex, nofollow, noarchive' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
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
    const businessSchema = { '@type': 'ProfessionalService', name: 'NestArcadia', alternateName: ['Nest Arcadia', 'Nest Arcadia Interiors', 'Nest Arcadia Noida'], url: SITE_URL, telephone: '+918448061997', contactPoint: { '@type': 'ContactPoint', telephone: '+918448061997', contactType: 'customer service', areaServed: 'IN' }, image: SOCIAL_IMAGE, description: meta.description, serviceType: ['Interior Design', 'Turnkey Interior Execution', 'Custom Furniture Design', 'Commercial Office Interior Design'], areaServed: ['Greater Noida West', 'Noida Extension', 'Greater Noida', 'Noida', 'Ghaziabad', 'Indirapuram', 'Crossing Republik', 'Faridabad', 'Delhi', 'East Delhi', 'South Delhi', 'Gurugram', 'Dadri', 'Jewar', 'Yamuna Expressway', 'Delhi NCR'], sameAs: ['https://www.instagram.com/nestarcadia/', 'https://www.facebook.com/people/Nest-Arcadia/61577890484320/', 'https://www.linkedin.com/company/nest-arcadia', 'https://www.youtube.com/@NestArcadiaOfficial'] };
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
        { '@type': 'Question', name: 'How much does a 2BHK or 3BHK interior cost in Greater Noida West?', acceptedAnswer: { '@type': 'Answer', text: 'For a raw or newly handed-over apartment, a complete interior project typically starts around ₹6.5–7 lakh for a 2BHK and ₹9–10 lakh for a 3BHK. If flooring, electrical or some civil work is already completed, the cost can be lower. More customised furniture, premium materials or extensive décor can increase the budget depending on the scope.' } },
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

    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pathname,
      send_to: 'G-LDM2YL1MP5',
    });
  }, [location.pathname, page, article, articleSlug, articleMetaLoaded, localService]);
  return null;
}

declare global { interface Window { dataLayer?: Record<string, unknown>[] } }

function NotFoundPage() {
  const location = useLocation();

  useEffect(() => {
    const pathname = normalizePathname(location.pathname);
    const canonical = `${SITE_URL}${pathname}`;
    document.title = 'Page not found | NestArcadia';

    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(property ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    setMeta('description', 'The page you requested does not exist on NestArcadia.');
    setMeta('robots', 'noindex, nofollow, noarchive');
    setMeta('og:title', 'Page not found | NestArcadia', true);
    setMeta('og:description', 'The page you requested does not exist on NestArcadia.', true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', canonical, true);
    setMeta('og:image', SOCIAL_IMAGE, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', 'Page not found | NestArcadia');
    setMeta('twitter:description', 'The page you requested does not exist on NestArcadia.');
    setMeta('twitter:image', SOCIAL_IMAGE);

    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;

    const schema = document.getElementById('nestarcadia-schema');
    if (schema) schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Page not found | NestArcadia',
      url: canonical,
    });
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] bg-[#F2EDE4] px-6 py-32 text-center text-[#1A1714]">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#2D8C7E] mb-5">NestArcadia</p>
      <h1 className="font-display text-5xl mb-5">Page not found.</h1>
      <p className="text-[#6B5E4E] mb-8">The page you requested does not exist.</p>
      <a href="/" className="inline-block bg-[#1C3A5A] text-white px-6 py-3 text-sm font-semibold">Return Home</a>
    </div>
  );
}

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

function ConsentManager() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nestarcadia_consent_v2');
    if (!stored) {
      setVisible(true);
      return;
    }
    const granted = stored === 'granted';
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }, []);

  const saveConsent = (granted: boolean) => {
    localStorage.setItem('nestarcadia_consent_v2', granted ? 'granted' : 'denied');
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
    });
    setSettingsOpen(false);
    setVisible(false);
  };

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => { setVisible(true); setSettingsOpen(true); }}
        className="fixed bottom-4 left-4 z-[100] rounded-full border border-[#C9BDAA] bg-[#F8F5EF]/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1C3A5A] shadow-sm backdrop-blur-sm hover:bg-white"
        aria-label="Open privacy choices"
      >
        Privacy choices
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:px-5 sm:pb-5" role="dialog" aria-label="Privacy and cookie choices">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#C9BDAA] bg-[#F8F5EF] p-5 shadow-2xl sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2D8C7E]">Privacy choices</p>
            <h2 className="font-display text-xl text-[#1C3A5A] sm:text-2xl">A little control stays with you.</h2>
            <p className="mt-2 text-sm leading-6 text-[#52677E]">
              NestArcadia uses Google Analytics and Google Ads to understand site usage and measure enquiries. You can allow these measurement and advertising technologies or keep them disabled.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:min-w-[220px]">
            <button type="button" onClick={() => saveConsent(true)} className="rounded-full bg-[#1C3A5A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2D8C7E]">Accept all</button>
            <button type="button" onClick={() => saveConsent(false)} className="rounded-full border border-[#1C3A5A] px-5 py-3 text-sm font-semibold text-[#1C3A5A] transition-colors hover:bg-white">Reject non-essential</button>
            <button type="button" onClick={() => setSettingsOpen((value) => !value)} className="text-xs font-medium text-[#52677E] underline underline-offset-4">{settingsOpen ? 'Hide details' : 'What is being used?'}</button>
          </div>
        </div>
        {settingsOpen && (
          <div className="mt-5 grid gap-3 border-t border-[#D4CBBB] pt-5 text-xs leading-5 text-[#52677E] sm:grid-cols-2">
            <div><strong className="text-[#1C3A5A]">Essential:</strong> required for the website to function and cannot be switched off here.</div>
            <div><strong className="text-[#1C3A5A]">Analytics:</strong> Google Analytics helps us understand visits, engagement and page performance.</div>
            <div><strong className="text-[#1C3A5A]">Advertising:</strong> Google Ads measurement helps us understand campaign performance and enquiries.</div>
            <div><strong className="text-[#1C3A5A]">Your choice:</strong> you can reopen Privacy choices at any time from the button at the bottom-left.</div>
          </div>
        )}
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
    return <Suspense fallback={<RouteFallback />}><AdminLogin onLogin={handleLogin} error={loginError} loading={loginLoading} /></Suspense>;
  }
  return <Suspense fallback={<RouteFallback />}><AdminDashboard adminPassword={adminPassword} onLogout={handleLogout} /></Suspense>;
}


function SiteShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const normalizedPath = normalizePathname(location.pathname);
  const page = pageFromPath(normalizedPath);
  const localService = getLocalServicePage(normalizedPath);
  if (!isKnownPath(normalizedPath)) return <NotFoundPage />;
  const articleId = normalizedPath.startsWith('/journal/') ? normalizedPath.split('/')[2] : undefined;
  const setPage = (next: Page) => { navigate(pagePaths[next]); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (page === 'admin') return <AdminShell />;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F2EDE4' }}>
      <SeoManager page={page} localService={localService} />
      <ConsentManager />
      <Nav page={page} forceSolid={Boolean(localService)} />
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
      <Footer />
      <WhatsApp />
      <MobileConversionBar setPage={setPage} />
    </div>
  );
}

const router = createBrowserRouter([{ path: '*', Component: SiteShell, errorElement: <RouteErrorElement /> }]);

function SiteImageBootstrap() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/site-media/images`, {
      headers: { apikey: publicAnonKey, Authorization: `Bearer ${publicAnonKey}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Image registry unavailable'))))
      .then((payload) => {
        setSiteImageOverrides(payload.data || []);
        setVersion((value) => value + 1);
      })
      .catch((error) => console.warn('Site image registry unavailable; using local image fallbacks.', error));
  }, []);

  return <RouterProvider router={router} />;
}

export default function App() { return <SiteErrorBoundary><SiteImageBootstrap /></SiteErrorBoundary>; }
