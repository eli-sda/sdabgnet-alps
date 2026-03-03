import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  initialIndex?: number;
  initialVideoId?: string;
}

const VideoPlayer = ({
  playlist,
  isVisible = true,
  initialIndex,
  initialVideoId
}: VideoPlayerProps) => {
  const { playlistTitle, playlistAuthor, videoItems } = playlist;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const videoIdFromUrl = searchParams.get('video');

  const currentVideo = videoItems[currentIndex];

  /**
   * When playlist changes:
   * If initialVideoId provided → find it
   * Else if initialIndex provided → use it
   * Else if URL has video param → find it
   * Otherwise → fallback to first video
   */
  useEffect(() => {
    if (!videoItems?.length) return;

    // Priority 1: Use initialVideoId if provided
    if (initialVideoId) {
      const indexFromVideoId = videoItems.findIndex(
        (v) => v.videoId === initialVideoId
      );
      if (indexFromVideoId !== -1) {
        setCurrentIndex(indexFromVideoId);
        return;
      }
    }

    // Priority 2: if an initialIndex is provided by the Dialog, use it (deterministic)
    if (
      typeof initialIndex === 'number' &&
      initialIndex >= 0 &&
      initialIndex < videoItems.length
    ) {
      setCurrentIndex(initialIndex);
      return;
    }

    // Priority 3: fallback to video id from URL if present
    if (videoIdFromUrl) {
      const indexFromUrl = videoItems.findIndex(
        (v) => v.videoId === videoIdFromUrl
      );

      if (indexFromUrl !== -1) {
        setCurrentIndex(indexFromUrl);
        return;
      }
    }

    // fallback
    setCurrentIndex(0);
  }, [playlist, initialIndex, initialVideoId, videoIdFromUrl, videoItems]);

  /**
   * Sync URL when current video changes
   */
  useEffect(() => {
    if (!videoItems?.length) return;

    const existingVideo = searchParams.get('video');
    const existingPlaylist = searchParams.get('playlistId');

    // If current URL already matches the current video & playlist, do nothing
    if (
      currentVideo &&
      isVisible &&
      existingVideo === currentVideo.videoId &&
      existingPlaylist === playlist._id
    ) {
      return;
    }

    const newParams = new URLSearchParams(searchParams);

    if (currentVideo && isVisible) {
      newParams.set('playlistId', playlist._id);
      newParams.set('video', currentVideo.videoId);
    } else {
      newParams.delete('video');
      newParams.delete('playlistId');
    }

    setSearchParams(newParams, { replace: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideo?.videoId, isVisible, playlist._id]);

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

  const handleCopyLink = (videoId: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const currentTab = params.get('tab');

    if (currentTab) {
      params.set('tab', currentTab);
    }

    params.set('playlistId', playlist._id);
    params.set('video', videoId);

    const finalUrl = `${baseUrl}?${params.toString()}`;

    void navigator.clipboard.writeText(finalUrl).then(() => {
      setCopiedId(videoId);
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  return (
    <div className="videoPlayer u-spacing">
      <HeadingBlock title={playlistTitle} />
      {playlistAuthor && (
        <h3 className="u-font--secondary--m u-theme--color--darker u-space--half--top">
          {playlistAuthor}
        </h3>
      )}

      <div className="videoPlayer-layout">
        <div className="videoPlayer-layout-player">
          {currentVideo ? (
            <Figure
              caption={`${currentVideo.title}\n\n${
                currentVideo.description || ''
              }`}
              size="large"
              videoSrc={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
              onVideoEnded={handleVideoEnded}
              isVisible={isVisible}
            />
          ) : (
            <Caption>Няма налично видео</Caption>
          )}
        </div>
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

                <div
                  className="videoItem-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyLink(video.videoId);
                  }}
                >
                  {copiedId === video.videoId ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className="far fa-copy"></i>
                  )}
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
