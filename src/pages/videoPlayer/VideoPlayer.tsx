import { useState } from 'react';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Video } from 'alps-library/atoms/video/Video';
import './VideoPlayer.scss';

export type VideoPlaylistType = {
  playlistTitle: string;
  playlistAuthor?: string;
  playlistDescription?: string;
  videoItems: {
    videoId: string;
    title?: string;
    description?: string;
  }[];
};

interface VideoPlayerProps {
  playlist: VideoPlaylistType;
}

const VideoPlayer = ({ playlist }: VideoPlayerProps) => {
  const { playlistTitle, playlistAuthor, playlistDescription, videoItems } =
    playlist;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVideo = videoItems[currentIndex];

  const playVideo = (index: number) => {
    if (index < 0) index = videoItems.length - 1;
    if (index >= videoItems.length) index = 0;
    setCurrentIndex(index);
  };

  return (
    <div className="u-spacing">
      <HeadingBlock title={playlistTitle} />

      {playlistAuthor && <p>{playlistAuthor}</p>}
      {playlistDescription && <p>{playlistDescription}</p>}

      <div>
        <Video
          src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
          title={currentVideo.title || ''}
        />
      </div>

      <div className="video-contsiner">
        {videoItems.map((video, i) => {
          const thumb = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
          const isActive = currentIndex === i;

          return (
            <div
              key={i}
              className={`video-thumb ${isActive ? 'active' : ''}`}
              onClick={() => playVideo(i)}
            >
              <img src={thumb} />
              {video.title && (
                <p className="u-space--half--top">{video.title}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoPlayer;
