import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LinkType } from 'src/contexts/PlaylistsContext';
import DawnloadListItem from './DawnloadListItem';
import './DownloadList.scss';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import PlaylistActionButtons from './PlaylistActionButtons';

type DownloadListProps = {
  id?: string;
  author?: string;
  title?: string;
  items?: LinkType[];
};

const DownloadList = ({ id, author, title, items }: DownloadListProps) => {
  const { hash } = useLocation();

  // derived state for open accordion
  const isInitiallyOpened = !!id && hash === `#${id}`;

  // Render playlist items
  const content = useMemo(
    () => (
      <div className="u-spacing--double">
        {items?.map((item, i) => (
          <DawnloadListItem key={i} {...item} />
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
    >
      <PlaylistActionButtons
        shareUrl={`${window.location.origin}${window.location.pathname}#${id}`}
      />
      {content}
    </AccordionItem>
  ) : (
    <>{content}</>
  );
};

export default DownloadList;
