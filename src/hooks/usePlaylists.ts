import { useCallback } from 'react';
import {
  LinkType,
  PlaylistType,
  SeminarRelatedPresentationsType,
  usePlaylistsContext
} from 'src/contexts/PlaylistsContext';
import {
  loadLinks,
  loadPlaylists,
  loadSeminarRelatedPresentations,
  loadStandalonePresentations
} from 'src/utils/FetchHelper';
import { getTodayString } from 'src/utils/getTodayString';

// removes prefixes like "п-р", "П-р", "д-р", "Д-р", with optional dots/spaces
function normalizeAuthor(author?: string) {
  return (author || '').replace(/^(п|д)[.\- ]?р\.?\s*/i, '').trim();
}

export function usePlaylists() {
  const {
    playlists,
    setPlaylists,
    links,
    setLinks,
    seminarRelatedPresentations,
    setSeminarRelatedPresentations,
    standalonePresentations,
    setStandalonePresentations,
    lastLoaded,
    setLastLoaded
  } = usePlaylistsContext();

  /**
   * Retrieves playlists for a given type.
   * - If playlists of that type are cached and up-to-date (loaded today), returns the cached data.
   * - Otherwise, fetches them from the backend, updates the cache, and returns the new data.
   *
   * @param type The playlist type (e.g. "video", "presentation").
   * @returns A promise resolving to an array of playlists.
   */
  const getPlaylists = useCallback(
    async (
      type: string,
      isResource: boolean,
      title?: string
    ): Promise<PlaylistType[]> => {
      const today = getTodayString();

      // Build a cache key that includes resource flag and title (if any)
      const titleKey = title ? `_title=${encodeURIComponent(title)}` : '';
      const cacheKey = isResource
        ? `resource_${type}${titleKey}`
        : `${type}${titleKey}`;

      // Return cached playlists for cacheKey if up-to-date
      if (playlists[cacheKey] && lastLoaded[`playlist_${cacheKey}`] === today) {
        return Promise.resolve(playlists[cacheKey]);
      }

      // Otherwise, fetch from backend and update cache
      return await loadPlaylists(type, isResource, title)
        .then((loadedPlaylists) => {
          const sortedPlaylists = loadedPlaylists
            ?.slice() // make a copy so the original array is not modified
            .sort((a, b) => {
              const special = ['чуждоговорящи', 'други'];

              const aTitle = (a.title || '').toLowerCase();
              const bTitle = (b.title || '').toLowerCase();

              const aIsSpecial = special.some((s) => aTitle === s);
              const bIsSpecial = special.some((s) => bTitle === s);

              // Push "Чуждоговорящи" or "Други" playlists to the end
              if (aIsSpecial && !bIsSpecial) return 1;
              if (!aIsSpecial && bIsSpecial) return -1;

              // Sort first by normalized author
              const authorComparison = normalizeAuthor(a.author).localeCompare(
                normalizeAuthor(b.author),
                'bg',
                { sensitivity: 'base' }
              );

              if (authorComparison !== 0) return authorComparison;

              // Then, if same author, sort alphabetically by title
              return (a.title ?? '').localeCompare(b.title ?? '', 'bg', {
                sensitivity: 'base'
              });
            });

          setPlaylists(cacheKey, sortedPlaylists);
          setLastLoaded(`playlist_${cacheKey}`, today);
          return Promise.resolve(sortedPlaylists);
        })
        .catch((err) => {
          console.error(`Failed to fetch ${type} playlists: ${err}`);
          return Promise.resolve([]);
        });
    },
    [playlists, lastLoaded, setPlaylists, setLastLoaded]
  );

  /**
   * Retrieves resource playlists for a given type.
   * - If playlists of that type are cached and up-to-date (loaded today), returns the cached data.
   * - Otherwise, fetches them from the backend, updates the cache, and returns the new data.
   *
   * @param type The playlist type (e.g. "video", "presentation").
   * @returns A promise resolving to an array of playlists.
   */
  const getResourcePlaylists = useCallback(
    async (type: string, title?: string): Promise<PlaylistType[]> => {
      return getPlaylists(type, true, title);
    },
    [getPlaylists]
  );

  /**
   * Retrieves links for a given type.
   * - If links of that type are cached and up-to-date (loaded today), returns the cached data.
   * - Otherwise, fetches them from the backend, updates the cache, and returns the new data.
   *
   * @param type The link type (e.g. "image").
   * @returns A promise resolving to an array of links.
   */
  const getLinks = useCallback(
    async (type: string): Promise<LinkType[]> => {
      const today = getTodayString();

      // Return cached links if available and not stale
      if (links[type] && lastLoaded[`link_${type}`] === today) {
        return Promise.resolve(links[type]);
      }

      // Otherwise, fetch from backend and update cache
      return await loadLinks(type)
        .then((loadedLinks) => {
          setLinks(type, loadedLinks);
          setLastLoaded(`link_${type}`, today);
          return Promise.resolve(loadedLinks);
        })
        .catch((err) => {
          console.error(`Failed to fetch ${type} links: ${err}`);
          return Promise.resolve([]);
        });
    },
    [links, lastLoaded, setLinks, setLastLoaded]
  );

  /**
   * Retrieves presentations that are related to seminars.
   * - If seminar-related presentations are cached and have been loaded today, returns the cached data.
   * - Otherwise, fetches them from the backend, updates the cache, and returns the newly loaded data.
   *
   * @returns A promise resolving to an array of seminar-related presentations.
   */
  const getSeminarRelatedPresentations = useCallback(async (): Promise<
    SeminarRelatedPresentationsType[]
  > => {
    const today = getTodayString();

    // Return cached links if available and not stale
    if (
      seminarRelatedPresentations &&
      lastLoaded['seminarRelatedPresentations'] === today
    ) {
      return Promise.resolve(seminarRelatedPresentations);
    }

    // Otherwise, fetch from backend and update cache
    return await loadSeminarRelatedPresentations()
      .then((loadedPresentations) => {
        setSeminarRelatedPresentations(loadedPresentations);
        setLastLoaded('seminarRelatedPresentations', today);
        return Promise.resolve(loadedPresentations);
      })
      .catch((err) => {
        console.error(`Failed to fetch seminar related presentations: ${err}`);
        return Promise.resolve([]);
      });
  }, [
    seminarRelatedPresentations,
    lastLoaded,
    setSeminarRelatedPresentations,
    setLastLoaded
  ]);

  /**
   * Retrieves standalone presentations.
   * - If standalone presentations are cached and have been loaded today, returns the cached data.
   * - Otherwise, fetches them from the backend, updates the cache, and returns the newly loaded data.
   * @returns A promise resolving to an array of standalone presentations.
   */
  const getStandalonePresentations = useCallback(async (): Promise<
    LinkType[]
  > => {
    const today = getTodayString();

    if (
      standalonePresentations &&
      lastLoaded['standalonePresentations'] === today
    ) {
      return Promise.resolve(standalonePresentations);
    }

    // Otherwise, fetch from backend and update cache
    return await loadStandalonePresentations()
      .then((loadedPresentations) => {
        setStandalonePresentations(loadedPresentations);
        setLastLoaded('standalonePresentations', today);
        return Promise.resolve(loadedPresentations);
      })
      .catch((err) => {
        console.error(`Failed to fetch standalone presentations: ${err}`);
        return Promise.resolve([]);
      });
  }, [
    lastLoaded,
    setLastLoaded,
    setStandalonePresentations,
    standalonePresentations
  ]);

  return {
    getPlaylists,
    getResourcePlaylists,
    getLinks,
    getSeminarRelatedPresentations,
    getStandalonePresentations
  };
}
