import { useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Button as AlpsButton } from 'src/alps/atoms/Button';
import VideoPlayer, { VideoPlaylistType } from './VideoPlayer';
import './VideoPlayerDialog.scss';

type VideoPlayerDialogProps = {
  playlist: VideoPlaylistType | null;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const VideoPlayerDialog = ({
  playlist,
  title = '',
  isOpen,
  onClose
}: VideoPlayerDialogProps) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open={isOpen}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick') return;
        handleClose();
      }}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>
        {title}
        <div className="dialog-close-button-wrapper">
          <AlpsButton
            faIconClass="fas fa-times fa-lg"
            iconPosition="right"
            simple
            onClick={handleClose}
          />
        </div>
      </DialogTitle>
      <DialogContent>
        {playlist && <VideoPlayer playlist={playlist} />}
      </DialogContent>
    </Dialog>
  );
};
