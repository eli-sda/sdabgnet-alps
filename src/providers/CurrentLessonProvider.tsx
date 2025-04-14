import { ReactNode, useState } from 'react';
import { CurrentLessonContext } from 'src/contexts/CurrentLessonContext';
import {
  QuarterObject,
  LessonDetails,
  LessonType
} from 'src/utils/LessonUtils';

export const CurrentLessonProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [currentAdultQuarter, setCurrentAdultQuarter] =
    useState<QuarterObject>();
  const [currentInverseQuarter, setCurrentInverseQuarter] =
    useState<QuarterObject>();
  const [currentCCQuarter, setCurrentCCQuarter] = useState<QuarterObject>();

  const setCurrentQuarter = (qObject: QuarterObject) => {
    switch (qObject.type) {
      case 'cq':
        setCurrentInverseQuarter(qObject);
        break;
      case 'cc':
        setCurrentCCQuarter(qObject);
        break;
      default:
        setCurrentAdultQuarter(qObject);
        break;
    }
  };

  const getLessonFromCurrentQuarter = (
    type: LessonType,
    lessonNumber: number
  ): LessonDetails | undefined => {
    const qObj =
      type === 'cq'
        ? currentInverseQuarter
        : type === 'cc'
        ? currentCCQuarter
        : currentAdultQuarter;
    const currentLesson = qObj?.lessons.find(
      (lesson) => lesson.num === lessonNumber
    );
    return currentLesson;
  };

  return (
    <CurrentLessonContext.Provider
      value={{
        currentAdultQuarter,
        currentInverseQuarter,
        currentCCQuarter,
        setCurrentQuarter,
        getLessonFromCurrentQuarter
      }}
    >
      {children}
    </CurrentLessonContext.Provider>
  );
};
