import { memo, useState } from 'react';
import { FaVideo } from 'react-icons/fa';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import MediaPlaylistList from 'src/components/media/MediaPlaylistList';
import { VideoPlayerDialog } from './VideoPlayerDialog';
import { reactIconProps } from '../MediaPlaylistListDefReactIcon';
import './VideoPlaylistList.scss';

type VideoPlaylistListProps = {
  pagePath?: string;
  playlists?: PlaylistType[];
  withListPadding?: boolean;
};

const VideoPlaylistList = ({
  pagePath,
  playlists,
  withListPadding = false
}: VideoPlaylistListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <MediaPlaylistList
      pagePath={pagePath}
      mediaPlaylists={playlists}
      className={withListPadding ? 'u-padding--sides' : ''}
      mediaType="video"
      defaultImageIcon={<FaVideo {...reactIconProps} />}
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
