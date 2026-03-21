import { useState, useEffect, useCallback } from 'react';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Button } from 'src/alps/atoms/Button';
import ShareVideoButton from 'src/components/ShareVideoButton';
import './VideoPlayer.scss';

export type VideoPlaylistType = {
  _id: string;
  playlistTitle: string;
  playlistAuthor?: string;
  videoItems: {
    _id: string;
    videoId: string;
    title: string;
    description?: string;
  }[];
};

interface VideoPlayerProps {
  playlist: VideoPlaylistType;
  isVisible?: boolean;
  initialIndex?: number;
}

const VideoPlayer = ({
  playlist,
  isVisible = true,
  initialIndex = 0
}: VideoPlayerProps) => {
  const { playlistTitle, playlistAuthor, videoItems } = playlist;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentVideo = videoItems[currentIndex];

  useEffect(() => {
    if (!videoItems?.length) return;

    setCurrentIndex(initialIndex);
  }, [playlist, initialIndex, videoItems.length]);

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

  const handleCopyLink = (videoId: string, videoTitle: string) => {
    const finalUrl = computeFinalUrl(videoId, videoTitle);

    if (!finalUrl) return;

    void navigator.clipboard.writeText(finalUrl).then(() => {
      setCopiedId(videoId);
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  const computeFinalUrl = (videoId: string, videoTitle: string) => {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const hash = '#' + playlist._id;

    const params = new URLSearchParams();
    const currentTab = new URLSearchParams(window.location.search).get('tab');
    if (currentTab) {
      params.set('tab', currentTab);
    }
    params.set('playlistId', playlist._id);
    params.set('playId', videoId);
    params.set('playlistTitle', playlistTitle);
    params.set('title', videoTitle);

    return `${baseUrl}?${params.toString()}${hash}`;
  };

  return (
    <div className="videoPlayer u-spacing">
      {playlistAuthor && (
        <h3 className="u-font--secondary--m u-theme--color--darker u-space--half--top">
          {playlistAuthor}
        </h3>
      )}

      <div className="videoPlayer-layout">
        <div className="videoPlayer-layout-player">
          {currentVideo ? (
            <>
              <Figure
                caption={`${currentVideo.title}\n\n${
                  currentVideo.description || ''
                }`}
                size="large"
                videoSrc={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
                onVideoEnded={handleVideoEnded}
                isVisible={isVisible}
              />
              <ShareVideoButton
                url={computeFinalUrl(currentVideo._id, currentVideo.title)}
                btnClassName="share-video-button"
              />
            </>
          ) : (
            <Caption>Няма налично видео</Caption>
          )}
        </div>
        <div className="videoPlayer-layout-sidebar u-spacing--half u-theme--border-color--darker">
          {videoItems.map((video, i) => {
            const thumb = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
            const isActive = currentIndex === i;

            return (
              <div
                key={i}
                className={`videoItem u-border--left ${isActive ? 'active' : ''}`}
                onClick={() => playVideo(i)}
              >
                <div className="videoItem-thumb">
                  <div className="video-index-container">
                    <span className="u-font--secondary--xs u-space--half--right">
                      {isActive ? <i className="fas fa-play"></i> : i + 1}
                    </span>
                  </div>
                  <img src={thumb} />
                </div>
                <h4 className="videoItem-text hyphens-auto">{video.title}</h4>

                <Button
                  className="videoItem-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    (e.currentTarget as HTMLElement).blur();
                    handleCopyLink(video._id, video.title);
                  }}
                  simple
                  faIconClass={`fas fa-${copiedId === video._id ? 'check' : 'share-alt'} fa-lg`}
                  title={
                    copiedId === video._id ? 'Линкът е копиран' : 'Вземи линк'
                  }
                  disabled={copiedId === video._id}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
