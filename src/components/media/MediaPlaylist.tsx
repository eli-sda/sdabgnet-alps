import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlayer } from 'src/contexts/AudioPlayerContext';
import { getImage } from 'src/utils/ImageHelper';
import './MediaPalylist.scss';

type MediaPlaylistProps = {
  type: 'audio' | 'video';
  playlist: PlaylistType;
  onPlaylistSelect: () => void;
  isCurrent?: boolean;
  isPlaying?: boolean;
  actionButtons?: JSX.Element;
};

const MediaPlaylist = ({
  type,
  playlist,
  onPlaylistSelect,
  isCurrent,
  isPlaying,
  actionButtons
}: MediaPlaylistProps) => {
  const { author, title = '', imageUrl } = playlist;
  const img = imageUrl
    ? {
        alt: '',
        srcSet: {
          default: `${imageUrl}`,
          500: '',
          750: '',
          1200: ''
        }
      }
    : getImage();

  const ctx = usePlayer();
  const pauseAction = ctx.pause ?? (() => {});
  const playAction = ctx.play ?? (() => {});

  const showPlayPauseControls = type === 'audio';

  return (
    <div
      className={`playlist-card ${isCurrent ? 'is-current' : ''} ${
        isPlaying ? 'is-playing' : ''
      }`}
      id={playlist._id}
    >
      <MediaBlock
        image={img}
        type="stacked"
        title={title}
        kicker={author}
        mediaIcon={type}
        mediaIconAction={
          showPlayPauseControls && isCurrent
            ? isPlaying
              ? pauseAction
              : playAction
            : onPlaylistSelect
        }
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
