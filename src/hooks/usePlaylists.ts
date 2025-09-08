import { useCallback } from 'react';
import { usePlaylistsContext } from 'src/contexts/PlaylistsContext';
import { loadPlaylists } from 'src/utils/FetchHelper';

function getTodayString() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function usePlaylists() {
  const { playlists, setPlaylists, lastLoaded, setLastLoaded } = usePlaylistsContext();

  /**
   * Returns the playlists. If the playlists are not loaded or are stale (older than today),
   * it will fetch them from the backend and update the provider. Otherwise, it returns the cached Playlists.
   *
   * @param type optional filter (e.g. "video", "book")
   */
  const getPlaylists = useCallback(
    async (type?: string) => {
      const today = getTodayString();
      const playlistType = type || 'all';

      // Return cached playlists for type if up-to-date
      if (
        playlists[playlistType] &&
        lastLoaded[playlistType] === today
      ) {
        return Promise.resolve(playlists[playlistType]);
      }

      // Otherwise, fetch from backend
      return await loadPlaylists(type)
        .then((loadedPlaylists) => {
          // Cache by type
          setPlaylists({
            ...playlists,
            [playlistType]: loadedPlaylists
          });
          setLastLoaded(playlistType, today);
          return Promise.resolve(loadedPlaylists);
        })
        .catch((err) => {
          console.error('Failed to fetch playlists: ', err);
          return Promise.resolve([]);
        });
    },
    [playlists, lastLoaded, setPlaylists, setLastLoaded]
  );

  return { playlists, getPlaylists };
}
