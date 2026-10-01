import { useEffect, useRef, useState } from 'react';

interface RichArticleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const toolbar = [
  ['B', 'Bold', 'bold'], ['I', 'Italic', 'italic'], ['H2', 'Heading 2', 'h2'],
  ['H3', 'Heading 3', 'h3'], ['“', 'Blockquote', 'quote'], ['•', 'Bulleted list', 'ul'],
  ['1.', 'Numbered list', 'ol'], ['Link', 'Add link', 'link'], ['—', 'Divider', 'hr'],
  ['↶', 'Undo', 'undo'], ['↷', 'Redo', 'redo'],
] as const;

const fontOptions = [
  { label: 'DM Sans', value: 'DM Sans' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Arial', value: 'Arial' },
] as const;

const colorPresets = ['#1C3A5A', '#2D8C7E', '#6B5E4E', '#1A1714', '#C4915A', '#7A5C61'];

function plainTextToHtml(text: string) {
  return text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>`).join('');
}

export default function RichArticleEditor({ value, onChange, placeholder }: RichArticleEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const initializedRef = useRef(false);
  const [font, setFont] = useState('DM Sans');
  const [color, setColor] = useState('#1C3A5A');

  useEffect(() => {
    if (!editorRef.current || initializedRef.current) return;
    editorRef.current.innerHTML = /<\/?(p|h2|h3|blockquote|ul|ol|li|strong|em|a|hr|font)\b/i.test(value) ? value : plainTextToHtml(value);
    initializedRef.current = true;
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || !editorRef.current?.contains(selection.anchorNode)) return;
    selectionRef.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const range = selectionRef.current;
    if (!range) return;
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const emitChange = () => onChange(editorRef.current?.innerHTML || '');

  const run = (action: typeof toolbar[number][2]) => {
    editorRef.current?.focus();
    restoreSelection();

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

    saveSelection();
    emitChange();
  };

  const applyFont = (nextFont: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand('fontName', false, nextFont);
    setFont(nextFont);
    saveSelection();
    emitChange();
  };

  const applyColor = (nextColor: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand('foreColor', false, nextColor);
    setColor(nextColor);
    saveSelection();
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
    <div className="admin-rich-editor border border-[#C9BDAA] bg-[#F8F5EF] overflow-hidden shadow-sm">
      <div className="border-b border-[#C9BDAA] bg-[#E4DDD2] px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 mr-2">
            {toolbar.map(([label, title, action]) => (
              <button
                key={title}
                type="button"
                title={title}
                aria-label={title}
                onMouseDown={(event) => {
                  event.preventDefault();
                  saveSelection();
                }}
                onClick={() => run(action)}
                className={`admin-editor-tool ${action === 'bold' ? 'font-semibold' : action === 'italic' ? 'italic' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="h-7 w-px bg-[#C9BDAA] mx-1" />

          <label className="admin-editor-control" title="Font">
            <span className="admin-editor-control-label">Font</span>
            <select
              value={font}
              onMouseDown={saveSelection}
              onChange={(event) => applyFont(event.target.value)}
              className="admin-editor-select"
              aria-label="Font family"
            >
              {fontOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>

          <label className="admin-editor-control" title="Text colour">
            <span className="admin-editor-control-label">Colour</span>
            <input
              type="color"
              value={color}
              onMouseDown={saveSelection}
              onChange={(event) => applyColor(event.target.value)}
              className="admin-editor-color"
              aria-label="Text colour"
            />
          </label>

          <div className="flex items-center gap-1 ml-1">
            {colorPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                title={`Use ${preset}`}
                aria-label={`Use colour ${preset}`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  saveSelection();
                }}
                onClick={() => applyColor(preset)}
                className="h-5 w-5 rounded-full border border-white shadow-sm ring-1 ring-[#C9BDAA] hover:scale-110 transition-transform"
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>
        </div>
        <p className="text-[11px] text-[#6B5E4E] mt-2">
          Select text first, then use formatting. Font and colour apply to the selected text.
        </p>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={saveSelection}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onInput={emitChange}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        spellCheck
        className="rich-editor min-h-[460px] max-h-[760px] overflow-y-auto px-7 py-6 outline-none text-[17px] leading-[1.85] text-[#1A1714]"
      />
    </div>
  );
}
