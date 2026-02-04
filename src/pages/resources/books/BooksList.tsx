import { useMemo } from 'react';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import DownloadListItem from 'src/components/downloadList/DownloadListItem';
import './BooksList.scss';

const BooksList = ({
  sectionTitle,
  description,
  sectionImage,
  books
}: BooksSection) => {
  const heading = useMemo(() => {
    return (
      <div className="book-list-heading">
        {sectionImage ? (
          <img
            src={`/img/author/${sectionImage}`}
            className="heading-image u-space--half--right"
          />
        ) : (
          <SupervisedUserCircleIcon className="user-circle-icon u-space--half--right" />
        )}
        <h3>{sectionTitle}</h3>
      </div>
    );
  }, [sectionImage, sectionTitle]);

  const content = useMemo(
    () => (
      <div className="u-spacing--double u-space--half--bottom">
        {description && <p>{description}</p>}
        {books.map((book, i) => (
          <DownloadListItem key={i} _id={''} {...book} variant="book-row" />
        ))}
      </div>
    ),
    [books, description]
  );

  return (
    <AccordionItem heading={heading} hideDefaultIcon>
      {content}
    </AccordionItem>
  );
};

export default BooksList;
