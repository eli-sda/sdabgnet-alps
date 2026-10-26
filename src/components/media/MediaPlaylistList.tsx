import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { generateShareUrl } from 'src/utils/urlUtils';
import {
  getLastPlayedMedia,
  saveLastPlayedMedia
} from 'src/utils/lastPlayedMedia';
import PlaylistActionButtons from '../playlistButtons/PlaylistActionButtons';
import type { PlayableRef } from '../playlistButtons/ResumeButton';
import MediaResumeDialog from './MediaResumeDialog';
import MediaPlaylist from './MediaPlaylist';
import type { MediaPlayerRenderControls } from './MediaPlayerControls';
import './MediaPlaylistList.scss';

// The router defers location state updates (startTransition), so a filtered
// list can refresh before useLocation() reflects a new URL. Read the browser
// URL directly when capturing the shared-link selection.
type UrlSelection = {
  playlistId: string;
  playId: string | null;
  timeParam: string | null;
};

const readCurrentUrlSelection = (): UrlSelection | null => {
  const params = new URLSearchParams(window.location.search);
  const rawHash = window.location.hash;
  const playlistId =
    params.get('playlistId') || (rawHash ? rawHash.replace('#', '') : null);

  if (!playlistId) return null;

  return {
    playlistId,
    playId: params.get('playId'),
    timeParam: params.get('time')
  };
};

// Removed from the URL once a video playlist opened from a shared link, so the
// player is not re-opened on later refreshes of the list.
const VIDEO_SHARE_PARAMS = [
  'playlistId',
  'playId',
  'playlistTitle',
  'title'
] as const;

interface MediaPlaylistListProps {
  mediaType: 'audio' | 'video';
  pagePath?: string;
  mediaPlaylists?: PlaylistType[];
  showDownloadAll?: boolean;
  isPlaying?: boolean;
  onPlaylistSelect?: (playlist: PlaylistType) => void;
  renderPlayer?: (
    playlist: PlaylistType | null,
    controls: MediaPlayerRenderControls
  ) => React.ReactNode;
  getCurrentTime?: () => number;
  seekTo?: (time: number) => void;
  playerRef?: PlayableRef;
  className?: string;
  defaultImageIcon?: ReactNode;
  renderPlaylistExtra?: (playlist: PlaylistType) => ReactNode;
  getShareBaseParams?: (playlist: PlaylistType) => Record<string, string>;
  highlightText?: string;
}

const MediaPlaylistList = ({
  mediaType,
  pagePath,
  mediaPlaylists,
  showDownloadAll = false,
  isPlaying,
  onPlaylistSelect,
  renderPlayer,
  getCurrentTime,
  seekTo,
  playerRef,
  className = '',
  defaultImageIcon,
  renderPlaylistExtra,
  getShareBaseParams,
  highlightText
}: MediaPlaylistListProps) => {
  const { hash } = useLocation();
  const navigate = useNavigate();

  const { getPagePlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>(
    mediaPlaylists || []
  );
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    null
  );
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [initialTime, setInitialTime] = useState<number | undefined>(undefined);
  // Forces a re-render after an explicit save so canResume/resume button read
  // the newly stored position immediately instead of staying stale.
  const [, refreshRemembered] = useState(0);
  // True only while the selected playlist is the one the URL opened and the
  // resume action has not been used yet. Cleared on manual selection or resume.
  const [openedViaLink, setOpenedViaLink] = useState(false);
  const [resumePrompt, setResumePrompt] = useState<{
    playlistId: string;
    itemId: string;
    title: string;
    index: number;
    time?: number;
  } | null>(null);

  // Captured once on mount: a shared link must open its playlist only once.
  // Later data refreshes (for example a new search in Videoteka) recreate the
  // playlists array and must not apply the selection again.
  const pendingSelectionRef = useRef<UrlSelection | null>(
    readCurrentUrlSelection()
  );
  // Playlist and track that came from the link, needed by the "remember last
  // played" logic even after the playback params are removed from the URL.
  const linkPlaylistIdRef = useRef<string | null>(null);
  const linkTrackIdRef = useRef<string | null>(null);

  const clearInitialTime = useCallback(() => {
    setInitialTime(undefined);
  }, []);

  const clearVideoShareParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    (VIDEO_SHARE_PARAMS as readonly string[]).forEach((key) =>
      params.delete(key)
    );
    const search = params.toString();

    void navigate(
      { search: search ? `?${search}` : '', hash: '' },
      { replace: true }
    );
  }, [navigate]);

  useScrollToHash({ enabled: playlists.length > 0 && Boolean(hash) });

  const checkAndSetResumePrompt = useCallback((playlist: PlaylistType) => {
    const lastPlayed = getLastPlayedMedia(playlist._id);
    if (lastPlayed) {
      const savedIndex = playlist.items?.findIndex(
        (item) => item._id === lastPlayed.itemId
      );
      if (
        savedIndex !== undefined &&
        (savedIndex > 0 || (lastPlayed.time && lastPlayed.time > 0))
      ) {
        setResumePrompt({
          playlistId: playlist._id,
          itemId: lastPlayed.itemId,
          title: lastPlayed.title,
          index: savedIndex,
          time: lastPlayed.time
        });
        return;
      }
    }
    setResumePrompt(null);
  }, []);

  const handleSelect = useCallback(
    (playlist: PlaylistType) => {
      if (selectedPlaylist?._id === playlist._id) {
        onPlaylistSelect?.(playlist);
        return; // Do nothing if the same playlist is selected
      }

      // Only switching to a different playlist leaves the "opened via link"
      // state, so re-opening the same shared playlist keeps the resume button.
      setOpenedViaLink(false);
      setSelectedPlaylist(playlist);
      setCurrentPlayIndex(0);
      setInitialTime(undefined);

      checkAndSetResumePrompt(playlist);
      onPlaylistSelect?.(playlist);
    },
    [selectedPlaylist?._id, onPlaylistSelect, checkAndSetResumePrompt]
  );

  const setInitialPlaylists = useCallback(
    (playlistArr: PlaylistType[]) => {
      setPlaylists(playlistArr);

      const selection = pendingSelectionRef.current;
      if (!selection) return;

      const matchedPlaylist = playlistArr.find(
        (p) => p._id === selection.playlistId
      );

      // The playlist may arrive with a later batch of results; wait for it
      // instead of marking the link as handled.
      if (!matchedPlaylist) return;

      pendingSelectionRef.current = null;

      const { playId, timeParam } = selection;

      if (matchedPlaylist.items && matchedPlaylist.items.length > 0 && playId) {
        const index = matchedPlaylist.items.findIndex(
          (item) => item._id === playId
        );

        if (index !== -1) {
          setCurrentPlayIndex(index);
        }

        if (timeParam && /^\d+$/.test(timeParam)) {
          // Parse initial time (integer) from URL
          setInitialTime(Number.parseInt(timeParam, 10));
        } else {
          setInitialTime(undefined);
        }
      }

      linkPlaylistIdRef.current = matchedPlaylist._id;
      linkTrackIdRef.current =
        playId || matchedPlaylist.items?.[0]?._id || null;
      setSelectedPlaylist(matchedPlaylist);
      // Only the playlist picked by the URL counts as "opened via link".
      setOpenedViaLink(true);
      onPlaylistSelect?.(matchedPlaylist);

      if (mediaType === 'video') {
        clearVideoShareParams();
      }
    },
    [onPlaylistSelect, mediaType, clearVideoShareParams]
  );

  useEffect(() => {
    const playlistsArr: PlaylistType[] = [];

    if (mediaPlaylists && mediaPlaylists.length > 0) {
      playlistsArr.push(...mediaPlaylists);
    }

    if (pagePath) {
      void getPagePlaylists(pagePath)
        .then((sanityPl) => {
          playlistsArr.push(...sanityPl);
          setInitialPlaylists(playlistsArr);
        })
        .catch((error) => {
          console.error('Error fetching playlists:', error);
          setInitialPlaylists(playlistsArr);
        });
    } else {
      setInitialPlaylists(playlistsArr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mediaPlaylists,
    pagePath,
    mediaType
    // setInitialPlaylists - do not include to avoid infinite loop
  ]);

  useEffect(() => {
    if (!selectedPlaylist || resumePrompt) return;

    // If the audio player's handlePlay patch ever stops working, skip auto-saving
    // automatic advances in a shared-link playlist so the remembered item stays.
    const currentItem = selectedPlaylist.items?.[currentPlayIndex];
    if (!currentItem) return;

    // When the current item comes from the shared link (?playId), do not
    // overwrite an already remembered item for this playlist.
    const linkTrackId =
      selectedPlaylist._id === linkPlaylistIdRef.current
        ? linkTrackIdRef.current
        : null;

    if (linkTrackId === currentItem._id) {
      const existing = getLastPlayedMedia(selectedPlaylist._id);
      if (mediaType === 'video') {
        // Video is remembered from the link only if nothing was remembered yet.
        if (existing) {
          return;
        }
      } else if (existing && existing.itemId !== currentItem._id) {
        return;
      }
    }

    saveLastPlayedMedia(
      selectedPlaylist._id,
      currentItem._id,
      currentItem.title
    );
  }, [mediaType, selectedPlaylist, currentPlayIndex, resumePrompt]);

  return (
    <>
      <section className={`media-playlist-list ${className}`}>
        {playlists.map((playlist) => {
          const isCurrent = selectedPlaylist?._id === playlist._id;
          const currentItem = isCurrent
            ? playlist.items?.[currentPlayIndex]
            : undefined;

          // Mirror the video player's "Пусни от запомненото" for audio rows:
          // shown when the playlist was opened via a shared link and there is a
          // remembered position that differs from the current one.
          const rememberedEntry = isCurrent
            ? getLastPlayedMedia(playlist._id)
            : null;
          const resumeIndex = rememberedEntry
            ? (playlist.items?.findIndex(
                (item) => item._id === rememberedEntry.itemId
              ) ?? -1)
            : -1;

          return (
            <div key={playlist._id} className="playlist-item">
              <MediaPlaylist
                playlist={playlist}
                onPlaylistSelect={() => handleSelect(playlist)}
                isCurrent={isCurrent}
                isPlaying={isCurrent && isPlaying}
                type={mediaType}
                defaultImageIcon={defaultImageIcon}
                highlightText={highlightText}
                actionButtons={
                  <>
                    <div className="u-padding--half--top">
                      <PlaylistActionButtons
                        shareUrl={generateShareUrl({
                          id: playlist._id
                        })}
                        fromPlayId={currentItem?._id}
                        fromTitle={currentItem?.title}
                        itemUrls={
                          showDownloadAll
                            ? playlist.items
                                ?.map((item) => item.path)
                                .filter((path): path is string => !!path) || []
                            : undefined
                        }
                        playlistName={playlist.title}
                        getCurrentTime={getCurrentTime}
                        shareBaseParams={getShareBaseParams?.(playlist)}
                        simpleCopyButton={mediaType === 'video'}
                        showSaveButton={Boolean(
                          mediaType === 'audio' && isCurrent && currentItem
                        )}
                        onSaveAction={() => {
                          if (currentItem) {
                            const currentTime = getCurrentTime?.();
                            saveLastPlayedMedia(
                              playlist._id,
                              currentItem._id,
                              currentItem.title,
                              currentTime
                            );
                            // Re-render so the resume button reflects this save.
                            refreshRemembered((version) => version + 1);
                          }
                        }}
                        resume={
                          mediaType === 'audio' && isCurrent
                            ? {
                                openedViaLink,
                                remembered: rememberedEntry,
                                resumeIndex,
                                currentIndex: currentPlayIndex,
                                onSeek: (time) => {
                                  seekTo?.(time);
                                  setOpenedViaLink(false);
                                },
                                playerRef,
                                onSwitch: (index, time) => {
                                  setOpenedViaLink(false);
                                  setCurrentPlayIndex(index);
                                  if (time > 0) setInitialTime(time);
                                }
                              }
                            : undefined
                        }
                      />
                    </div>
                    {renderPlaylistExtra?.(playlist)}
                  </>
                }
              />
            </div>
          );
        })}
      </section>

      <MediaResumeDialog
        resumePrompt={resumePrompt}
        mediaType={mediaType}
        onClose={() => setResumePrompt(null)}
        onContinue={(index) => {
          setCurrentPlayIndex(index);
          if (resumePrompt?.time) {
            setInitialTime(resumePrompt.time);
          }
          setResumePrompt(null);
        }}
      />

      {renderPlayer?.(
        resumePrompt ? null : selectedPlaylist,
        {
          onPlayIndexChange: setCurrentPlayIndex,
          playIndex: currentPlayIndex,
          initialTime,
          openedViaLink,
          onInitialTimeApplied: clearInitialTime,
          // Only while the opened playlist is the one from the shared link.
          linkTrackId:
            selectedPlaylist?._id === linkPlaylistIdRef.current
              ? linkTrackIdRef.current
              : null
        }
      )}
    </>
  );
};

export default memo(MediaPlaylistList);
