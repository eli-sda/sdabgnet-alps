import { memo, useCallback, useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
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
    playIndex?: number
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
//   const { hash, search } = useLocation();
//   const searchParams = new URLSearchParams(search);
//   const playIndex = searchParams.get('playIndex');
  const { getPlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>(
    mediaPlaylists || []
  );
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    null
  );
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);

  const handleSelect = (playlist: PlaylistType) => {
    setSelectedPlaylist(playlist);
    setCurrentPlayIndex(0);
    onPlaylistSelect?.(playlist);
  };

  useEffect(() => {
    if (mediaPlaylists && mediaPlaylists.length > 0) {
      //   setPlaylists([mediaPlaylists||undefined]);
      setSelectedPlaylist(mediaPlaylists[0] || null);
    }
    if (sanityType) {
      void getPlaylists(sanityType, mediaType === 'audio').then((sanityPl) =>
        setPlaylists((curruntPlaylysts) => ({
          ...curruntPlaylysts,
          ...sanityPl
        }))
      );
    }
  }, [mediaPlaylists, sanityType, getPlaylists, mediaType]);

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

      {renderPlayer?.(selectedPlaylist, setCurrentPlayIndex, currentPlayIndex)}
    </>
  );
};

export default memo(MediaPlaylistList);
