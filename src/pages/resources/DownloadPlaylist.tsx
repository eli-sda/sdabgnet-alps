import { useState } from 'react';
import { saveAs } from 'file-saver';
import { zipSync } from 'fflate';
import { Button } from 'src/alps/atoms/Button';
import { Progress } from 'alps-library/molecules/components/progress/Progress.tsx';
import { RESOURCES_SITE } from 'src/constants';

interface DownloadPlaylistProps {
  itemUrls: string[];
  playlistName: string;
}

// Remove forbidden characters and normalize file names
const sanitizeFileName = (name: string): string =>
  name
    .replace(/[<>:"/\\|?*]+/g, '_') // Remove only forbidden chars, keep spaces
    .replace(/_+/g, '_') // Replace multiple underscores with single underscore
    .replace(/^_|_$/g, ''); // Trim leading/trailing underscores

const DownloadPlaylist = ({
  itemUrls,
  playlistName
}: DownloadPlaylistProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number | undefined>(undefined);

  // Calculate progress step (n files + 1 for zip operation)
  const progressStep = 100 / (itemUrls.length + 1);

  const nextStep = () => {
    setProgress((prev) => (prev !== undefined ? prev + progressStep : 0));
  };

  const handleDownload = async (): Promise<void> => {
    if (!itemUrls.length) return;
    setProgress(0);
    setIsLoading(true);

    try {
      const files: Record<string, Uint8Array> = {};

      // Fetch all files in parallel
      await Promise.all(
        itemUrls.map(async (resourcePath, index) => {
          const fetchUrl = import.meta.env.DEV
            ? resourcePath // Use Vite proxy in development to bypass CORS
            : `${RESOURCES_SITE}${resourcePath}`;

          const res = await fetch(fetchUrl);
          nextStep();
          if (!res.ok) return;

          const blob = await res.blob();
          const buffer = new Uint8Array(await blob.arrayBuffer());

          const fileName = sanitizeFileName(
            resourcePath.split('/').pop()?.split('?')[0] || `file${index + 1}`
          );

          files[fileName] = buffer;
        })
      );

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
    }
  };

  return (
    <div className="u-spacing--quarter">
      <Button
        onClick={() => void handleDownload()}
        disabled={isLoading}
        label="Изтегли всички"
        faIcon={isLoading ? 'fas fa-spinner fa-pulse' : 'fas fa-download'}
        small
      />
      <Progress percentage={progress} size="small" visible={isLoading} />
    </div>
  );
};

export default DownloadPlaylist;
