import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import { LinkType } from 'src/contexts/PlaylistsContext';
import { generateShareUrl, hasMatchingItemHash } from 'src/utils/urlUtils';
import useHashActive from 'src/hooks/useHashActive';
import PlaylistActionButtons from '../playlistButtons/PlaylistActionButtons';
import DownloadListItem from './DownloadListItem';

type DownloadListProps = {
  id?: string;
  author?: string;
  title?: string;
  items?: LinkType[];
  initiallyOpen?: boolean;
};

const DownloadList = ({
  id,
  author,
  title,
  items,
  initiallyOpen
}: DownloadListProps) => {
  const { hash } = useLocation();
  const activeItemId = useHashActive();
  const [refreshCounter, setRefreshCounter] = useState(0);

  // derived state for open accordion
  const isInitiallyOpened = useMemo(() => {
    const openByDefaultOrId = initiallyOpen || (!!id && hash === `#${id}`);
    const openByItemHash = hasMatchingItemHash(items, hash);

    return Boolean(openByDefaultOrId || openByItemHash);
  }, [initiallyOpen, id, hash, items]);

  // Render playlist items
  const content = useMemo(
    () => (
      <div
        className={`u-spacing--double u-space--half--bottom ${id ? 'u-space--top' : ''}`}
      >
        {items?.map((item, i) => (
          <DownloadListItem
            key={i}
            {...item}
            isActive={Boolean(activeItemId === item._id)}
          />
        ))}
      </div>
    ),
    [items, id, activeItemId]
  );

  return id ? (
    <AccordionItem
      id={id}
      open={isInitiallyOpened}
      faIconClass="far fa-folder"
      faIconOpenClass="far fa-folder-open"
      heading={
        <div className="title flex-1">
          <h3>{title && author !== title ? title : ''}</h3>
          <h4 className="author">{author}</h4>
        </div>
      }
      refreshCounter={refreshCounter}
    >
      <PlaylistActionButtons
        shareUrl={generateShareUrl({
          id
        })}
        itemUrls={
          items
            ?.map((item) => item.path)
            .filter((path): path is string => !!path) || []
        }
        playlistName={title}
        setRefreshCounter={setRefreshCounter}
        simpleCopyButton
      />
      {content}
    </AccordionItem>
  ) : (
    <>{content}</>
  );
};

export default DownloadList;
