import { useState, useMemo, useEffect } from 'react';
import { Pagination } from 'alps-library/molecules/navigation/pagination/Pagination';
import { Button } from 'src/alps/atoms/Button';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { DictionaryType } from 'src/contexts/DictionaryContext';
import { getTitle } from 'src/utils/Navigation';
import { useDictionary } from 'src/hooks/useDictionary';
import { DictionaryList } from './DictionaryList';
import './Dictionary.scss';

const ITEMS_PER_PAGE = 20;

const Dictionary = (): JSX.Element => {
  const breadcrumbsUrls = [routes.info(), routes.info('dictionary')];

  const [dictionaryData, setDictionaryData] = useState<DictionaryType[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { getDictionary } = useDictionary();

  useEffect(() => {
    getDictionary()
      .then((data: DictionaryType[]) => {
        setDictionaryData(data);
      })
      .catch((err) => {
        console.error('Failed to load dictionary:', err);
      });
  }, [getDictionary]);

  // useEffect(() => {
  //   fetch('/json/dictionary.json')
  //     .then((res) => res.json())
  //     .then((data: DictionaryType[]) => {
  //       setDictionaryData(data);
  //     })
  //     .catch((err) => {
  //       console.error('Failed to load dictionary.json', err);
  //       setDictionaryData([]);
  //     });
  // }, []);

  const availableLetters = useMemo(() => {
    const letters = new Set(
      dictionaryData.map((item) => item.topic.charAt(0).toUpperCase())
    );
    return Array.from(letters).sort((a, b) => a.localeCompare(b, 'bg'));
  }, [dictionaryData]);

  const filteredTopics = useMemo(() => {
    let result = [...dictionaryData];

    if (selectedLetter) {
      result = result.filter((item) =>
        item.topic.toUpperCase().startsWith(selectedLetter)
      );
    }

    return result.sort((a, b) => a.topic.localeCompare(b.topic, 'bg'));
  }, [dictionaryData, selectedLetter]);

  const totalPages = Math.ceil(filteredTopics.length / ITEMS_PER_PAGE);

  const paginatedTopics = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTopics.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTopics, currentPage]);

  const handleLetterClick = (letter: string | null) => {
    setSelectedLetter(letter);
    setCurrentPage(1);
  };

  return (
    <Page
      title={getTitle(routes.info('dictionary'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <div className="dictionary-page">
        <div className="dictionary-tabs u-padding u-space--bottom">
          <Button
            onClick={() => handleLetterClick(null)}
            className={`dictionary-tab-btn ${selectedLetter === null ? 'is-active' : ''}`}
            label="Всички"
          />
          {availableLetters.map((letter) => (
            <Button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={`dictionary-tab-btn ${selectedLetter === letter ? 'is-active' : ''}`}
              label={letter}
            />
          ))}
        </div>

        <DictionaryList items={paginatedTopics} />

        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            total={totalPages}
            onPageClick={() => {}}
            onNextClick={() => {}}
            onPrevClick={() => {}}
            nextLabel="Следваща"
            prevLabel="Предишна"
            onPageSelect={(pageNumber: number) => setCurrentPage(pageNumber)}
            setUrl={(pageNumber: number) => `?page=${pageNumber}`}
            surrounding={0}
            className="u-space--top"
          />
        )}
      </div>
    </Page>
  );
};

export default Dictionary;
