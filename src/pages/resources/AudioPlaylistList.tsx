import { memo, useRef, useState } from 'react';
import MediaPlaylistList from './MediaPlaylistList';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import AudioPlayerProvider from 'src/providers/AudioPlayerProvider';
import AudioPlayer, { AudioPlayerHandle } from './AudioPlayer';
// import { useLocation } from 'react-router-dom';

type AudioPlaylistListProps = {
  type?: string;
  playlists?: PlaylistType[];
  showDownloadAll?: boolean;
};

const AudioPlaylistList = ({
  type,
  playlists,
  showDownloadAll = true
}: AudioPlaylistListProps) => {
  // const { hash, search } = useLocation();
  // const searchParams = new URLSearchParams(search);
  // const playIndex = searchParams.get('playIndex');
  // Supports only time as seconds (integer)
  // const timeParam = searchParams.get('time');
  // const [currentPlayIndex, setCurrentPlayIndex] = useState<number>(0);
  // Store initialTime in state so it only applies to the selected playlist from URL
  // const [initialTime, setInitialTime] = useState<number | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playerRef = useRef<AudioPlayerHandle | null>(null);

  if (type === 'audiobook') {
    type = 'audio-book';
  }
  // const setInitialPlaylists = useCallback(
  //   (playlistArr: PlaylistType[]) => {
  //     setPlaylists(playlistArr);
  //     if (hash) {
  //       const playlistId = hash.replace('#', '');
  //       const matchedPlaylist = playlistArr.find((p) => p._id === playlistId);

  //       if (
  //         matchedPlaylist &&
  //         matchedPlaylist.items &&
  //         matchedPlaylist.items.length > 0 &&
  //         playIndex
  //       ) {
  //         const i = parseInt(playIndex);
  //         if (!isNaN(i) && i < matchedPlaylist.items.length) {
  //           setCurrentPlayIndex(i);
  //         }

  //         if (timeParam && /^\d+$/.test(timeParam)) {
  //           // Parse initial time (integer) from URL
  //           setInitialTime(parseInt(timeParam, 10));
  //         } else {
  //           setInitialTime(undefined);
  //         }
  //       }

  //       setSelectedPlaylist(matchedPlaylist || null);
  //     }
  //   },
  //   [hash, playIndex, timeParam]
  // );

  return (
    <AudioPlayerProvider playerRef={playerRef}>
      <MediaPlaylistList
        sanityType={type}
        mediaPlaylists={playlists}
        mediaType={'audio'}
        showDownloadAll={showDownloadAll}
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

export default memo(AudioPlaylistList);
