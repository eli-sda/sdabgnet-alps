import { MouseEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlayer } from 'src/contexts/AudioPlayerContext';
import { getImage, getImageTypeByUrl } from 'src/utils/ImageHelper';
import { highlightHtml, parseLinksMdToHtml } from 'src/utils/Links';
import './MediaPalylist.scss';

type MediaPlaylistProps = {
  type: 'audio' | 'video';
  playlist: PlaylistType;
  onPlaylistSelect: () => void;
  isCurrent?: boolean;
  isPlaying?: boolean;
  actionButtons?: JSX.Element;
  defaultImageIcon?: ReactNode;
  highlightText?: string;
};

const MediaPlaylist = ({
  type,
  playlist,
  onPlaylistSelect,
  isCurrent,
  isPlaying,
  actionButtons,
  defaultImageIcon,
  highlightText = ''
}: MediaPlaylistProps) => {
  const { author, title = '', imageUrl } = playlist;
  const img = imageUrl
    ? getImageTypeByUrl(imageUrl)
    : defaultImageIcon
      ? undefined
      : getImage();

  const ctx = usePlayer();
  const pauseAction = ctx.pause ?? (() => {});
  const playAction = ctx.play ?? (() => {});
  const navigate = useNavigate();

  const showPlayPauseControls = type === 'audio';

  const handlePlaylistAction = () => {
    if (showPlayPauseControls && isCurrent) {
      if (isPlaying) {
        pauseAction();
        return;
      }
      playAction();
      return;
    }
    onPlaylistSelect();
  };

  const handleDescriptionClick = (e: MouseEvent) => {
    // Intercept clicks on internal links to act like <NavLink> instead of a full reload
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && !href.startsWith('http')) {
        e.preventDefault();
        void navigate(href);
      }
    }
  };

  return (
    <div
      className={`playlist-card ${isCurrent ? 'is-current' : ''} ${
        isPlaying ? 'is-playing' : ''
      }`}
      id={playlist._id}
      onClick={handleDescriptionClick}
    >
      <MediaBlock
        image={img}
        defaultImageIcon={defaultImageIcon}
        type="stacked"
        title={title}
        kicker={author}
        description={highlightHtml(
          parseLinksMdToHtml(playlist.description),
          highlightText
        )}
        mediaIcon={type}
        mediaIconAction={handlePlaylistAction}
        mediaIconTitle={
          showPlayPauseControls && isPlaying
            ? 'Пауза'
            : isCurrent
              ? undefined
              : 'Пусни плейлиста'
        }
        additionalContent={actionButtons}
      />
    </div>
  );
};

export default MediaPlaylist;
