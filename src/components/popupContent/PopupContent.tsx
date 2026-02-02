import React, { useState } from 'react';
import { Breakpoint } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button as AlpsButton } from '../../alps/atoms/Button';

import './PopupContent.scss';

const PopupContent = ({
  children,
  title,
  buttonLabel,
  buttonLighter,
  asLink = false,
  maxWidth = 'sm',
  faIconClass
}: {
  children: React.ReactNode;
  title?: string;
  buttonLabel?: string;
  buttonLighter?: boolean;
  asLink?: boolean;
  maxWidth?: Breakpoint | false;
  faIconClass?: string;
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement>
  ) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  let icon = null;
  if (faIconClass) {
    icon = (
      <i
        className={`${faIconClass} ${
          buttonLabel ? `u-space--quarter--right` : ''
        }`}
      ></i>
    );
  }
  return (
    <>
      {asLink ? (
        <a href="#" onClick={handleOpen}>
          {icon}
          {buttonLabel || 'Прочети повече'}
        </a>
      ) : (
        <AlpsButton
          onClick={handleOpen}
          label={buttonLabel || 'Прочети повече'}
          outline={!buttonLighter}
          faIconClass={faIconClass}
          lighter={buttonLighter}
        />
      )}

      <Dialog open={open} onClose={handleClose} maxWidth={maxWidth} fullWidth>
        {title && (
          <DialogTitle className="popupContent-dialogTitle u-color--gray--darker">
            {title}
          </DialogTitle>
        )}
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <AlpsButton label="Затвори" onClick={handleClose} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PopupContent;
