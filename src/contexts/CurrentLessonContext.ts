import { createContext, useContext } from 'react';
import {
  QuarterObject,
  LessonDetails,
  LessonType
} from 'src/utils/LessonUtils';

type CurrentQuarterContextType = {
  currentAdultQuarter?: QuarterObject;
  currentInverseQuarter?: QuarterObject;
  currentCCQuarter?: QuarterObject; //Cornerstone Connections
  setCurrentQuarter: (qObject: QuarterObject) => void;
  getLessonFromCurrentQuarter: (
    type: LessonType,
    lessonNumber: number
  ) => LessonDetails | undefined;
};

export const CurrentLessonContext = createContext<CurrentQuarterContextType>({
  currentAdultQuarter: undefined,
  currentInverseQuarter: undefined,
  currentCCQuarter: undefined,
  setCurrentQuarter: () => {},
  getLessonFromCurrentQuarter: () => undefined
});

export function useLessonContext() {
  const context = useContext(CurrentLessonContext);

  return context;
}
