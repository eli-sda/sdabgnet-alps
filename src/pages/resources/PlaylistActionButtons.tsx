import { useState } from 'react';
import { Button } from 'src/alps/atoms/Button';
import { TextField } from 'alps-library/molecules/forms/elements/TextField';
import './PlaylistActionButtons.scss';
import DownloadPlaylist from './DownloadPlaylist';

type PlaylistActionButtonsProps = {
  shareUrl?: string;
  itemUrls?: string[];
  playlistName?: string;
};

const PlaylistActionButtons = ({
  shareUrl,
  itemUrls = [],
  playlistName = 'playlist'
}: PlaylistActionButtonsProps) => {
  // State for label text
  const [toShow, setToShow] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState('');

  const handleShare = (shareUrl: string) => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopiedLabel('Линкът е копиран');
        setToShow(true);
      })
      .catch(() => {
        setCopiedLabel('');
        setToShow(true);
      });
  };

  return (
    <div className="playlist-action-buttons">
      {shareUrl && (
        <>
          <Button
            className="u-space--half--bottom"
            onClick={() => handleShare(shareUrl)}
            small
            label="Вземи линк"
            icon="share"
          />

          {toShow && (
            <div className="share-field">
              <TextField
                labelClass="u-space--half--bottom"
                name="share-link"
                label={copiedLabel}
                value={shareUrl}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />

              <Button
                className="close-button"
                faIcon="times"
                iconPosition="right"
                onClick={() => setToShow(false)}
                simple
              />
            </div>
          )}

          {itemUrls.length > 0 && (
            <DownloadPlaylist
              itemUrls={itemUrls.map(
                (url) => `/sdabg/${url.replace(/^\/+/, '')}`
              )}
              playlistName={playlistName}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PlaylistActionButtons;
