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
      onPlaylistSelect={() => {
        setDialogOpen(true);
      }}
      renderPlayer={(selectedPlaylist, _setPlayIndex, playIndex) => (
        <VideoPlayerDialog
          isOpen={dialogOpen}
          playlist={selectedPlaylist}
          onClose={() => setDialogOpen(false)}
          playIndex={playIndex}
        />
      )}
    />
  );
};

export default memo(VideoPlaylistList);
