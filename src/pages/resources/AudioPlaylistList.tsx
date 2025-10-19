import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid } from 'alps-library/atoms/grids/Grid';
import { GridItem } from 'alps-library/atoms/grids/GridItem';
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
            if (!isNaN(i) && i < matchedPlaylist?.items?.length) {
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
      return (
        <div className="u-space--half--top">
          <PlaylistActionButtons
            shareUrl={`${window.location.origin}${window.location.pathname}#${playlist._id}`}
            fromIndex={
              selectedPlaylist?._id === playlist._id
                ? currentPlayIndex
                : undefined
            }
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

      <Grid
        className={
          'audio-playlist-list l-grid l-grid--7-col l-grid-wrap l-grid-wrap--6-of-7'
        }
        seven
        as="section"
        wrap={'6'}
      >
        {playlists.map((playlist) => (
          <GridItem
            className="u-padding--sides u-space--triple--bottom l-grid-item"
            key={playlist._id}
            sizeAtS="3"
            sizeAtL="2"
            sizeAtXL="1"
          >
            <AudioPalylist
              playlist={playlist}
              onPlay={() => handlePlaylistSelect(playlist)}
              isCurrent={selectedPlaylist?._id === playlist._id}
              actionButtons={getActionButtons(playlist)}
            />
          </GridItem>
        ))}
      </Grid>

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
