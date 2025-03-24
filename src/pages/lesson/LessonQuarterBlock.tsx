import { useEffect, useMemo, useState } from 'react';
import routes from 'src/routes';
import {
  formatDateRange,
  getRouteLesson,
  LessonObject,
  lessonParameters,
  loadLesson
} from './LessonUtils';
import { PageHeaderFeature2 } from 'src/organisms/sections/PageHeaderFeature2';
import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';

import { GridSeven } from 'alps-library/atoms/grids/GridSeven';
import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { Text } from 'alps-library/atoms/text/Text';

const LessonQuarterBlock = (params: lessonParameters) => {
  const ssPage = getRouteLesson(params.type || '');
  const lessonURL = routes.churchLife(ssPage);

  const [lesson, setLesson] = useState<LessonObject>();

  useEffect(() => {
    loadLesson(params)
      .then((lesson) => {
        // console.log(new Date(), ' lesson:', lesson);
        setLesson(lesson);
      })
      .catch((error) => console.error(error));
  }, [params]);

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

    if (lesson) {
      if (lesson.type != 'cc' && lesson.cover) {
        lImage.srcSet.default = lesson.cover;
      }
      qImage.alt = lesson.qTitle;
      qImage.srcSet.default = lesson.quarterlyCover || '';
    }

    return { lImage, qImage };
  }, [lesson]);

  return (
    <>
      {lesson && !lesson.hasError && (
        <>
          <PageHeaderFeature2
            blockType="longform"
            blocks={[
              {
                type: 'longform', //'featureWide',

                image: images.qImage,
                category: lesson.qAuthor,
                description: lesson.qDescription,
                kicker: lesson.qHumanDate,
                titlePrefix: lesson.qGroup,
                title: lesson.qTitle
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
                'c-article u-spacing--triple l-grid-item l-grid-item--l--4-col'
              }
            >
              <Text
                as="article"
                className="c-article__body u-padding--right"
                hasDropcap={false}
                spacing={'double'}
              >
                {lesson.title && (
                  <MediaBlock
                    type="archivePage"
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

export default LessonQuarterBlock;
