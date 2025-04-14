import { createContext, useContext } from 'react';
import { QuarterObject, LessonDetails } from 'src/utils/LessonUtils';

type LessonQuarterContextType = {
  quarterObject: QuarterObject | undefined;
  lesson: LessonDetails | undefined;
  setQuarter: (quarterObject: QuarterObject) => void;
  setLessonDetails: (lesson: LessonDetails | undefined) => void;
};

export const LessonQuarterContext = createContext<LessonQuarterContextType>({
  quarterObject: undefined,
  lesson: undefined,
  setQuarter: () => {},
  setLessonDetails: () => {}
});

export function useLessonQuarterContext() {
  const context = useContext(LessonQuarterContext);

  return context;
}
