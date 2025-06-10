import { useEffect, useState } from 'react';
import './LessonItem.scss';
import {
  LessonDetails,
  getLessonDays,
  LessonDays
} from '../../utils/LessonUtils';
import { Text } from 'alps-library/atoms/text/Text';
import { Blockquote } from 'alps-library/atoms/text/Blockquote';
type LessonItemType = {
  qLesson: LessonDetails;
};

export const LessonItem = ({ qLesson }: LessonItemType) => {
  const [days, setDays] = useState<LessonDays[]>([]);

  // Helper to render content with <Blockquote />
  function renderContentWithBlockquote(html: string) {
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
            <p dangerouslySetInnerHTML={{ __html: replaced }} />
          </Blockquote>
        );
      }
      // Even indices are normal HTML
      return part.trim() ? (
        <div key={idx} dangerouslySetInnerHTML={{ __html: part }} />
      ) : null;
    });
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
            <div key={idx}>
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
              {day.content && renderContentWithBlockquote(day.content)}
            </div>
          ))}
        </Text>
      )}
    </>
  );
};
