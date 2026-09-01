import { useEffect, useRef, useState, useMemo } from 'react';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Pagination } from 'alps-library/molecules/navigation/pagination/Pagination';
import { Button } from 'src/alps/atoms/Button';
import { LinkType, TopicType, PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { useVideotekaFilters } from 'src/hooks/useVideotekaFilters';
import { FilterForm } from './FilterForm';
import type { SearchSource, VideotekaApplied } from './types';
import { scrollToId } from 'src/utils/Links';
import { VideoLinkBlock } from './VideoLinkBlock';
import { VideoPlayerDialog } from 'src/components/media/video/VideoPlayerDialog';

type VideoGroup = {
  playlistId: string | null;
  playlistName: string | null;
  videos: LinkType[];
};

const VIDEOS_PER_PAGE = 20;
const RESULTS_ID = 'videoteka-video-results';

export interface VideoTabProps {
  isActive: boolean;
  initTopicTitle: string;
  initAuthor: string;
  initText: string;
  page: number;
  onSearch: (applied: VideotekaApplied, source?: SearchSource) => void;
  onPageChange: (page: number) => void;
}

export const VideoTab = ({
  isActive,
  initTopicTitle,
  initAuthor,
  initText,
  page,
  onSearch,
  onPageChange
}: VideoTabProps) => {
  const { getVideoTopics, getVideoAuthors, searchVideos } = useVideotekaFilters();
  const [videoTopics, setVideoTopics] = useState<TopicType[]>([]);
  const [videoAuthors, setVideoAuthors] = useState<string[]>([]);
  const [vTopic, setVTopic] = useState<TopicType | null>(null);
  const [vAuthor, setVAuthor] = useState<string | null>(null);
  const [vText, setVText] = useState(initText);
  const [vApplied, setVApplied] = useState<VideotekaApplied | null>(null);
  const [videos, setVideos] = useState<LinkType[]>([]);
  const [vLoading, setVLoading] = useState(false);
  const [dialogPlaylist, setDialogPlaylist] = useState<PlaylistType | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const dataLoadedRef = useRef(false);
  const onSearchRef = useRef(onSearch);
  useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);

  // Lazy load: only when first activated
  useEffect(() => {
    if (!isActive || dataLoadedRef.current) return;
    dataLoadedRef.current = true;

    Promise.all([getVideoTopics(), getVideoAuthors()])
      .then(([topics, authors]) => {
        setVideoTopics(topics);
        setVideoAuthors(authors);

        if (initTopicTitle || initAuthor || initText) {
          const resolved = topics.find((t) => t.title === initTopicTitle) ?? null;
          setVTopic(resolved);
          setVAuthor(initAuthor || null);
          setVText(initText);
          const applied: VideotekaApplied = { topic: resolved, author: initAuthor, text: initText };
          setVApplied(applied);
          onSearchRef.current(applied, 'init');
        }
      })
      .catch((err) => console.error('Failed to load video data', err));
  }, [isActive, initTopicTitle, initAuthor, initText, getVideoTopics, getVideoAuthors]);

  // Video search — searchVideos returns cached results when filters match, skipping Sanity
  useEffect(() => {
    if (!vApplied) return;
    const { topic, author, text } = vApplied;
    if (!topic && !author && !text) {
      setVideos([]);
      return;
    }
    setVLoading(true);
    searchVideos(topic?._id ?? null, topic?.title ?? '', author, text)
      .then(setVideos)
      .catch((err) => {
        console.error('Failed to load videos', err);
        setVideos([]);
      })
      .finally(() => setVLoading(false));
  }, [vApplied, searchVideos]);

  const youtubeVideos = useMemo<LinkType[]>(
    () => videos.filter((v) => v.isResource !== true),
    [videos]
  );

  const stripQuotes = (s: string) => s.replace(/^["'„“]+/, '');

  // Build a stable playlist name for every playlist id so a playlist's videos
  // sort contiguously (keyed by the same id used for grouping), and the pages
  // stay alphabetical without another playlist appearing between its parts.
  const playlistNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const v of youtubeVideos) {
      if (v.playlistId && !map.has(v.playlistId)) {
        map.set(v.playlistId, v.keyWords?.[0] ?? v.playlistId);
      }
    }
    return map;
  }, [youtubeVideos]);

  // Sort the full result set so singles come first (grouped under "Единични
  // видеа"), then by playlist name, then by video title.
  const sortedYoutubeVideos = useMemo<LinkType[]>(() => {
    const locCompare = (a: string, b: string) =>
      stripQuotes(a).localeCompare(stripQuotes(b), 'bg', { sensitivity: 'base', numeric: true });

    return [...youtubeVideos].sort((a, b) => {
      const pa = a.playlistId ? playlistNameById.get(a.playlistId) ?? a.playlistId : '';
      const pb = b.playlistId ? playlistNameById.get(b.playlistId) ?? b.playlistId : '';
      const byPlaylist = locCompare(pa, pb);
      return byPlaylist !== 0 ? byPlaylist : locCompare(a.title, b.title);
    });
  }, [youtubeVideos, playlistNameById]);

  const totalPages = Math.max(1, Math.ceil(sortedYoutubeVideos.length / VIDEOS_PER_PAGE));
  const effectivePage = Math.min(page, totalPages);

  const paginatedVideos = useMemo<LinkType[]>(
    () =>
      sortedYoutubeVideos.slice(
        (effectivePage - 1) * VIDEOS_PER_PAGE,
        effectivePage * VIDEOS_PER_PAGE
      ),
    [sortedYoutubeVideos, effectivePage]
  );

  // Total video count per group across the whole result set (not just the page),
  // keyed by playlist id, with 'singles' for videos not in a playlist.
  const groupCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of sortedYoutubeVideos) {
      const key = v.playlistId ?? 'singles';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [sortedYoutubeVideos]);

  useScrollToHash({
    enabled: !vLoading && youtubeVideos.length > 0
  });

  useEffect(() => {
    setSelectedIds(new Set());
  }, [vApplied]);

  const groupedVideos = useMemo((): VideoGroup[] => {
    const sortByTitle = (a: LinkType, b: LinkType) =>
      a.title
        .replace(/^["'„“]+/, '')
        .localeCompare(b.title.replace(/^["'„“]+/, ''), 'bg', { sensitivity: 'base', numeric: true });

    const map = new Map<string | null, LinkType[]>();
    paginatedVideos.forEach((video: LinkType) => {
      const key = video.playlistId ?? null;
      let arr = map.get(key);
      if (!arr) {
        arr = [];
        map.set(key, arr);
      }
      arr.push(video);
    });
    const result: VideoGroup[] = [];
    for (const [id, vids] of map) {
      if (id !== null) {
        result.push({
          playlistId: id,
          playlistName: playlistNameById.get(id) ?? vids[0].keyWords?.[0] ?? null,
          videos: [...vids].sort(sortByTitle)
        });
      }
    }
    result.sort((a, b) =>
      stripQuotes(a.playlistName ?? '')
        .localeCompare(stripQuotes(b.playlistName ?? ''), 'bg', { sensitivity: 'base', numeric: true })
    );
    const singles = map.get(null) ?? [];
    if (singles.length > 0) {
      result.unshift({ playlistId: null, playlistName: null, videos: [...singles].sort(sortByTitle) });
    }
    return result;
  }, [paginatedVideos, playlistNameById]);

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectedVideos = useMemo(
    () => youtubeVideos.filter((v) => selectedIds.has(v._id)),
    [selectedIds, youtubeVideos]
  );

  const openSingle = (video: LinkType) =>
    setDialogPlaylist({ _id: video._id, title: video.title, items: [video] });

  const openSelected = () =>
    setDialogPlaylist({ _id: 'videoteka-selected', title: 'Избрани видеа', items: selectedVideos });

  const openPlaylist = (group: VideoGroup) =>
    setDialogPlaylist({
      _id: group.playlistId ?? 'singles',
      title: group.playlistName ?? 'Единични видеа',
      items: group.videos
    });

  const vHasApplied = vApplied && (!!vApplied.topic || !!vApplied.author || !!vApplied.text);

  const handleSearch = () => {
    const applied: VideotekaApplied = { topic: vTopic, author: vAuthor ?? '', text: vText.trim() };
    setVApplied(applied);
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
    <>
      <div className="u-spacing--double">
        <section className="u-spacing">
          <Caption>
            Изберете поне един критерий за търсене на YouTube видеа от нашата
            колекция. Можете да филтрирате по тема, автор или да въведете ключова
            дума в заглавието или описанието.
          </Caption>
          <FilterForm
            type="videos"
            allTopics={videoTopics}
            allAuthors={videoAuthors}
            selectedTopic={vTopic}
            selectedAuthor={vAuthor}
            searchText={vText}
            onTopicChange={setVTopic}
            onAuthorChange={setVAuthor}
            onSearchTextChange={setVText}
            onSearch={handleSearch}
          />
        </section>

        {vLoading && (
          <div className="centered-text">
            <i className="fas fa-spinner fa-pulse fa-5x u-space--triple"></i>
          </div>
        )}

        {!vLoading && youtubeVideos.length > 0 && (
          <section
            id={RESULTS_ID}
            className="u-spacing--double"
          >
            <div className="videoteka-youtube-header">
              <h2 className="u-font--primary--m u-theme--color--darker">
                YouTube видеа ({youtubeVideos.length})
              </h2>
              {selectedIds.size > 0 ? (
                <Button
                  outline
                  small
                  faIconClass="fas fa-play-circle"
                  label={`Пусни избраните (${selectedIds.size})`}
                  onClick={openSelected}
                />
              ) : (
                <Button outline small disabled faIconClass="fas fa-play-circle" label="Пусни избраните" />
              )}
            </div>
            {renderPagination()}
            {groupedVideos.map((group) => (
              <div key={group.playlistId ?? 'singles'} className="videoteka-playlist-group u-spacing">
                <div className="videoteka-group-header">
                  {group.playlistId ? (
                    <>
                      <span>
                        <i className="fas fa-list u-space--quarter--right"></i>
                        {group.playlistName ?? group.playlistId}
                        <span className="videoteka-group-count"> ({groupCounts.get(group.playlistId ?? '') ?? group.videos.length})</span>
                      </span>
                      <Button
                        outline
                        small
                        faIconClass="fas fa-play-circle"
                        label="Пусни плейлиста"
                        onClick={() => openPlaylist(group)}
                      />
                    </>
                  ) : (
                    <span>Единични видеа ({groupCounts.get('singles') ?? group.videos.length})</span>
                  )}
                </div>
                {group.videos.map((video, i) => (
                  <VideoLinkBlock
                    key={video._id || i}
                    video={video}
                    appliedTopics={vApplied?.topic ? [vApplied.topic] : []}
                    isSelected={selectedIds.has(video._id)}
                    onToggleSelect={() => toggleSelect(video._id)}
                    onPlay={() => openSingle(video)}
                    showPlaylist={false}
                  />
                ))}
              </div>
            ))}
            {renderPagination()}
          </section>
        )}

        {!vLoading && vHasApplied && videos.length === 0 && (
          <div className="u-spacing u-text-align--center">
            <p>Не са намерени резултати.</p>
          </div>
        )}
      </div>

      {selectedIds.size > 0 && (
        <div className="videoteka-sticky-bar">
          <Button
            faIconClass="fas fa-play-circle"
            label={`Пусни избраните (${selectedIds.size})`}
            onClick={openSelected}
          />
        </div>
      )}

      <VideoPlayerDialog
        isOpen={dialogPlaylist !== null}
        playlist={dialogPlaylist}
        title={dialogPlaylist?.title ?? ''}
        playIndex={0}
        onClose={() => setDialogPlaylist(null)}
      />
    </>
  );
};
