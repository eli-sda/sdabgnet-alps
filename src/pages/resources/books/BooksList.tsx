import { useMemo } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import { SubNavArrow } from 'alps-library/molecules/navigation/primaryNavItem/SubNavArrow';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import routes from 'src/routes';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import DownloadListItem from 'src/components/downloadList/DownloadListItem';
import './BooksList.scss';

const BooksList = ({
  _id,
  title,
  description,
  imageUrl,
  items
}: PlaylistType) => {
  useScrollToHash();

  const heading = useMemo(() => {
    return (
      <div className="book-list-heading" id={_id}>
        {imageUrl ? (
          <img
            src={imageUrl}
            className="heading-image u-space--quarter u-space--half--right"
          />
        ) : (
          <GroupIcon className="user-circle-icon u-color--white u-background-color--gray u-space--quarter u-space--half--right u-padding--quarter" />
        )}
        <h3>{title}</h3>
        <SubNavArrow className="arrow" />
      </div>
    );
  }, [_id, imageUrl, title]);

  const content = useMemo(
    () => (
      <div className="u-spacing u-space--half--bottom">
        {description && <p>{description}</p>}
        <div className="u-spacing--double">
          {items?.map((book) => {
            const additionalButtons = [];

            let newLifeId = ''; // id in https://newlife-bg.com/
            let audioId = ''; // id to use as internal anchor to Аудио: /resources/audio#<audioId>
            let cleanDescription = book.description || '';

            if (cleanDescription) {
              // Extract newLifeId and remove it from the description
              const newLifeMatch = cleanDescription.match(
                /newLifeId:\s*([^\n\r]+)/
              );
              if (newLifeMatch) {
                newLifeId = newLifeMatch[1].trim();
                cleanDescription = cleanDescription
                  .replace(/newLifeId:\s*[^\n\r]+/, '')
                  .trim();
              }

              // Extract audioId and remove it from the description
              const audioMatch = cleanDescription.match(
                /audioId:\s*([^\n\r]+)/
              );
              if (audioMatch) {
                audioId = audioMatch[1].trim();
                cleanDescription = cleanDescription
                  .replace(/audioId:\s*[^\n\r]+/, '')
                  .trim();
              }
            }

            if (audioId) {
              additionalButtons.push({
                label: 'слушай',
                url: `${routes.resources('audio', 'audiobook')}#${audioId}`,
                as: 'a' as const,
                faIconClass: 'fas fa-volume-up'
              });
            }

            if (newLifeId) {
              additionalButtons.push({
                label: 'виж в издателството',
                url: `https://newlife-bg.com/product/${newLifeId}/`,
                as: 'a' as const,
                isExternal: true
              });
            }

            return (
              <DownloadListItem
                key={book._id}
                {...book}
                description={cleanDescription} // Override the original description
                additionalButtons={additionalButtons}
              />
            );
          })}
        </div>
      </div>
    ),
    [items, description]
  );

  return (
    <AccordionItem heading={heading} hideDefaultIcon>
      {content}
    </AccordionItem>
  );
};

export default BooksList;
