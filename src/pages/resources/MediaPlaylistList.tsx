import { memo, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import PlaylistActionButtons from './PlaylistActionButtons';
import MediaPlaylist from './MediaPlaylist';
import './AudioPlaylistList.scss';

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
}

const MediaPlaylistList = ({
  mediaType,
  sanityType,
  mediaPlaylists,
  showDownloadAll = false,
  isPlaying,
  onPlaylistSelect,
  renderPlayer
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
      }
    },
    [hash, playIndex, timeParam]
  );

  useEffect(() => {
    const playlistsArr = [] as PlaylistType[];
    if (mediaPlaylists && mediaPlaylists.length > 0) {
      playlistsArr.push(...mediaPlaylists);
      // setSelectedPlaylist(mediaPlaylists[0] || null);
    }
    if (sanityType) {
      void getPlaylists(sanityType, mediaType === 'audio')
        .then((sanityPl) => {
          playlistsArr.push(...sanityPl);
          setInitialPlaylists(playlistsArr);
        })
        .catch((error) => {
          console.error('Error fetching playlists:', error);
        });
    } else {
      setInitialPlaylists(playlistsArr);
    }
  }, [
    mediaPlaylists,
    sanityType,
    getPlaylists,
    mediaType,
    setInitialPlaylists
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
    <>
      <section className="media-playlist-list u-space--top">
        {playlists.map((pl) => (
          <MediaPlaylist
            key={pl._id}
            playlist={pl}
            onPlaylistSelect={() => handleSelect(pl)}
            isCurrent={selectedPlaylist?._id === pl._id}
            isPlaying={selectedPlaylist?._id === pl._id && isPlaying}
            actionButtons={getActionButtons(pl)}
            type={mediaType}
          />
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
