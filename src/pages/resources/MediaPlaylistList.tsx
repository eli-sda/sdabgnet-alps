import { memo, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import PlaylistActionButtons from './PlaylistActionButtons';
import MediaPlaylist from './MediaPlaylist';
import './MediaPlaylistList.scss';

interface MediaPlaylistListProps {
  mediaType: 'audio' | 'video';
  sanityType?: string;
  mediaPlaylists?: PlaylistType[];
  showDownloadAll?: boolean;
  isPlaying?: boolean;
  onPlaylistSelect?: (playlist: PlaylistType) => void;
  renderPlayer?: (
    playlist: PlaylistType | null,
    setPlayIndex: (i: number) => void,
    playIndex?: number,
    initialTime?: number
  ) => React.ReactNode;
  getCurrentTime?: () => number;
}

const MediaPlaylistList = ({
  mediaType,
  sanityType,
  mediaPlaylists,
  showDownloadAll = false,
  isPlaying,
  onPlaylistSelect,
  renderPlayer,
  getCurrentTime
}: MediaPlaylistListProps) => {
  const { hash, search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const playIndex = searchParams.get('playIndex');
  // Supports only time as seconds (integer)
  const timeParam = searchParams.get('time');

  const { getPlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>(
    mediaPlaylists || []
  );
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    null
  );
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [initialTime, setInitialTime] = useState<number | undefined>(undefined);

  const handleSelect = (playlist: PlaylistType) => {
    if (selectedPlaylist?._id === playlist._id) {
      onPlaylistSelect?.(playlist);
      return; // Do nothing if the same playlist is selected
    }
    setSelectedPlaylist(playlist);
    setCurrentPlayIndex(0);
    setInitialTime(undefined);
    onPlaylistSelect?.(playlist);
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

          if (timeParam && /^\d+$/.test(timeParam)) {
            // Parse initial time (integer) from URL
            setInitialTime(parseInt(timeParam, 10));
          } else {
            setInitialTime(undefined);
          }
        }

        setSelectedPlaylist(matchedPlaylist || null);
        if (matchedPlaylist) onPlaylistSelect?.(matchedPlaylist);
      }
    },
    [hash, onPlaylistSelect, playIndex, timeParam]
  );

  useEffect(() => {
    const playlistsArr = [] as PlaylistType[];
    if (mediaPlaylists && mediaPlaylists.length > 0) {
      playlistsArr.push(...mediaPlaylists);
    }
    if (sanityType) {
      void getPlaylists(sanityType, mediaType === 'audio')
        .then((sanityPl) => {
          playlistsArr.push(...sanityPl);
          setInitialPlaylists(playlistsArr);
        })
        .catch((error) => {
          console.error('Error fetching playlists:', error);
          setInitialPlaylists(playlistsArr);
        });
    } else {
      setInitialPlaylists(playlistsArr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mediaPlaylists,
    sanityType,
    getPlaylists,
    mediaType
    // setInitialPlaylists - do not include to avoid infinite loop
  ]);

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
                //TODO: for video player to support start from index
              mediaType === 'audio' && selectedPlaylist?._id === playlist._id
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
            getCurrentTime={getCurrentTime}
          />
        </div>
      );
    },
    [selectedPlaylist?._id, currentPlayIndex, mediaType, showDownloadAll, getCurrentTime]
  );

  return (
    <>
      <section className="media-playlist-list u-space--top">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="playlist-item u-padding--sides u-space--double--bottom"
          >
            <MediaPlaylist
              playlist={playlist}
              onPlaylistSelect={() => handleSelect(playlist)}
              isCurrent={selectedPlaylist?._id === playlist._id}
              isPlaying={selectedPlaylist?._id === playlist._id && isPlaying}
              actionButtons={getActionButtons(playlist)}
              type={mediaType}
            />
          </div>
        ))}
      </section>

      {renderPlayer?.(
        selectedPlaylist,
        setCurrentPlayIndex,
        currentPlayIndex,
        initialTime
      )}
    </>
  );
};

export default memo(MediaPlaylistList);
