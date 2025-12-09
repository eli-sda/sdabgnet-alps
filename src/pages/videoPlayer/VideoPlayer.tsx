import { useState } from 'react';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
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
  const { playlistTitle, playlistAuthor, videoItems } = playlist;

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
      {playlistAuthor && <h3>{playlistAuthor}</h3>}

      <div className="videoPlayer-layout">
        <div className="videoPlayer-player">
          <Figure
            caption={currentVideo.title}
            size="large"
            videoSrc={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
          />
        </div>
        <div className="videoPlayer-sidebar u-border--left u-theme--border-color--darker u-spacing">
          {videoItems.map((video, i) => {
            const thumb = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
            const isActive = currentIndex === i;

            return (
              <div
                key={i}
                className={`videoItem ${isActive ? 'active' : ''}`}
                onClick={() => playVideo(i)}
              >
                <div className="video-index-container">
                  <span className="u-font--secondary--xs">
                    {isActive ? <i className="fas fa-play"></i> : i + 1}
                  </span>
                </div>
                <img src={thumb} />
                <h4 className="videoItem-text hyphens-auto">{video.title}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
