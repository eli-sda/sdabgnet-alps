import { memo, ReactNode, useRef, useState } from 'react';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import AudioPlayerProvider from 'src/providers/AudioPlayerProvider';
import MediaPlaylistList from '../MediaPlaylistList';
import AudioPlayer, { AudioPlayerHandle } from './AudioPlayer';

type AudioPlaylistListProps = {
  pagePath?: string;
  playlists?: PlaylistType[];
  showDownloadAll?: boolean;
  defaultImageIcon?: ReactNode;
  withListPadding?: boolean;
};

const AudioPlaylistListComponent = ({
  pagePath,
  playlists,
  showDownloadAll = true,
  defaultImageIcon,
  withListPadding = false
}: AudioPlaylistListProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playerRef = useRef<AudioPlayerHandle | null>(null);

  return (
    <AudioPlayerProvider playerRef={playerRef}>
      <MediaPlaylistList
        className={`u-space--top${withListPadding ? ' u-padding--sides' : ''}`}
        pagePath={pagePath}
        mediaPlaylists={playlists}
        mediaType={'audio'}
        showDownloadAll={showDownloadAll}
        defaultImageIcon={defaultImageIcon}
        getCurrentTime={() => playerRef.current?.getCurrentTime() ?? 0}
        renderPlayer={(
          selectedPlaylist,
          setPlayIndex,
          playIndex,
          initialTime
        ) =>
          selectedPlaylist?.items ? (
            <AudioPlayer
              ref={playerRef}
              playlist={selectedPlaylist}
              playIndex={playIndex}
              onPlayIndexChange={setPlayIndex}
              onAudioPlay={() => setIsPlaying(true)}
              onAudioPause={() => setIsPlaying(false)}
              initialTime={initialTime}
            />
          ) : null
        }
        isPlaying={isPlaying}
      />
    </AudioPlayerProvider>
  );
};

export const AudioPlaylistList = memo(AudioPlaylistListComponent);
