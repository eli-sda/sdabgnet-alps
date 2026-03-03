import { memo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    null
  );

  const [searchParams] = useSearchParams();
  const playlistIdFromUrl = searchParams.get('playlistId');
  const videoIdFromUrl = searchParams.get('video');

  useEffect(() => {
    if (!playlistIdFromUrl) return;
    if (!playlists?.length) return;

    const found = playlists.find((p) => p._id === playlistIdFromUrl);

    if (found) {
      setSelectedPlaylist(found);
      setDialogOpen(true);
    }
  }, [playlistIdFromUrl, playlists]);

  return (
    <MediaPlaylistList
      sanityType={sanityType}
      mediaPlaylists={playlists}
      mediaType="video"
      onPlaylistSelect={(pl) => {
        setSelectedPlaylist(pl);
        setDialogOpen(true);
      }}
      renderPlayer={(_selectedPlaylist, _setPlayIndex, _playIndex) => (
        <VideoPlayerDialog
          isOpen={dialogOpen}
          playlist={selectedPlaylist}
          onClose={() => setDialogOpen(false)}
          initialVideoId={videoIdFromUrl ?? undefined}
        />
      )}
    />
  );
};

export default memo(VideoPlaylistList);
