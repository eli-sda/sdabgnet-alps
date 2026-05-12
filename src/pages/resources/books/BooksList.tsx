import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  items,
  isFiltered
}: PlaylistType & { isFiltered?: boolean }) => {
  useScrollToHash();
  const { hash } = useLocation();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);

  // Animate icon when hash matches a book
  useEffect(() => {
    if (!hash) return;
    const targetHashId = hash.replace('#', '');
    setActiveBookId(null);
    let resetTimeout: number;
    const delay = window.setTimeout(() => {
      setActiveBookId(targetHashId);
      resetTimeout = window.setTimeout(() => setActiveBookId(null), 5000);
    }, 1100);
    return () => {
      clearTimeout(delay);
      clearTimeout(resetTimeout);
    };
  }, [hash]);

  // Determine if this accordion should be initially open based on the hash
  const isInitiallyOpened = useMemo(() => {
    const targetHashId = hash.replace('#', '');

    const openByHash = items?.some((book) => book._id === targetHashId);
    const openByFilter = Boolean(isFiltered && items && items.length > 0);

    return Boolean(openByHash || openByFilter);
  }, [hash, items, isFiltered]);

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

  const handleCopyLink = useCallback((bookId: string, bookTitle: string) => {
    const baseUrl = `${window.location.origin}${routes.resources('books')}`;
    const params = new URLSearchParams();

    params.set('title', bookTitle);

    const finalUrl = `${baseUrl}?${params.toString()}#${bookId}`;

    void navigator.clipboard.writeText(finalUrl).then(() => {
      setCopiedId(bookId);
      setTimeout(() => setCopiedId(null), 3000);
    });
  }, []);

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

            const displayAuthor =
              book.author && title === 'Други' ? `${book.author}` : ''; // show the author only if the book is in 'Други' playlist, otherwise it is visible in the title of the playlist

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

            const isCopied = copiedId === book._id;

            additionalButtons.push({
              label: isCopied ? 'Линкът е копиран' : 'Вземи линк',
              as: 'button' as const,
              disabled: copiedId === book._id,
              onClick: () => handleCopyLink(book._id, book.title),
              faIconClass: isCopied ? 'fas fa-check' : 'fas fa-share-alt'
            });

            return (
              <DownloadListItem
                key={book._id}
                {...book}
                author={displayAuthor}
                description={cleanDescription} // Override the original description
                additionalButtons={additionalButtons}
                isActive={activeBookId === book._id}
              />
            );
          })}
        </div>
      </div>
    ),
    [items, description, copiedId, handleCopyLink, activeBookId, title]
  );

  return (
    <AccordionItem heading={heading} hideDefaultIcon open={isInitiallyOpened}>
      {content}
    </AccordionItem>
  );
};

export default BooksList;
