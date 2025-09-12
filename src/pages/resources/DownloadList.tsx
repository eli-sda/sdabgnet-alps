import { useMemo } from 'react';
import { PlaylistItemType } from 'src/contexts/PlaylistsContext';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import DawnloadListItem from './DawnloadListItem';
import './DownloadList.scss';

type DownloadListProps = {
  author?: string;
  title?: string;
  items?: PlaylistItemType[];
};

const DownloadList = ({ author, title, items }: DownloadListProps) => {
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

  // If title/author exists → wrap in AccordionItem, else show items directly
  return title || author ? (
    <AccordionItem
      faIcon="folder-o"
      faIconOpen="folder-open-o"
      heading={
        <div className="title flex-1">
          {/* Show title or default if missing */}
          <h3>{title && author !== title ? title : ''}</h3>
          <h4 className="author">{author}</h4>
        </div>
      }
    >
      {content}
    </AccordionItem>
  ) : (
    content
  );
};

export default DownloadList;
