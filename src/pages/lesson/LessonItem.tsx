import { FC } from 'react';
import { LessonDetails } from '../../utils/LessonUtils';

type LessonItemType = {
  qLesson: LessonDetails;
  lessonDateRange: string;
  ssPath: string;
};
export const LessonItem: FC<LessonItemType> = ({
  ssPath,
  qLesson,
  lessonDateRange
}) => (
  <>
    {qLesson && (
      <>
        <img src={qLesson.cover} width="100%" />
        <div>
          <h2>
            <a href={ssPath} target="_blank" rel="noreferrer">
              {qLesson.title}
            </a>
          </h2>
          <h5>{lessonDateRange}</h5>
        </div>
      </>
    )}
  </>
);
