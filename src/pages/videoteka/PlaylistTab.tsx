import { useEffect, useMemo, useRef, useState } from 'react';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Pagination } from 'alps-library/molecules/navigation/pagination/Pagination';
import { PlaylistSearchResults } from 'src/utils/FetchHelper';
import { LinkType, PlaylistType, TopicType } from 'src/contexts/PlaylistsContext';
import { useVideotekaFilters } from 'src/hooks/useVideotekaFilters';
import { scrollToId } from 'src/utils/Links';
import { FilterForm } from './FilterForm';
import { PlaylistSearchBlock } from './PlaylistSearchBlock';
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
  const [playlistTopics, setPlaylistTopics] = useState<TopicType[]>([]);
  const [playlistAuthors, setPlaylistAuthors] = useState<string[]>([]);
  const [pTopic, setPTopic] = useState<TopicType | null>(null);
  const [pAuthor, setPAuthor] = useState<string | null>(null);
  const [pText, setPText] = useState(initText);
  const [pApplied, setPApplied] = useState<VideotekaApplied | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistSearchResults>({ embedded: [], ytLinks: [] });
  const [pLoading, setPLoading] = useState(false);

  const dataLoadedRef = useRef(false);
  const onSearchRef = useRef(onSearch);
  useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);

  // Lazy load: only when first activated
  useEffect(() => {
    if (!isActive || dataLoadedRef.current) return;
    dataLoadedRef.current = true;

    Promise.all([getPlaylistTopics(), getPlaylistAuthors()])
      .then(([topics, authors]) => {
        setPlaylistTopics(topics);
        setPlaylistAuthors(authors);

        if (initTopicTitle || initAuthor || initText) {
          const resolved = topics.find((t) => t.title === initTopicTitle) ?? null;
          setPTopic(resolved);
          setPAuthor(initAuthor || null);
          setPText(initText);
          const applied: VideotekaApplied = { topic: resolved, author: initAuthor, text: initText };
          setPApplied(applied);
          onSearchRef.current(applied, 'init');
        }
      })
      .catch((err) => console.error('Failed to load playlist data', err));
  }, [isActive, initTopicTitle, initAuthor, initText, getPlaylistTopics, getPlaylistAuthors]);

  // Playlist search
  useEffect(() => {
    if (!pApplied) return;
    const { topic, author, text } = pApplied;
    if (!topic && !author && !text) {
      setPlaylists({ embedded: [], ytLinks: [] });
      return;
    }
    setPLoading(true);
    searchPlaylists(topic?._id ?? null, topic?.title ?? '', author, text)
      .then(setPlaylists)
      .catch((err) => {
        console.error('Failed to load playlists', err);
        setPlaylists({ embedded: [], ytLinks: [] });
      })
      .finally(() => setPLoading(false));
  }, [pApplied, searchPlaylists]);

  const pHasApplied = pApplied && (!!pApplied.topic || !!pApplied.author || !!pApplied.text);
  const pNoResults =
    !pLoading && pHasApplied && playlists.embedded.length === 0 && playlists.ytLinks.length === 0;

  // Combine embedded series and YouTube playlists into one list sorted by
  // title, then paginate that single list. The page's items are split back by
  // type so both sections (Видео поредици / YouTube плейлисти) stay visible,
  // but a YouTube playlist lands on the page matching its alphabetical rank
  // among ALL playlists.
  type CombinedPlaylist =
    | { kind: 'embedded'; playlist: PlaylistType }
    | { kind: 'yt'; link: LinkType };

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

  const totalResults = combinedSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PLAYLISTS_PER_PAGE));
  const effectivePage = Math.min(page, totalPages);

  const { pageEmbedded, pageYt } = useMemo(() => {
    const pageItems = combinedSorted.slice(
      (effectivePage - 1) * PLAYLISTS_PER_PAGE,
      effectivePage * PLAYLISTS_PER_PAGE
    );
    return {
      pageEmbedded: pageItems
        .filter((i): i is Extract<CombinedPlaylist, { kind: 'embedded' }> => i.kind === 'embedded')
        .map((i) => i.playlist),
      pageYt: pageItems
        .filter((i): i is Extract<CombinedPlaylist, { kind: 'yt' }> => i.kind === 'yt')
        .map((i) => i.link)
    };
  }, [combinedSorted, effectivePage]);

  const handleSearch = () => {
    const applied: VideotekaApplied = { topic: pTopic, author: pAuthor ?? '', text: pText.trim() };
    setPApplied(applied);
    onSearch(applied, 'user');
    scrollToId(RESULTS_ID, true);
  };

  const handlePageChange = (nextPage: number) => {
    onPageChange(nextPage);
    scrollToId(RESULTS_ID);
  };

  const renderPagination = () =>
    totalPages > 1 ? (
      <Pagination
        page={effectivePage}
        total={totalPages}
        onPageClick={handlePageChange}
        onNextClick={() => handlePageChange(Math.min(effectivePage + 1, totalPages))}
        onPrevClick={() => handlePageChange(Math.max(effectivePage - 1, 1))}
        nextLabel="Следваща"
        prevLabel="Предишна"
        setUrl={(_pageNumber: number) => `#page-${_pageNumber}`}
        surrounding={1}
      />
    ) : null;

  return (
    <div className="u-spacing--double">
      <section className="u-spacing">
        <Caption>
          Изберете поне един критерий за търсене на YouTube видео поредици.
          Можете да филтрирате по тема, автор или да въведете ключова дума в
          заглавието или описанието. Вградените поредици се пускат директно в
          сайта, а YouTube плейлистите се отварят в YouTube.
        </Caption>
        <FilterForm
          type="playlists"
          allTopics={playlistTopics}
          allAuthors={playlistAuthors}
          selectedTopic={pTopic}
          selectedAuthor={pAuthor}
          searchText={pText}
          onTopicChange={setPTopic}
          onAuthorChange={setPAuthor}
          onSearchTextChange={setPText}
          onSearch={handleSearch}
        />
      </section>

      {pLoading && (
        <div className="centered-text">
          <i className="fas fa-spinner fa-pulse fa-5x u-space--triple"></i>
        </div>
      )}

      {!pLoading && pHasApplied && !pNoResults && (
        <div id={RESULTS_ID}>
          {renderPagination()}
          <PlaylistSearchBlock
            embedded={pageEmbedded}
            ytLinks={pageYt}
            embeddedTotal={playlists.embedded.length}
            ytTotal={playlists.ytLinks.length}
            appliedTopics={pApplied?.topic ? [pApplied.topic] : []}
          />
          {renderPagination()}
        </div>
      )}

      {pNoResults && (
        <div className="u-spacing u-text-align--center">
          <p>Не са намерени резултати.</p>
        </div>
      )}
    </div>
  );
};
