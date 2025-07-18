import React, { useState } from 'react';
import { AccordionItem } from 'alps-library/molecules/components/accordion/AccordionItem';
import { Blockquote } from 'alps-library/atoms/text/Blockquote';
import { LessonDays } from '../../utils/LessonUtils';
import { VerseLink } from './VerseLink';

// Props for LessonDay
interface LessonDayProps {
  day: LessonDays;
  isOpen: boolean;
}

export const LessonDay = ({ day, isOpen }: LessonDayProps) => {
  // Robust HTML-to-React rendering with inline verse link replacement
  function renderContent(html: string, bible: LessonDays['bible'] = []) {
    const parts = html.split(/<blockquote>|<\/blockquote>/i);
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        // Optimized blockquote logic: first <p> becomes <h3>, rest as <p>, others as normal
        let doc: HTMLElement | null = null;
        try {
          const parser = new window.DOMParser();
          const docEl = parser.parseFromString(
            `<body>${part}</body>`,
            'text/html'
          );
          doc = docEl.body;
        } catch {
          return part;
        }
        if (!doc) return part;
        // Improved: after <h3>, group all text and inline elements (including <a>) into a single <p>, block elements break the paragraph
        let firstP = true;
        let key = 0;
        const blocks = [];
        let afterH3Inline: React.ReactNode[] = [];
        let afterH3 = false;
        // Helper: check if tag is inline
        const isInlineTag = (tag: string) =>
          [
            'a',
            'span',
            'strong',
            'em',
            'b',
            'i',
            'u',
            'small',
            'abbr',
            'cite',
            'q',
            'sub',
            'sup',
            'mark',
            's',
            'del',
            'ins',
            'code',
            'kbd',
            'samp',
            'var',
            'time',
            'br',
            'wbr'
          ].includes(tag);
        for (const node of doc.childNodes) {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node as HTMLElement).tagName.toLowerCase() === 'p'
          ) {
            const content = parseHtmlToReact(
              (node as HTMLElement).innerHTML,
              bible,
              `bq-p-${key}`
            );
            if (firstP) {
              firstP = false;
              afterH3 = true;
              blocks.push(<h3 key={`h3-${key}`}>{content}</h3>);
            } else {
              afterH3Inline.push(content);
            }
            key++;
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const tag = el.tagName.toLowerCase();
            if (afterH3 && isInlineTag(tag)) {
              // Always use parseHtmlToReact on the OUTER HTML to allow <a class="verse"> replacement
              const tempDiv = document.createElement('div');
              tempDiv.appendChild(el.cloneNode(true));
              const outer = tempDiv.innerHTML;
              afterH3Inline.push(
                parseHtmlToReact(outer, bible, `bq-inline-${tag}-${key}`)
              );
              key++;
            } else {
              if (afterH3 && afterH3Inline.length) {
                blocks.push(<p key={`p-afterh3-${key++}`}>{afterH3Inline}</p>);
                afterH3Inline = [];
              }
              // For block elements, also use parseHtmlToReact on the OUTER HTML
              const tempDiv = document.createElement('div');
              tempDiv.appendChild(el.cloneNode(true));
              const outer = tempDiv.innerHTML;
              blocks.push(
                parseHtmlToReact(outer, bible, `bq-block-${tag}-${key}`)
              );
              key++;
            }
          } else if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent?.trim()
          ) {
            if (afterH3) {
              afterH3Inline.push(node.textContent);
            } else {
              blocks.push(node.textContent);
            }
          }
        }
        // If we have collected inline after h3, flush as <p>
        if (afterH3 && afterH3Inline.length) {
          blocks.push(<p key={`p-afterh3-${key++}`}>{afterH3Inline}</p>);
        }
        return (
          <Blockquote key={idx}>
            <div className="lesson_to_remember">{blocks}</div>
          </Blockquote>
        );
      }
      // Outside blockquote: standard parsing
      return parseHtmlToReact(part, bible, `nq-${idx}-`);
    });
  }

  // Recursively parse HTML string to React elements, replacing verse links
  function parseHtmlToReact(
    html: string,
    bible: LessonDays['bible'] = [],
    keyPrefix = ''
  ): React.ReactNode {
    if (!html.trim()) return null;
    // Use DOMParser in browser, fallback for SSR (Server-Side Rendering)
    let doc: HTMLElement | null = null;
    try {
      const parser = new window.DOMParser();
      const docEl = parser.parseFromString(`<body>${html}</body>`, 'text/html');
      doc = docEl.body;
    } catch {
      // SSR fallback: render as plain text
      return html;
    }
    if (!doc) return html;

    const walk = (node: ChildNode, key: string): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return null;
      const el = node as HTMLElement;
      // Replace <a class="verse" verse="...">...</a> with <VerseLink>
      if (
        el.tagName.toLowerCase() === 'a' &&
        el.classList.contains('verse') &&
        el.hasAttribute('verse')
      ) {
        return (
          <VerseLink
            key={key}
            verseKey={el.getAttribute('verse') || ''}
            label={el.textContent || ''}
            bible={bible}
          />
        );
      }
      // For all other tags, render as their tag, recursively
      const Tag = el.tagName.toLowerCase();
      const children = Array.from(el.childNodes).map((child, i) =>
        walk(child, key + '-' + i)
      );
      return React.createElement(Tag, { key }, children);
    };

    return Array.from(doc.childNodes).map((node, i) =>
      walk(node, keyPrefix + i)
    );
  }

  // Track open/close state for this AccordionItem
  const [opened, setOpend] = useState<boolean>(isOpen);

  return (
    <AccordionItem
      open={opened}
      onChange={(open: boolean) => setOpend(open)}
      heading={
        <div className="day_title flex-1" title={opened ? 'Затвори' : 'Отвори'}>
          <h3>{day.title}</h3>
          {day.date && (
            <h4>
              {(() => {
                // day.date example: "29/03/2025"
                const dateStr = new Date(
                  // Convert from dd/MM/yyyy to yyyy-MM-dd for Date constructor
                  day.date.split('/').reverse().join('-')
                ).toLocaleDateString('bg-BG', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                }); //=> 'събота, 29 март'
                // Format the date string to "Събота - 29 март"
                // Split by comma, capitalize, and join with " - "
                const [weekday, rest] = dateStr.split(',');
                return `${
                  weekday.trim().charAt(0).toUpperCase() +
                  weekday.trim().slice(1)
                } -${rest ? ' ' + rest.trim() : ''}`;
              })()}
            </h4>
          )}
        </div>
      }
    >
      {/* Render the lesson content for this day */}
      {day.content && (
        <div className="u-spacing">{renderContent(day.content, day.bible)}</div>
      )}
    </AccordionItem>
  );
};
