import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { scrollToId } from 'src/utils/scrollToId';

type Options<TIndex, TFull> = {
  /** Sorted index rows for the whole result set. */
  index: TIndex[];
  /** Requested page from the URL/state. */
  page: number;
  pageSize: number;
  resultsId: string;
  /** Cache key for an index row; must match `getDocKey` of its full document. */
  getPageKey: (item: TIndex) => string;
  /** Cache key for a full document. */
  getDocKey: (doc: TFull) => string;
  /** Loads the full documents for the index rows missing from the cache. */
  load: (missing: TIndex[]) => Promise<TFull[]>;
  /** Shared cache that survives leaving/returning to Videoteka. */
  cache: Map<string, TFull>;
};

type PagedResults<TFull> = {
  pageItems: TFull[];
  loading: boolean;
  /** Ask to scroll to the results once the current page is rendered. */
  requestScroll: () => void;
  /** Full document from the cache, for items selected on other pages. */
  getCached: (key: string) => TFull | undefined;
};

/**
 * Shared pagination/data-loading logic for the Videoteka tabs.
 *
 * Only the current page's full documents are loaded; visited pages are cached
 * by key. Scroll requests are deferred until the page content is rendered, so
 * the viewport never lands on the spinner or the previous page.
 */
export function useVideotekaPagedResults<TIndex, TFull>({
  index,
  page,
  pageSize,
  resultsId,
  getPageKey,
  getDocKey,
  load,
  cache
}: Options<TIndex, TFull>): PagedResults<TFull> {
  const [pageItems, setPageItems] = useState<TFull[]>([]);
  const [loadedPageKey, setLoadedPageKey] = useState('');
  // One in-flight request per page key, shared by effect re-runs.
  const requestsRef = useRef<Map<string, Promise<TFull[]>>>(new Map());
  const scrollOnResultsRef = useRef(false);

  const totalPages = Math.max(1, Math.ceil(index.length / pageSize));
  const effectivePage = Math.min(page, totalPages);
  const pageIndex = useMemo(
    () => index.slice((effectivePage - 1) * pageSize, effectivePage * pageSize),
    [index, effectivePage, pageSize]
  );

  // Stable key for exactly this page's documents. Comparing it with the loaded
  // key tells us whether pageItems belongs to the page currently on screen.
  const pageKey = useMemo(
    () => pageIndex.map(getPageKey).join(','),
    [pageIndex, getPageKey]
  );

  useEffect(() => {
    if (pageIndex.length === 0) {
      setPageItems([]);
      setLoadedPageKey('');
      return;
    }

    const missing = pageIndex.filter((item) => !cache.has(getPageKey(item)));

    // Rebuild the visible list in index order from the cached documents.
    const applyCached = () =>
      setPageItems(
        pageIndex
          .map((item) => cache.get(getPageKey(item)))
          .filter((item): item is TFull => Boolean(item))
      );

    if (missing.length === 0) {
      applyCached();
      setLoadedPageKey(pageKey);
      return;
    }

    const request = requestsRef.current.get(pageKey) ?? load(missing);
    requestsRef.current.set(pageKey, request);

    // `cancelled` prevents a slow response for an old page from overwriting
    // the documents of the page the user switched to in the meantime.
    let cancelled = false;
    request
      .then((docs) => {
        // Cache even a stale response so returning to the page is instant.
        docs.forEach((doc) => cache.set(getDocKey(doc), doc));
        if (cancelled) return;
        applyCached();
        setLoadedPageKey(pageKey);
      })
      .catch((err) => {
        console.error('Failed to load page documents', err);
        // Mark the page as loaded anyway so it does not spin forever.
        if (!cancelled) setLoadedPageKey(pageKey);
      })
      .finally(() => {
        if (requestsRef.current.get(pageKey) === request) {
          requestsRef.current.delete(pageKey);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pageIndex, pageKey, getPageKey, getDocKey, load, cache]);

  // Spinner stays until the documents for the current page key are ready.
  const loading = pageIndex.length > 0 && loadedPageKey !== pageKey;

  const requestScroll = useCallback(() => {
    scrollOnResultsRef.current = true;
  }, []);

  // Changing page must also land at the top of the results, but only after the
  // new page's documents are rendered (not while the spinner is shown).
  const previousPageRef = useRef(page);
  useEffect(() => {
    if (previousPageRef.current === page) return;
    previousPageRef.current = page;
    scrollOnResultsRef.current = true;
  }, [page]);

  // Scroll to the results only after a search/page change has real content.
  useEffect(() => {
    if (loading || !scrollOnResultsRef.current) return;
    scrollOnResultsRef.current = false;
    scrollToId(resultsId, true);
  }, [loading, index, page, resultsId]);

  const getCached = useCallback((key: string) => cache.get(key), [cache]);

  return { pageItems, loading, requestScroll, getCached };
}
