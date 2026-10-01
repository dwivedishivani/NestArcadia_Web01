import RichArticleContent from '../common/RichArticleContent';

interface ArticlePreviewProps {
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  category: string;
  content: string;
  imageUrl?: string;
}

export default function ArticlePreview({ title, excerpt, author, readTime, category, content, imageUrl }: ArticlePreviewProps) {
  return (
    <article className="max-w-[900px] mx-auto">
      {imageUrl && <div className="overflow-hidden bg-[#D4CBBB] mb-8 aspect-[16/8]"><img src={imageUrl} alt="" className="w-full h-full object-cover" /></div>}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[#2D8C7E]">{category}</span>
        <span className="text-[#D4CBBB]">·</span>
        <span className="text-[13px] text-[#6B5E4E]">{readTime}</span>
      </div>
      <h1 className="font-display text-[clamp(2rem,5vw,4rem)] text-[#1A1714] leading-[1.08] mb-5">{title || 'Article title'}</h1>
      {excerpt && <p className="text-[16px] leading-[1.8] text-[#6B5E4E] border-b border-[#D4CBBB] pb-7 mb-9">{excerpt}</p>}
      <p className="text-[12px] text-[#6B5E4E] mb-10">By {author || 'Author'} · Preview</p>
      <RichArticleContent content={content} />
    </article>
  );
}
