import { memo, useState } from 'react';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import MediaPlaylistList from 'src/components/media/MediaPlaylistList';
import { VideoPlayerDialog } from './VideoPlayerDialog';
import './VideoPlaylistList.scss';

type VideoPlaylistListProps = {
  pagePath?: string;
  playlists?: PlaylistType[];
};

const VideoPlaylistList = ({
  pagePath,
  playlists
}: VideoPlaylistListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <MediaPlaylistList
      pagePath={pagePath}
      mediaPlaylists={playlists}
      mediaType="video"
      defaultImageIcon={
        <i className="fas fa-video c-block__image u-color--black video-playlist-default-icon"></i>
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
