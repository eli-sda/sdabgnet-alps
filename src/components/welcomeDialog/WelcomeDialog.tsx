import { NavLink } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Button as AlpsButton } from 'src/alps/atoms/Button';
import routes from 'src/routes';

type WelcomeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const WelcomeDialog = ({ isOpen, onClose }: WelcomeDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Добре дошли!</DialogTitle>
      <DialogContent className='text'>
        <p>
          Добре дошли в обновения сайт на Адвентната българска мреж@.
        </p>
        <p>
          Използвайте страницата{' '}
          <NavLink to={routes.about('site-guide')} onClick={onClose}>
            Ориентация в сайта
          </NavLink>
          , за да се запознаете с промените и да се ориентирате по-лесно.
        </p>
      </DialogContent>
      <DialogActions>
        <AlpsButton label="Разбрах" onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};
