import { useState, useMemo } from 'react';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Pagination } from 'alps-library/molecules/navigation/pagination/Pagination';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import { DictionaryType } from 'src/contexts/DictionaryContext';
import { DictionaryListItem } from './DictionaryListItem';
import './DictionaryList.scss';

const ITEMS_PER_PAGE = 20;

export const DictionaryList = ({
  items
}: {
  items: DictionaryType[];
}): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [items, currentPage]);

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
