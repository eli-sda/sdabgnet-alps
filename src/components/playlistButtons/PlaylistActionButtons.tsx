import { useMemo, useState } from 'react';
import { TextField } from 'alps-library/molecules/forms/elements/TextField';
import { Checkbox } from 'alps-library/molecules/forms/elements/Checkbox';
import { Button } from 'src/alps/atoms/Button';
import { RESOURCES_FOLDER } from 'src/constants';
import { formatTime } from 'src/utils/formatTime';
import ShareItemButton from '../ShareItemButton';
import DownloadPlaylistButton from './DownloadPlaylistButton';
import './PlaylistActionButtons.scss';

type PlaylistActionButtonsProps = {
  shareUrl?: string;
  fromPlayId?: string;
  fromTitle?: string;
  itemUrls?: string[];
  playlistName?: string;
  simpleCopyButton?: boolean;
  setRefreshCounter?: React.Dispatch<React.SetStateAction<number>>;
  getCurrentTime?: () => number;
  showSaveButton?: boolean;
  onSaveAction?: () => void;
  shareBaseParams?: Record<string, string>;
};

const PlaylistActionButtons = ({
  shareUrl,
  fromPlayId,
  fromTitle,
  itemUrls = [],
  playlistName = 'playlist',
  setRefreshCounter,
  getCurrentTime,
  simpleCopyButton = false,
  showSaveButton = false,
  onSaveAction,
  shareBaseParams
}: PlaylistActionButtonsProps) => {
  const [toShow, setToShow] = useState(false);
  const [fromCurrent, setFromCurrent] = useState(false);
  const [showCopyLabel, setShowCopyLabel] = useState(false);
  const [withTime, setWithTime] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const hasDownload = itemUrls && itemUrls.length > 0;
  const playlistID = shareUrl?.split('#')[1];

  // Generate the final share URL with all query parameters
  const url = useMemo(() => {
    if (!shareUrl) return '';

    const hashIdx = shareUrl.indexOf('#');
    const baseUrl = hashIdx >= 0 ? shareUrl.substring(0, hashIdx) : shareUrl;
    const hash = hashIdx >= 0 ? shareUrl.substring(hashIdx) : '';

    const params = new URLSearchParams();

    if (shareBaseParams) {
      for (const [key, value] of Object.entries(shareBaseParams)) {
        params.set(key, value);
      }
    } else {
      const currentTab =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('tab')
          : null;

      if (currentTab) {
        params.set('tab', currentTab);
      }
    }

    if (fromCurrent) {
      if (fromPlayId) {
        params.set('playId', fromPlayId);
      }

      // add the current time only if withTime is selected
      if (withTime && typeof getCurrentTime === 'function') {
        const time = getCurrentTime();
        if (time > 0) {
          params.set('time', Math.floor(time).toString());
        }
      }
    }

    if (playlistName) {
      params.set('playlistTitle', playlistName);
    }

    if (fromCurrent && fromTitle) {
      params.set('title', fromTitle);
    }

    const query = params.toString();
    return query ? `${baseUrl}?${query}${hash}` : shareUrl;
  }, [
    shareUrl,
    shareBaseParams,
    playlistName,
    fromPlayId,
    fromTitle,
    fromCurrent,
    withTime,
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

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSaveAction) {
      onSaveAction();
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="playlist-action-buttons u-spacing--half">
      {(shareUrl || hasDownload || showSaveButton) && (
        <div className="buttons">
          {shareUrl &&
            (!simpleCopyButton ? (
              <Button
                onClick={handleShare}
                small
                label="Вземи линк"
                faIconClass="fas fa-share-alt"
              />
            ) : (
              <ShareItemButton url={url} />
            ))}

          {hasDownload && (
            <DownloadPlaylistButton
              itemUrls={itemUrls.map(
                (url) => `${RESOURCES_FOLDER}${url.replace(/^\/+/, '')}`
              )}
              playlistName={playlistName}
            />
          )}

          {showSaveButton && (
            <Button
              onClick={handleSave}
              label={isSaved ? 'Запомнено' : 'Запомни'}
              title={
                isSaved ? 'Успешно запазено' : 'Запомни докъде съм стигнал'
              }
              faIconClass={isSaved ? 'fas fa-check' : 'fas fa-bookmark'}
              disabled={isSaved}
              small
            />
          )}
        </div>
      )}

      {!simpleCopyButton && toShow && (
        <div className={`share-fields${showCopyLabel ? ' withLabel' : ''}`}>
          <div className="share-link u-space--half--bottom">
            <TextField
              name="share-link"
              label={showCopyLabel ? 'Линкът е копиран' : 'Сподели линк'}
              value={url}
              readOnly
              onClick={(
                e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => e.currentTarget.select()}
            />

            <Button
              className="copy-button"
              onClick={handleCopy}
              disabled={showCopyLabel}
              simple
              faIconClass="far fa-copy fa-lg"
              title="Копирай линка"
            />
          </div>

          {fromPlayId !== undefined && (
            <>
              <Checkbox
                className="u-space--half--top"
                name={
                  playlistID
                    ? `startFromCurrentAudio-${playlistID}`
                    : 'startFromCurrentAudio'
                }
                checked={fromCurrent}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => setFromCurrent((e.target as HTMLInputElement).checked)}
                label="Към текущото аудио"
              />
              {fromCurrent && typeof getCurrentTime === 'function' && (
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
            title="Затвори"
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
