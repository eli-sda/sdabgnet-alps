import { LinkType, TopicType } from 'src/contexts/PlaylistsContext';
import { Button } from 'src/alps/atoms/Button';
import ShareItemButton from 'src/components/ShareItemButton';

import { cleanedDescription, highlightHtml, parseLinksMdToHtml } from 'src/utils/Links';
import { buildReadableUrl } from 'src/utils/urlUtils';
import { TopicsBlock } from './TopicsBlock';
import './VideoLinkBlock.scss';

interface VideoLinkBlockProps {
  video: LinkType;
  appliedTopics?: TopicType[];
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onPlay?: () => void;
  showPlaylist?: boolean;
  highlightText?: string;
}

export const VideoLinkBlock = ({
  video,
  appliedTopics = [],
  isSelected = false,
  onToggleSelect,
  onPlay,
  showPlaylist = true,
  highlightText = ''
}: VideoLinkBlockProps) => {
  const appliedIds = new Set(appliedTopics.map((t) => t._id));
  const playlistName =
    showPlaylist && video.playlistId ? video.keyWords?.[0] || null : null;
  const isYouTube = video.path.includes('youtube.com');
  const isShort = /youtube\.com\/shorts\//i.test(video.path || '');
  const elementId = `video-${video._id}`;

  const shareUrl = buildReadableUrl(
    `${window.location.origin}${window.location.pathname}`,
    { tab: 'videos', vText: video.title, title: video.title },
    elementId
  );

  return (
    <div
      id={elementId}
      className={`video-link-block c-cta-block c-block u-border--left u-theme--border-color--darker--left${isSelected ? ' is-selected' : ''}`}
    >
      <div className="c-cta-block__content c-block__content u-spacing--half u-padding--half">
        <div className="video-link-block__header">
          {onToggleSelect && isYouTube && !isShort && (
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
              {onPlay && isYouTube && !isShort && (
                <Button
                  faIconClass="fas fa-play-circle"
                  label="Пусни в плеъра"
                  onClick={onPlay}
                />
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
                        highlightHtml(
                          parseLinksMdToHtml(
                            cleanedDescription(video.description || '')
                          ),
                          highlightText
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
