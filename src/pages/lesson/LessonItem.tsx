import { useEffect, useState } from 'react';
import { Text } from 'alps-library/atoms/text/Text';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';

import { LessonDay } from './LessonDay';
// For robust HTML parsing
import './LessonItem.scss';
import {
  LessonDetails,
  getLessonDaysAndPdf,
  LessonDays
} from '../../utils/LessonUtils';
type LessonItemType = {
  qLesson: LessonDetails;
};

export const LessonItem = ({ qLesson }: LessonItemType) => {
  const [days, setDays] = useState<LessonDays[]>([]);
  const [pdfLink, setPdfLink] = useState<string | undefined>();

  useEffect(() => {
    if (qLesson?.full_path) {
      void getLessonDaysAndPdf(qLesson.full_path).then(({ days, pdfLink }) => {
        setDays(days);
        setPdfLink(pdfLink);
      });
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
          {days.length === 0 && pdfLink && (
            <h3 className="u-padding--bottom">
              <a href={pdfLink} target="_blank" rel="noreferrer">
                <i className="far fa-file-pdf u-space--half--right"></i>
                {`Отвори урока в PDF формат`}
              </a>
            </h3>
          )}
          {days.length > 0 && (
            <Accordion>
              {days.map((day) => (
                // Render LessonDay (AccordionItem) for each day
                <LessonDay key={`${day.index}`} day={day} />
              ))}
            </Accordion>
          )}
        </Text>
      )}
    </>
  );
};
