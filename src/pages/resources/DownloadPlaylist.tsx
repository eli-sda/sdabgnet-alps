import { useState } from 'react';
import { saveAs } from 'file-saver';
import { zipSync } from 'fflate';
import { Button } from 'src/alps/atoms/Button';

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

  const handleDownload = async (): Promise<void> => {
    if (!itemUrls.length) return;
    setIsLoading(true);

    try {
      const files: Record<string, Uint8Array> = {};

      // Fetch all files in parallel
      await Promise.all(
        itemUrls.map(async (resourcePath, index) => {
          // Use proxy for local development to bypass CORS, PHP proxy for production
          const fetchUrl = import.meta.env.DEV
            ? resourcePath // Use Vite proxy in development
            : `/download-proxy.php?resourcePath=${encodeURIComponent(
                resourcePath
              )}`;

          const res = await fetch(fetchUrl);
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

      // Save ZIP file
      saveAs(zipBlob, `${sanitizeFileName(playlistName)}.zip`);
    } catch (error) {
      console.error('Download failed: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={() => void handleDownload()}
      disabled={isLoading}
      label="Изтегли всички"
      faIcon={isLoading ? 'spinner fa-pulse' : 'download'}
      small
    />
  );
};

export default DownloadPlaylist;
