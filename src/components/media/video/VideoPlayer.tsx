import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Button } from 'src/alps/atoms/Button';
import { newLinesWithLinks } from 'src/utils/Links';
import ShareItemButton from 'src/components/ShareItemButton';
import './VideoPlayer.scss';

export type VideoPlaylistType = {
  _id: string;
  playlistTitle: string;
  playlistAuthor?: string;
  playlistDescription?: string;
  videoItems: {
    _id: string;
    videoId: string;
    title: string;
    author?: string;
    description?: string;
  }[];
};

interface VideoPlayerProps {
  playlist: VideoPlaylistType;
  isVisible?: boolean;
  initialIndex?: number;
  shareBaseParams?: Record<string, string>;
}

const VideoPlayer = ({
  playlist,
  isVisible = true,
  initialIndex = 0,
  shareBaseParams
}: VideoPlayerProps) => {
  const { playlistTitle, playlistAuthor, playlistDescription, videoItems } =
    playlist;

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

  const activeVideoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isVertical || !playlist.videoItems.length || currentIndex == null) {
      return;
    }

    requestAnimationFrame(() => {
      activeVideoRef.current?.scrollIntoView({
        behavior: 'auto',
        block: 'nearest'
      });
    });
  }, [playlist, currentIndex, isVertical]);

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
    const url = new URL(window.location.pathname, window.location.origin);

    if (shareBaseParams) {
      for (const [key, value] of Object.entries(shareBaseParams)) {
        url.searchParams.set(key, value);
      }
    } else {
      const currentTab = new URLSearchParams(window.location.search).get('tab');
      if (currentTab) {
        url.searchParams.set('tab', currentTab);
      }
    }
    url.searchParams.set('playlistId', playlist._id);
    url.searchParams.set('playId', videoId);
    url.searchParams.set('playlistTitle', playlistTitle);
    url.searchParams.set('title', videoTitle);
    url.hash = playlist._id;
    return url.href;
  };

  const caption = useMemo(() => {
    return (
      <div>
        <div className="video_title">
          {currentVideo.title}
          {currentVideo.author && currentVideo.author !== playlistAuthor
            ? ` | ${currentVideo.author}`
            : ''}
        </div>
        {currentVideo.description && (
          <div className="text u-space--half--top">
            {newLinesWithLinks(currentVideo.description)}
          </div>
        )}
      </div>
    );
  }, [
    currentVideo.author,
    currentVideo.description,
    currentVideo.title,
    playlistAuthor
  ]);
  const playerDiv = (
    <div className="videoPlayer-layout-player">
      {currentVideo ? (
        <>
          <Figure
            caption={caption}
            size="large"
            videoSrc={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
            onVideoEnded={handleVideoEnded}
            isVisible={isVisible}
          />
          <ShareItemButton
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
    <div className="videoPlayer-layout-sidebar u-spacing--half">
      {videoItems.map((video, i) => {
        const thumb = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
        const isActive = currentIndex === i;

        return (
          <div
            key={i}
            ref={isActive ? activeVideoRef : null}
            className={`videoItem u-border--left u-theme--border-color--darker ${isActive ? 'active' : ''}`}
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
    <div className="videoPlayer" ref={playerRef}>
      {playlistAuthor && (
        <h3 className="u-font--secondary--m u-theme--color--darker u-space--half--top">
          {playlistAuthor}
        </h3>
      )}
      {playlistDescription && (
        <p className="text u-space--half--top">
          {newLinesWithLinks(playlistDescription)}
        </p>
      )}

      {/* Always render Group to prevent React from unmounting the iframe during layout switch */}
      <Group
        orientation="horizontal"
        className={`videoPlayer-layout ${isVertical ? 'is-vertical' : 'is-horizontal'}`}
      >
        {/* VIDEO PANEL */}
        <Panel defaultSize="70%" minSize="40%">
          {playerDiv}
        </Panel>

        {/* Mount separator only on desktop */}
        {!isVertical && (
          <Separator className="separator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="currentColor"
            >
              <path d="M9 6H9.01M15 6H15.01M15 12H15.01M9 12H9.01M9 18H9.01M15 18H15.01M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6ZM16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6ZM10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12ZM16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12ZM10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18ZM16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z"></path>
            </svg>
          </Separator>
        )}

        {/* PLAYLIST PANEL */}
        <Panel className="playlist-container" defaultSize="30%" minSize="20%">
          {playlistDiv}
        </Panel>
      </Group>
    </div>
  );
};

export default VideoPlayer;
