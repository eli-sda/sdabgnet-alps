import { FC, useEffect, useState } from 'react';
import {
  LessonDetails,
  getLessonDays,
  LessonDays
} from '../../utils/LessonUtils';
import LessonHead from './LessonHead';

type LessonItemType = {
  qLesson: LessonDetails;
  lessonDateRange: string;
  ssPath: string;
};

export const LessonItem: FC<LessonItemType> = ({
  qLesson,
  lessonDateRange
}) => {
  const [days, setDays] = useState<LessonDays[]>([]);

  useEffect(() => {
    if (qLesson?.full_path) {
      void getLessonDays(qLesson.full_path).then(setDays);
    }
  }, [qLesson?.full_path]);

  return (
    <>
      {qLesson && (
        <>
          <LessonHead
            lessonTitle={qLesson.title}
            kicker={`Урок № ${qLesson.num}`}
            lessonDateRange={lessonDateRange}
            lessonCover={qLesson.cover}
          />

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
              <div dangerouslySetInnerHTML={{ __html: day.content }} />
            </div>
          ))}
        </>
      )}
    </>
  );
};
