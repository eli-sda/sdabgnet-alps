import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { getImage, transparentImg } from 'src/utils/ImageHelper';
import './AudioList.scss';

type AudioListProps = {
  playlist: PlaylistType;
  onPlay: () => void;
};

const AudioList = ({ playlist, onPlay }: AudioListProps) => {
  const { author, title = '', image } = playlist;
  const img = getImage(image || transparentImg);

  return (
    <div className="playlist-card">
      <div className="playlist-card__image-wrapper">
        <MediaBlock
          image={img}
          type="stacked"
          title={title}
          kicker={author}
          mediaIcon="audio"
          mediaIconAction={onPlay}
          mediaIconTitle="Пусни плейлиста"
        />
      </div>
    </div>
  );
};

export default AudioList;
