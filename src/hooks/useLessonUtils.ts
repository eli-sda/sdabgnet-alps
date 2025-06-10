import { useState, useEffect, useCallback } from 'react';
import { LessonProps, loadQuarter, QuarterProps } from 'src/utils/LessonUtils';
import { useLessonContext } from '../contexts/CurrentLessonContext';
import moment from 'moment';

export function useLessonUtils() {
  const [currentLessonParameters, setCurrentLessonProps] =
    useState<LessonProps>(() => getCurrentLessonProps());
  const {
    currentAdultQuarter,
    currentInverseQuarter,
    currentCCQuarter,
    setCurrentQuarter
  } = useLessonContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLessonProps(getCurrentLessonProps());
    }, 60 * 60 * 1000); // update every hour

    return () => clearInterval(interval);
  }, []);

  const getQuarter = useCallback(
    async (quarterProps: QuarterProps) => {
      const isCurrent =
        currentLessonParameters.lessonYear === quarterProps.lessonYear &&
        currentLessonParameters.lessonQuarter === quarterProps.lessonQuarter;

      if (isCurrent) {
        switch (quarterProps.type) {
          case 'cq':
            if (currentInverseQuarter)
              return Promise.resolve(currentInverseQuarter);
            break;
          case 'cc':
            if (currentCCQuarter) return Promise.resolve(currentCCQuarter);
            break;
          default:
            if (currentAdultQuarter)
              return Promise.resolve(currentAdultQuarter);
            break;
        }
      }
      return loadQuarter(quarterProps)
        .then((qObject) => {
          if (isCurrent && !qObject.hasError) {
            setCurrentQuarter(qObject);
          }
          return Promise.resolve(qObject);
        })
        .catch();
    },
    [
      currentAdultQuarter,
      currentCCQuarter,
      currentInverseQuarter,
      currentLessonParameters.lessonQuarter,
      currentLessonParameters.lessonYear,
      setCurrentQuarter
    ]
  );

  return {
    currentLessonParameters,
    getQuarter
  };
}

const getCurrentLessonProps = (): LessonProps => {
  const now = moment();
  const day = now.date();
  const month = now.month();
  const year = now.year();
  const weekDay = now.day();
  const time = now.hour();

  const add = weekDay === 6 && time >= 14 ? 7 : 0;
  const nextSabbath = moment({ year, month, day: day }).add(
    +6 - weekDay + add,
    'days'
  );

  const returnYear = nextSabbath.year();
  const returnQuarter = nextSabbath.quarter();
  const first = moment({
    year: returnYear,
    month: (returnQuarter - 1) * 3,
    day: 1
  }); // first day in the qarter
  const returnLessonNumber = nextSabbath.diff(first, 'weeks') + 1;

  return {
    lessonYear: returnYear,
    lessonQuarter: returnQuarter,
    lessonNumber: returnLessonNumber
  };
};
