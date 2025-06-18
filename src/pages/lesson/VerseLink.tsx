import { useCallback, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import { OptionGroup } from 'alps-library/molecules/forms/elements/OptionGroup';
import { Button as AlpsButton } from 'src/alps/atoms/Button';
import { LessonDays } from 'src/utils/LessonUtils';

export const VerseLink = ({
  verseKey,
  label,
  bible
}: {
  verseKey: string;
  label: string;
  bible: LessonDays['bible'];
}) => {
  const [open, setOpen] = useState(false);
  const [translation, setTranslation] = useState(bible?.[0]?.name || 'BG1940');

  const handleOpen = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => setOpen(false), []);

  // Find the selected translation
  const bibleObj = bible?.find((b) => b.name === translation);
  const verseHtml =
    bibleObj?.verses?.[verseKey] || '<em>Няма текст за този превод.</em>';

  return (
    <>
      <a href="#" className="verse" onClick={handleOpen}>
        {label}
      </a>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Библейски текст</DialogTitle>
        <DialogContent>
          <OptionGroup
            type="radio"
            title="Версия на библията"
            titleFontSize="m"
            options={bible?.map((b) => ({
              label: b.name,
              id: `bible-translation-${b.name}`,
              name: 'bibleTranslation',
              value: b.name,
              checked: translation === b.name,
              onClick: () => setTranslation(b.name)
            }))}
          />
          <p dangerouslySetInnerHTML={{ __html: verseHtml }} />
        </DialogContent>
        {/* similar to set .u-padding--double */}
        <DialogActions
          style={{ padding: 'calc(2.5rem / 2 * 1.5)' }}
          disableSpacing
        >
          <AlpsButton label="Затвори" onClick={handleClose} />
        </DialogActions>
      </Dialog>
    </>
  );
};
