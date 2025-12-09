import { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Button as AlpsButton } from 'src/alps/atoms/Button';

type InfoDialogProps = {
  message?: string;
  title?: string;
  children?: React.ReactNode;
  fullScreen?: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export const InfoDialog = ({
  message,
  title = 'Съобщение',
  children,
  fullScreen = false,
  isOpen,
  onClose
}: InfoDialogProps) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children ? children : <p>{message}</p>}
      </DialogContent>
      <DialogActions>
        <AlpsButton label="Затвори" onClick={handleClose} />
      </DialogActions>
    </Dialog>
  );
};
