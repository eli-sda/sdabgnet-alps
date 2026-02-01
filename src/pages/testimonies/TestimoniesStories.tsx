import { useState } from 'react';
import { Button } from 'src/alps/atoms/Button';
import { LessonsStories } from '../../components/lesson/LessonsStories';
import './TestimoniesStories.scss';

const TestimoniesStories = () => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear; year >= 2024; year--) {
    years.push(year);
  }
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  return (
    <section className="testimonies-stories">
      <div className="year-buttons u-space--bottom">
        {years.map((year) => (
          <Button
            key={year}
            label={`${year.toString()} г.`}
            onClick={() => setSelectedYear(year)}
            className={selectedYear === year ? 'selected-button' : ''}
            outline
          />
        ))}
      </div>

      <LessonsStories year={selectedYear} />
    </section>
  );
};

export default TestimoniesStories;
