import { useEffect, useState } from 'react';
import { LinkType, PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { usePlaylists } from 'src/hooks/usePlaylists';
import ShareVideoButton from 'src/components/ShareVideoButton';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import VideoWithPreview from 'src/components/media/video/videoWithPreview/VideoWithPreview';
import { extractYouTubeId, extractRumbleId } from 'src/utils/extractVideoId';
import './TestimoniesVideos.scss';

const TestimoniesVideos = () => {
  useScrollToHash();

  const { getPlaylists } = usePlaylists();

  const [videos, setVideos] = useState<LinkType[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videoIdPrefix = 'video-';

  useEffect(() => {
    getPlaylists('testimony_video', false)
      .then((data: PlaylistType[]) => {
        // Find the playlist that contains 'SINGLE' in its title
        const singlePlaylist = data.find((p) => p.title?.includes('SINGLE'));

        if (singlePlaylist && singlePlaylist.items) {
          // Set its videos to the videos state
          setVideos(singlePlaylist.items);
        } else {
          setVideos([]);
        }

        // Filter out the 'SINGLE' playlist to keep the rest clean
        const regularPlaylists = data.filter(
          (p) => !p.title?.includes('SINGLE')
        );
        setPlaylists(regularPlaylists);
      })
      .catch((err) => {
        console.error(err);
        setVideos([]);
        setPlaylists([]);
      });
  }, [getPlaylists]);

  const handleHashChange = () => {
    const hash = window.location.hash.slice(1);

    if (hash.startsWith(videoIdPrefix)) {
      const videoId = hash.substring(videoIdPrefix.length);

      // force refresh even if same id
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
    <section className="testimonies-videos-list">
      <VideoPlaylistList playlists={playlists} />

      {videos.map(({ title, URL, description }) => {
        if (!URL) {
          return null;
        }

        const videoId = getVideoId(URL);
        const isActive = activeVideo === videoId;
        const elementId = `${videoIdPrefix}${videoId}`;

        // Extract thumbnail from the description string if it's there
        const parsedThumbnail =
          description && typeof description === 'string'
            ? description.match(/thumbnail:\s*(https?:\/\/[^\s]+)/i)?.[1]
            : undefined;

        return (
          <div key={videoId} id={elementId} className="testimonies-videos">
            <VideoWithPreview
              title={title}
              videoSrc={URL}
              isActive={isActive}
              thumbnail={parsedThumbnail}
              onActivate={setActiveVideo}
              size="large"
            />
            <ShareVideoButton
              url={`${window.location.origin}${window.location.pathname}?tab=videos#${elementId}`}
            />
          </div>
        );
      })}
    </section>
  );
};

export default TestimoniesVideos;
