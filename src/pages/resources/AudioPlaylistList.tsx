import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Caption } from 'alps-library/atoms/text/Caption';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import AudioPlayerProvider from 'src/providers/AudioPlayerProvider';
import { usePlaylists } from 'src/hooks/usePlaylists';
import AudioPalylist from './AudioPalylist';
import AudioPlayer, { AudioPlayerHandle } from './AudioPlayer';
import PlaylistActionButtons from './PlaylistActionButtons';
import './AudioPlaylistList.scss';

/**
 * @playlist - a playlist to use, instead of to fetch it
 * @type - type by which to get the playlists from BE
 */
interface AudioPlaylistListProps {
  type?: string;
  playlist?: PlaylistType;
  showDownloadAll?: boolean;
}

const AudioPlaylistList = ({
  type,
  playlist,
  showDownloadAll = true
}: AudioPlaylistListProps) => {
  const { hash, search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const playIndex = searchParams.get('playIndex');
  const { getResourcePlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    null
  );
  const [currentPlayIndex, setCurrentPlayIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playerRef = useRef<AudioPlayerHandle | null>(null);

  const handlePlaylistSelect = (playlist: PlaylistType) => {
    if (selectedPlaylist?._id === playlist._id) {
      return; // Do nothing if the same playlist is selected
    }
    setCurrentPlayIndex(0);
    setSelectedPlaylist(playlist);
  };

  const setInitialPlaylists = useCallback(
    (playlistArr: PlaylistType[]) => {
      setPlaylists(playlistArr);
      if (hash) {
        const playlistId = hash.replace('#', '');
        const matchedPlaylist = playlistArr.find((p) => p._id === playlistId);

        if (
          matchedPlaylist &&
          matchedPlaylist.items &&
          matchedPlaylist.items.length > 0 &&
          playIndex
        ) {
          const i = parseInt(playIndex);
          if (!isNaN(i) && i < matchedPlaylist.items.length) {
            setCurrentPlayIndex(i);
          }
        }

        setSelectedPlaylist(matchedPlaylist || null);
      }
    },
    [hash, playIndex]
  );

  if (type === 'audiobook') {
    type = 'audio-book';
  }

  useEffect(() => {
    if (playlist && playlists.length === 0) {
      const playlistArr = [playlist];
      setInitialPlaylists(playlistArr);
    } else if (type) {
      getResourcePlaylists(type)
        .then((playlists) => {
          setInitialPlaylists(playlists);
        })
        .catch((err) => console.error(err));
    }
  }, [getResourcePlaylists, type, playlist, setInitialPlaylists, playlists.length]);

  // Initial index is now handled in the useEffect
  const getActionButtons = useCallback(
    (playlist: PlaylistType): JSX.Element => {
      // Get the current title if this playlist is selected
      const currentItemTitle =
        selectedPlaylist?._id === playlist._id &&
        playlist.items?.[currentPlayIndex]?.title
          ? playlist.items[currentPlayIndex].title
          : undefined;

      return (
        <div className="u-space--half--top">
          <PlaylistActionButtons
            shareUrl={`${window.location.origin}${window.location.pathname}#${playlist._id}`}
            fromIndex={
              selectedPlaylist?._id === playlist._id
                ? currentPlayIndex
                : undefined
            }
            fromTitle={currentItemTitle}
            itemUrls={
              showDownloadAll
                ? playlist.items
                    ?.map((item) => item.path)
                    .filter((path): path is string => !!path) || []
                : undefined
            }
            playlistName={playlist.title}
          />
        </div>
      );
    },
    [currentPlayIndex, selectedPlaylist, showDownloadAll]
  );

  return (
    <AudioPlayerProvider playerRef={playerRef}>
      {!playlists ||
        (playlists.length === 0 && (
          <div className="u-space--left">
            <Caption>Няма налични аудио ресурси.</Caption>
          </div>
        ))}

      <section className="audio-playlist-list u-space--top">
        {playlists.map((playlist, i) => (
          <div
            key={i}
            className="playlist-item u-padding--sides u-space--double--bottom"
          >
            <AudioPalylist
              playlist={playlist}
              onPlaylistSelect={() => handlePlaylistSelect(playlist)}
              isCurrent={selectedPlaylist?._id === playlist._id}
              isPlaying={selectedPlaylist?._id === playlist._id && isPlaying}
              actionButtons={getActionButtons(playlist)}
            />
          </div>
        ))}
      </section>

      {selectedPlaylist?.items && (
        <AudioPlayer
          ref={playerRef}
          playlist={selectedPlaylist}
          playIndex={currentPlayIndex}
          onPlayIndexChange={setCurrentPlayIndex}
          onAudioPlay={() => setIsPlaying(true)}
          onAudioPause={() => setIsPlaying(false)}
        />
      )}
    </AudioPlayerProvider>
  );
};

export default memo(AudioPlaylistList);
