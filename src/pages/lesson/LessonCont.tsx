import React, { useMemo, useEffect, useState } from 'react';
import { MissingLesson } from './MissingLesson';

import { ArticleContent } from 'alps-library/organisms/content/articleContent/ArticleContent.tsx';
import { MediaBlockProps } from 'src/alps/molecules/blocks/MediaBlock';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';
import LessonHead from './LessonHead';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { Aside } from 'alps-library/organisms/asides/aside/Aside';
import LessonAudio from './LessonAudio';
import { resolveBitlyViaBackend } from 'src/utils/resolveBitly';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import {
  formatDateRange,
  getLessonFromQuarter,
  LessonProps
} from '../../utils/LessonUtils';
import { useLessonQuarterContext } from 'src/contexts/LessonQuarterContext';
import { LessonItem } from './LessonItem';

interface LessonContProps {
  lessonURL: string;
  currentLessonParameters: LessonProps;
  params: LessonProps;
}

const LessonCont = ({
  lessonURL,
  currentLessonParameters,
  params
}: LessonContProps) => {
  const { qLesson, lessonDateRange, quarterObject } = useLessonQuarterContext();
  const [videoDiscussionUrl, setVideoDiscussionUrl] = useState<string | null>(
    null
  );
  const [videoCommentUrl, setVideoCommentUrl] = useState<string | null>(null);

  const passedLessons = useMemo(() => {
    if (!quarterObject) return [];
    const { lessonYear, lessonQuarter } = quarterObject;
    const passedLessons: MediaBlockProps[] = [];
    const toLesson =
      lessonYear === currentLessonParameters.lessonYear &&
      lessonQuarter === currentLessonParameters.lessonQuarter
        ? currentLessonParameters.lessonNumber //show only up to current lesson for current quarter
        : quarterObject.lessons.length; //all lessons in quarter
    for (let i = 1; i <= toLesson; i++) {
      const lesson = getLessonFromQuarter(quarterObject, i);
      if (!lesson) continue;
      const lessonBlock = {
        title: `${lesson.num}. ${lesson.title}`,
        image: lesson.cover ? getImageTypeByUrl(lesson.cover) : undefined,
        url: `${lessonURL}/${lessonYear % 100}/${lessonQuarter}/${lesson.num}`,
        category:
          lesson.startDate && lesson.endDate
            ? formatDateRange(lesson.startDate, lesson.endDate)
            : ''
      };
      passedLessons.push(lessonBlock);
    }
    return passedLessons;
  }, [currentLessonParameters, lessonURL, quarterObject]);

  const video: null | { caption: string; src: string } = useMemo(() => {
    let video = null;
    const isCQLesson = quarterObject?.type === 'cq';
    if (
      qLesson &&
      quarterObject &&
      (quarterObject.type == '' || quarterObject.type === 'cq') &&
      quarterObject.lessonYear === 2025 &&
      quarterObject.lessonQuarter === 3
    ) {
      let videoId;
      switch (qLesson.num) {
        case 2:
          videoId = isCQLesson ? 'v6BwBvGq47s' /* 2гл. */ : 'VQ4SD1NVbnA'; //3гл.
          break;
        case 3:
          videoId = isCQLesson ? 'VQ4SD1NVbnA' /* 3гл. */ : 'c3utnt0Y8bI'; //5гл.
          break;
        case 4:
          videoId = isCQLesson ? 'c3utnt0Y8bI' /* 5гл. */ : '2plz5iiyRD4'; //7гл.
          break;
        case 5:
          videoId = isCQLesson ? '2plz5iiyRD4' /* 7гл. */ : '4SiwsULXdzg'; //11гл.
          break;
        case 6:
          videoId = isCQLesson ? '9fNOTOslfUg' /* 9гл. */ : 'B92evKCcU-M'; //13гл.
          break;
        case 7:
          videoId = isCQLesson ? '4SiwsULXdzg' /* 11гл. */ : 'AxJKBpR1ABk'; //16гл.
          break;
        case 8:
          videoId = isCQLesson ? 'nS4Hl58MFA0' /* 14гл. */ : 'tQYiVnClO8U'; //19гл.
          break;
        case 9:
          videoId = isCQLesson ? 'tQYiVnClO8U' /* 19гл. */ : 'fcoEoMyE8rM'; //21гл.
          break;
        case 10:
          videoId = isCQLesson ? 'aRMsAHTDMsw' /* 20гл. */ : 'KkCxsCVZstI'; //24гл.
          break;
        case 11:
          videoId = isCQLesson ? '' /* 25гл. липсва */ : 'ssLMBU_jVF0'; //32гл.
          break;
        case 12:
          videoId = isCQLesson ? 'ssLMBU_jVF0' /* 32гл. */ : 'RzI0g9Elr_M'; //33гл.
          break;
        case 13:
          videoId = isCQLesson ? 'RzI0g9Elr_M' /* 33гл. */ : 'GxZlpW1Jjdo'; //35гл.
          break;

        default:
          videoId = '';
          break;
      }
      video = {
        caption: 'Гледайте поредицата "Изход" с п-р Петър Стоилов',
        src: `https://www.youtube.com/embed/${videoId}?list=PLfCTd97jVbHUL-rsvyHnIr0L7FM8MtJnq`
      };
    }
    return video;
  }, [qLesson, quarterObject]);

  // Define Bitly URL for video discussion of VVV
  // when the lesson is from 2025 Q4 or later and not after the current lesson
  const videoDiscussionBitlyUrl: string | null = useMemo(() => {
    if (
      qLesson &&
      quarterObject &&
      quarterObject.type === '' &&
      (quarterObject.lessonYear > 2025 ||
        (quarterObject.lessonYear === 2025 &&
          quarterObject.lessonQuarter >= 4)) &&
      (quarterObject.lessonYear < currentLessonParameters.lessonYear ||
        (quarterObject.lessonYear === currentLessonParameters.lessonYear &&
          quarterObject.lessonQuarter <
            currentLessonParameters.lessonQuarter) ||
        (quarterObject.lessonYear === currentLessonParameters.lessonYear &&
          quarterObject.lessonQuarter ===
            currentLessonParameters.lessonQuarter &&
          qLesson.num <= currentLessonParameters.lessonNumber))
    ) {
      const lessonNum = qLesson.num.toString().padStart(2, '0');
      return `https://bit.ly/${quarterObject.lessonYear}-T${quarterObject.lessonQuarter}-Urok${lessonNum}`;
    }
    return null;
  }, [qLesson, quarterObject, currentLessonParameters]);

  // Define Bitly URL for video comment from TV Svetlina
  // when the lesson is from 2026 later and not after the current lesson
  const videoCommentBitlyUrl: string | null = useMemo(() => {
    if (
      qLesson &&
      quarterObject &&
      quarterObject.type === '' &&
      quarterObject.lessonYear >= 2026 &&
      (quarterObject.lessonYear < currentLessonParameters.lessonYear ||
        (quarterObject.lessonYear === currentLessonParameters.lessonYear &&
          quarterObject.lessonQuarter <
            currentLessonParameters.lessonQuarter) ||
        (quarterObject.lessonYear === currentLessonParameters.lessonYear &&
          quarterObject.lessonQuarter ===
            currentLessonParameters.lessonQuarter &&
          qLesson.num <= currentLessonParameters.lessonNumber))
    ) {
      const lessonNum = qLesson.num.toString().padStart(2, '0');
      return `https://bit.ly/ss-${quarterObject.lessonYear}-${quarterObject.lessonQuarter}-${lessonNum}`;
    }
    return null;
  }, [qLesson, quarterObject, currentLessonParameters]);

  useEffect(() => {
    if (!videoDiscussionBitlyUrl) {
      setVideoDiscussionUrl(null);
      return;
    }
    const getYouTubeUrl = async () => {
      await resolveBitlyViaBackend(videoDiscussionBitlyUrl)
        .then((url) => {
          setVideoDiscussionUrl(url);
        })
        .catch((error: unknown) => {
          console.error('Failed to resolve bitly URL:', error);
          setVideoDiscussionUrl(null);
        });
    };

    void getYouTubeUrl();
  }, [videoDiscussionBitlyUrl]);

  useEffect(() => {
    if (!videoCommentBitlyUrl) {
      setVideoCommentUrl(null);
      return;
    }

    const getYouTubeUrl = async () => {
      await resolveBitlyViaBackend(videoCommentBitlyUrl)
        .then((url) => {
          setVideoCommentUrl(url);
        })
        .catch((error: unknown) => {
          console.error('Failed to resolve bitly URL:', error);
          setVideoCommentUrl(null);
        });
    };

    void getYouTubeUrl();
  }, [videoCommentBitlyUrl]);

  const videoDiscussion = useMemo(() => {
    if (videoDiscussionUrl) {
      return (
        <Figure
          align="left"
          caption="Видео дискусия на урока"
          size="large"
          videoSrc={videoDiscussionUrl}
        />
      );
    }
    return undefined;
  }, [videoDiscussionUrl]);

  const videoComment = useMemo(() => {
    if (videoCommentUrl) {
      return (
        <Figure
          align="left"
          caption="Коментар на урока от Марк Финли"
          size="large"
          videoSrc={videoCommentUrl}
        />
      );
    }
    return undefined;
  }, [videoCommentUrl]);

  const sidebar = useMemo(() => {
    return (
      <>
        {(video || videoDiscussion || videoComment) && (
          <Aside>
            {video && (
              <Figure
                align="left"
                caption={video.caption}
                size="large"
                videoSrc={video.src}
              />
            )}
            {videoDiscussion && videoDiscussion}
            {videoComment && videoComment}
          </Aside>
        )}
        {passedLessons.length > 0 && (
          <RelatedPosts
            heading="Изминали уроци от тримесечието"
            blocks={passedLessons}
          />
        )}
      </>
    );
  }, [video, videoDiscussion, videoComment, passedLessons]);

  return (
    <>
      {qLesson && (
        <>
          <LessonHead
            lessonTitle={qLesson.title}
            kicker={`Урок № ${qLesson.num}`}
            lessonDateRange={lessonDateRange}
            lessonCover={qLesson.cover}
          />
          {quarterObject?.type === '' && quarterObject.lessonYear >= 2019 && (
            <>
              <div id="lesson-audio-container" />
              <LessonAudio
                year={quarterObject.lessonYear}
                quarter={quarterObject.lessonQuarter}
                week={qLesson.num}
                title={qLesson.title}
                getContainer={() =>
                  document.getElementById('lesson-audio-container') ||
                  document.body
                }
              />
            </>
          )}
          <ArticleContent sidebar={sidebar}>
            <LessonItem qLesson={qLesson} />
          </ArticleContent>
        </>
      )}
      {!qLesson && <MissingLesson {...params} />}
    </>
  );
};
export default React.memo(LessonCont);
