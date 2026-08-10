import { useCallback } from 'react';
import {
  LinkType,
  PlaylistType,
  SeminarRelatedPresentationsType,
  usePlaylistsContext
} from 'src/contexts/PlaylistsContext';
import {
  loadLinks,
  loadPagePlaylists,
  loadPlaylists,
  loadSeminarRelatedPresentations
} from 'src/utils/FetchHelper';
import { getTodayString } from 'src/utils/getTodayString';

export function usePlaylists() {
  const {
    playlists,
    setPlaylists,
    links,
    setLinks,
    seminarRelatedPresentations,
    setSeminarRelatedPresentations,
    lastLoaded,
    setLastLoaded
  } = usePlaylistsContext();

  /**
   * Retrieves playlists for a given type and set of titles.
   *
   * - If playlists matching the titles are cached and up-to-date (loaded today),
   *   returns the cached data.
   * - Otherwise, fetches them from Sanity, updates the cache, and returns the new data.
   * - The playlists are ordered according to the order of the titles array.
   *
   * @param type The playlist type (e.g. "video", "presentation").
   * @param isResource Whether it is a resource.
   * @param titles - title to filter by.
   * @returns A promise resolving to an array of playlists.
   */
  const getPlaylistsByTitles = useCallback(
    async (
      type: string,
      isResource: boolean,
      titles: string[]
    ): Promise<PlaylistType[]> => {
      const today = getTodayString();

      // Same cache key regardless of the order of titles
      const titleKey = `_titles=${titles
        .slice()
        .sort()
        .map(encodeURIComponent)
        .join(',')}`;

      const cacheKey = isResource
        ? `resource_${type}${titleKey}`
        : `${type}${titleKey}`;

      const sortByTitles = (items: PlaylistType[]) => {
        const titleOrder = new Map(
          titles.map((title, index) => [title, index])
        );

        return items
          .slice()
          .sort(
            (a, b) =>
              (titleOrder.get(a.title ?? '') ?? Infinity) -
              (titleOrder.get(b.title ?? '') ?? Infinity)
          );
      };

      // Return sorted cached playlists for cacheKey if up-to-date
      if (playlists[cacheKey] && lastLoaded[`playlist_${cacheKey}`] === today) {
        return sortByTitles(playlists[cacheKey]);
      }

      // Sanity
      try {
        const loadedPlaylists = await loadPlaylists(type, isResource, titles);

        const processedPlaylists = sortByTitles(loadedPlaylists);

        setPlaylists(cacheKey, processedPlaylists);
        setLastLoaded(`playlist_${cacheKey}`, today);

        return processedPlaylists;
      } catch (err) {
        console.error(`Failed to fetch ${type} playlists:`, err);
        return [];
      }
    },
    [playlists, lastLoaded, setPlaylists, setLastLoaded]
  );

  /**
   * Retrieves playlists defined on a Sanity page document by its path.
   * Caches by pagePath, refreshed once per day.
   *
   * @param pagePath The Sanity page path (e.g. "/resources/books").
   * @returns A promise resolving to an array of playlists.
   */
  const getPagePlaylists = useCallback(
    async (pagePath: string): Promise<PlaylistType[]> => {
      const today = getTodayString();
      const cacheKey = `page_${pagePath}`;

      if (playlists[cacheKey] && lastLoaded[`playlist_${cacheKey}`] === today) {
        return Promise.resolve(playlists[cacheKey]);
      }

      return await loadPagePlaylists(pagePath)
        .then((loadedPlaylists) => {
          const processedPlaylists = loadedPlaylists?.slice() || [];
          setPlaylists(cacheKey, processedPlaylists);
          setLastLoaded(`playlist_${cacheKey}`, today);
          return Promise.resolve(processedPlaylists);
        })
        .catch((err) => {
          console.error(
            `Failed to fetch page playlists for "${pagePath}": ${err}`
          );
          return Promise.resolve([]);
        });
    },
    [playlists, lastLoaded, setPlaylists, setLastLoaded]
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

  return {
    getPlaylistsByTitles,
    getPagePlaylists,
    getLinks,
    getSeminarRelatedPresentations
  };
}
