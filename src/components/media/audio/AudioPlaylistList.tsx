import { memo, useRef, useState } from 'react';
import MediaPlaylistList from '../MediaPlaylistList';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import AudioPlayerProvider from 'src/providers/AudioPlayerProvider';
import AudioPlayer, { AudioPlayerHandle } from './AudioPlayer';

type AudioPlaylistListProps = {
  type?: string;
  playlists?: PlaylistType[];
  showDownloadAll?: boolean;
};

const AudioPlaylistListComponent = ({
  type,
  playlists,
  showDownloadAll = true
}: AudioPlaylistListProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playerRef = useRef<AudioPlayerHandle | null>(null);

  if (type === 'audiobook') {
    type = 'audio-book';
  }

  return (
    <AudioPlayerProvider playerRef={playerRef}>
      <MediaPlaylistList
        className="u-space--top"
        sanityType={type}
        mediaPlaylists={playlists}
        mediaType={'audio'}
        showDownloadAll={showDownloadAll}
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
