import { useCallback, useMemo, useState } from 'react';
import { PlaylistSearchResults } from 'src/utils/FetchHelper';
import { LinkType, PlaylistType } from 'src/contexts/PlaylistsContext';
import { useVideotekaFilters } from 'src/hooks/useVideotekaFilters';
import { PlaylistSearchBlock } from './PlaylistSearchBlock';
import { VideotekaSubTab, VideotekaSubTabContext } from './VideotekaSubTab';
import type { SearchSource, VideotekaApplied } from './types';

const PLAYLISTS_PER_PAGE = 20;
const RESULTS_ID = 'videoteka-playlist-results';

export interface PlaylistTabProps {
  isActive: boolean;
  initTopicTitle: string;
  initAuthor: string;
  initText: string;
  page: number;
  onSearch: (applied: VideotekaApplied, source?: SearchSource) => void;
  onPageChange: (page: number) => void;
}

type CombinedPlaylist =
  | { kind: 'embedded'; playlist: PlaylistType }
  | { kind: 'yt'; link: LinkType };

export const PlaylistTab = ({
  isActive,
  initTopicTitle,
  initAuthor,
  initText,
  page,
  onSearch,
  onPageChange
}: PlaylistTabProps) => {
  const { getPlaylistTopics, getPlaylistAuthors, searchPlaylists } = useVideotekaFilters();
  const [playlists, setPlaylists] = useState<PlaylistSearchResults>({ embedded: [], ytLinks: [] });

  const fetchResults = useCallback(
    (applied: VideotekaApplied, setLoading: (l: boolean) => void) => {
      const { topic, author, text } = applied;
      if (!topic && !author && !text) {
        setPlaylists({ embedded: [], ytLinks: [] });
        return;
      }
      setLoading(true);
      searchPlaylists(topic?._id ?? null, topic?.title ?? '', author, text)
        .then(setPlaylists)
        .catch((err) => {
          console.error('Failed to load playlists', err);
          setPlaylists({ embedded: [], ytLinks: [] });
        })
        .finally(() => setLoading(false));
    },
    [searchPlaylists]
  );

  // Combine embedded series and YouTube playlists into one list sorted by
  // title, then paginate that single list. The page's items are split back by
  // type so both sections (Видео поредици / YouTube плейлисти) stay visible,
  // but a YouTube playlist lands on the page matching its alphabetical rank
  // among ALL playlists.
  const combinedSorted = useMemo<CombinedPlaylist[]>(
    () =>
      [
        ...playlists.embedded.map((playlist) => ({ kind: 'embedded' as const, playlist })),
        ...playlists.ytLinks.map((link) => ({ kind: 'yt' as const, link }))
      ].sort((a, b) => {
        // Strip leading quote(s) so "„/"" prefixed titles sort by the real title
        const ta = (a.kind === 'embedded' ? (a.playlist.title ?? '') : a.link.title)
          .replace(/^["'„“]+/, '');
        const tb = (b.kind === 'embedded' ? (b.playlist.title ?? '') : b.link.title)
          .replace(/^["'„“]+/, '');
        return ta.localeCompare(tb, 'bg', { sensitivity: 'base' });
      }),
    [playlists.embedded, playlists.ytLinks]
  );

  const noResults = playlists.embedded.length === 0 && playlists.ytLinks.length === 0;

  const renderResults = useCallback(
    (ctx: VideotekaSubTabContext) => {
      const pageItems = combinedSorted.slice(
        (ctx.effectivePage - 1) * PLAYLISTS_PER_PAGE,
        ctx.effectivePage * PLAYLISTS_PER_PAGE
      );
      const pageEmbedded = pageItems
        .filter((i): i is Extract<CombinedPlaylist, { kind: 'embedded' }> => i.kind === 'embedded')
        .map((i) => i.playlist);
      const pageYt = pageItems
        .filter((i): i is Extract<CombinedPlaylist, { kind: 'yt' }> => i.kind === 'yt')
        .map((i) => i.link);

      return (
        <>
          {ctx.renderPagination()}
          <PlaylistSearchBlock
            embedded={pageEmbedded}
            ytLinks={pageYt}
            embeddedTotal={playlists.embedded.length}
            ytTotal={playlists.ytLinks.length}
            appliedTopics={ctx.applied?.topic ? [ctx.applied.topic] : []}
          />
          {ctx.renderPagination()}
        </>
      );
    },
    [combinedSorted, playlists.embedded.length, playlists.ytLinks.length]
  );

  return (
    <VideotekaSubTab
      isActive={isActive}
      initTopicTitle={initTopicTitle}
      initAuthor={initAuthor}
      initText={initText}
      page={page}
      onSearch={onSearch}
      onPageChange={onPageChange}
      resultsId={RESULTS_ID}
      pageSize={PLAYLISTS_PER_PAGE}
      filterType="playlists"
      caption={
        <>
          Изберете поне един критерий за търсене на YouTube видео поредици.
          Можете да филтрирате по тема, автор или да въведете ключова дума в
          заглавието или описанието. Вградените поредици се пускат директно в
          сайта, а YouTube плейлистите се отварят в YouTube.
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
