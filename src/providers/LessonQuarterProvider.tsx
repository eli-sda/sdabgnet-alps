import { ReactNode, useState } from 'react';
import { isEqual } from 'lodash';
import { LessonQuarterContext } from 'src/contexts/LessonQuarterContext';
import {
  getLessonFromQuarter,
  LessonDetails,
  QuarterObject
} from 'src/utils/LessonUtils';

export const LessonQuarterProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [quarterObject, setQuarterObject] = useState<QuarterObject>();
  const [lesson, setLesson] = useState<LessonDetails>();

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
    setLesson((prev) => {
      if (isEqual(prev, newLesson)) {
        return prev;
      }
      return newLesson;
    });
  };

  return (
    <LessonQuarterContext.Provider
      value={{
        quarterObject,
        lesson,
        setQuarter,
        setLessonDetails
      }}
    >
      {children}
    </LessonQuarterContext.Provider>
  );
};
