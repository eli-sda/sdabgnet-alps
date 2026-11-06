import { ReactNode, useEffect, useRef, useState } from 'react';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Pagination } from 'alps-library/molecules/navigation/pagination/Pagination';
import { TopicType } from 'src/contexts/PlaylistsContext';
import { FilterForm } from './FilterForm';
import type { SearchSource, VideotekaApplied } from './types';

export interface VideotekaSubTabContext {
  applied: VideotekaApplied | null;
  hasApplied: boolean;
  effectivePage: number;
  setLoading: (loading: boolean) => void;
  handlePageChange: (page: number) => void;
  renderPagination: () => ReactNode;
}

export interface VideotekaSubTabProps {
  isActive: boolean;
  initTopicTitle: string;
  initAuthor: string;
  initText: string;
  initAll?: boolean;
  page: number;
  onSearch: (applied: VideotekaApplied, source?: SearchSource) => void;
  onPageChange: (page: number) => void;
  resultsId: string;
  pageSize: number;
  filterType: 'videos' | 'playlists';
  caption: ReactNode;
  getTopics: () => Promise<TopicType[]>;
  getAuthors: () => Promise<string[]>;
  fetchResults: (
    applied: VideotekaApplied,
    setLoading: (loading: boolean) => void
  ) => void;
  totalResults: number;
  noResults: boolean;
  renderResults: (ctx: VideotekaSubTabContext) => ReactNode;
}

export const VideotekaSubTab = ({
  isActive,
  initTopicTitle,
  initAuthor,
  initText,
  initAll = false,
  page,
  onSearch,
  onPageChange,
  resultsId,
  pageSize,
  filterType,
  caption,
  getTopics,
  getAuthors,
  fetchResults,
  totalResults,
  noResults,
  renderResults
}: VideotekaSubTabProps) => {
  const [topics, setTopics] = useState<TopicType[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [topic, setTopic] = useState<TopicType | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [text, setText] = useState(initText);
  const [applied, setApplied] = useState<VideotekaApplied | null>(null);
  const [loading, setLoading] = useState(false);

  const dataLoadedRef = useRef(false);
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Lazy load: only when first activated
  useEffect(() => {
    if (!isActive || dataLoadedRef.current) return;
    dataLoadedRef.current = true;

    Promise.all([getTopics(), getAuthors()])
      .then(([topicsResult, authorsResult]) => {
        setTopics(topicsResult);
        setAuthors(authorsResult);

        if (initTopicTitle || initAuthor || initText || initAll) {
          const resolved =
            topicsResult.find((t) => t.title === initTopicTitle) ?? null;
          setTopic(resolved);
          setAuthor(initAuthor || null);
          setText(initText);
          const initApplied: VideotekaApplied = {
            topic: resolved,
            author: initAuthor,
            text: initText,
            all: initAll || undefined
          };
          setApplied(initApplied);
          onSearchRef.current(initApplied, 'init');
        }
      })
      .catch((err) => console.error('Failed to load tab data', err));
  }, [
    isActive,
    initTopicTitle,
    initAuthor,
    initText,
    initAll,
    getTopics,
    getAuthors
  ]);

  // Fetch results whenever the applied filter changes; fetchResults scrolls
  // to them once they are rendered.
  useEffect(() => {
    if (!applied) return;
    fetchResults(applied, setLoading);
  }, [applied, fetchResults]);

  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const effectivePage = Math.min(page, totalPages);
  const hasApplied = applied !== null;

  const handleSearch = () => {
    const next: VideotekaApplied = {
      topic,
      author: author ?? '',
      text: text.trim()
    };
    setApplied(next);
    onSearch(next, 'user');
  };

  const handleShowAll = () => {
    setTopic(null);
    setAuthor(null);
    setText('');
    const next: VideotekaApplied = {
      topic: null,
      author: '',
      text: '',
      all: true
    };
    setApplied(next);
    onSearch(next, 'user');
  };

  // The tabs scroll to their results once the new page is rendered; doing it
  // here would target the old page/spinner before React applies the change.
  const handlePageChange = (nextPage: number) => {
    onPageChange(nextPage);
  };

  const renderPagination = () =>
    totalPages > 1 ? (
      <Pagination
        page={effectivePage}
        total={totalPages}
        onPageClick={handlePageChange}
        onNextClick={() =>
          handlePageChange(Math.min(effectivePage + 1, totalPages))
        }
        onPrevClick={() => handlePageChange(Math.max(effectivePage - 1, 1))}
        nextLabel="Следваща"
        prevLabel="Предишна"
        setUrl={(_pageNumber: number) => `#page-${_pageNumber}`}
        surrounding={1}
      />
    ) : null;

  const ctx: VideotekaSubTabContext = {
    applied,
    hasApplied,
    effectivePage,
    setLoading,
    handlePageChange,
    renderPagination
  };

  return (
    <div className="u-spacing--double">
      <section className="u-spacing">
        <Caption>{caption}</Caption>
        <FilterForm
          type={filterType}
          allTopics={topics}
          allAuthors={authors}
          selectedTopic={topic}
          selectedAuthor={author}
          searchText={text}
          onTopicChange={setTopic}
          onAuthorChange={setAuthor}
          onSearchTextChange={setText}
          onSearch={handleSearch}
          onShowAll={handleShowAll}
        />
      </section>

      {loading && (
        <div className="centered-text">
          <i className="fas fa-spinner fa-pulse fa-5x u-space--triple"></i>
        </div>
      )}

      {!loading && hasApplied && !noResults && (
        <div id={resultsId} className="u-spacing--double">
          {renderResults(ctx)}
        </div>
      )}

      {!loading && hasApplied && noResults && (
        <div id={resultsId} className="u-spacing u-text-align--center">
          <p>{filterType === 'videos' ? 'Не са намерени видеа.' : 'Не са намерени плейлисти.'}</p>
        </div>
      )}
    </div>
  );
};
