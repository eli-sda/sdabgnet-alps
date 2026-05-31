import React, { useMemo, useState } from 'react';
import { LessonDayType } from '../../utils/LessonUtils';
import { renderContent } from '../../utils/LessonContentUtils';
import './LessonDayContent.scss';

interface LessonDayContentProps {
  day: LessonDayType;
  shouldShowImg: boolean;
}

const lessonQuarterLetter = {
  1: 'a',
  2: 'b',
  3: 'c',
  4: 'd'
};

export const LessonDayContent = ({
  day,
  shouldShowImg
}: LessonDayContentProps) => {
  // Extract lesson info from day.index (e.g., "bg-2024-03-05-...")
  const { lessonYear, lessonQuarter, lessonNum } = useMemo(() => {
    if (!day.index) return { lessonYear: 0, lessonQuarter: 0, lessonNum: '' };

    const parts = day.index.split('-');
    // Format: bg-2024-03-05-...
    const year = parseInt(parts[1] || '0', 10);
    const quarter = parseInt(parts[2] || '0', 10);
    const num = parts[3] || '';

    return {
      lessonYear: year,
      lessonQuarter: quarter,
      lessonNum: num
    };
  }, [day.index]);

  const storyImageUrl = useMemo(() => {
    if (!shouldShowImg || !lessonYear || !lessonQuarter || !lessonNum) return;
    return `https://ssnet.org/lessons/${lessonYear % 100}${
      lessonQuarterLetter[lessonQuarter as 1 | 2 | 3 | 4]
    }/images/is${lessonNum}.jpg`;
  }, [shouldShowImg, lessonYear, lessonQuarter, lessonNum]);

  // Check if image exists
  const [imageExists, setImageExists] = useState<boolean | null>(null);

  React.useEffect(() => {
    if (!shouldShowImg || !storyImageUrl) {
      setImageExists(null);
      return;
    }

    // Reset when the URL changes so we don't briefly show stale state
    setImageExists(null);
    const img = new Image();
    img.onload = () => setImageExists(true);
    img.onerror = () => {
      console.warn('Image failed to load:', storyImageUrl);
      setImageExists(false);
    };
    img.src = storyImageUrl;
  }, [shouldShowImg, storyImageUrl]);

  const imgComponent = useMemo(() => {
    if (!shouldShowImg || !imageExists) return null;
    return (
      <img
        src={storyImageUrl}
        className="story-image u-space--right u-space--bottom"
      />
    );
  }, [shouldShowImg, imageExists, storyImageUrl]);

  // Split content to insert image after first two elements
  const contentParts = useMemo(() => {
    if (!day.content || !imageExists) {
      return { beforeImg: day.content || '', afterImg: '' };
    }

    // Parse HTML to find first two elements
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      `<div>${day.content}</div>`,
      'text/html'
    );
    const container = doc.querySelector('div');

    if (container && container.children.length >= 2) {
      const beforeImg =
        container.children[0].outerHTML + container.children[1].outerHTML;
      const afterImg = Array.from(container.children)
        .slice(2)
        .map((child) => child.outerHTML)
        .join('');
      return { beforeImg, afterImg };
    }

    return { beforeImg: day.content, afterImg: '' };
  }, [day.content, imageExists]);

  if (!day.content) return null;

  return (
    <div className="u-spacing">
      {contentParts.beforeImg &&
        renderContent(contentParts.beforeImg, day.bible)}
      {imgComponent}
      {contentParts.afterImg && renderContent(contentParts.afterImg, day.bible)}
    </div>
  );
};
