import { useCallback, useMemo, useState } from 'react';
import {
  CachedPlaylistItem,
  PlaylistIndexItem,
  useVideotekaContext
} from 'src/contexts/VideotekaContext';
import { useVideotekaFilters } from 'src/hooks/useVideotekaFilters';
import { PlaylistSearchBlock } from './PlaylistSearchBlock';
import { VideotekaSubTab, VideotekaSubTabContext } from './VideotekaSubTab';
import type { SearchSource, VideotekaApplied } from './types';
import { loadPlaylistsByIds } from 'src/utils/FetchHelper';
import { PageResultsSpinner } from './PageResultsSpinner';
import { useVideotekaPagedResults } from 'src/hooks/useVideotekaPagedResults';

const PLAYLISTS_PER_PAGE = 20;
const RESULTS_ID = 'videoteka-playlist-results';

type CombinedPlaylist = CachedPlaylistItem;

// Strip leading quote(s) so "„/"" prefixed titles sort by the real title.
const sortTitle = (title: string) => title.replace(/^["'„“]+/, '');

const getPlaylistPageKey = (item: PlaylistIndexItem) =>
  `${item.kind}:${item._id}`;

const getPlaylistDocKey = (item: CombinedPlaylist) =>
  item.kind === 'embedded'
    ? `embedded:${item.playlist._id}`
    : `yt:${item.link._id}`;

const loadPlaylistPage = async (
  items: PlaylistIndexItem[]
): Promise<CombinedPlaylist[]> => {
  const { embedded, ytLinks } = await loadPlaylistsByIds(items);
  return [
    ...embedded.map((playlist) => ({ kind: 'embedded' as const, playlist })),
    ...ytLinks.map((link) => ({ kind: 'yt' as const, link }))
  ];
};

export interface PlaylistTabProps {
  isActive: boolean;
  initTopicTitle: string;
  initAuthor: string;
  initText: string;
  initAll?: boolean;
  page: number;
  onSearch: (applied: VideotekaApplied, source?: SearchSource) => void;
  onPageChange: (page: number) => void;
}

export const PlaylistTab = ({
  isActive,
  initTopicTitle,
  initAuthor,
  initText,
  initAll,
  page,
  onSearch,
  onPageChange
}: PlaylistTabProps) => {
  const { getPlaylistTopics, getPlaylistAuthors, searchPlaylistIndex } =
    useVideotekaFilters();
  const { playlistCache } = useVideotekaContext();
  const [playlistIndex, setPlaylistIndex] = useState<PlaylistIndexItem[]>([]);

  // Sort the lightweight index by title, then paginate that single combined
  // list. The page's items are split back by type so both sections (Видео
  // поредици / YouTube плейлисти) stay visible, but a YouTube playlist lands
  // on the page matching its alphabetical rank among ALL playlists.
  const combinedSorted = useMemo<PlaylistIndexItem[]>(
    () =>
      [...playlistIndex].sort((a, b) =>
        sortTitle(a.title).localeCompare(sortTitle(b.title), 'bg', {
          sensitivity: 'base'
        })
      ),
    [playlistIndex]
  );

  // Section totals come from the full index so the headers can show
  // "page count of total" when the section spans several pages.
  const { embeddedTotal, ytTotal } = useMemo(() => {
    let embedded = 0;
    let yt = 0;
    for (const item of playlistIndex) {
      if (item.kind === 'embedded') embedded += 1;
      else yt += 1;
    }
    return { embeddedTotal: embedded, ytTotal: yt };
  }, [playlistIndex]);

  const {
    pageItems,
    loading: pageLoading,
    requestScroll
  } = useVideotekaPagedResults<PlaylistIndexItem, CombinedPlaylist>({
    index: combinedSorted,
    page,
    pageSize: PLAYLISTS_PER_PAGE,
    resultsId: RESULTS_ID,
    getPageKey: getPlaylistPageKey,
    getDocKey: getPlaylistDocKey,
    load: loadPlaylistPage,
    cache: playlistCache
  });

  // Load only the lightweight index for all matching playlists. Full
  // documents are fetched per page by useVideotekaPagedResults.
  const fetchResults = useCallback(
    (applied: VideotekaApplied, setLoading: (l: boolean) => void) => {
      const { topic, author, text } = applied;
      setLoading(true);
      requestScroll();
      searchPlaylistIndex(topic?._id ?? null, topic?.title ?? '', author, text)
        // Copy the array so an identical cached search still triggers the
        // scroll effect (React bails out on the same reference).
        .then((index) => setPlaylistIndex([...index]))
        .catch((err) => {
          console.error('Failed to load playlist index', err);
          setPlaylistIndex([]);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [searchPlaylistIndex, requestScroll]
  );

  const noResults = playlistIndex.length === 0;

  const renderResults = useCallback(
    (ctx: VideotekaSubTabContext) => {
      // Pagination is rendered above and below the results. Keep it visible
      // even while the page documents are still loading.
      const pagination = ctx.renderPagination();

      if (pageLoading) {
        return <PageResultsSpinner pagination={pagination} />;
      }

      // Split the current page back into the two sections. Their order inside
      // each section still follows the combined alphabetical page slice above.
      const pageEmbedded = pageItems
        .filter(
          (i): i is Extract<CombinedPlaylist, { kind: 'embedded' }> =>
            i.kind === 'embedded'
        )
        .map((i) => i.playlist);
      const pageYt = pageItems
        .filter(
          (i): i is Extract<CombinedPlaylist, { kind: 'yt' }> => i.kind === 'yt'
        )
        .map((i) => i.link);

      return (
        <>
          {pagination}
          <PlaylistSearchBlock
            embedded={pageEmbedded}
            ytLinks={pageYt}
            embeddedTotal={embeddedTotal}
            ytTotal={ytTotal}
            appliedTopics={ctx.applied?.topic ? [ctx.applied.topic] : []}
            highlightText={ctx.applied?.text ?? ''}
          />
          {pagination}
        </>
      );
    },
    [pageLoading, pageItems, embeddedTotal, ytTotal]
  );

  return (
    <VideotekaSubTab
      isActive={isActive}
      initTopicTitle={initTopicTitle}
      initAuthor={initAuthor}
      initText={initText}
      initAll={initAll}
      page={page}
      onSearch={onSearch}
      onPageChange={onPageChange}
      resultsId={RESULTS_ID}
      pageSize={PLAYLISTS_PER_PAGE}
      filterType="playlists"
      caption={
        <>
          Търсете видео поредици по тематика, автор или думи от заглавието или
          описанието. Повечето плейлисти се гледат директно тук с вграден плеър
          без реклами, а останалите се отварят в YouTube.
        </>
      }
      getTopics={getPlaylistTopics}
      getAuthors={getPlaylistAuthors}
      fetchResults={fetchResults}
      totalResults={combinedSorted.length}
      noResults={noResults}
      renderResults={renderResults}
    />
  );
};
