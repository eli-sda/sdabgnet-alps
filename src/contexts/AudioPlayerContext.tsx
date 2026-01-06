import { createContext, useContext } from 'react';
import { AudioPlayerHandle } from 'src/components/media/audio/AudioPlayer';

export type AudioPlayerContextType = {
  playerRef: React.RefObject<AudioPlayerHandle> | null;
  play: () => void;
  pause: () => void;
};

export const AudioPlayerContext = createContext<AudioPlayerContextType>({
  playerRef: null,
  play: () => {},
  pause: () => {}
});

export const usePlayer = () => useContext(AudioPlayerContext);
