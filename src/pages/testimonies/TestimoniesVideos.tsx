import { useEffect, useState } from 'react';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
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

  return (
    <section className="testimonies-videos-list">
      <VideoPlaylistList playlists={playlists} />

      {videos.map(({ title, videoSrc }, index) => (
        <Figure
          key={`${title}-${index}`}
          className="testimonies-videos"
          caption={title}
          size="large"
          videoSrc={videoSrc}
        />
      ))}
    </section>
  );
};

export default TestimoniesVideos;
