import { useEffect, useState } from 'react';
import './LessonItem.scss';
import {
  LessonDetails,
  getLessonDays,
  LessonDays
} from '../../utils/LessonUtils';
import { Text } from 'alps-library/atoms/text/Text';
import { Blockquote } from 'alps-library/atoms/text/Blockquote';
import { VerseLink } from './VerseLink';

type LessonItemType = {
  qLesson: LessonDetails;
};

export const LessonItem = ({ qLesson }: LessonItemType) => {
  const [days, setDays] = useState<LessonDays[]>([]);

  // Helper to render content with <Blockquote />
  function renderContent(html: string, bible: LessonDays['bible'] = []) {
    const parts = html.split(/<blockquote>|<\/blockquote>/i);
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        // Replace the first <p>...</p> with <h3>...</h3> and wrap the rest in <span>
        const trimmed = part.trim();
        const pMatch = trimmed.match(/<p>([\s\S]*?)<\/p>/i);
        let replaced = trimmed;
        if (pMatch) {
          const h3 = `<h3 class="u-padding--half--bottom">${pMatch[1]}</h3>`;
          const afterP = trimmed.replace(/^[\s\S]*?<\/p>/i, '');
          const rest = afterP.trim() ? `<span>${afterP.trim()}</span>` : '';
          replaced = h3 + rest;
        }
        return (
          <Blockquote key={idx}>
            <p>{replaceVerseLinks(replaced, bible)}</p>
          </Blockquote>
        );
      }
      // Even indices are normal HTML
      return part.trim() ? (
        <div key={idx}>{replaceVerseLinks(part, bible)}</div>
      ) : null;
    });
  }

  // Helper: Extract all <a class="verse" verse="...">...</a> and replace with VerseLink
  function replaceVerseLinks(
    html: string,
    bible: LessonDays['bible'] = []
  ): (JSX.Element | null)[] {
    // Regex to match <a class="verse" verse="...">...</a>
    const verseRegex = /<a class="verse" verse="([^"]+)">([\s\S]*?)<\/a>/gi;
    let lastIndex = 0;
    const elements: (JSX.Element | null)[] = [];
    let match: RegExpExecArray | null;
    let key = 0;
    while ((match = verseRegex.exec(html))) {
      if (match.index > lastIndex) {
        elements.push(
          <span
            key={key++}
            dangerouslySetInnerHTML={{
              __html: html.slice(lastIndex, match.index)
            }}
          />
        );
      }
      elements.push(
        <VerseLink
          key={key++}
          verseKey={match[1]}
          label={match[2]}
          bible={bible}
        />
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < html.length) {
      elements.push(
        <span
          key={key++}
          dangerouslySetInnerHTML={{ __html: html.slice(lastIndex) }}
        />
      );
    }
    return elements;
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
