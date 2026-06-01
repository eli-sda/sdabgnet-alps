import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { generateShareUrl } from 'src/utils/urlUtils';
import PlaylistActionButtons from '../playlistButtons/PlaylistActionButtons';
import AudioResumeDialog from './audio/AudioResumeDialog';
import MediaPlaylist from './MediaPlaylist';
import './MediaPlaylistList.scss';

const STORAGE_KEY = 'last_played_media';

interface LastPlayedData {
  [playlistId: string]: {
    itemId: string;
    title: string;
    time?: number;
  };
}

const saveLastPlayedMedia = (
  playlistId: string,
  itemId: string,
  title: string,
  time?: number
) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as unknown) : {};
    const data = parsed as LastPlayedData;

    // Prevent overwriting the saved time if auto-saving the same item without a specific time
    const existing = data[playlistId];
    const timeToSave =
      time === undefined && existing?.itemId === itemId ? existing.time : time;

    data[playlistId] = { itemId, title, time: timeToSave };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving last played media to local storage', e);
  }
};

const getLastPlayedMedia = (playlistId: string) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as unknown;
      const data = parsed as LastPlayedData;
      return data[playlistId] || null;
    }
  } catch (e) {
    console.error('Error reading last played media from local storage', e);
  }
  return null;
};

interface MediaPlaylistListProps {
  mediaType: 'audio' | 'video';
  pagePath?: string;
  mediaPlaylists?: PlaylistType[];
  showDownloadAll?: boolean;
  isPlaying?: boolean;
  onPlaylistSelect?: (playlist: PlaylistType) => void;
  renderPlayer?: (
    playlist: PlaylistType | null,
    setPlayIndex: (i: number) => void,
    playIndex?: number,
    initialTime?: number
  ) => React.ReactNode;
  getCurrentTime?: () => number;
  className?: string;
  defaultImageIcon?: ReactNode;
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
  className = '',
  defaultImageIcon
}: MediaPlaylistListProps) => {
  const { hash, search } = useLocation();

  const { playId, playlistIdFromSearch, timeParam } = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return {
      playId: searchParams.get('playId'),
      playlistIdFromSearch: searchParams.get('playlistId'),
      // Supports only time as seconds (integer)
      timeParam: searchParams.get('time')
    };
  }, [search]);

  const { getPagePlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>(
    mediaPlaylists || []
  );
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    null
  );
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [initialTime, setInitialTime] = useState<number | undefined>(undefined);
  const [resumePrompt, setResumePrompt] = useState<{
    playlistId: string;
    itemId: string;
    title: string;
    index: number;
    time?: number;
  } | null>(null);

  // Determine the track ID that was initially loaded from a shared URL
  const urlTrackId = useMemo(() => {
    const playlistId =
      playlistIdFromSearch || (hash ? hash.replace('#', '') : null);
    if (
      !playlistId ||
      !selectedPlaylist ||
      selectedPlaylist._id !== playlistId
    ) {
      return null;
    }
    return playId || selectedPlaylist.items?.[0]?._id;
  }, [playlistIdFromSearch, hash, playId, selectedPlaylist]);

  const checkAndSetResumePrompt = useCallback(
    (playlist: PlaylistType) => {
      if (mediaType !== 'audio') return;

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
    },
    [mediaType]
  );

  const handleSelect = useCallback(
    (playlist: PlaylistType) => {
      if (selectedPlaylist?._id === playlist._id) {
        onPlaylistSelect?.(playlist);
        return; // Do nothing if the same playlist is selected
      }

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
      // support playlist selection from either hash (#<id>) or query ?playlistId=<id>
      const playlistId =
        playlistIdFromSearch || (hash ? hash.replace('#', '') : null);

      if (playlistId) {
        const matchedPlaylist = playlistArr.find((p) => p._id === playlistId);

        if (
          matchedPlaylist &&
          matchedPlaylist.items &&
          matchedPlaylist.items.length > 0 &&
          playId
        ) {
          const index = matchedPlaylist.items.findIndex(
            (item) => item._id === playId
          );

          if (index !== -1) {
            setCurrentPlayIndex(index);
          }

          if (timeParam && /^\d+$/.test(timeParam)) {
            // Parse initial time (integer) from URL
            setInitialTime(parseInt(timeParam, 10));
          } else {
            setInitialTime(undefined);
          }
        }

        setSelectedPlaylist(matchedPlaylist || null);
        if (matchedPlaylist) onPlaylistSelect?.(matchedPlaylist);
      }
    },
    [hash, onPlaylistSelect, playId, playlistIdFromSearch, timeParam]
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
    if (mediaType === 'audio' && selectedPlaylist && !resumePrompt) {
      const currentItem = selectedPlaylist.items?.[currentPlayIndex];

      if (currentItem) {
        // Skip auto-saving the initial URL track to preserve existing progress until the track is changed.
        if (urlTrackId === currentItem._id) {
          const existing = getLastPlayedMedia(selectedPlaylist._id);
          if (existing && existing.itemId !== currentItem._id) {
            return;
          }
        }

        saveLastPlayedMedia(
          selectedPlaylist._id,
          currentItem._id,
          currentItem.title
        );
      }
    }
  }, [mediaType, selectedPlaylist, currentPlayIndex, resumePrompt, urlTrackId]);

  return (
    <>
      <section className={`media-playlist-list ${className}`}>
        {playlists.map((playlist) => {
          const isCurrent = selectedPlaylist?._id === playlist._id;
          const currentItem = isCurrent
            ? playlist.items?.[currentPlayIndex]
            : undefined;

          return (
            <div key={playlist._id} className="playlist-item u-padding--sides">
              <MediaPlaylist
                playlist={playlist}
                onPlaylistSelect={() => handleSelect(playlist)}
                isCurrent={isCurrent}
                isPlaying={isCurrent && isPlaying}
                type={mediaType}
                defaultImageIcon={defaultImageIcon}
                actionButtons={
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
                        }
                      }}
                    />
                  </div>
                }
              />
            </div>
          );
        })}
      </section>

      <AudioResumeDialog
        resumePrompt={resumePrompt}
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
        setCurrentPlayIndex,
        currentPlayIndex,
        initialTime
      )}
    </>
  );
};

export default memo(MediaPlaylistList);
