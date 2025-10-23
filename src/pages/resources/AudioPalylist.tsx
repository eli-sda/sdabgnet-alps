import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { ImageType } from 'alps-library/atoms/images/ImageType.tsx';
import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { getImage } from 'src/utils/ImageHelper';
import './AudioPalylist.scss';

type AudioPalylistProps = {
  playlist: PlaylistType;
  onPlay: () => void;
  isCurrent?: boolean;
  actionButtons?: JSX.Element;
};

const AudioPalylist = ({
  playlist,
  onPlay,
  isCurrent,
  actionButtons
}: AudioPalylistProps) => {
  const { author, title = '', image, imageUrl } = playlist;

  const sanityImg = getImage(
    image && typeof image === 'object'
      ? (image as SanityImageSource)
      : undefined
  );

  const localImg: ImageType | undefined = imageUrl
    ? {
        alt: '',
        srcSet: {
          default: imageUrl,
          500: imageUrl,
          750: imageUrl,
          1200: imageUrl
        }
      }
    : undefined;

  const imgToUse = sanityImg || localImg;

  return (
    <div
      className={`playlist-card ${isCurrent ? 'is-current' : ''}`}
      id={playlist._id}
    >
      <MediaBlock
        image={imgToUse}
        type="stacked"
        title={title}
        kicker={author}
        mediaIcon="audio"
        mediaIconAction={onPlay}
        mediaIconTitle={isCurrent ? undefined : 'Пусни плейлиста'}
        additionalContent={actionButtons}
      />
    </div>
  );
};

export default AudioPalylist;
