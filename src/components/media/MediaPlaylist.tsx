import { ReactNode } from 'react';
import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlayer } from 'src/contexts/AudioPlayerContext';
import { getImage, getImageTypeByUrl } from 'src/utils/ImageHelper';
import './MediaPalylist.scss';
import { parseLinksMdToHtml } from 'src/utils/Links';

type MediaPlaylistProps = {
  type: 'audio' | 'video';
  playlist: PlaylistType;
  onPlaylistSelect: () => void;
  isCurrent?: boolean;
  isPlaying?: boolean;
  actionButtons?: JSX.Element;
  defaultImageIcon?: ReactNode;
};

const MediaPlaylist = ({
  type,
  playlist,
  onPlaylistSelect,
  isCurrent,
  isPlaying,
  actionButtons,
  defaultImageIcon
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

  return (
    <div
      className={`playlist-card ${isCurrent ? 'is-current' : ''} ${
        isPlaying ? 'is-playing' : ''
      }`}
      id={playlist._id}
    >
      <MediaBlock
        image={img}
        defaultImageIcon={defaultImageIcon}
        type="stacked"
        title={title}
        kicker={author}
        description={parseLinksMdToHtml(playlist.description)}
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
