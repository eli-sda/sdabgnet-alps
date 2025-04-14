import { FC } from 'react';
import { QuarterObject, LessonDetails } from '../../utils/LessonUtils';

export const LessonItem: FC<
  QuarterObject & { lesson: LessonDetails } & { ssPath: string }
> = ({ ssPath, lesson, ...quarterObj }) => (
  <>
    {!quarterObj.hasError && (
      <>
        <span
          dangerouslySetInnerHTML={{
            __html:
              quarterObj.qIntroduction
                ?.replaceAll('\n\n', '<p>')
                .replace(/_(.*?)_/g, '<em>$1</em>')
                .replace(
                  /\b(www\.[^\s]+)/g,
                  '<a href="//$1" target="_blank">$1</a>'
                ) || ''
          }}
        />
        <img src={lesson.cover} width="100%" />
        <a href={ssPath} target="_blank" rel="noreferrer">
          <h4>{lesson.title}</h4>
        </a>
        <h5>
          {lesson.startDate && lesson.startDate.replaceAll('/', '.')} -{' '}
          {lesson.endDate && lesson.endDate.replaceAll('/', '.')}
        </h5>
      </>
    )}
  </>
);
