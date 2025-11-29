import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlayer } from 'src/contexts/AudioPlayerContext';
import { getImage } from 'src/utils/ImageHelper';
import './AudioPalylist.scss';

type AudioPalylistProps = {
  playlist: PlaylistType;
  onPlaylistSelect: () => void;
  isCurrent?: boolean;
  isPlaying?: boolean;
  actionButtons?: JSX.Element;
};

const AudioPalylist = ({
  playlist,
  onPlaylistSelect,
  isCurrent,
  isPlaying,
  actionButtons
}: AudioPalylistProps) => {
  const { author, title = '', image } = playlist;
  const img = getImage(
    image && typeof image === 'object'
      ? (image as SanityImageSource)
      : undefined
  );

  const ctx = usePlayer();
  const pauseAction = ctx.pause ?? (() => {});
  const playAction = ctx.play ?? (() => {});

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
        mediaIcon="audio"
        mediaIconAction={
          isCurrent ? (isPlaying ? pauseAction : playAction) : onPlaylistSelect
        }
        mediaIconTitle={
          isPlaying ? 'Пауза' : isCurrent ? undefined : 'Пусни плейлиста'
        }
        additionalContent={actionButtons}
      />
    </div>
  );
};

export default AudioPalylist;
