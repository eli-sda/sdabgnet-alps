import { useEffect, useState, useCallback } from 'react';
import { Grid } from 'alps-library/atoms/grids/Grid';
import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import AudioPalylist from './AudioPalylist';
import AudioPlayer from './AudioPlayer';
import PlaylistActionButtons from './PlaylistActionButtons';
import bibleBooksCounts from './bible_books_counts.json';
import './AudioPlaylistList.scss';

type BibleBook = {
  bookPath: string;
  count: number;
};

const BibleAudioPalylist = () => {
  const [playlist, setPlaylist] = useState<PlaylistType | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    null
  );
  const [currentPlayIndex, setCurrentPlayIndex] = useState<number>(0);

  useEffect(() => {
    if (!Array.isArray(bibleBooksCounts)) return;

    const items = bibleBooksCounts.flatMap((book: BibleBook) => {
      const { bookPath, count } = book;

      const nameWithoutNumber = bookPath.replace(/^\d+\s*/, '').trim();

      return Array.from({ length: count }, (_, i) => {
        const chapterNumber = i + 1;
        const chapterStr = chapterNumber.toString().padStart(2, '0'); // 01, 02, ...
        const _id = `${nameWithoutNumber
          .toLowerCase()
          .replace(/\s+/g, '_')}_${chapterNumber}`;
        const title = `${nameWithoutNumber} глава ${chapterNumber}`;
        const path = encodeURI(
          `audio/bible/${bookPath}/${nameWithoutNumber} (${chapterStr}).mp3`
        );

        return { _id, title, path };
      });
    });

    const playlistData: PlaylistType = {
      _id: 'audioBible',
      title: 'Аудио Библия',
      imageUrl: '/img/bible.webp',
      items
    };

    setPlaylist(playlistData);
  }, []);

  const getActionButtons = useCallback((): JSX.Element | undefined => {
    if (!playlist) return undefined;
    return (
      <PlaylistActionButtons
        shareUrl={`${window.location.origin}${window.location.pathname}#${playlist._id}`}
        fromIndex={
          selectedPlaylist?._id === playlist._id ? currentPlayIndex : undefined
        }
        playlistName={playlist.title}
      />
    );
  }, [playlist, selectedPlaylist, currentPlayIndex]);

  const handlePlay = useCallback(() => {
    if (!playlist) return;
    setSelectedPlaylist(playlist);
    setCurrentPlayIndex(0);
  }, [playlist]);

  if (!playlist) return null;

  return (
    <>
      <Grid
        className="audio-playlist-list l-grid l-grid--7-col u-space--top"
        seven
        as="section"
        wrap="6"
      >
        <GridItem
          className="u-padding--sides u-space--double--bottom l-grid-item"
          key={playlist._id}
          sizeAtS="3"
          sizeAtL="2"
          sizeAtXL="1"
        >
          <AudioPalylist
            playlist={playlist}
            onPlay={handlePlay}
            isCurrent={selectedPlaylist?._id === playlist._id}
            actionButtons={getActionButtons()}
          />
        </GridItem>
      </Grid>

      {selectedPlaylist && selectedPlaylist.items && (
        <AudioPlayer
          playlist={selectedPlaylist}
          playIndex={currentPlayIndex}
          onPlayIndexChange={setCurrentPlayIndex}
        />
      )}
    </>
  );
};

export default BibleAudioPalylist;
