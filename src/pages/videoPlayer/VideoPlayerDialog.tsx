import { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Button as AlpsButton } from 'src/alps/atoms/Button';
import VideoPlayer, { VideoPlaylistType } from './VideoPlayer';

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
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {playlist && <VideoPlayer playlist={playlist} />}
      </DialogContent>
      <DialogActions>
        <AlpsButton label="Затвори" onClick={handleClose} />
      </DialogActions>
    </Dialog>
  );
};
