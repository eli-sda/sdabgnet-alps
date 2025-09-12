import { useEffect, useState } from 'react';
import { Text } from 'alps-library/atoms/text/Text';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';

import { LessonDay } from './LessonDay';
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
          <Accordion>
            {days.map((day, idx) => {
              // Determine if this AccordionItem should be open
              let isOpen = true;
              if (day.date) {
                // day.date is in format "dd/MM/yyyy"
                const [d, m, y] = day.date.split('/');
                const dayDate = new Date(`${y}-${m}-${d}`);
                const now = new Date();
                // Compare only date part (ignore time)
                isOpen =
                  dayDate.getFullYear() === now.getFullYear() &&
                  dayDate.getMonth() === now.getMonth() &&
                  dayDate.getDate() === now.getDate();
              }
              // Render LessonDay (AccordionItem) for each day
              return <LessonDay key={idx} day={day} isOpen={isOpen} />;
            })}
          </Accordion>
        </Text>
      )}
    </>
  );
};
