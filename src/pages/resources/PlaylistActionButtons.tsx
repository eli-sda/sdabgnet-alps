import { useMemo, useState } from 'react';
import { TextField } from 'alps-library/molecules/forms/elements/TextField';
import { Checkbox } from 'alps-library/molecules/forms/elements/Checkbox';
import { Button } from 'src/alps/atoms/Button';
import { RESOURCES_FOLDER } from 'src/constants';
import DownloadPlaylist from './DownloadPlaylist';
import './PlaylistActionButtons.scss';

type PlaylistActionButtonsProps = {
  shareUrl?: string;
  fromIndex?: number;
  itemUrls?: string[];
  playlistName?: string;
};

const PlaylistActionButtons = ({
  shareUrl,
  fromIndex,
  itemUrls = [],
  playlistName = 'playlist'
}: PlaylistActionButtonsProps) => {
  const [toShow, setToShow] = useState(false);
  const [withIndex, setWithIndex] = useState(false);
  const [showCopyLabel, setShowCopyLabel] = useState(false);

  const hasDownload = itemUrls && itemUrls.length > 0;
  const playlistID = shareUrl?.split('#')[1];

  // Construct share URL with playIndex as query parameter before the hash
  const url = useMemo(() => {
    return withIndex && shareUrl && fromIndex
      ? shareUrl.includes('?')
        ? shareUrl.replace('#', `&playIndex=${fromIndex}#`) // URL already has query params
        : shareUrl.replace('#', `?playIndex=${fromIndex}#`) // Add first query param
      : shareUrl;
  }, [shareUrl, fromIndex, withIndex]);

  const handleShare = () => {
    if (!url) return;
    setToShow(true);
  };

  const handleCopy = () => {
    if (!url) return;
    void navigator.clipboard.writeText(url).then(() => {
      setShowCopyLabel(true);
      setTimeout(() => setShowCopyLabel(false), 3000);
    });
  };

  return (
    <div className="playlist-action-buttons">
      {(shareUrl || hasDownload) && (
        <div className="buttons u-space--half--bottom">
          {shareUrl && (
            <Button
              onClick={handleShare}
              small
              label="Вземи линк"
              icon="share"
              iconSize="xs"
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
        <div className={`share-fields${showCopyLabel ? ' withLabel' : ''}`}>
          <div className="share-link u-space--half--bottom">
            <TextField
              name="share-link"
              label={showCopyLabel ? 'Линкът е копиран' : ''}
              value={url}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />

            <Button
              className="copy-button"
              onClick={handleCopy}
              simple
              faIcon="copy"
              title="Копирай линка"
            />
          </div>

          {!!fromIndex && (
            <Checkbox
              labelClass="u-space--half--top"
              name={
                playlistID
                  ? `startFromCurrentAudio-${playlistID}`
                  : 'startFromCurrentAudio'
              }
              checked={withIndex}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setWithIndex((e.target as HTMLInputElement).checked)}
              label="Линк към текущото аудио"
            />
          )}

          <Button
            className="close-button"
            faIcon="times"
            iconPosition="right"
            onClick={() => {
              setToShow(false);
              setShowCopyLabel(false);
            }}
            simple
          />
        </div>
      )}
    </div>
  );
};

export default PlaylistActionButtons;
