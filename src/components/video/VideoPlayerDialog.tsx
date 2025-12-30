import React from 'react';
import { useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import { Button as AlpsButton } from 'src/alps/atoms/Button';
import VideoPlayer, { VideoPlaylistType } from './VideoPlayer';
import VideoPlaylistList from './VideoPlaylistList';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import './VideoPlayerDialog.scss';

type VideoPlayerDialogProps = {
  playlist?: VideoPlaylistType | null;
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  // For using VideoPlaylistList instead of VideoPlayer
  playlistType?: string;
  playlistData?: PlaylistType;
  usePlaylistList?: boolean;
  showDownloadAll?: boolean;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export const VideoPlayerDialog = ({
  playlist,
  title = '',
  isOpen,
  onClose,
  playlistType,
  playlistData,
  usePlaylistList = false,
  showDownloadAll = true
}: VideoPlayerDialogProps) => {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <Dialog
      open={isOpen}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick') return;
        handleClose();
      }}
      slots={{
        transition: Transition
      }}
      maxWidth="xl"
      fullWidth
      keepMounted // Improve performance by not unmounting on close
      className="videoPlayerDialog"
    >
      <DialogTitle className="videoPlayerDialog-title">
        {title}
        <div className="videoPlayerDialog-title-close-wrapper">
          <AlpsButton
            faIconClass="fas fa-times fa-lg"
            iconPosition="right"
            simple
            onClick={handleClose}
          />
        </div>
      </DialogTitle>
      <DialogContent>
        {usePlaylistList && playlistType ? (
          <VideoPlaylistList
            type={playlistType}
            playlist={playlistData}
            showDownloadAll={showDownloadAll}
          />
        ) : (
          playlist && <VideoPlayer playlist={playlist} isVisible={isOpen} />
        )}
      </DialogContent>
    </Dialog>
  );
};
