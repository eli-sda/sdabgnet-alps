import { AudioInstructions } from 'src/components/media/audio/AudioInstructions';
import { AudioPlaylistList } from 'src/components/media/audio/AudioPlaylistList';
import bibleBooksCounts from './bible_books_counts.json';

type BibleBook = {
  bookPath: string;
  count: number;
};

const BibleAudioPalylist = () => {
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
          ? encodeURI(`audio/bible/${bookPath}/${nameWithoutPrefixNumber}.mp3`)
          : encodeURI(
              `audio/bible/${bookPath}/${nameWithoutPrefixNumber} (${chapterStr}).mp3`
            );

      return { _id, title, path };
    });
  });
  const playlist = {
    _id: 'audioBible',
    title: 'Аудио Библия',
    imageUrl: '/img/resources/bible.webp',
    items
  };

  return (
    <>
      <AudioInstructions type="bible" className="u-space--double--top" />

      <AudioPlaylistList playlists={[playlist]} showDownloadAll={false} />
    </>
  );
};

export default BibleAudioPalylist;
