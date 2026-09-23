import React, { useEffect, useRef, useCallback } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { InlineMathText } from './InlineMathText';
import { WorksheetBlock } from '../../../types/worksheet';

export interface WysiwygMathDocumentEditorProps {
  text: string;
  onChange: (newText: string) => void;
  styles: WorksheetBlock['styles'];
  isArabic?: boolean;
  onRegisterInsertHandler?: (handler: (formula: string) => void) => void;
  onOpenMathModal?: () => void;
}

/**
 * Creates an atomic HTML DOM node for an inline math formula with homogeneous styling (Capture 2)
 */
function createMathDomNode(latex: string): HTMLElement {
  const clean = latex.trim().replace(/^\$\$?/, '').replace(/\$\$?$/, '').trim();
  const wrapper = document.createElement('span');
  wrapper.className =
    'inline-math-token inline-flex items-baseline align-baseline select-none mx-0.5 cursor-default';
  wrapper.setAttribute('contenteditable', 'false');
  wrapper.setAttribute('data-latex', clean);
  wrapper.style.unicodeBidi = 'isolate';
  wrapper.style.direction = 'ltr';

  // Render using standard homogeneous InlineMathText vector markup
  const renderedHtml = renderToStaticMarkup(<InlineMathText text={`$${clean}$`} />);
  wrapper.innerHTML = renderedHtml;

  return wrapper;
}

/**
 * Serializes the contenteditable DOM tree into a clean standard LaTeX text string
 */
function serializeEditorToText(root: HTMLElement): string {
  let result = '';

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.nodeValue || '';
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      // Inline math token element
      if (el.getAttribute('data-latex') !== null) {
        const latex = el.getAttribute('data-latex') || '';
        result += `$${latex}$`;
        return;
      }

      // Line breaks
      if (el.tagName === 'BR') {
        result += '\n';
        return;
      }

      // Block-level division (e.g. from pressing Enter)
      const isBlock = ['DIV', 'P'].includes(el.tagName);
      if (isBlock && result.length > 0 && !result.endsWith('\n')) {
        result += '\n';
      }

      for (let i = 0; i < el.childNodes.length; i++) {
        walk(el.childNodes[i]);
      }
    }
  };

  for (let i = 0; i < root.childNodes.length; i++) {
    walk(root.childNodes[i]);
  }

  return result;
}

/**
 * Populates the contenteditable DOM tree from a raw text containing $formula$ tokens
 */
function populateEditorFromText(root: HTMLElement, rawText: string) {
  root.innerHTML = '';
  if (!rawText) return;

  const lines = rawText.split('\n');

  lines.forEach((line, lIdx) => {
    if (lIdx > 0) {
      root.appendChild(document.createElement('br'));
    }

    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIdx) {
        const plainText = line.substring(lastIdx, match.index);
        root.appendChild(document.createTextNode(plainText));
      }

      const rawFormula = match[0];
      const cleanFormula = rawFormula.startsWith('$$')
        ? rawFormula.slice(2, -2).trim()
        : rawFormula.slice(1, -1).trim();

      const mathNode = createMathDomNode(cleanFormula);
      root.appendChild(mathNode);

      lastIdx = match.index + rawFormula.length;
    }

    if (lastIdx < line.length) {
      root.appendChild(document.createTextNode(line.substring(lastIdx)));
    }
  });
}

export const WysiwygMathDocumentEditor: React.FC<WysiwygMathDocumentEditorProps> = ({
  text,
  onChange,
  styles,
  isArabic = false,
  onRegisterInsertHandler,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastSerializedTextRef = useRef<string>(text);
  const savedRangeRef = useRef<Range | null>(null);

  const effectiveDirection = styles.textDirection || (isArabic ? 'rtl' : 'ltr');
  const textAlign = styles.textAlign || (effectiveDirection === 'rtl' ? 'right' : 'left');

  // Populate editor DOM initially or when external text changes
  useEffect(() => {
    if (editorRef.current && text !== lastSerializedTextRef.current) {
      lastSerializedTextRef.current = text;
      populateEditorFromText(editorRef.current, text);
    }
  }, [text]);

  // Initial population on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.childNodes.length === 0) {
      populateEditorFromText(editorRef.current, text);
    }
  }, []);

  // Save selection range on cursor move or selection change
  const saveCurrentSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  // Formula insertion directly at the cursor position
  const insertMathFormula = useCallback(
    (rawFormula: string) => {
      const cleanFormula = rawFormula.trim().replace(/^\$\$?/, '').replace(/\$\$?$/, '').trim();
      if (!cleanFormula) return;

      const editor = editorRef.current;
      if (!editor) return;

      editor.focus();

      // Retrieve or create selection range
      let range = savedRangeRef.current;
      const sel = window.getSelection();

      if (!range || !editor.contains(range.commonAncestorContainer)) {
        range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false); // End of editor
      }

      // Create homogeneous math token node
      const mathNode = createMathDomNode(cleanFormula);

      // Insert at cursor
      range.deleteContents();
      range.insertNode(mathNode);

      // Place cursor right after inserted math token
      const afterSpace = document.createTextNode('\u00A0'); // non-breaking space for smooth typing
      if (mathNode.nextSibling) {
        editor.insertBefore(afterSpace, mathNode.nextSibling);
      } else {
        editor.appendChild(afterSpace);
      }

      if (sel) {
        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(afterSpace);
        newRange.collapse(true);
        sel.addRange(newRange);
        savedRangeRef.current = newRange;
      }

      // Trigger change
      const serialized = serializeEditorToText(editor);
      lastSerializedTextRef.current = serialized;
      onChange(serialized);
    },
    [onChange]
  );

  // Register insertion callback with parent toolbar
  useEffect(() => {
    if (onRegisterInsertHandler) {
      onRegisterInsertHandler(insertMathFormula);
    }
  }, [onRegisterInsertHandler, insertMathFormula]);

  // Native input handling
  const handleInput = () => {
    if (!editorRef.current) return;
    saveCurrentSelection();
    const serialized = serializeEditorToText(editorRef.current);
    lastSerializedTextRef.current = serialized;
    onChange(serialized);
  };

  // Handle keyboard events (Backspace, Enter, Shortcuts)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // 1. Backspace: support deleting inline math tokens like single characters
    if (e.key === 'Backspace') {
      const sel = window.getSelection();
      if (sel && sel.isCollapsed && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const startContainer = range.startContainer;
        const startOffset = range.startOffset;

        // If cursor is at start of text node and previous sibling is math token
        if (startContainer.nodeType === Node.TEXT_NODE && startOffset === 0) {
          const prev = startContainer.previousSibling;
          if (prev && (prev as HTMLElement).classList?.contains('inline-math-token')) {
            e.preventDefault();
            prev.parentNode?.removeChild(prev);
            handleInput();
            return;
          }
        }

        // If cursor is in element and preceding child is math token
        if (startContainer.nodeType === Node.ELEMENT_NODE && startOffset > 0) {
          const prev = startContainer.childNodes[startOffset - 1];
          if (prev && (prev as HTMLElement).classList?.contains('inline-math-token')) {
            e.preventDefault();
            prev.parentNode?.removeChild(prev);
            handleInput();
            return;
          }
        }
      }
    }

    // 2. Enter: standard line break
    if (e.key === 'Enter' && !e.shiftKey) {
      // standard contenteditable handles Enter naturally
    }
  };

  return (
    <div className="w-full relative">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={saveCurrentSelection}
        onMouseUp={saveCurrentSelection}
        dir={effectiveDirection}
        data-placeholder={
          isArabic
            ? 'اكتب نص التمرين أو المسألة هنا...'
            : 'Cliquez ici pour rédiger le texte ou le problème...'
        }
        className="w-full min-h-[44px] p-2 bg-transparent outline-none leading-relaxed transition-all focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:italic"
        style={{
          fontFamily: styles.fontFamily || (isArabic ? 'Cairo, sans-serif' : 'Outfit, sans-serif'),
          fontSize: `${styles.fontSize || 15}px`,
          fontWeight: styles.fontWeight || 'normal',
          fontStyle: styles.fontStyle || 'normal',
          textDecoration: styles.textDecoration || 'none',
          textAlign,
          color: styles.color || '#0f172a',
          lineHeight: styles.lineHeight || 1.6,
        }}
      />
    </div>
  );
};
