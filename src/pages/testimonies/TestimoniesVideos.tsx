import { useEffect, useState } from 'react';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import './TestimoniesVideos.scss';

type TestimonyVideo = {
  title: string;
  videoSrc: string;
};

const TestimoniesVideos = () => {
  const [videos, setVideos] = useState<TestimonyVideo[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

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

  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="testimonies-videos-list">
      <VideoPlaylistList playlists={playlists} />

      {videos.map(({ title, videoSrc }, index) => {
        const ytId = getYouTubeId(videoSrc);
        if (ytId) {
          const isActive = activeVideo === ytId;
          return (
            <div key={`${ytId}-${index}`} className="testimonies-videos">
              {!isActive && (
                <Figure
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
                  className="testimonies-videos"
                  caption={title}
                  size="large"
                  videoSrc={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                />
              )}
            </div>
          );
        } else {
          // Not YouTube: show Figure directly
          return (
            <Figure
              key={`${title}-${index}`}
              className="testimonies-videos"
              caption={title}
              size="large"
              videoSrc={videoSrc}
            />
          );
        }
      })}
    </section>
  );
};

export default TestimoniesVideos;
