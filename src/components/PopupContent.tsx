import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button as AlpsButton } from '../alps/atoms/Button';

const PopupContent = ({
  children,
  title,
  buttonLabel
}: {
  children: React.ReactNode;
  title?: string;
  buttonLabel?: string;
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement>
  ) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <AlpsButton
        onClick={handleOpen}
        label={buttonLabel || 'Прочети повече'}
        outline={true}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <AlpsButton label="Затвори" onClick={handleClose} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PopupContent;
