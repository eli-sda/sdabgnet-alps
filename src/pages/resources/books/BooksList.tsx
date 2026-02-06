import { useMemo } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import routes from 'src/routes';
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
            className="heading-image u-space--quarter u-space--half--right"
          />
        ) : (
          <GroupIcon className="user-circle-icon u-color--white u-background-color--gray u-space--quarter u-space--half--right u-padding--quarter" />
        )}
        <h3>{sectionTitle}</h3>
      </div>
    );
  }, [sectionImage, sectionTitle]);

  const content = useMemo(
    () => (
      <div className="u-spacing u-space--half--bottom">
        {description && <p>{description}</p>}
        <div className="u-spacing--double">
          {books.map((book, i) => {
            const additionalButtons = [];

            if (book.audioId) {
              additionalButtons.push({
                label: 'слушай',
                url: `${routes.resources('audio', 'audiobook')}#${book.audioId}`,
                as: 'a' as const,
                faIconClass: 'fas fa-volume-up'
              });
            }

            if (book.newLifeId) {
              additionalButtons.push({
                label: 'виж в издателството',
                url: `https://newlife-bg.com/product/${book.newLifeId}/`,
                as: 'a' as const,
                isExternal: true
              });
            }

            return (
              <DownloadListItem
                key={i}
                _id={`book-${i}`}
                {...book}
                additionalButtons={additionalButtons}
              />
            );
          })}
        </div>
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
