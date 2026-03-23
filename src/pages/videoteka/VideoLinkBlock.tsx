import { useMemo } from 'react';
import { Chip } from '@mui/material';
import { LinkType, TopicType } from 'src/contexts/PlaylistsContext';
import './VideoLinkBlock.scss';
import { NavLink } from 'react-router-dom';

interface VideoLinkBlockProps {
  video: LinkType;
  appliedTopics?: TopicType[];
}

export const VideoLinkBlock = ({
  video,
  appliedTopics = []
}: VideoLinkBlockProps) => {
  const appliedIds = new Set(appliedTopics.map((t) => t._id));

  const playlistTitle = video.keyWords?.[0] || ''; // Assuming the playlist title is stored in keyWords[0];

  const navLink = useMemo(() => {
    if (!video.playlistId || !video.playlistType) return null;
    let pathname = '';

    const hash = `#${video.playlistId}`;

    const params = new URLSearchParams();
    switch (video?.playlistType) {
      case 'testimony':
        pathname = '/testimonies';
        params.set('tab', 'videoPlaylists');
        break;
      case 'bible_ref':
        pathname = '/info/biblical';
        break;
      case 'video':
        // pathname = '/videoteka';
        // TODO: to get the playlists from Sainty and display them in Videoteka, we need to add a new page for video playlists, e.g. /videoteka/playlists, and navigate there instead of /videoteka. The playlist page will read the playlistId from the URL and display the videos in that playlist.
        break;
    }
    if (!pathname) return null;
    params.set('playlistId', video.playlistId);
    params.set('playId', video._id);
    params.set('playlistTitle', playlistTitle);
    params.set('title', video.title);

    return `${pathname}?${params.toString()}${hash}`;
  }, [
    video?.playlistType,
    video?.playlistId,
    video?._id,
    video?.title,
    playlistTitle
  ]);
  return (
    <div className="video-link-block c-cta-block c-block u-border--left u-theme--border-color--darker--left">
      <div className="c-cta-block__content c-block__content u-spacing--half u-padding--half">
        <div className="c-cta-block__group c-block__group u-spacing--half">
          <a
            className="u-font--primary--m c-block__title-link u-theme--color--darker u-theme--link-hover--dark"
            href={video.path}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>
              <i className="fab fa-youtube fa-lg u-space--quarter--right"></i>
              {video.title}
              <i className="fas fa-external-link-alt fa-sm u-space--quarter--left"></i>
            </strong>
          </a>
          {navLink && (
            <div className="u-space--quarter--top">
              <NavLink
                className="u-font--primary--m c-block__title-link u-theme--color--darker u-theme--link-hover--dark"
                to={navLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-play-circle fa-lg u-theme--color--base u-space--quarter--right"></i>
                Отвори в плейлиста <strong>{playlistTitle}</strong>
              </NavLink>
            </div>
          )}

          {(video.author || video.description) && (
            <p>
              {video.author && (
                <div className="u-text--strong">{video.author}</div>
              )}
              {video.description}
            </p>
          )}
          {video.topics && video.topics.length > 0 && (
            <div className="video-block-topics">
              {video.topics.map((topic) => (
                <Chip
                  key={topic._id}
                  label={topic.title}
                  size="small"
                  className={appliedIds.has(topic._id) ? '' : 'chip-no-bg'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
