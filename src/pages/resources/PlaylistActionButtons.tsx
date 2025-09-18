import { Button } from 'src/alps/atoms/Button';
import { TextField } from 'alps-library/molecules/forms/elements/TextField';
import './PlaylistActionButtons.scss';

type PlaylistActionButtonsProps = {
  shareUrl: string;
  copied: string;
  onShare: () => void;
  onClose: () => void;
};

const PlaylistActionButtons = ({
  shareUrl,
  copied,
  onShare,
  onClose
}: PlaylistActionButtonsProps) => {
  if (!shareUrl) return null;

  return (
    <>
      <Button
        className="u-space--half--bottom"
        onClick={onShare}
        small
        label="Вземи линк"
        icon="share"
      />

      {copied && (
        <div className="playlist-action-buttons">
          <TextField
            labelClass="u-space--half--bottom"
            name="share-link"
            label={copied}
            value={shareUrl}
            readOnly
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />

          <Button
            className="close-button"
            faIcon="times"
            onClick={onClose}
            simple
          />
        </div>
      )}
    </>
  );
};

export default PlaylistActionButtons;
