import { useEffect, useState } from 'react';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import ShareVideoButton from 'src/components/ShareVideoButton';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import VideoWithPreview from 'src/components/videoWithPreview/VideoWithPreview';
import './TestimoniesVideos.scss';

type TestimonyVideo = {
  id: string;
  title: string;
  videoSrc: string;
  thumbnail?: string;
};

const TestimoniesVideos = () => {
  useScrollToHash();

  const [videos, setVideos] = useState<TestimonyVideo[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videoIdPrefix = 'video-';

  useEffect(() => {
    fetch('/json/testimonies-videos.json')
      .then((res) => res.json())
      .then((data: TestimonyVideo[]) => {
        setVideos(data);
      })
      .catch((err) => {
        console.error(err);
        setVideos([]);
      });

    fetch('/json/testimonies-video-playlist.json')
      .then((res) => res.json())
      .then((data: PlaylistType[]) => {
        setPlaylists(data);
      })
      .catch((err) => {
        console.error(err);
        setPlaylists([]);
      });
  }, []);

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

  return (
    <section className="testimonies-videos-list">
      <VideoPlaylistList playlists={playlists} />

      {videos.map(({ id, title, videoSrc, thumbnail }) => {
        const isActive = activeVideo === id;
        const videoId = `${videoIdPrefix}${id}`;

        return (
          <div
            key={videoId}
            id={videoId}
            className={`testimonies-videos${isActive ? ' is-active' : ''}`}
          >
            <VideoWithPreview
              id={id}
              title={title}
              videoSrc={videoSrc}
              isActive={isActive}
              thumbnail={thumbnail}
              onActivate={setActiveVideo}
              size="large"
            />
            <ShareVideoButton
              url={`${window.location.origin}${window.location.pathname}?tab=videos#${videoId}`}
            />
          </div>
        );
      })}
    </section>
  );
};

export default TestimoniesVideos;
