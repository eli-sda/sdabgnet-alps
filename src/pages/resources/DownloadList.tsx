import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LinkType } from 'src/contexts/PlaylistsContext';
import DownloadListItem from './DownloadListItem';
import './DownloadList.scss';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import PlaylistActionButtons from './PlaylistActionButtons';

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
  const [refreshCounter, setRefreshCounter] = useState(0);

  // derived state for open accordion
  const isInitiallyOpened = initiallyOpen || (!!id && hash === `#${id}`);

  // Render playlist items
  const content = useMemo(
    () => (
      <div className="u-spacing--double u-space--half--bottom">
        {items?.map((item, i) => (
          <DownloadListItem key={i} {...item} />
        ))}
      </div>
    ),
    [items]
  );

  return id ? (
    <AccordionItem
      id={id}
      open={isInitiallyOpened}
      faIcon="folder-o"
      faIconOpen="folder-open-o"
      heading={
        <div className="title flex-1">
          <h3>{title && author !== title ? title : ''}</h3>
          <h4 className="author">{author}</h4>
        </div>
      }
      refreshCounter={refreshCounter}
    >
      <PlaylistActionButtons
        shareUrl={`${window.location.origin}${window.location.pathname}#${id}`}
        itemUrls={
          items
            ?.map((item) => item.path)
            .filter((path): path is string => !!path) || []
        }
        playlistName={title}
        setRefreshCounter={setRefreshCounter}
      />
      {content}
    </AccordionItem>
  ) : (
    <>{content}</>
  );
};

export default DownloadList;
