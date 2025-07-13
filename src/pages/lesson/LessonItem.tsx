import React, { useEffect, useState } from 'react';
import { Blockquote } from 'alps-library/atoms/text/Blockquote';
import { Text } from 'alps-library/atoms/text/Text';
import { VerseLink } from './VerseLink';
// For robust HTML parsing
import './LessonItem.scss';
import {
  LessonDetails,
  getLessonDays,
  LessonDays
} from '../../utils/LessonUtils';

type LessonItemType = {
  qLesson: LessonDetails;
};

export const LessonItem = ({ qLesson }: LessonItemType) => {
  const [days, setDays] = useState<LessonDays[]>([]);

  // Robust HTML-to-React rendering with inline verse link replacement
  function renderContent(html: string, bible: LessonDays['bible'] = []) {
    const parts = html.split(/<blockquote>|<\/blockquote>/i);
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        // Special blockquote logic: first <p> becomes <h3>, rest as <p>, others as normal
        const parser = new window.DOMParser();
        const docEl = parser.parseFromString(
          `<body>${part}</body>`,
          'text/html'
        );
        const nodes = Array.from(docEl.body.childNodes);
        let firstPDone = false;
        const blocks: React.ReactNode[] = [];
        let key = 0;
        nodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node as HTMLElement).tagName.toLowerCase() === 'p'
          ) {
            if (!firstPDone) {
              firstPDone = true;
              blocks.push(
                <h3 className="u-padding--half--bottom" key={`h3-${key++}`}>
                  {parseHtmlToReact(
                    (node as HTMLElement).innerHTML,
                    bible,
                    `bq-h3-${key}`
                  )}
                </h3>
              );
            } else {
              blocks.push(
                <p key={`p-${key++}`}>
                  {parseHtmlToReact(
                    (node as HTMLElement).innerHTML,
                    bible,
                    `bq-p-${key}`
                  )}
                </p>
              );
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Other tags (code, div, etc.)
            const el = node as HTMLElement;
            blocks.push(
              React.createElement(
                el.tagName.toLowerCase(),
                { key: `bq-${el.tagName.toLowerCase()}-${key++}` },
                parseHtmlToReact(
                  el.innerHTML,
                  bible,
                  `bq-${el.tagName.toLowerCase()}-${key}`
                )
              )
            );
          } else if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent?.trim()
          ) {
            blocks.push(node.textContent);
          }
        });
        return (
          <Blockquote key={idx}>
            <p>{blocks}</p>
          </Blockquote>
        );
      }
      // Outside blockquote: parse as normal
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

  useEffect(() => {
    if (qLesson?.full_path) {
      void getLessonDays(qLesson.full_path).then(setDays);
    }
  }, [qLesson?.full_path]);

  return (
    <>
      {qLesson && (
        <Text
          as="article"
          className="lesson_item c-article__body"
          hasDropcap={false}
          spacing="double"
        >
          {days.map((day, idx) => (
            <div key={idx} className="u-spacing">
              <h3>{day.title}</h3>
              {day.date && (
                <h4>
                  {(() => {
                    //day.date example: "29/03/2025"
                    const dateStr = new Date(
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
              {day.content && renderContent(day.content, day.bible)}
            </div>
          ))}
        </Text>
      )}
    </>
  );
};
