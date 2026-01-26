import { useEffect, useState } from 'react';
import { Button } from 'src/alps/atoms/Button';
import { LessonsStories } from '../../components/lesson/LessonsStories';
import './TestimoniesStories.scss';

interface YearData {
  year: string;
  file: string;
  count: number;
}

const TestimoniesStories = () => {
  const [years, setYears] = useState<YearData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    fetch('/json/stories-index.json')
      .then((res) => res.json())
      .then((data: { years: YearData[] }) => {
        setYears(data.years);
        if (data.years.length > 0) {
          setSelectedYear(data.years[0].year);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <section className='testimonies-stories'>
      <div className='year-buttons u-space--bottom'>
        {years.map((yearData) => (
          <Button
            key={yearData.year}
            label={yearData.year}
            onClick={() => setSelectedYear(yearData.year)}
            className={selectedYear === yearData.year ? 'selected-button' : ''}
            outline
          />
        ))}
      </div>

      {selectedYear && <LessonsStories year={parseInt(selectedYear)} />}
    </section>
  );
};

export default TestimoniesStories;
