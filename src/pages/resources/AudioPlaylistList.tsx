import { useEffect, useState } from 'react';
import { Grid } from 'alps-library/atoms/grids/Grid';
import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { Caption } from 'alps-library/atoms/text/Caption';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import AudioPalylist from './AudioPalylist';
import AudioPlayer from './AudioPlayer';

interface AudioPlaylistListProps {
  type: string;
}

const AudioPlaylistList = ({ type }: AudioPlaylistListProps) => {
  const { getPlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    null
  );

  const handlePlaylistSelect = (playlist: PlaylistType) => {
    setSelectedPlaylist(playlist);
  };

  useEffect(() => {
    getPlaylists(type)
      .then(setPlaylists)
      .catch((err) => console.error(err));
  }, [getPlaylists, type]);

  return (
    <>
      {!playlists ||
        (playlists.length === 0 && (
          <Caption>Няма налични аудио ресурси.</Caption>
        ))}

      <Grid
        className={'l-grid l-grid--7-col l-grid-wrap l-grid-wrap--6-of-7'}
        seven
        as="section"
        wrap={'6'}
      >
        {playlists.map((playlist) => (
          <GridItem
            className="u-padding--sides u-space--triple--bottom l-grid-item"
            key={playlist._id}
            sizeAtXL="1"
            sizeAtM="2"
          >
            <AudioPalylist
              playlist={playlist}
              onPlay={() => handlePlaylistSelect(playlist)}
            />
          </GridItem>
        ))}
      </Grid>

      {selectedPlaylist?.items && <AudioPlayer playlist={selectedPlaylist} />}
    </>
  );
};

export default AudioPlaylistList;
