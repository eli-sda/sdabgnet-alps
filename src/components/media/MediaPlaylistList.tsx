import { memo, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import PlaylistActionButtons from '../playlistButtons/PlaylistActionButtons';
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
  className?: string;
}

const MediaPlaylistList = ({
  mediaType,
  sanityType,
  mediaPlaylists,
  showDownloadAll = false,
  isPlaying,
  onPlaylistSelect,
  renderPlayer,
  getCurrentTime,
  className = ''
}: MediaPlaylistListProps) => {
  const { hash, search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const playId = searchParams.get('playId');
  const playlistIdFromSearch = searchParams.get('playlistId');
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
      // support playlist selection from either hash (#<id>) or query ?playlistId=<id>
      const playlistId = playlistIdFromSearch || (hash ? hash.replace('#', '') : null);
      if (playlistId) {
        const matchedPlaylist = playlistArr.find((p) => p._id === playlistId);

        if (
          matchedPlaylist &&
          matchedPlaylist.items &&
          matchedPlaylist.items.length > 0 &&
          playId
        ) {
          const index = matchedPlaylist.items.findIndex(
            (item) => item._id === playId
          );

          if (index !== -1) {
            setCurrentPlayIndex(index);
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
    [hash, onPlaylistSelect, playId, playlistIdFromSearch, timeParam]
  );

  useEffect(() => {
    const playlistsArr: PlaylistType[] = [];

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
    mediaType
    // setInitialPlaylists - do not include to avoid infinite loop
  ]);

  // Scroll to playlist when URL has playlistId parameter
  useEffect(() => {
    if (!playlistIdFromSearch) return;
    
    setTimeout(() => {
      const element = document.getElementById(`playlist-${playlistIdFromSearch}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  }, [playlistIdFromSearch]);

  const getActionButtons = useCallback(
    (playlist: PlaylistType): JSX.Element => {
      const currentItem =
        selectedPlaylist?._id === playlist._id
          ? playlist.items?.[currentPlayIndex]
          : undefined;

      return (
        <div className="u-space--half--top">
          <PlaylistActionButtons
            shareUrl={`${window.location.origin}${window.location.pathname}#${playlist._id}`}
            fromPlayId={
              //TODO: for video player to support start from index
              mediaType === 'audio' && currentItem?._id
                ? currentItem._id
                : undefined
            }
            fromTitle={currentItem?.title}
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
    [
      selectedPlaylist?._id,
      currentPlayIndex,
      mediaType,
      showDownloadAll,
      getCurrentTime
    ]
  );

  return (
    <>
      <section className={`media-playlist-list ${className}`}>
        {playlists.map((playlist) => (
          <div
            id={`playlist-${playlist._id}`}
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
