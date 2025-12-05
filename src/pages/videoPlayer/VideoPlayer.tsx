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
    <div className="videoPlayer u-spacing">
      <HeadingBlock title={playlistTitle} />

      {playlistAuthor && <p>{playlistAuthor}</p>}
      {playlistDescription && <p>{playlistDescription}</p>}

      <div className="videoPlayer-layout">
        <div className="videoPlayer-player">
          <Video
            src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
            title={currentVideo.title || ''}
          />
        </div>

        <div className="videoPlayer-sidebar">
          {videoItems.map((video, i) => {
            const thumb = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
            const isActive = currentIndex === i;

            return (
              <div
                key={i}
                className={`videoItem ${isActive ? 'active' : ''}`}
                onClick={() => playVideo(i)}
              >
                <img src={thumb} />
                <div className="videoItem-text">
                  <p>{video.title}</p>
                  {video.description && <p>{video.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
