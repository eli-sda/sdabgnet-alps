import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Caption } from 'alps-library/atoms/text/Caption';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import AudioPalylist from './AudioPalylist';
import AudioPlayer from './AudioPlayer';
import PlaylistActionButtons from './PlaylistActionButtons';
import './AudioPlaylistList.scss';

interface AudioPlaylistListProps {
  type: string;
}

const AudioPlaylistList = ({ type }: AudioPlaylistListProps) => {
  const { hash, search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const playIndex = searchParams.get('playIndex');
  const { getPlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    null
  );
  const [currentPlayIndex, setCurrentPlayIndex] = useState<number>(0);
  const handlePlaylistSelect = (playlist: PlaylistType) => {
    if (selectedPlaylist?._id === playlist._id) {
      return; // Do nothing if the same playlist is selected
    }
    setCurrentPlayIndex(0);
    setSelectedPlaylist(playlist);
  };

  if (type === 'audiobook') {
    type = 'audio-book';
  }

  useEffect(() => {
    getPlaylists(type)
      .then((playlists) => {
        setPlaylists(playlists);
        if (hash) {
          const playlistId = hash.replace('#', '');
          const matchedPlaylist = playlists.find((p) => p._id === playlistId);

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
      })
      .catch((err) => console.error(err));
  }, [getPlaylists, type, hash, playIndex]);

  // Initial index is now handled in the useEffect

  const getActionButtons = useCallback(
    (playlist: PlaylistType): JSX.Element => {
      //Get the current title if this playlist is selected
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
              playlist.items
                ?.map((item) => item.path)
                .filter((path): path is string => !!path) || []
            }
            playlistName={playlist.title}
          />
        </div>
      );
    },
    [currentPlayIndex, selectedPlaylist]
  );

  return (
    <>
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
              onPlay={() => handlePlaylistSelect(playlist)}
              isCurrent={selectedPlaylist?._id === playlist._id}
              actionButtons={getActionButtons(playlist)}
            />
          </div>
        ))}
      </section>

      {selectedPlaylist?.items && (
        <AudioPlayer
          playlist={selectedPlaylist}
          playIndex={currentPlayIndex}
          onPlayIndexChange={setCurrentPlayIndex}
        />
      )}
    </>
  );
};

export default AudioPlaylistList;
