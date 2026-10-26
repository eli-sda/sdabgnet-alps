import { Button } from 'src/alps/atoms/Button';
import type { LastPlayedMediaEntry } from 'src/utils/lastPlayedMedia';

export type PlayableRef = {
  current: { play: () => void } | null;
};

export type ResumeButtonProps = {
  /** The playlist must have been opened via a shared link for the button to show. */
  openedViaLink?: boolean;
  remembered: LastPlayedMediaEntry | null;
  /** Index of the remembered item within the playlist (-1 when not found). */
  resumeIndex: number;
  /** Index of the currently playing item. */
  currentIndex: number;
  /** Seek within the currently playing item. */
  onSeek: (time: number) => void;
  /** Player ref used to start playback after seeking within the current item. */
  playerRef?: PlayableRef;
  /** Switch to the remembered item, optionally starting at the given time. */
  onSwitch: (index: number, time: number) => void;
  className?: string;
};

const ResumeButton = ({
  openedViaLink,
  remembered,
  resumeIndex,
  currentIndex,
  onSeek,
  playerRef,
  onSwitch,
  className
}: ResumeButtonProps) => {
  if (
    !openedViaLink ||
    !remembered ||
    resumeIndex < 0 ||
    (resumeIndex === currentIndex && (remembered.time ?? 0) <= 0)
  ) {
    return null;
  }

  const handleClick = () => {
    const time = remembered.time && remembered.time > 0 ? remembered.time : 0;

    if (resumeIndex === currentIndex) {
      if (time > 0) onSeek(time);
      playerRef?.current?.play();
      return;
    }

    onSwitch(resumeIndex, time);
  };

  return (
    <Button
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      label="Пусни от запомненото"
      title="Продължи от запомненото място"
      faIconClass="fas fa-play"
      small
    />
  );
};

export default ResumeButton;
