import { useCallback } from 'react';
import { usePlaylistsContext } from 'src/contexts/PlaylistsContext';
import { loadPlaylists } from 'src/utils/FetchHelper';

function getTodayString() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function usePlaylists() {
  const { playlists, setPlaylists, lastLoaded, setLastLoaded } =
    usePlaylistsContext();

  /**
   * Returns the playlists. If the playlists are not loaded or are stale (older than today),
   * it will fetch them from the backend and update the provider. Otherwise, it returns the cached Playlists.
   * @returns Promise resolving to an array of playlists
   */
  const getPlaylists = useCallback(async () => {
    const today = getTodayString();
    if (playlists && lastLoaded === today) {
      return Promise.resolve(playlists);
    }
    return loadPlaylists()
      .then((loadedPlaylists) => {
        setPlaylists(loadedPlaylists);
        setLastLoaded(today);
        return Promise.resolve(loadedPlaylists);
      })
      .catch((err) => {
        console.error('Failed to fetch playlists: ', err);
        return Promise.resolve([]);
      });
  }, [playlists, lastLoaded, setPlaylists, setLastLoaded]);

  return { playlists, getPlaylists };
}
