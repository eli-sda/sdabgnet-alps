import React, { useEffect, useMemo, useRef } from 'react';
import { isEqual } from 'lodash';
import routes from 'src/routes';
import {
  formatDateRange,
  getLessonFromQuarter,
  getRouteLesson,
  QuarterProps
} from '../../utils/LessonUtils';
import './LessonQuarterBlock.css';

import { PageHeaderFeature2 } from 'src/organisms/sections/PageHeaderFeature2';
import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';

import { GridSeven } from 'alps-library/atoms/grids/GridSeven';
import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { Text } from 'alps-library/atoms/text/Text';
import { useLessonUtils } from 'src/hooks/useLessonUtils';
import { useLessonQuarterContext } from 'src/contexts/LessonQuarterContext';

export type LessonQuarterBlockType = QuarterProps & {
  lessonNumber: number;
  showLessonLink: boolean;
};

// should be wrapped in <LessonQuarterProvider>
const LessonQuarterBlock = (params: LessonQuarterBlockType) => {
  const ssPage = getRouteLesson(params.type || '');
  const lessonURL = routes.churchLife(ssPage);
  const { getQuarter } = useLessonUtils();
  const { lesson, quarterObject, setQuarter, setLessonDetails } =
    useLessonQuarterContext();

  const prevParamsRef = useRef<LessonQuarterBlockType | null>(null);
  useEffect(() => {
    if (isEqual(prevParamsRef.current, params)) return;
    prevParamsRef.current = params;
    getQuarter(params)
      .then((quarterObject) => {
        if (!quarterObject.hasError) {
          setQuarter(quarterObject);
          if (params.lessonNumber)
            setLessonDetails(
              getLessonFromQuarter(quarterObject, params.lessonNumber)
            );
        }
      })
      .catch((error) => console.error(error));
  }, [getQuarter, params, setLessonDetails, setQuarter]);

  const dateRange = useMemo(() => {
    if (lesson && lesson.startDate && lesson.endDate) {
      return formatDateRange(lesson.startDate, lesson.endDate);
    } else return '';
  }, [lesson]);

  const images = useMemo(() => {
    const qImage = {
      alt: '',
      srcSet: {
        default: '',
        500: '',
        750: '',
        1200: ''
      }
    };
    const lImage = {
      alt: '',
      srcSet: {
        default: '',
        500: '',
        750: '',
        1200: ''
      }
    };

    if (lesson && quarterObject?.type != 'cc' && lesson.cover) {
      lImage.srcSet.default = lesson.cover;
    }

    if (quarterObject) {
      qImage.alt = quarterObject.qTitle;
      qImage.srcSet.default = quarterObject.quarterlyCover || '';
    }

    return { lImage, qImage };
  }, [lesson, quarterObject]);

  return (
    <>
      {quarterObject && !quarterObject.hasError && (
        <>
          <PageHeaderFeature2
            blockType="longform"
            blocks={[
              {
                type: 'longform', //'featureWide',
                image: images.qImage,
                category: quarterObject.qAuthor,
                description: quarterObject.qDescription,
                kicker: quarterObject.qHumanDate,
                titlePrefix: quarterObject.qGroup,
                title: quarterObject.qTitle
              }
            ]}
          />

          <GridSeven
            as="section"
            className={
              'l-grid l-grid--7-col l-grid-wrap--6-of-7 u-shift--left--1-col--at-large u-space--triple--bottom'
            }
          >
            <GridItem
              className={
                'to-lesson c-article u-spacing--triple l-grid-item l-grid-item--l--4-col'
              }
            >
              <Text
                as="section"
                className="c-article__body u-padding--right"
                hasDropcap={false}
                spacing={'double'}
              >
                {params.showLessonLink && lesson?.title && (
                  <MediaBlock
                    type="featuredNews"
                    kicker="Прочети текущия урок"
                    kickerAs="h4"
                    title={lesson.title}
                    url={lessonURL}
                    category={dateRange}
                    image={images.lImage}
                  />
                )}
              </Text>
            </GridItem>
          </GridSeven>
        </>
      )}
    </>
  );
};

export default React.memo(LessonQuarterBlock);
