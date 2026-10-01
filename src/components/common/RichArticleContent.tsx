function sanitizeHtml(html: string) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const allowed = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'H2', 'H3', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A', 'HR', 'FONT', 'H4']);
  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT);
  const elements: Element[] = [];
  while (walker.nextNode()) elements.push(walker.currentNode as Element);

  elements.forEach((element) => {
    if (!allowed.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      if (element.tagName === 'A' && attribute.name === 'href') {
        const value = attribute.value.trim();
        if (!/^https?:\/\//i.test(value) && !/^\//.test(value)) element.removeAttribute(attribute.name);
      } else if (element.tagName === 'FONT' && (attribute.name === 'color' || attribute.name === 'face')) {
        const value = attribute.value.trim();
        const safeColor = /^#[0-9a-f]{6}$/i.test(value) || /^(rgb|rgba)\([\d\s%,.]+\)$/i.test(value);
        const safeFace = /^(DM Sans|Playfair Display|Georgia|Arial)$/i.test(value);
        if ((attribute.name === 'color' && !safeColor) || (attribute.name === 'face' && !safeFace)) {
          element.removeAttribute(attribute.name);
        }
      } else if (element.tagName === 'P' && attribute.name === 'class') {
        if (!/^(editor-lead|editor-small)$/.test(attribute.value.trim())) element.removeAttribute(attribute.name);
      } else {
        element.removeAttribute(attribute.name);
      }
    });

    if (element.tagName === 'A' && element.getAttribute('href')) {
      element.setAttribute('target', '_blank');
      element.setAttribute('rel', 'noopener noreferrer');
    }
  });
  return template.innerHTML;
}

function looksLikeRichHtml(value: string) {
  return /<\/(p|h2|h3|h4|blockquote|ul|ol|li|strong|b|em|i|font)>|<(hr)\b/i.test(value);
}

function legacyParagraphs(value: string) {
  return value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export default function RichArticleContent({ content, className = '' }: { content: string; className?: string }) {
  if (!content?.trim()) return null;
  if (looksLikeRichHtml(content)) {
    return <div className={`rich-article-content ${className}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />;
  }
  return (
    <div className={`rich-article-content ${className}`}>
      {legacyParagraphs(content).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </div>
  );
}
