import {
  LinkType,
  PlaylistType,
  TopicType
} from 'src/contexts/PlaylistsContext';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import { TopicsBlock } from './TopicsBlock';

interface PlaylistSearchBlockProps {
  embedded: PlaylistType[];
  ytLinks: LinkType[];
  appliedTopics?: TopicType[];
}

export const PlaylistSearchBlock = ({
  embedded,
  ytLinks,
  appliedTopics = []
}: PlaylistSearchBlockProps) => {
  const appliedIds = new Set(appliedTopics.map((t) => t._id));

  if (embedded.length === 0 && ytLinks.length === 0) return null;

  return (
    <div className="playlist-search-block u-spacing--double">
      {embedded.length > 0 && (
        <section className="u-spacing">
          <h2 className="u-font--primary--m u-theme--color--darker">
            Видео поредици ({embedded.length})
          </h2>
          <VideoPlaylistList
            playlists={embedded}
            withListPadding={false}
            renderPlaylistExtra={(playlist) => (
              <TopicsBlock topics={playlist.topics} appliedIds={appliedIds} />
            )}
            getShareBaseParams={(playlist) => ({
              tab: 'playlists',
              pText: playlist.title || ''
            })}
          />
        </section>
      )}

      {ytLinks.length > 0 && (
        <section className="u-spacing">
          <h2 className="u-font--primary--m u-theme--color--darker">
            YouTube плейлисти ({ytLinks.length})
          </h2>
          <div className="u-spacing">
            {ytLinks.map((link) => (
              <div
                key={link._id}
                className="playlist-search-block c-cta-block c-block u-border--left u-theme--border-color--darker--left"
              >
                <div className="c-cta-block__content c-block__content u-spacing--half u-padding--half">
                  <a
                    className="u-font--primary--m c-block__title-link u-theme--color--darker u-theme--link-hover--dark"
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>
                      <i
                        className="fab fa-youtube fa-lg u-space--quarter--right"
                        style={{ color: '#ff0033' }}
                      ></i>
                      {link.title}
                      <i className="fas fa-external-link-alt fa-sm u-space--quarter--left"></i>
                    </strong>
                  </a>
                  {link.author && (
                    <p className="u-font--secondary--s u-color--gray">
                      {link.author}
                    </p>
                  )}
                  {link.description && (
                    <p className="u-font--secondary--s">{link.description}</p>
                  )}
                  <TopicsBlock topics={link.topics} appliedIds={appliedIds} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
