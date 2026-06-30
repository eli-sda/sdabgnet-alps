import { createContext, useContext } from 'react';
import { QuarterObject, LessonDetails } from 'src/utils/LessonUtils';

type LessonQuarterContextType = {
  quarterObject?: QuarterObject;
  qLesson?: LessonDetails;
  setQuarter: (quarterObject: QuarterObject) => void;
  setLessonDetails: (lesson?: LessonDetails) => void;
  lessonDateRange: string;
};

export const LessonQuarterContext = createContext<LessonQuarterContextType>({
  quarterObject: undefined,
  qLesson: undefined,
  setQuarter: () => {},
  setLessonDetails: () => {},
  lessonDateRange: ''
});

export function useLessonQuarterContext() {
  const context = useContext(LessonQuarterContext);

  return context;
}
