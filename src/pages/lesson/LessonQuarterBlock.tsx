import React, { useEffect, useMemo, useRef } from 'react';
import { isEqual } from 'lodash';
import routes from 'src/routes';
import {
  getLessonFromQuarter,
  getRouteLesson,
  LessonProps
} from '../../utils/LessonUtils';
import './LessonQuarterBlock.css';

import { PageHeaderFeature2 } from 'src/organisms/sections/PageHeaderFeature2';

import { useLessonUtils } from 'src/hooks/useLessonUtils';
import { useLessonQuarterContext } from 'src/contexts/LessonQuarterContext';
import LessonHead from './LessonHead';

export type LessonQuarterBlockType = LessonProps & {
  withIntroduction?: boolean;
  showLessonLink: boolean;
};

// should be wrapped in <LessonQuarterProvider>
const LessonQuarterBlock = (params: LessonQuarterBlockType) => {
  const { withIntroduction, showLessonLink, ...lessonProps } = params;
  const ssPage = getRouteLesson(lessonProps.type || '');
  const lessonURL = routes.churchLife(ssPage);
  const { getQuarter } = useLessonUtils();
  const {
    qLesson,
    quarterObject,
    setQuarter,
    setLessonDetails,
    lessonDateRange
  } = useLessonQuarterContext();

  const prevParamsRef = useRef<LessonProps | null>(null);

  useEffect(() => {
    if (isEqual(prevParamsRef.current, lessonProps)) return;
    prevParamsRef.current = lessonProps;
    getQuarter(lessonProps)
      .then((quarterObject) => {
        if (!quarterObject.hasError) {
          setQuarter(quarterObject);
          if (lessonProps.lessonNumber) {
            setLessonDetails(
              getLessonFromQuarter(quarterObject, lessonProps.lessonNumber)
            );
          }
        }
      })
      .catch((error) => console.error(error));
  }, [getQuarter, lessonProps, setLessonDetails, setQuarter]);

  const qImage = useMemo(() => {
    const qImage = {
      alt: '',
      srcSet: {
        default: '',
        500: '',
        750: '',
        1200: ''
      }
    };

    if (quarterObject) {
      qImage.alt = quarterObject.qTitle;
      qImage.srcSet.default = quarterObject.quarterlyCover || '';
    }

    return qImage;
  }, [quarterObject]);

  return (
    <>
      {quarterObject && !quarterObject.hasError && (
        <>
          <PageHeaderFeature2
            blockType="longform"
            blocks={[
              {
                type: 'longform', //'featureWide',
                image: qImage,
                category: quarterObject.qAuthor,
                description: withIntroduction
                  ? quarterObject.qIntroduction
                  : '',
                expandable: true,
                kicker: quarterObject.qHumanDate,
                titlePrefix: quarterObject.qGroup,
                title: quarterObject.qTitle
              }
            ]}
          />
          {showLessonLink && qLesson?.title && (
            //from template News.tsx latest
            <LessonHead
              lessonTitle={qLesson.title}
              kicker={`Прочети текущия урок № ${qLesson.num}`}
              lessonURL={lessonURL}
              lessonDateRange={lessonDateRange}
              lessonCover={qLesson.cover}
            />
          )}
        </>
      )}
    </>
  );
};

export default React.memo(LessonQuarterBlock);
