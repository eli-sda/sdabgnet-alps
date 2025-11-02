import { useEffect, useState, useCallback } from 'react';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import AudioPalylist from './AudioPalylist';
import AudioPlayer from './AudioPlayer';
import PlaylistActionButtons from './PlaylistActionButtons';
import bibleBooksCounts from './bible_books_counts.json';
import './BibleAudioPalylist.scss';
import './AudioPlaylistList.scss';
import './AudioPage.scss';

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

      const nameWithoutPrefixNumber = bookPath.replace(/^\d+\s*/, '').trim();
      const slug = nameWithoutPrefixNumber.toLowerCase().replace(/\s+/g, '_');

      return Array.from({ length: count }, (_, i) => {
        const chapterNumber = i + 1;
        let chapterStr = chapterNumber.toString();

        if (count > 100) {
          chapterStr = chapterStr.padStart(3, '0');
        } else if (count >= 10) {
          chapterStr = chapterStr.padStart(2, '0');
        }

        const _id = `${slug}_${chapterNumber}`;
        const title = `${nameWithoutPrefixNumber} глава ${chapterNumber}`;
        const path =
          count === 1
            ? encodeURI(
                `audio/bible/${bookPath}/${nameWithoutPrefixNumber}.mp3`
              )
            : encodeURI(
                `audio/bible/${bookPath}/${nameWithoutPrefixNumber} (${chapterStr}).mp3`
              );

        return { _id, title, path };
      });
    });

    setPlaylist({
      _id: 'audioBible',
      title: 'Аудио Библия',
      image: {
        _type: 'image',
        asset: {
          _ref: 'image-a128b00a4deb52a7fef7ee2960f3fa329beb9bff-625x625-webp',
          _type: 'reference'
        }
      },
      imageUrl:
        'https://cdn.sanity.io/images/tw3a1q78/production/a128b00a4deb52a7fef7ee2960f3fa329beb9bff-625x625.webp',
      items
    });
  }, []);

  useEffect(() => {
    if (!playlist) return;

    const hashId = window.location.hash.replace('#', '');
    const params = new URLSearchParams(window.location.search);
    const playIndexParam = params.get('playIndex');
    const index = playIndexParam ? parseInt(playIndexParam) : 0;

    if (hashId === playlist._id && playlist.items && playlist.items[index]) {
      setSelectedPlaylist(playlist);
      setCurrentPlayIndex(index);
    }
  }, [playlist]);

  const getActionButtons = useCallback((): JSX.Element | undefined => {
    if (!playlist) return undefined;

    //Get the current title if this playlist is selected
    const currentItemTitle =
      selectedPlaylist?._id === playlist._id &&
      playlist.items?.[currentPlayIndex]?.title
        ? playlist.items[currentPlayIndex].title
        : undefined;

    return (
      <PlaylistActionButtons
        shareUrl={`${window.location.origin}${window.location.pathname}#${playlist._id}`}
        fromIndex={
          selectedPlaylist?._id === playlist._id ? currentPlayIndex : undefined
        }
        fromTitle={currentItemTitle}
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
      <div className="audio-page-instructions u-space--double--top">
        <h4 className="audio-page-caption">
          Използвайте бутона{' '}
          <span className="audio-page-caption__icon-wrapper">
            <img
              className="icon"
              src="/images/icons/o-icon__audio.svg"
              alt="Аудио икона"
            />
          </span>
          , за да слушате аудио Библията.
          <br />В отворения аудио плеър чрез бутона{' '}
          <img
            className="icon"
            src="/img/icons/playlist-icon.svg"
            alt="Плейлист икона"
          />{' '}
          можете да видите списъка с всички глави на Библията.
          <br />
          За да изтеглите текущия файл, използвайте иконата{' '}
          <img
            className="icon"
            src="/img/icons/download-icon.svg"
            alt="Изтегли икона"
          />{' '}
          от плеъра.
          <br />
          Можете да споделите линк към аудио Библията или конкретно аудио от
          нея.
        </h4>
      </div>

      <section className="audio-playlist-list bible-audio-playlist u-space--top">
        <div className="playlist-item u-padding--sides">
          <AudioPalylist
            playlist={playlist}
            onPlay={handlePlay}
            isCurrent={selectedPlaylist?._id === playlist._id}
            actionButtons={getActionButtons()}
          />
        </div>
      </section>

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
