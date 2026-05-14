import { useMemo, useState } from 'react';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { Button, ButtonProps } from 'src/alps/atoms/Button';
import { RESOURCES_SITE, RESOURCES_FOLDER } from 'src/constants';
import { LinkType } from 'src/contexts/PlaylistsContext';
import { generateShareUrl } from 'src/utils/urlUtils';
import ShareItemButton from '../ShareItemButton';
import './DownloadListItem.scss';

interface DownloadListItemProps extends LinkType {
  additionalButtons?: ButtonProps[];
  shareUrl?: string;
  isActive?: boolean; // highlight/animate download button
}

const DownloadListItem = ({
  title,
  author,
  description,
  _id,
  path,
  size,
  additionalButtons = [],
  shareUrl,
  isActive = false
}: DownloadListItemProps) => {
  const icon = useMemo(() => {
    if (path.endsWith('.pdf')) return 'file-pdf';
    if (path.endsWith('.doc') || path.endsWith('.docx')) return 'file-word';
    if (path.endsWith('.xls') || path.endsWith('.xlsx')) return 'file-excel';
    if (path.endsWith('.ppt') || path.endsWith('.pptx'))
      return 'file-powerpoint';
    if (path.endsWith('.zip') || path.endsWith('.rar')) return 'file-archive';
    if (path.endsWith('.mp3') || path.endsWith('.wav')) return 'file-audio';
    if (path.endsWith('.mp4') || path.endsWith('.mov') || path.endsWith('.avi'))
      return 'file-video';
    return 'file';
  }, [path]);

  const [downloading, setDownloading] = useState(false);

  // Parse description for video embeds
  // Format: [VIDEO:youtube_url|caption_text]
  const { htmlContent, videos } = useMemo(() => {
    if (!description) return { htmlContent: '', videos: [] };

    const videoRegex = /\[VIDEO:([^|]+)\|([^\]]+)\]/g;
    const videos: Array<{ url: string; caption: string }> = [];

    // Extract videos and replace tags with placeholders
    const processedHtml = description.replace(
      videoRegex,
      (_match: string, url: string, caption: string) => {
        const cleanUrl = url.trim();
        const cleanCaption = caption.trim();
        if (import.meta.env.DEV) {
          console.log('[DownloadListItem] Parsed video URL:', cleanUrl);
        }
        videos.push({ url: cleanUrl, caption: cleanCaption });
        return `__VIDEO_${videos.length - 1}__`;
      }
    );

    const htmlWithBreaks = processedHtml.replace(/\n/g, '<br/>');

    return { htmlContent: htmlWithBreaks, videos };
  }, [description]);

  const url = useMemo(() => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const resourcePath = `${RESOURCES_FOLDER}${path.replace(/^\/+/, '')}`;
    const url = import.meta.env.DEV
      ? resourcePath // Use Vite proxy in development to bypass CORS
      : `${RESOURCES_SITE}${resourcePath}`;
    return url;
  }, [path]);

  const handleDownload = async (fileUrl: string) => {
    setDownloading(true);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Create URL and trigger browser download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileUrl?.split('/').pop() || 'download';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  const renderVideoContent = useMemo(() => {
    return (
      <div className="u-spacing">
        {htmlContent.split(/(__VIDEO_\d+__)/g).map((part, index) => {
          const videoMatch = part.match(/^__VIDEO_(\d+)__$/);

          if (videoMatch) {
            const videoIndex = parseInt(videoMatch[1], 10);
            const video = videos[videoIndex];

            return video ? (
              <Figure
                key={`video-${index}`}
                caption={video.caption}
                size="large"
                videoSrc={video.url}
              />
            ) : null;
          }

          return part ? (
            <div
              key={`text-${index}`}
              dangerouslySetInnerHTML={{ __html: part }}
            />
          ) : null;
        })}
      </div>
    );
  }, [htmlContent, videos]);

  const downloadButton = (
    <Button
      key={_id}
      as="button"
      onClick={() => void handleDownload(url)}
      disabled={downloading}
      faIconClass={
        downloading
          ? 'fas fa-spinner fa-pulse fa-lg'
          : `fas fa-download fa-lg${isActive ? ' is-active' : ''}`
      }
      label={`Изтегли ${size ? `(${size} MB)` : ''}`}
      className="u-space--half--top"
      small
    />
  );

  const additionalButtonsJsx = useMemo(() => {
    return additionalButtons.map((btn, i) => (
      <Button key={`btn-${i}`} className="u-space--half--top" {...btn} small />
    ));
  }, [additionalButtons]);

  return (
    <div id={_id} className="download-item">
      <h3>
        <i
          className={`far fa-${icon} u-space--half--right`}
          aria-hidden="true"
        ></i>
      </h3>
      <div>
        <h3 className="u-space--quarter--bottom hyphens-auto">{title}</h3>
        {author && (
          <h3 className="c-block__kicker u-space--quarter--bottom">{author}</h3>
        )}
        {htmlContent && <div>{renderVideoContent}</div>}
        <div className="action-buttons">
          {downloadButton}
          <ShareItemButton
            url={
              shareUrl ||
              generateShareUrl({
                id: _id,
                title
              })
            }
            btnClassName="u-space--half--top"
          />
          {additionalButtonsJsx}
        </div>
      </div>
    </div>
  );
};

export default DownloadListItem;
