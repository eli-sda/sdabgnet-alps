import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Button as AlpsButton } from 'src/alps/atoms/Button';

type InfoDialogProps = {
  message: string;
  title?: string;
};

export const InfoDialog = ({
  message,
  title = 'Съобщение',
  onClose
}: InfoDialogProps & { onClose?: () => void }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose?.(); // call the optional onClose callback to reset or clear the parent state
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <AlpsButton label="Затвори" onClick={handleClose} />
      </DialogActions>
    </Dialog>
  );
};
