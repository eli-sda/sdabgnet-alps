import { FC, useEffect, useState } from 'react';
import {
  LessonDetails,
  getLessonDays,
  LessonDays
} from '../../utils/LessonUtils';
import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { Text } from 'alps-library/atoms/text/Text';

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
        <>
          <GridItem className="c-article" sizeAtL="3" sizeAtXL="3">
            <Text
              as="article"
              className="c-article__body"
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
                  <div dangerouslySetInnerHTML={{ __html: day.content }} />
                </div>
              ))}
            </Text>
          </GridItem>
        </>
      )}
    </>
  );
};
