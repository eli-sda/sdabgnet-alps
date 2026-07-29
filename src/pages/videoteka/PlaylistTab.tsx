import { useEffect, useRef, useState } from 'react';
import { Caption } from 'alps-library/atoms/text/Caption';
import { PlaylistSearchResults } from 'src/utils/FetchHelper';
import { TopicType } from 'src/contexts/PlaylistsContext';
import { useVideotekaFilters } from 'src/hooks/useVideotekaFilters';
import { FilterForm } from './FilterForm';
import { PlaylistSearchBlock } from './PlaylistSearchBlock';

export type PlaylistApplied = {
  topic: TopicType | null;
  author: string;
  text: string;
};

export interface PlaylistTabProps {
  isActive: boolean;
  initTopicTitle: string;
  initAuthor: string;
  initText: string;
  onSearch: (applied: PlaylistApplied) => void;
}

export const PlaylistTab = ({
  isActive,
  initTopicTitle,
  initAuthor,
  initText,
  onSearch
}: PlaylistTabProps) => {
  const { getPlaylistTopics, getPlaylistAuthors, searchPlaylists } = useVideotekaFilters();
  const [playlistTopics, setPlaylistTopics] = useState<TopicType[]>([]);
  const [playlistAuthors, setPlaylistAuthors] = useState<string[]>([]);
  const [pTopic, setPTopic] = useState<TopicType | null>(null);
  const [pAuthor, setPAuthor] = useState<string | null>(null);
  const [pText, setPText] = useState(initText);
  const [pApplied, setPApplied] = useState<PlaylistApplied | null>(null);
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
          const applied: PlaylistApplied = { topic: resolved, author: initAuthor, text: initText };
          setPApplied(applied);
          onSearchRef.current(applied);
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

  const handleSearch = () => {
    const applied: PlaylistApplied = { topic: pTopic, author: pAuthor ?? '', text: pText.trim() };
    setPApplied(applied);
    onSearch(applied);
  };

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
        <PlaylistSearchBlock
          embedded={playlists.embedded}
          ytLinks={playlists.ytLinks}
          appliedTopics={pApplied?.topic ? [pApplied.topic] : []}
        />
      )}

      {pNoResults && (
        <div className="u-spacing u-text-align--center">
          <p>Не са намерени резултати.</p>
        </div>
      )}
    </div>
  );
};
