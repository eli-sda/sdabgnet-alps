import { useEffect, useMemo, useState, useCallback } from 'react';
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

  // smooth scroll when hash matches
  useEffect(() => {
    if (!isInitiallyOpened || !id) return;

    const scrollToElement = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        requestAnimationFrame(scrollToElement);
      }
    };
    requestAnimationFrame(scrollToElement);
  }, [isInitiallyOpened, id]);

  // State for label text
  const [copied, setCopied] = useState('');

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

  const shareUrl = id
    ? `${window.location.origin}${window.location.pathname}#${id}`
    : '';

  const handleShare = useCallback(() => {
    if (!shareUrl) return;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => setCopied('Линкът е копиран'))
      .catch(() => setCopied(''));
  }, [shareUrl]);

  const shareBlock = id && (
    <PlaylistActionButtons
      shareUrl={shareUrl}
      copied={copied}
      onShare={handleShare}
      onClose={() => setCopied('')}
    />
  );

  return title || author ? (
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
      {shareBlock}
      {content}
    </AccordionItem>
  ) : (
    <>
      {shareBlock}
      {content}
    </>
  );
};

export default DownloadList;
