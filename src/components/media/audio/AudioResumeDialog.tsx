import { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Button } from 'src/alps/atoms/Button';

type ResumePrompt = {
  playlistId: string;
  itemId: string;
  title: string;
  index: number;
} | null;

type AudioResumeDialogProps = {
  resumePrompt: ResumePrompt;
  onClose: () => void;
  onContinue: (index: number) => void;
};

export const AudioResumeDialog = ({
  resumePrompt,
  onClose,
  onContinue
}: AudioResumeDialogProps) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleContinue = useCallback(() => {
    if (resumePrompt) onContinue(resumePrompt.index);
  }, [onContinue, resumePrompt]);

  return (
    <Dialog
      open={Boolean(resumePrompt)}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      disableAutoFocus
    >
      <DialogTitle>Възстановяване на възпроизвеждането</DialogTitle>
      <DialogContent>
        <p>
          Последно сте слушали <strong>{resumePrompt?.title}</strong>. Искате ли
          да продължите от там?
        </p>
      </DialogContent>
      <DialogActions>
        <Button label="Не" simple onClick={handleClose} />
        <Button label="Да, продължи" onClick={handleContinue} />
      </DialogActions>
    </Dialog>
  );
};

export default AudioResumeDialog;
