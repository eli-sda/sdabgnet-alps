import { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Button as AlpsButton } from 'src/alps/atoms/Button';

type MessageDialogProps = {
  message?: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const MessageDialog = ({
  message,
  title = 'Съобщение',
  isOpen,
  onClose
}: MessageDialogProps) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent><p>{message}</p></DialogContent>
      <DialogActions>
        <AlpsButton label="Затвори" onClick={handleClose} />
      </DialogActions>
    </Dialog>
  );
};
