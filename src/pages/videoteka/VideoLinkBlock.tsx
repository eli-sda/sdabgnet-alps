import { LinkType, TopicType } from 'src/contexts/PlaylistsContext';
import ShareItemButton from 'src/components/ShareItemButton';

import { cleanedDescription, parseLinksMdToHtml } from 'src/utils/Links';
import { TopicsBlock } from './TopicsBlock';
import './VideoLinkBlock.scss';

interface VideoLinkBlockProps {
  video: LinkType;
  appliedTopics?: TopicType[];
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onPlay?: () => void;
  showPlaylist?: boolean;
}

export const VideoLinkBlock = ({
  video,
  appliedTopics = [],
  isSelected = false,
  onToggleSelect,
  onPlay,
  showPlaylist = true
}: VideoLinkBlockProps) => {
  const appliedIds = new Set(appliedTopics.map((t) => t._id));
  const playlistName =
    showPlaylist && video.playlistId ? video.keyWords?.[0] || null : null;
  const isYouTube = video.path.includes('youtube.com');
  const elementId = `video-${video._id}`;

  const shareUrlObj = new URL(window.location.pathname, window.location.origin);
  shareUrlObj.searchParams.set('tab', 'videos');
  shareUrlObj.searchParams.set('vText', video.title);
  shareUrlObj.searchParams.set('title', video.title);
  shareUrlObj.hash = elementId;
  const shareUrl = shareUrlObj.href;

  return (
    <div
      id={elementId}
      className={`video-link-block c-cta-block c-block u-border--left u-theme--border-color--darker--left${isSelected ? ' is-selected' : ''}`}
    >
      <div className="c-cta-block__content c-block__content u-spacing--half u-padding--half">
        <div className="video-link-block__header">
          {onToggleSelect && isYouTube && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="video-link-block__checkbox"
              title="Включи в плейъра"
            />
          )}
          <div className="c-cta-block__group c-block__group u-spacing--half video-link-block__content">
            <a
              className="u-font--primary--m c-block__title-link u-theme--color--darker u-theme--link-hover--dark"
              href={video.path}
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>
                {isYouTube ? (
                  <i className="fab fa-youtube fa-lg u-space--quarter--right"></i>
                ) : (
                  <i className="fas fa-video fa-lg u-space--quarter--right"></i>
                )}
                {video.title}
                <i className="fas fa-external-link-alt fa-sm u-space--quarter--left"></i>
              </strong>
            </a>
            <div className="video-link-block__actions">
              {onPlay && isYouTube && (
                <button
                  className="o-button o-button--outline video-link-block__play-btn"
                  onClick={onPlay}
                >
                  <i className="fas fa-play-circle u-space--quarter--right"></i>
                  Пусни в плеъра
                </button>
              )}
              <ShareItemButton url={shareUrl} />
            </div>

            {(video.author || video.description) && (
              <p>
                {video.author && (
                  <span className="u-text--strong">
                    {video.author}
                    <br />
                  </span>
                )}
                {cleanedDescription(video.description || '') && (
                  <span
                    className="text"
                    dangerouslySetInnerHTML={{
                      __html:
                        parseLinksMdToHtml(
                          cleanedDescription(video.description || '')
                        ) || ''
                    }}
                  />
                )}
              </p>
            )}
            {(playlistName || (video.topics && video.topics.length > 0)) && (
              <div className="video-link-block__meta">
                {playlistName && (
                  <span className="video-link-block__playlist">
                    <i className="fas fa-list fa-sm u-space--quarter--right"></i>
                    {playlistName}
                  </span>
                )}
                <TopicsBlock topics={video.topics} appliedIds={appliedIds} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
