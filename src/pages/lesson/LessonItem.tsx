import { FC } from 'react';
import {
  LessonObject,
  OLD_SS_URL,
  SS_API_URL_BG_QUARTER,
  twoDigits
} from './LessonUtils';

export const LessonItem: FC<LessonObject & { ssPath: string }> = ({
  ssPath,
  ...lesson
}) => (
  <li style={{ paddingBottom: '60px' }}>
    {lesson.hasError && !lesson.isCQ && (
      <p>
        <h2>{lesson.qTitle}</h2>
        Опитайте да заредите
        <a
          href={`${OLD_SS_URL}&year=${lesson.lessonYear - 2000}&quarter=${
            lesson.lessonQuarter
          }&week=${lesson.lessonNumber}`}
          target="_blank"
          rel="noreferrer"
        >
          {' '}
          през стария сайт
        </a>
        .
      </p>
    )}
    {!lesson.hasError && (
      <>
        <div
          className="ss-cover"
          style={{
            backgroundImage: `url(${SS_API_URL_BG_QUARTER}/${
              lesson.lessonYear
            }-${twoDigits(lesson.lessonQuarter)}${
              lesson.isCQ ? '-cq' : ''
            }/cover.png)`
          }}
        ></div>
        <h3>
          {lesson.qTitle}
          <br />
          {lesson.qAuthor}
        </h3>
        <span
          dangerouslySetInnerHTML={{
            __html: lesson.qIntroduction?.replaceAll('\n\n', '<p>') || ''
          }}
        />
        <a href={ssPath} target="_blank" rel="noreferrer">
          <h4>{lesson.title}</h4>
        </a>
        <h5>
          {lesson.startDate && lesson.startDate.replaceAll('/', '.')} -{' '}
          {lesson.endDate && lesson.endDate.replaceAll('/', '.')}
        </h5>
      </>
    )}
  </li>
);
