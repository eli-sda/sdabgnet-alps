import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { LinkType } from 'src/contexts/PlaylistsContext';
import DawnloadListItem from './DawnloadListItem';
import './DownloadList.scss';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import { Button } from 'src/alps/atoms/Button';
import { TextField } from 'src/alps/molecules/forms/elements/TextField';

type DownloadListProps = {
  _id: string;
  author?: string;
  title?: string;
  items?: LinkType[];
};

const DownloadList = ({ _id, author, title, items }: DownloadListProps) => {
  const { hash } = useLocation();

  // State controlling accordion open/closed
  const [isOpen, setIsOpen] = useState(false);

  // State for showing copied link
  const [copied, setCopied] = useState(false);

  // Scroll to this playlist if URL hash matches
  useEffect(() => {
    if (hash === `#${_id}`) {
      setIsOpen(true);

      // Smooth scroll when DOM is ready
      const scrollToElement = () => {
        const el = document.getElementById(_id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Retry next animation frame if element not yet rendered
          requestAnimationFrame(scrollToElement);
        }
      };
      requestAnimationFrame(scrollToElement);
    }
  }, [hash, _id]);

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

  const shareUrl = `${window.location.origin}${window.location.pathname}#${_id}`;

  const handleShare = useCallback(() => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => setCopied(true))
      .catch(() => setCopied(true)); // even if failed, still show field
  }, [shareUrl]);

  const shareBlock = (
    <>
      <Button
        className="u-space--half--bottom"
        onClick={handleShare}
        small
        label="Вземи линк"
        icon="share"
      />

      {copied && (
        <div className="share-field-wrapper">
          <TextField
            labelClass="u-space--half--bottom"
            name="share-link"
            label="Линкът е копиран"
            value={shareUrl}
            readOnly
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />

          {/* Hicks button */}
          <Button
            className="close-button"
            faIcon="times"
            onClick={() => setCopied(false)}
            simple
          />
        </div>
      )}
    </>
  );

  return title || author ? (
    <AccordionItem
      id={_id}
      open={isOpen}
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
