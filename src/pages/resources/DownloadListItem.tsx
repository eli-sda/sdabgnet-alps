import { useMemo, useState } from 'react';
import { RESOURCES_SITE, RESOURCES_FOLDER } from 'src/constants';
import { LinkType } from 'src/contexts/PlaylistsContext';
import { Button } from 'src/alps/atoms/Button';

const DownloadListItem = ({
  title,
  description,
  _id,
  path,
  size
}: LinkType) => {
  const icon = useMemo(() => {
    if (path.endsWith('.pdf')) return 'file-pdf-o';
    if (path.endsWith('.doc') || path.endsWith('.docx')) return 'file-word-o';
    if (path.endsWith('.xls') || path.endsWith('.xlsx')) return 'file-excel-o';
    if (path.endsWith('.ppt') || path.endsWith('.pptx'))
      return 'file-powerpoint-o';
    if (path.endsWith('.zip') || path.endsWith('.rar')) return 'file-archive-o';
    if (path.endsWith('.mp3') || path.endsWith('.wav')) return 'file-audio-o';
    if (path.endsWith('.mp4') || path.endsWith('.mov') || path.endsWith('.avi'))
      return 'file-video-o';
    return 'file-o';
  }, [path]);

  const [downloading, setDownloading] = useState(false);

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
    }
    setDownloading(false);
  };

  return (
    <div className="download-item">
      <h3>
        <i
          className={`fa fa-${icon} u-space--half--right`}
          aria-hidden="true"
        ></i>
      </h3>
      <div>
        <h3 className="u-space--quarter--bottom">{title}</h3>
        <p
          dangerouslySetInnerHTML={{
            __html: description || ''
          }}
        ></p>
        <Button
          key={_id}
          as="button"
          onClick={() => void handleDownload(url)}
          disabled={downloading}
          small
          className="u-space--half--top"
          faIcon={downloading ? 'spinner fa-pulse' : 'download'}
          label={`Изтегли ${size ? `(${size} MB)` : ''}`}
          isExternal
          download
        />
      </div>
    </div>
  );
};

export default DownloadListItem;
