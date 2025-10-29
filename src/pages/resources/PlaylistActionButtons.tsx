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
  fromTitle?: string;
  itemUrls?: string[];
  playlistName?: string;
  setRefreshCounter?: React.Dispatch<React.SetStateAction<number>>;
};

const PlaylistActionButtons = ({
  shareUrl,
  fromIndex,
  fromTitle,
  itemUrls = [],
  playlistName = 'playlist',
  setRefreshCounter
}: PlaylistActionButtonsProps) => {
  const [toShow, setToShow] = useState(false);
  const [withIndex, setWithIndex] = useState(false);
  const [showCopyLabel, setShowCopyLabel] = useState(false);

  const hasDownload = itemUrls && itemUrls.length > 0;
  const playlistID = shareUrl?.split('#')[1];

  // Generate the final share URL with all query parameters

  const url = useMemo(() => {
    if (!shareUrl) return '';

    const baseUrl = shareUrl.split('#')[0];
    const hash = shareUrl.includes('#') ? '#' + playlistID : '';

    const params = new URLSearchParams();
    
    if (withIndex && typeof fromIndex === 'number') {
      params.set('playIndex', fromIndex.toString());
    }

    if (playlistName) {
      params.set('playlistTitle', playlistName);
    }

    if (withIndex && fromTitle) {
      params.set('title', fromTitle);
    }

    const query = params.toString();
    return query ? `${baseUrl}?${query}${hash}` : shareUrl;
  }, [shareUrl, playlistName, fromIndex, fromTitle, withIndex, playlistID]);

  const handleShare = () => {
    if (!url) return;
    setToShow(true);
    setRefreshCounter?.((prev) => prev + 1);
  };

  const handleCopy = () => {
    if (!url) return;
    void navigator.clipboard.writeText(url).then(() => {
      setShowCopyLabel(true);
      setRefreshCounter?.((prev) => prev + 1);
      setTimeout(() => setShowCopyLabel(false), 3000);
    });
  };

  return (
    <div className="playlist-action-buttons u-spacing--half">
      {(shareUrl || hasDownload) && (
        <div className="buttons">
          {shareUrl && (
            <Button
              onClick={handleShare}
              small
              label="Вземи линк"
              icon="share"
              iconSize="s"
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
              label="Към текущото аудио"
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
