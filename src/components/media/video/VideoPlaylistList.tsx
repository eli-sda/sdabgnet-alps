import { memo, ReactNode, useState } from 'react';
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
  renderPlaylistExtra?: (playlist: PlaylistType) => ReactNode;
  getShareBaseParams?: (playlist: PlaylistType) => Record<string, string>;
  highlightText?: string;
};

const VideoPlaylistList = ({
  pagePath,
  playlists,
  withListPadding = false,
  renderPlaylistExtra,
  getShareBaseParams,
  highlightText
}: VideoPlaylistListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <MediaPlaylistList
      pagePath={pagePath}
      mediaPlaylists={playlists}
      className={withListPadding ? 'u-padding--sides' : ''}
      mediaType="video"
      defaultImageIcon={<FaVideo {...reactIconProps} />}
      highlightText={highlightText}
      onPlaylistSelect={() => {
        setDialogOpen(true);
      }}
      renderPlayer={(selectedPlaylist, setPlayIndex, playIndex) => (
        <VideoPlayerDialog
          isOpen={dialogOpen && Boolean(selectedPlaylist)}
          playlist={selectedPlaylist}
          title={selectedPlaylist?.title}
          onClose={() => setDialogOpen(false)}
          playIndex={playIndex}
          onPlayIndexChange={setPlayIndex}
          shareBaseParams={
            selectedPlaylist && getShareBaseParams
              ? getShareBaseParams(selectedPlaylist)
              : undefined
          }
        />
      )}
      renderPlaylistExtra={renderPlaylistExtra}
      getShareBaseParams={getShareBaseParams}
    />
  );
};

export default memo(VideoPlaylistList);
