import { useEffect, useState } from 'react';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import ShareVideoButton from 'src/components/ShareVideoButton';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import '/src/styles/VideoPreview.scss';
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
        const isYouTube = videoSrc.includes('youtube.com');
        const isRumble = videoSrc.includes('rumble.com');
        const isActive = activeVideo === id;
        const videoId = `${videoIdPrefix}${id}`;

        return (
          <div
            key={videoId}
            id={videoId}
            className={`testimonies-videos${isActive ? ' is-active' : ''}`}
          >
            {isYouTube ? (
              <Figure
                className={`testimonies-videos video-preview ${isActive ? 'is-active' : ''}`}
                caption={title}
                size="large"
                image={
                  !isActive
                    ? getImageTypeByUrl(
                        `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                      )
                    : undefined
                }
                onImageClick={!isActive ? () => setActiveVideo(id) : undefined}
                videoSrc={
                  isActive
                    ? `https://www.youtube.com/embed/${id}?autoplay=1`
                    : undefined
                }
              />
            ) : isRumble && thumbnail ? (
              <Figure
                className="testimonies-videos video-preview"
                caption={title}
                size="large"
                image={getImageTypeByUrl(thumbnail)}
                onImageClick={() =>
                  window.open(videoSrc, '_blank', 'noopener,noreferrer')
                }
              />
            ) : (
              <Figure
                className="testimonies-videos video-preview"
                caption={title}
                size="large"
                videoSrc={videoSrc}
              />
            )}
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
