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
    if (!shouldShowImg) {
      setImageExists(null);
      return;
    }

    const checkImageExists = () => {
      const img = new Image();
      img.onload = () => {
        setImageExists(true);
      };
      img.onerror = () => {
        console.warn('Image failed to load:', storyImageUrl);
        setImageExists(false);
      };
      img.src = storyImageUrl ?? '';
    };

    checkImageExists();
  }, [shouldShowImg, storyImageUrl]);

  const imgComponent = useMemo(() => {
    return shouldShowImg && imageExists ? (
      <img
        src={storyImageUrl}
        className="story-image u-space--right u-space--bottom"
      />
    ) : null;
  }, [shouldShowImg, imageExists, storyImageUrl]);

  // Split content to insert image after first two elements
  const contentParts = useMemo(() => {
    if (!day.content || !shouldShowImg || !imageExists) {
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
      // Get HTML of first two children
      const firstChild = container.children[0];
      const secondChild = container.children[1];

      const beforeImg = firstChild.outerHTML + secondChild.outerHTML;
      const afterImg = Array.from(container.children)
        .slice(2)
        .map((child) => child.outerHTML)
        .join('');

      return { beforeImg, afterImg };
    }

    return { beforeImg: day.content, afterImg: '' };
  }, [day.content, shouldShowImg, imageExists]);

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
