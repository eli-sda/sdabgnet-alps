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
  getCurrentTime?: () => number;
};

// Helper to format seconds as 0:35, 2:01 etc.
function formatTime(seconds: number) {
  const s = Math.floor(seconds || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  } else {
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }
}

const PlaylistActionButtons = ({
  shareUrl,
  fromIndex,
  fromTitle,
  itemUrls = [],
  playlistName = 'playlist',
  setRefreshCounter,
  getCurrentTime
}: PlaylistActionButtonsProps) => {
  const [toShow, setToShow] = useState(false);
  const [withIndex, setWithIndex] = useState(false);
  const [showCopyLabel, setShowCopyLabel] = useState(false);
  const [withTime, setWithTime] = useState(false);

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
    // add the current time only if withTime is selected
    if (withIndex && withTime && typeof getCurrentTime === 'function') {
      const time = getCurrentTime();
      if (time > 0) {
        params.set('time', Math.floor(time).toString());
      }
    }
    if (playlistName) {
      params.set('playlistTitle', playlistName);
    }

    if (withIndex && fromTitle) {
      params.set('title', fromTitle);
    }

    const query = params.toString();
    return query ? `${baseUrl}?${query}${hash}` : shareUrl;
  }, [
    shareUrl,
    playlistName,
    fromIndex,
    fromTitle,
    withIndex,
    withTime,
    playlistID,
    getCurrentTime
  ]);

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
              className="share-button"
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
              label={showCopyLabel ? 'Линкът е копиран' : 'Сподели линк'}
              value={url}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />

            <Button
              className="copy-button"
              onClick={handleCopy}
              simple
              faIconClass="far fa-copy fa-lg"
              title="Копирай линка"
            />
          </div>

          {fromIndex !== undefined && (
            <>
              <Checkbox
                className="u-space--half--top"
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
              {withIndex && typeof getCurrentTime === 'function' && (
                <Checkbox
                  name={
                    playlistID
                      ? `addCurrentTime-${playlistID}`
                      : 'addCurrentTime'
                  }
                  checked={withTime}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => setWithTime((e.target as HTMLInputElement).checked)}
                  label={`Започване от ${formatTime(getCurrentTime())}`}
                />
              )}
            </>
          )}

          <Button
            className="close-button"
            faIconClass="fas fa-times fa-lg"
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
