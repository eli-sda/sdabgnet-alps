import { useState, useEffect, useCallback } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { Caption } from 'alps-library/atoms/text/Caption';
import './VideoPlayer.scss';

export type VideoPlaylistType = {
  _id: string;
  playlistTitle: string;
  playlistAuthor?: string;
  videoItems: {
    videoId: string;
    title?: string;
    description?: string;
  }[];
};

interface VideoPlayerProps {
  playlist: VideoPlaylistType;
  isVisible?: boolean;
}

const VideoPlayer = ({ playlist, isVisible = true }: VideoPlayerProps) => {
  const { playlistTitle, playlistAuthor, videoItems } = playlist;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVideo = videoItems[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
  }, [playlist]);

  const playVideo = (index: number) => {
    if (index < 0) index = videoItems.length - 1;
    if (index >= videoItems.length) index = 0;
    setCurrentIndex(index);
  };

  const handleVideoEnded = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < videoItems.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  }, [videoItems.length]);

  return (
    <div className="videoPlayer u-spacing">
      <HeadingBlock title={playlistTitle} />

      {playlistAuthor && (
        <h3 className="u-font--secondary--m u-theme--color--darker u-space--half--top">
          {playlistAuthor}
        </h3>
      )}

      <Group orientation="horizontal" className="videoPlayer-layout">
        {/* VIDEO PANEL */}
        <Panel defaultSize={70} minSize={40}>
          <div className="videoPlayer-layout-player">
            {currentVideo ? (
              <Figure
                caption={`${currentVideo.title}\n\n${currentVideo.description || ''}`}
                size="large"
                videoSrc={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
                onVideoEnded={handleVideoEnded}
                isVisible={isVisible}
              />
            ) : (
              <Caption>Няма налично видео</Caption>
            )}
          </div>
        </Panel>

        {/* RESIZE HANDLE */}
        <Separator className="videoPlayer-divider" />

        {/* PLAYLIST PANEL */}
        <Panel defaultSize={30} minSize={20}>
          <div className="videoPlayer-layout-sidebar u-border--left u-theme--border-color--darker">
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
        </Panel>
      </Group>
    </div>
  );
};

export default VideoPlayer;
