import React from 'react';
import { AudioPlayerContextType, AudioPlayerContext } from '../contexts/AudioPlayerContext';
import { AudioPlayerHandle } from 'src/components/media/audio/AudioPlayer';

type AudioPlayerProviderProps = {
  children: React.ReactNode;
  playerRef: React.RefObject<AudioPlayerHandle>;
};

const AudioPlayerProvider = ({ children, playerRef }: AudioPlayerProviderProps) => {
  const value: AudioPlayerContextType = {
    playerRef,
    play: () => playerRef.current?.play(),
    pause: () => playerRef.current?.pause()
  };

  return (
    <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>
  );
};

export default AudioPlayerProvider;
