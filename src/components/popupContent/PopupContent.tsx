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
  linkTitleClassName,
  maxWidth = 'sm',
  faIconClass,
  iconPosition = 'left'
}: {
  children: React.ReactNode;
  title?: string;
  buttonLabel?: string;
  buttonLighter?: boolean;
  asLink?: boolean;
  linkTitleClassName?: string;
  maxWidth?: Breakpoint | false;
  faIconClass?: string;
  iconPosition?: 'left' | 'right';
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
          buttonLabel
            ? `u-space--quarter--${iconPosition === 'left' ? 'right' : 'left'}`
            : ''
        }`}
      ></i>
    );
  }

  const label = buttonLabel || 'Прочети повече';

  return (
    <>
      {asLink ? (
        <a href="#" className={linkTitleClassName} onClick={handleOpen}>
          {iconPosition === 'left' && icon}
          {label}
          {iconPosition === 'right' && icon}
        </a>
      ) : (
        <AlpsButton
          onClick={handleOpen}
          label={label}
          outline={!buttonLighter}
          faIconClass={faIconClass}
          iconPosition={iconPosition}
          lighter={buttonLighter}
        />
      )}

      <Dialog open={open} onClose={handleClose} maxWidth={maxWidth} fullWidth>
        {title && (
          <DialogTitle className="popupContent-dialogTitle">
            {title}
            <div className="close-wrapper">
              <AlpsButton
                faIconClass="fas fa-times fa-lg"
                iconPosition="right"
                title="Затвори"
                simple
                onClick={handleClose}
              />
            </div>
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
