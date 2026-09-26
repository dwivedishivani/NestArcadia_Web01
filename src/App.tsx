import { lazy, Suspense, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, useNavigate } from 'react-router';
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

const DesignCultures = lazy(() => import('./pages/DesignCultures/DesignCultures'));
const Services = lazy(() => import('./pages/Services/Services'));
const OurStory = lazy(() => import('./pages/OurStory/OurStory'));
const Journal = lazy(() => import('./pages/Journal/Journal'));
const JournalArticle = lazy(() => import('./pages/Journal/Journal'));
const Homes = lazy(() => import('./pages/Homes/Homes'));
const StartProject = lazy(() => import('./pages/StartProject/StartProject'));
const FAQs = lazy(() => import('./pages/FAQs/FAQs'));

export type Page = 'home' | 'cultures' | 'services' | 'story' | 'journal' | 'homes' | 'project' | 'faq' | 'admin';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-078be9eb`;

const SITE_URL = 'https://nestarcadia.com';
const SOCIAL_IMAGE = 'https://images.unsplash.com/photo-1603901622056-0a5bee231395?w=1200&h=630&fit=crop&auto=format&q=85';
type FaqItem = [string, string];

const homeFaqSchema: FaqItem[] = [
  ['Which areas does NestArcadia serve?', 'NestArcadia serves Noida, Greater Noida, Greater Noida West, Delhi, Gurgaon, Faridabad and Ghaziabad for residential and commercial interior design projects.'],
  ['Do you design 2BHK, 3BHK and 4BHK interiors?', 'Yes. We plan and execute interiors for 2BHK, 3BHK and 4BHK apartments, as well as villas, farmhouses and commercial offices. Every project is tailored to the layout, lifestyle and budget.'],
  ['What services are included in a turnkey interior project?', 'Turnkey projects can include space planning, 3D visualisation, material selection, modular and custom furniture, lighting, decor, site coordination and final handover.'],
  ['When should I contact an interior designer?', 'Ideally, contact us before possession or before any civil work begins. Early planning gives more flexibility for electrical points, storage, lighting, kitchen layout and material decisions.'],
];

const pagePaths: Record<Page, string> = {
  home: '/',
  cultures: '/design-cultures',
  services: '/interior-design-services',
  story: '/our-story',
  journal: '/journal',
  homes: '/homes',
  project: '/start-your-project',
  faq: '/faqs',
  admin: '/admin',
};

const pageMeta: Record<Page, { title: string; description: string }> = {
  home: { title: 'NestArcadia | Interior Designers in Noida & Greater Noida', description: 'NestArcadia creates heritage-inspired, contemporary interiors for 2BHK, 3BHK, 4BHK apartments, villas and farmhouses in Noida, Greater Noida, Greater Noida West and NCR.' },
  cultures: { title: 'Indian Design Cultures for Modern Homes', description: 'Discover how North, South, East, West and Central Indian design traditions shape contemporary homes in Noida, Greater Noida and NCR.' },
  services: { title: 'Interior Design & Turnkey Services in Noida', description: 'Interior design, turnkey execution, custom furniture, Vastu-led planning and decor services for homes in Noida, Greater Noida West, Delhi, Gurgaon, Faridabad and Ghaziabad.' },
  story: { title: 'Our Story | Ancient Craft, Modern Indian Interiors', description: 'Meet NestArcadia, an interior design studio translating India’s material heritage into homes made for modern living.' },
  journal: { title: 'Interior Design Journal for Noida & Greater Noida Homes', description: 'Practical design ideas for 2BHK, 3BHK and 4BHK homes in Noida, Greater Noida and Greater Noida West — from materials and space planning to site execution.' },
  homes: { title: 'Interior Design Portfolio | Homes in NCR', description: 'Explore NestArcadia’s modern Indian interior design portfolio: apartments, villas and family homes shaped with craft and contemporary comfort.' },
  project: { title: 'Start Your Interior Design Project in Noida & NCR', description: 'Talk to NestArcadia about your 2BHK, 3BHK, 4BHK, villa or farmhouse interior project in Noida, Greater Noida, Greater Noida West and NCR.' },
  faq: { title: 'Interior Design FAQs | Greater Noida West, Noida & NCR', description: 'Answers to common questions about 2BHK, 3BHK and 4BHK interior design, modular kitchens, turnkey execution, Vastu planning and commercial interiors in NCR.' },
  admin: { title: 'Admin Dashboard', description: 'NestArcadia admin dashboard for managing content and enquiries.' },
};

function pageFromPath(pathname: string): Page {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/design-cultures')) return 'cultures';
  if (pathname.startsWith('/interior-design-services')) return 'services';
  if (pathname.startsWith('/our-story')) return 'story';
  if (pathname.startsWith('/journal')) return 'journal';
  if (pathname.startsWith('/homes')) return 'homes';
  if (pathname.startsWith('/start-your-project')) return 'project';
  if (pathname.startsWith('/faqs')) return 'faq';
  return 'home';
}

function SeoManager({ page }: { page: Page }) {
  const location = useLocation();
  const articleSlug = page === 'journal' ? location.pathname.match(/^\/journal\/([^/]+)\/?$/)?.[1] : undefined;
  const [article, setArticle] = useState<{ id: string; title: string; excerpt: string; img: string; category: string; author: string } | null>(null);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(homeFaqSchema);

  useEffect(() => {
    let active = true;
    if (!articleSlug) { setArticle(null); return; }
    import('./pages/Journal/Journal').then(({ getJournalArticle }) => {
      if (active) setArticle(getJournalArticle(articleSlug) ?? null);
    });
    return () => { active = false; };
  }, [articleSlug]);

  useEffect(() => {
    let active = true;
    if (page !== 'faq') { setFaqItems(homeFaqSchema); return; }
    import('./pages/FAQs/FAQs').then(({ faqGroups }) => {
      if (active) setFaqItems(faqGroups.flatMap((group) => group.items) as FaqItem[]);
    });
    return () => { active = false; };
  }, [page]);

  useEffect(() => {
    const pathname = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '');
    const activeArticle = article?.id === articleSlug ? article : undefined;
    const meta = activeArticle
      ? { title: `${activeArticle.title} | NestArcadia Journal`, description: activeArticle.excerpt, image: activeArticle.img, type: 'article' }
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
    setMeta('geo.placename', 'Greater Noida West, Noida, Greater Noida');
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
    const businessSchema = { '@type': 'ProfessionalService', name: 'NestArcadia', url: SITE_URL, image: SOCIAL_IMAGE, description: meta.description, serviceType: ['Interior Design', 'Turnkey Interior Execution', 'Custom Furniture Design', 'Commercial Office Interior Design'], areaServed: ['Noida', 'Greater Noida', 'Greater Noida West', 'Delhi', 'Gurgaon', 'Faridabad', 'Ghaziabad'], sameAs: ['https://www.instagram.com/nestarcadia/', 'https://www.facebook.com/people/Nest-Arcadia/61577890484320/', 'https://www.linkedin.com/company/nest-arcadia', 'https://www.youtube.com/@NestArcadiaOfficial'] };
    const publisher = { '@type': 'Organization', name: 'NestArcadia', url: SITE_URL, logo: { '@type': 'ImageObject', url: new URL(logoImg, SITE_URL).toString() } };
    const articleSchema = activeArticle && { '@type': 'BlogPosting', headline: activeArticle.title, description: activeArticle.excerpt, image: activeArticle.img, author: { '@type': 'Person', name: activeArticle.author }, publisher, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }, articleSection: activeArticle.category };
    const breadcrumbSchema = activeArticle && { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/journal` },
      { '@type': 'ListItem', position: 3, name: activeArticle.title, item: canonical },
    ] };
    const visibleFaqs = page === 'home' ? homeFaqSchema : faqItems;
    schema.textContent = JSON.stringify(articleSchema
      ? { '@context': 'https://schema.org', '@graph': [businessSchema, articleSchema, breadcrumbSchema] }
      : ((page === 'home' || page === 'faq')
        ? { '@context': 'https://schema.org', '@graph': [businessSchema, { '@type': 'FAQPage', mainEntity: visibleFaqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) }] }
        : { '@context': 'https://schema.org', ...businessSchema }));
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
      page_type: page,
      content_group: page === 'journal' && location.pathname !== '/journal' ? 'journal_article' : page,
    });
  }, [location.pathname, page, article, articleSlug, faqItems]);
  return null;
}

declare global { interface Window { dataLayer?: Record<string, unknown>[] } }

function RouteFallback() {
  return <div className="min-h-[52vh] animate-pulse bg-[#F2EDE4] px-6 pt-36 lg:px-20"><div className="mx-auto h-3 w-28 bg-[#D4CBBB]" /><div className="mx-auto mt-6 h-12 max-w-xl bg-[#EAE4DA]" /><div className="mx-auto mt-10 h-64 max-w-[1440px] bg-[#EAE4DA]" /></div>;
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
  const articleId = location.pathname.startsWith('/journal/') ? location.pathname.split('/')[2] : undefined;
  const setPage = (next: Page) => { navigate(pagePaths[next]); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Admin page has its own shell
  if (page === 'admin') {
    return <AdminShell />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F2EDE4' }}>
      <SeoManager page={page} />
      <Nav page={page} setPage={setPage} />
      <main className="flex-1 pb-16 sm:pb-0">
        {page === 'home' && <Home setPage={setPage} />}
        <Suspense fallback={<RouteFallback />}>
          {page === 'cultures' && <DesignCultures setPage={setPage} />}
          {page === 'services' && <Services setPage={setPage} />}
          {page === 'story' && <OurStory setPage={setPage} />}
          {page === 'journal' && (articleId ? <JournalArticle setPage={setPage} articleId={articleId} setArticleId={(id) => navigate(id ? `/journal/${id}` : '/journal')} /> : <Journal setPage={setPage} articleId={articleId} setArticleId={(id) => navigate(id ? `/journal/${id}` : '/journal')} />)}
          {page === 'homes' && <Homes setPage={setPage} />}
          {page === 'project' && <StartProject setPage={setPage} />}
          {page === 'faq' && <FAQs setPage={setPage} />}
        </Suspense>
        <EditorialContext page={page} />
        <ConversionBanner page={page} setPage={setPage} />
      </main>
      <Footer setPage={setPage} />
      <WhatsApp />
      <MobileConversionBar setPage={setPage} />
    </div>
  );
}

const router = createBrowserRouter([{ path: '*', Component: SiteShell }]);

export default function App() { return <RouterProvider router={router} />; }
