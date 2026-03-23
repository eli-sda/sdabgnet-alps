import { useState, useEffect, useCallback, useRef } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
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
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [playerContainerWidth, setPlayerContainerWidth] = useState<number>(670);

  const currentVideo = videoItems[currentIndex];

  const getWindowWidth = () => {
    const width = playerRef.current?.clientWidth ?? 670;
    setPlayerContainerWidth(width);
  };

  const isVertical = playerContainerWidth < 670;

  useEffect(() => {
    getWindowWidth();
    const resizeObserver = new ResizeObserver(() => getWindowWidth());
    if (playerRef.current) {
      resizeObserver.observe(playerRef.current);
    }
    window.addEventListener('resize', getWindowWidth);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', getWindowWidth);
    };
  }, []);

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

  const playerDiv = (
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
  );

  const playlistDiv = (
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
              title={copiedId === video._id ? 'Линкът е копиран' : 'Вземи линк'}
              disabled={copiedId === video._id}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="videoPlayer u-spacing" ref={playerRef}>
      <HeadingBlock title={playlistTitle} />

      {playlistAuthor && (
        <h3 className="u-font--secondary--m u-theme--color--darker u-space--half--top">
          {playlistAuthor}
        </h3>
      )}

      <Group orientation="horizontal" className={`videoPlayer-layout ${isVertical ? 'is-vertical' : 'is-horizontal'}`}>
        {/* VIDEO PANEL */}
        <Panel defaultSize={70} minSize={40}>
          {playerDiv}
        </Panel>

        {/* RESIZE HANDLE - hidden on small screens */}
        <Separator className="videoPlayer-divider">
          <span>
            <i></i>
            <i></i>
            <i></i>
          </span>
        </Separator>

        {/* PLAYLIST PANEL */}
        <Panel defaultSize={30} minSize={20}>
          {playlistDiv}
        </Panel>
      </Group>
    </div>
  );
};

export default VideoPlayer;
