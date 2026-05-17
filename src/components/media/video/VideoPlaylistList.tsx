import { memo, useState } from 'react';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import MediaPlaylistList from 'src/components/media/MediaPlaylistList';
import { VideoPlayerDialog } from './VideoPlayerDialog';

type VideoPlaylistListProps = {
  sanityType?: string;
  playlists?: PlaylistType[];
};

const VideoPlaylistList = ({
  sanityType,
  playlists
}: VideoPlaylistListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <MediaPlaylistList
      sanityType={sanityType}
      mediaPlaylists={playlists}
      mediaType="video"
      defaultImageIcon={
        <i
          style={{
            width: '234px',
            height: '234px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '120px'
          }}
          className="fas fa-video u-background-color--gray--light u-color--black"
        ></i>
      }
      onPlaylistSelect={() => {
        setDialogOpen(true);
      }}
      renderPlayer={(selectedPlaylist, _setPlayIndex, playIndex) => (
        <VideoPlayerDialog
          isOpen={dialogOpen}
          playlist={selectedPlaylist}
          title={selectedPlaylist?.title}
          onClose={() => setDialogOpen(false)}
          playIndex={playIndex}
        />
      )}
    />
  );
};

export default memo(VideoPlaylistList);
