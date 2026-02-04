import { useMemo, useState } from 'react';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { Button } from 'src/alps/atoms/Button';
import routes from 'src/routes';
import { RESOURCES_SITE, RESOURCES_FOLDER } from 'src/constants';
import { LinkType } from 'src/contexts/PlaylistsContext';
import './DownloadListItem.scss';

interface DownloadListItemProps extends LinkType {
  variant?: 'default' | 'book-row';
  audioId?: number | string;
  newLifeId?: number | string;
}

const DownloadListItem = ({
  title,
  description,
  _id,
  path,
  size,
  audioId,
  newLifeId,
  variant = 'default'
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

    return { htmlContent: processedHtml, videos };
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

  const renderVideoContent = () => (
    <div>
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

  const buttonProps = {
    outline: true,
    simple: true,
    small: true
  };

  const downloadButton = (
    <Button
      key={_id}
      as="button"
      onClick={() => void handleDownload(url)}
      disabled={downloading}
      faIconClass={
        downloading ? 'fas fa-spinner fa-pulse fa-lg' : 'fas fa-download'
      }
      label={
        variant === 'book-row'
          ? 'изтегли'
          : `Изтегли ${size ? `(${size} MB)` : ''}`
      }
      {...(variant === 'book-row'
        ? buttonProps
        : { className: 'u-space--half--top', small: true })}
    />
  );

  if (variant === 'book-row') {
    return (
      <div className="book-row u-spacing--half">
        <div className="title hyphens-auto">
          <AutoStoriesIcon className="u-space--half--right" />
          <h3>{title}</h3>
        </div>

        {htmlContent && (
          <div className="book-description">{renderVideoContent()}</div>
        )}

        <div className="action-buttons">
          {downloadButton}

          {audioId && (
            <Button
              label="слушай"
              as="a"
              url={`${routes.resources('audio', 'audiobook')}#${audioId}`}
              faIconClass="fas fa-volume-up"
              {...buttonProps}
            />
          )}

          {newLifeId && (
            <Button
              label="виж в издателството"
              as="a"
              url={`https://newlife-bg.com/product/${newLifeId}/`}
              isExternal
              hideExternalIcon
              faIconClass="fas fa-external-link-alt"
              {...buttonProps}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="download-item">
      <h3>
        <i
          className={`far fa-${icon} u-space--half--right`}
          aria-hidden="true"
        ></i>
      </h3>
      <div>
        <h3 className="u-space--quarter--bottom">{title}</h3>
        {htmlContent && <div>{renderVideoContent()}</div>}
        {downloadButton}
      </div>
    </div>
  );
};

export default DownloadListItem;
