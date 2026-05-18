import { useEffect, useState } from 'react';
import { LinkType, PlaylistType } from 'src/contexts/PlaylistsContext';
import { extractYouTubeId, extractRumbleId } from 'src/utils/extractVideoId';
import VideoWithPreview from 'src/components/media/video/videoWithPreview/VideoWithPreview';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import ShareItemButton from 'src/components/ShareItemButton';
import './VideoGrid.scss';

interface VideoGridProps {
  playlists: PlaylistType[];
  videos: LinkType[];
  isPlaylistFirst?: boolean;
  tabParam?: string;
  className?: string;
}

const VideoGrid = ({
  playlists,
  videos,
  isPlaylistFirst = false,
  tabParam,
  className
}: VideoGridProps) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const videoIdPrefix = 'video-';

  const handleHashChange = () => {
    const hash = window.location.hash.slice(1);

    if (hash.startsWith(videoIdPrefix)) {
      const videoId = hash.substring(videoIdPrefix.length);

      // Force refresh even if it is the same id
      setActiveVideo(null);

      setTimeout(() => {
        setActiveVideo(videoId);
      }, 0);
    }
  };

  useEffect(() => {
    // run on mount
    handleHashChange();

    // listen for future changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const getVideoId = (videoSrc: string): string => {
    const videoId = extractYouTubeId(videoSrc) || extractRumbleId(videoSrc);

    if (!videoId) {
      console.warn(`Could not extract video ID from URL: ${videoSrc}`);
    }

    return videoId;
  };

  return (
    <section className={`video-grid-container ${className || ''}`}>
      {isPlaylistFirst && <VideoPlaylistList playlists={playlists} />}

      {videos.map(({ title, author, path, description }) => {
        const videoId = getVideoId(path);

        if (!videoId) return null;

        const isActive = activeVideo === videoId;
        const elementId = `${videoIdPrefix}${videoId}`;

        // Extract thumbnail from the description string
        const parsedThumbnail =
          description && typeof description === 'string'
            ? description.match(/thumbnail:\s*(https?:\/\/[^\s]+)/i)?.[1]
            : undefined;

        const shareUrlObj = new URL(
          window.location.pathname,
          window.location.origin
        );
        if (tabParam) shareUrlObj.searchParams.set('tab', tabParam);
        shareUrlObj.searchParams.set('title', title);
        shareUrlObj.hash = elementId;
        const shareUrl = shareUrlObj.href;

        return (
          <div key={videoId} id={elementId} className="single-video-item">
            <VideoWithPreview
              title={`${title}${author ? ' | ' + author : ''}`}
              videoSrc={path}
              isActive={isActive}
              thumbnail={parsedThumbnail}
              onActivate={setActiveVideo}
              size="large"
            />
            <ShareItemButton url={shareUrl} />
          </div>
        );
      })}

      {!isPlaylistFirst && <VideoPlaylistList playlists={playlists} />}
    </section>
  );
};

export default VideoGrid;
