import React, { useState, useEffect } from 'react';
import PopupContent from '../PopupContent';
import { LessonDayContent } from './LessonDayContent';
import { LessonDayType } from '../../utils/LessonUtils';
import './LessonsStories.scss';

interface LessonsStoriesProps {
  year: number;
}

export const LessonsStories: React.FC<LessonsStoriesProps> = ({ year }) => {
  const [stories, setStories] = useState<LessonDayType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/json/stories-${year}.json`);

        if (!response.ok) {
          throw new Error(`Failed to load stories for year ${year}`);
        }

        const data = (await response.json()) as LessonDayType[];
        setStories(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
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

  if (error) {
    return <div>Грешка: {error}</div>;
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
              title={story.title}
              buttonLabel={story.title}
              faIconClass="far fa-comment-dots"
              asLink={true}
              maxWidth="md"
            >
              <div className="text">
                <LessonDayContent day={story} shouldShowImg={true} />
              </div>
            </PopupContent>
          </li>
        ))}
      </ul>
    </section>
  );
};
