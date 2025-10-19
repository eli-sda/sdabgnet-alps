import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { getImage } from 'src/utils/ImageHelper';
import './AudioPalylist.scss';

type AudioPalylistProps = {
  playlist: PlaylistType;
  onPlay: () => void;
  isCurrent?: boolean;
};

const AudioPalylist = ({ playlist, onPlay, isCurrent }: AudioPalylistProps) => {
  const { author, title = '', image } = playlist;
  const img = getImage(
    image && typeof image === 'object'
      ? (image as SanityImageSource)
      : undefined
  );

  return (
    <div
      className={`playlist-card ${isCurrent ? 'is-current' : ''}`}
      id={playlist._id}
    >
      <div>
        <MediaBlock
          image={img}
          type="stacked"
          title={title}
          kicker={author}
          mediaIcon="audio"
          mediaIconAction={onPlay}
          mediaIconTitle={isCurrent ? undefined : 'Пусни плейлиста'}
        />
      </div>
    </div>
  );
};

export default AudioPalylist;
