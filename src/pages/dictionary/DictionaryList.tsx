import { useState, useMemo } from 'react';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Pagination } from 'alps-library/molecules/navigation/pagination/Pagination';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import { Button } from 'src/alps/atoms/Button';
import { DictionaryType } from 'src/contexts/DictionaryContext';
import { DictionaryListItem } from './DictionaryListItem';
import './DictionaryList.scss';

export const DictionaryList = ({
  items,
  itemsPerPage = 20
}: {
  items: DictionaryType[];
  itemsPerPage?: number;
}): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const availableLetters = useMemo(() => {
    const letters = new Set(
      items.map((item) => item.topic.charAt(0).toUpperCase())
    );
    return Array.from(letters).sort((a, b) => a.localeCompare(b, 'bg'));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedLetter) return items;
    return items.filter((item) =>
      item.topic.toUpperCase().startsWith(selectedLetter)
    );
  }, [items, selectedLetter]);

  const handleLetterClick = (letter: string | null) => {
    setSelectedLetter(letter);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    //scroll to the top of the dictionary list when changing pages
    const element = document.getElementById('dictionary-tabs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (items.length === 0) {
    return <Caption>Няма намерени теми.</Caption>;
  }

  return (
    <>
      <div
        id="dictionary-tabs"
        className="dictionary-tabs u-padding u-space--bottom"
      >
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

      <Accordion className="dictionary-list text">
        {paginatedItems.map((item) => (
          <DictionaryListItem key={item.topic} item={item} />
        ))}
      </Accordion>

      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          total={totalPages}
          onPageClick={handlePageChange}
          onNextClick={() => handlePageChange(currentPage + 1)}
          onPrevClick={() => handlePageChange(currentPage - 1)}
          nextLabel="Следваща"
          prevLabel="Предишна"
          setUrl={(_pageNumber: number) => `#${_pageNumber}`}
          surrounding={1}
          className="u-space--top"
        />
      )}
    </>
  );
};
