import React, { useMemo, useState } from 'react';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import { LessonDayType } from '../../utils/LessonUtils';
import { useLessonQuarterContext } from 'src/contexts/LessonQuarterContext';
import { LessonDayContent } from '../../components/lesson/LessonDayContent';

// Props for LessonDay
interface LessonDayProps {
  day: LessonDayType;
}

export const LessonDay = ({ day }: LessonDayProps) => {
  const { quarterObject } = useLessonQuarterContext();

  // Determine if this AccordionItem should be open based on current date
  const isOpen = useMemo(() => {
    if (!day.date) return false;
    // day.date is in format "dd/MM/yyyy"
    const [d, m, y] = day.date.split('/');
    const dayDate = new Date(`${y}-${m}-${d}`);
    const now = new Date();
    // Compare only date part (ignore time)
    return (
      dayDate.getFullYear() === now.getFullYear() &&
      dayDate.getMonth() === now.getMonth() &&
      dayDate.getDate() === now.getDate()
    );
  }, [day.date]);

  const shouldShowImg = useMemo(() => {
    return day.title === 'Разказ' && quarterObject?.type == '';
  }, [day.title, quarterObject?.type]);

  // Track open/close state for this AccordionItem
  const [opened, setOpend] = useState<boolean>(isOpen);

  return (
    <AccordionItem
      open={opened}
      onChange={(open: boolean) => setOpend(open)}
      heading={
        <div className="title flex-1" title={opened ? 'Затвори' : 'Отвори'}>
          <h3 className="hyphens-auto">{day.title}</h3>
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
      <LessonDayContent day={day} shouldShowImg={shouldShowImg} />
    </AccordionItem>
  );
};
