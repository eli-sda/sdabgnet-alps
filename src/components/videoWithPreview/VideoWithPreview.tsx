import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import './VideoWithPreview.scss';

interface VideoWithPreviewProps {
  id: string;
  title: string;
  videoSrc: string;
  isActive: boolean;
  thumbnail?: string;
  onActivate?: (id: string) => void;
  className?: string;
  size?: 'large' | 'medium' | 'small';
  align?: 'left' | 'right' | 'center';
}

const VideoWithPreview = ({
  id,
  title,
  videoSrc,
  isActive,
  thumbnail,
  onActivate,
  className = '',
  size = 'large',
  align
}: VideoWithPreviewProps) => {
  const isYouTube = videoSrc.includes('youtube.com');
  const isRumble = videoSrc.includes('rumble.com');

  if (isYouTube) {
    return (
      <Figure
        className={`${className} video-preview ${isActive ? 'is-active' : ''}`}
        caption={title}
        size={size}
        align={align}
        image={
          !isActive
            ? getImageTypeByUrl(
                `https://img.youtube.com/vi/${id}/hqdefault.jpg`
              )
            : undefined
        }
        onImageClick={!isActive ? () => onActivate?.(id) : undefined}
        videoSrc={
          isActive
            ? `https://www.youtube.com/embed/${id}?autoplay=1`
            : undefined
        }
      />
    );
  }

  if (isRumble && thumbnail) {
    return (
      <Figure
        className={`${className} video-preview`}
        caption={title}
        size={size}
        align={align}
        image={getImageTypeByUrl(thumbnail)}
        onImageClick={() =>
          window.open(videoSrc, '_blank', 'noopener,noreferrer')
        }
      />
    );
  }

  // Default: direct video source
  return (
    <Figure
      className={`${className} video-preview`}
      caption={title}
      size={size}
      align={align}
      videoSrc={videoSrc}
    />
  );
};

export default VideoWithPreview;
