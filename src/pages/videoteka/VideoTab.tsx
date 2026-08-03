import { useEffect, useRef, useState, useMemo } from 'react';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Button } from 'src/alps/atoms/Button';
import { LinkType, TopicType, PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { useVideotekaFilters } from 'src/hooks/useVideotekaFilters';
import { FilterForm } from './FilterForm';
import type { SearchSource, VideotekaApplied } from './types';
import { VideoLinkBlock } from './VideoLinkBlock';
import { VideoPlayerDialog } from 'src/components/media/video/VideoPlayerDialog';

type VideoGroup = {
  playlistId: string | null;
  playlistName: string | null;
  videos: LinkType[];
};

export interface VideoTabProps {
  isActive: boolean;
  initTopicTitle: string;
  initAuthor: string;
  initText: string;
  onSearch: (applied: VideotekaApplied, source?: SearchSource) => void;
}

export const VideoTab = ({
  isActive,
  initTopicTitle,
  initAuthor,
  initText,
  onSearch
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

  useScrollToHash({
    enabled: !vLoading && youtubeVideos.length > 0
  });

  useEffect(() => {
    setSelectedIds(new Set());
  }, [vApplied]);

  const groupedVideos = useMemo((): VideoGroup[] => {
    const map = new Map<string | null, LinkType[]>();
    youtubeVideos.forEach((video: LinkType) => {
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
        result.push({ playlistId: id, playlistName: vids[0].keyWords?.[0] ?? null, videos: vids });
      }
    }
    const singles = map.get(null) ?? [];
    if (singles.length > 0) {
      result.push({ playlistId: null, playlistName: null, videos: singles });
    }
    return result;
  }, [youtubeVideos]);

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
  };

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
          <section className="u-spacing--double">
            <div className="videoteka-youtube-header">
              <h2 className="u-font--primary--m u-theme--color--darker">YouTube видеа</h2>
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
            {groupedVideos.map((group) => (
              <div key={group.playlistId ?? 'singles'} className="videoteka-playlist-group u-spacing">
                <div className="videoteka-group-header">
                  {group.playlistId ? (
                    <>
                      <span>
                        <i className="fas fa-list u-space--quarter--right"></i>
                        {group.playlistName ?? group.playlistId}
                        <span className="videoteka-group-count"> ({group.videos.length})</span>
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
                    <span>Единични видеа ({group.videos.length})</span>
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
