import { useEffect, useRef } from 'react';

interface RichArticleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const toolbar = [
  ['B', 'Bold', 'bold'], ['I', 'Italic', 'italic'], ['H2', 'Heading 2', 'h2'],
  ['H3', 'Heading 3', 'h3'], ['“', 'Blockquote', 'quote'], ['• List', 'Bulleted list', 'ul'],
  ['1. List', 'Numbered list', 'ol'], ['Link', 'Add link', 'link'], ['—', 'Divider', 'hr'],
  ['↶', 'Undo', 'undo'], ['↷', 'Redo', 'redo'],
] as const;

function plainTextToHtml(text: string) {
  return text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>`).join('');
}

export default function RichArticleEditor({ value, onChange, placeholder }: RichArticleEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current || initializedRef.current) return;
    editorRef.current.innerHTML = /<\/?(p|h2|h3|blockquote|ul|ol|li|strong|em|a|hr)\b/i.test(value) ? value : plainTextToHtml(value);
    initializedRef.current = true;
  }, [value]);

  const emitChange = () => onChange(editorRef.current?.innerHTML || '');

  const run = (action: typeof toolbar[number][2]) => {
    editorRef.current?.focus();
    if (action === 'link') {
      const url = window.prompt('Enter URL');
      if (!url) return;
      document.execCommand('createLink', false, url);
    } else if (action === 'h2') document.execCommand('formatBlock', false, 'H2');
    else if (action === 'h3') document.execCommand('formatBlock', false, 'H3');
    else if (action === 'quote') document.execCommand('formatBlock', false, 'BLOCKQUOTE');
    else if (action === 'ul') document.execCommand('insertUnorderedList', false);
    else if (action === 'ol') document.execCommand('insertOrderedList', false);
    else if (action === 'hr') document.execCommand('insertHorizontalRule', false);
    else document.execCommand(action, false);
    emitChange();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const plainText = event.clipboardData.getData('text/plain');
    if (!plainText) return;
    event.preventDefault();
    document.execCommand('insertHTML', false, plainTextToHtml(plainText));
    emitChange();
  };

  return (
    <div className="border border-[#D4CBBB] bg-[#F2EDE4] overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#D4CBBB] bg-[#EAE4DA]">
        {toolbar.map(([label, title, action]) => (
          <button key={title} type="button" title={title} onMouseDown={(event) => event.preventDefault()} onClick={() => run(action)}
            className="min-w-8 h-8 px-2 text-[11px] text-[#1A1714] border border-transparent hover:border-[#D4CBBB] hover:bg-[#F2EDE4]">
            {label}
          </button>
        ))}
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={emitChange} onPaste={handlePaste}
        data-placeholder={placeholder} className="rich-editor min-h-[420px] max-h-[720px] overflow-y-auto px-5 py-5 outline-none text-[15px] leading-[1.9] text-[#1A1714]" />
    </div>
  );
}
