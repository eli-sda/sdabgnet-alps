import React, { useState, useEffect } from 'react';
import PopupContent from '../popupContent/PopupContent';
import { LessonDayContent } from './LessonDayContent';
import { LessonDayType } from '../../utils/LessonUtils';
import './LessonsStories.scss';

interface LessonsStoriesProps {
  year: number;
}

const getStoryTimestamp = (date: string) => {
  const [day, month, year] = date.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
};

export const LessonsStories: React.FC<LessonsStoriesProps> = ({ year }) => {
  const [stories, setStories] = useState<LessonDayType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/json/stories-${year}.json`);

        if (!response.ok) {
          setStories([]);
          return;
        }

        const data = (await response.json()) as LessonDayType[];
        // Sort oldest first so the newest stories appear at the bottom.
        const sortedData = data
          .slice()
          .sort(
            (a, b) => getStoryTimestamp(a.date) - getStoryTimestamp(b.date)
          );
        setStories(sortedData);
      } catch (error) {
        console.warn(`Грешка при зареждане на разкази за ${year}:`, error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchStories();
  }, [year]);

  if (loading) {
    return <div>Зареждане на разкази...</div>;
  }

  if (stories.length === 0) {
    return <div>Няма намерени разкази за {year} година.</div>;
  }

  return (
    <section className="lessons-stories text">
      <ul>
        {stories.map((story, index) => (
          <li key={index}>
            <PopupContent
              buttonLabel={story.title}
              title={story.title}
              faIconClass="far fa-comment-dots"
              asLink={true}
              maxWidth="md"
            >
              <div className="text u-padding--top">
                <LessonDayContent day={story} shouldShowImg={true} />
              </div>
            </PopupContent>
          </li>
        ))}
      </ul>
    </section>
  );
};
