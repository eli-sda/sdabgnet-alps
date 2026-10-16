import { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Button } from 'src/alps/atoms/Button';
import { formatTime } from 'src/utils/formatTime';

type ResumePrompt = {
  playlistId: string;
  itemId: string;
  title: string;
  index: number;
  time?: number;
} | null;

type MediaType = 'audio' | 'video';

type MediaResumeDialogProps = {
  resumePrompt: ResumePrompt;
  mediaType?: MediaType;
  onClose: () => void;
  onContinue: (index: number) => void;
};

export const MediaResumeDialog = ({
  resumePrompt,
  mediaType = 'audio',
  onClose,
  onContinue
}: MediaResumeDialogProps) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleContinue = useCallback(() => {
    if (resumePrompt) onContinue(resumePrompt.index);
  }, [onContinue, resumePrompt]);

  const isVideo = mediaType === 'video';

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
          Последно сте {isVideo ? 'гледали' : 'слушали'}{' '}
          <strong>{resumePrompt?.title}</strong>
          {!isVideo && resumePrompt?.time && resumePrompt.time > 0 && (
            <span>
              {' '}
              до <strong>{formatTime(resumePrompt.time)}</strong>
            </span>
          )}
          . Искате ли да продължите {isVideo ? 'с него' : 'от там'}?
        </p>
      </DialogContent>
      <DialogActions>
        <Button label="Не" simple onClick={handleClose} />
        <Button label="Да, продължи" onClick={handleContinue} />
      </DialogActions>
    </Dialog>
  );
};

export default MediaResumeDialog;
