import { useState } from 'react';
import { saveAs } from 'file-saver';
import { zipSync } from 'fflate';
import { Button } from 'src/alps/atoms/Button';
import { Progress } from 'alps-library/molecules/components/progress/Progress.tsx';

interface DownloadPlaylistProps {
  itemUrls: string[];
  playlistName: string;
}

// Remove forbidden characters and normalize file names
const sanitizeFileName = (name: string): string =>
  name
    .replace(/[<>:"/\\|?*\s]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

const DownloadPlaylist = ({
  itemUrls,
  playlistName
}: DownloadPlaylistProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number | undefined>(undefined);

  const handleDownload = async (): Promise<void> => {
    if (!itemUrls.length) return;
    setIsLoading(true);
    setProgress(0);

    // Calculate progress step (n files + 1 for zip operation)
    const progressStep = 100 / (itemUrls.length + 1);

    try {
      const files: Record<string, Uint8Array> = {};

      // Fetch files sequentially to track progress
      for (let i = 0; i < itemUrls.length; i++) {
        const resourcePath = itemUrls[i];
        // Use proxy for local development to bypass CORS, PHP proxy for production
        const fetchUrl = import.meta.env.DEV
          ? resourcePath // Use Vite proxy in development
          : `/download-proxy.php?resourcePath=${encodeURIComponent(
              resourcePath
            )}`;

        const res = await fetch(fetchUrl);
        if (!res.ok) continue;

        const blob = await res.blob();
        const buffer = new Uint8Array(await blob.arrayBuffer());

        const fileName = sanitizeFileName(
          resourcePath.split('/').pop()?.split('?')[0] || `file${i + 1}`
        );

        files[fileName] = buffer;

        // Update progress after each file
        setProgress((i + 1) * progressStep);
      }

      // Create ZIP archive
      const zipped = zipSync(files);
      const zipBlob = new Blob([zipped.buffer as ArrayBuffer], {
        type: 'application/zip'
      });

      // Save ZIP file and set final progress
      saveAs(zipBlob, `${sanitizeFileName(playlistName)}.zip`);
      setProgress(100);
    } catch (error) {
      console.error('Download failed: ', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(undefined), 1000); // Hide progress after 1s
    }
  };

  return (
    <div>
      <Button
        onClick={() => void handleDownload()}
        disabled={isLoading}
        label="Изтегли всички"
        faIcon={isLoading ? 'spinner fa-pulse' : 'download'}
        small
      />
      {progress !== undefined && (
        <div className="u-space--half--top">
          <Progress percentage={progress} size="small" />
        </div>
      )}
    </div>
  );
};

export default DownloadPlaylist;
