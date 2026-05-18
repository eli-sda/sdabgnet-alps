import { AudioPlaylistList } from '../../../../components/media/audio/AudioPlaylistList';
import bibleBooksCounts from './bible_books_counts.json';
import '../AudioPage.scss';

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
          <br />
          Вашият напредък (коя глава слушате) се помни автоматично. Натиснете{' '}
          <i className="fas fa-bookmark u-color--white u-background-color--ming u-padding--quarter"></i>, за да запазите точната секунда,
          на която прекъсвате Библията. Щом започнете следващата глава, тя
          автоматично ще стане вашето ново запомнено място.
        </h4>
      </div>

      <AudioPlaylistList playlists={[playlist]} showDownloadAll={false} />
    </>
  );
};

export default BibleAudioPalylist;
