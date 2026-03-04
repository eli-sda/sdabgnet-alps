import { useEffect, useState } from 'react';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import ShareVideoButton from 'src/components/ShareVideoButton';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import './TestimoniesVideos.scss';

type TestimonyVideo = {
  title: string;
  videoSrc: string;
  videoId?: string;
};

const TestimoniesVideos = () => {
  useScrollToHash();

  const [videos, setVideos] = useState<TestimonyVideo[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

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

  // Helper to extract YouTube video ID from URL
  function getYouTubeId(url: string): string | null {
    // Handles youtube.com/watch?v=, youtu.be/, and youtube.com/embed/
    const match = url.match(
      /(?:youtube\.com\/(?:.*[?&]v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);

      if (hash.startsWith('video=')) {
        const videoId = hash.substring(6);

        // force refresh even if same id
        setActiveVideo(null);

        setTimeout(() => {
          setActiveVideo(videoId);
        }, 0);
      }
    };

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

      {videos.map(({ title, videoSrc, videoId }, index) => {
        const ytId = getYouTubeId(videoSrc);
        if (ytId) {
          const isActive = activeVideo === ytId;
          return (
            <div key={`${ytId}-${index}`} className="testimonies-videos">
              {!isActive && (
                <Figure
                  id={ytId}
                  className="testimonies-videos"
                  caption={title}
                  size="large"
                  image={getImageTypeByUrl(
                    `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                  )}
                  onImageClick={() => setActiveVideo(ytId)}
                />
              )}
              {isActive && (
                <Figure
                  id={`video=${ytId}`}
                  className="testimonies-videos"
                  caption={title}
                  size="large"
                  videoSrc={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                />
              )}
              <ShareVideoButton
                url={`${window.location.origin}${window.location.pathname}?tab=videos#video=${ytId}`}
              />
            </div>
          );
        } else {
          // Not YouTube: show Figure directly
          return (
            <div key={`video-${index}`} className="testimonies-videos">
              <Figure
                id={`video=${videoId}`}
                key={`${title}-${index}`}
                className="testimonies-videos"
                caption={title}
                size="large"
                videoSrc={videoSrc}
              />
              <ShareVideoButton
                url={`${window.location.origin}${window.location.pathname}?tab=videos#video=${videoId}`}
              />
            </div>
          );
        }
      })}
    </section>
  );
};

export default TestimoniesVideos;
