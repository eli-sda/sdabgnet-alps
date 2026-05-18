import { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
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
  };
}

const saveLastPlayedMedia = (
  playlistId: string,
  itemId: string,
  title: string
) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as unknown) : {};
    const data = parsed as LastPlayedData;

    data[playlistId] = { itemId, title };
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
  sanityType?: string;
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
  sanityType,
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

  const { getPlaylists } = usePlaylists();
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
  } | null>(null);

  const checkAndSetResumePrompt = useCallback(
    (playlist: PlaylistType) => {
      if (mediaType !== 'audio') return;

      const lastPlayed = getLastPlayedMedia(playlist._id);
      if (lastPlayed) {
        const savedIndex = playlist.items?.findIndex(
          (item) => item._id === lastPlayed.itemId
        );
        if (savedIndex !== undefined && savedIndex > 0) {
          setResumePrompt({
            playlistId: playlist._id,
            itemId: lastPlayed.itemId,
            title: lastPlayed.title,
            index: savedIndex
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
            // hasSetFromUrl = true;
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

    if (sanityType) {
      void getPlaylists(sanityType, mediaType === 'audio')
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
    sanityType,
    mediaType
    // setInitialPlaylists - do not include to avoid infinite loop
  ]);

  useEffect(() => {
    if (mediaType === 'audio' && selectedPlaylist && !resumePrompt) {
      const currentItem = selectedPlaylist.items?.[currentPlayIndex];

      if (currentItem) {
        saveLastPlayedMedia(
          selectedPlaylist._id,
          currentItem._id,
          currentItem.title
        );
      }
    }
  }, [mediaType, selectedPlaylist, currentPlayIndex, resumePrompt]);

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
                  <div className="u-space--half--top">
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
