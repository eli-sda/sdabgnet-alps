import { ReactNode, useMemo, useState } from 'react';
import { isEqual } from 'lodash';
import { LessonQuarterContext } from 'src/contexts/LessonQuarterContext';
import {
  formatDateRange,
  LessonDetails,
  QuarterObject
} from 'src/utils/LessonUtils';

export const LessonQuarterProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [quarterObject, setQuarterObject] = useState<QuarterObject>();
  const [qLesson, setQLesson] = useState<LessonDetails>();

  const setQuarter = (newQuarterObject: QuarterObject) => {
    // Avoid setting state if it hasn’t changed
    setQuarterObject((prev) => {
      if (isEqual(prev, newQuarterObject)) {
        return prev;
      }
      return newQuarterObject;
    });
  };

  const setLessonDetails = (newLesson: LessonDetails | undefined) => {
    // Avoid setting state if it hasn’t changed
    setQLesson((prev) => {
      if (isEqual(prev, newLesson)) {
        return prev;
      }
      return newLesson;
    });
  };

  const lessonDateRange = useMemo(() => {
    if (qLesson && qLesson.startDate && qLesson.endDate) {
      return formatDateRange(qLesson.startDate, qLesson.endDate);
    } else return '';
  }, [qLesson]);

  return (
    <LessonQuarterContext.Provider
      value={{
        quarterObject,
        qLesson,
        setQuarter,
        setLessonDetails,
        lessonDateRange
      }}
    >
      {children}
    </LessonQuarterContext.Provider>
  );
};
