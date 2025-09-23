import { useState } from 'react';
import { Button } from 'src/alps/atoms/Button';
import { TextField } from 'alps-library/molecules/forms/elements/TextField';
import './PlaylistActionButtons.scss';
import DownloadPlaylist from './DownloadPlaylist';
import { RESOURCES_FOLDER } from 'src/constants';

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

  const hasDownload = itemUrls && itemUrls.length > 0;

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
      {(shareUrl || hasDownload) && (
        <div className="buttons u-space--half--bottom">
          {shareUrl && (
            <Button
              onClick={() => handleShare(shareUrl)}
              small
              label="Вземи линк"
              icon="share"
            />
          )}
          {hasDownload && (
            <DownloadPlaylist
              itemUrls={itemUrls.map(
                (url) => `${RESOURCES_FOLDER}${url.replace(/^\/+/, '')}`
              )}
              playlistName={playlistName}
            />
          )}
        </div>
      )}
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
    </div>
  );
};

export default PlaylistActionButtons;
