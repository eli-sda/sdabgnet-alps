import { useEffect, useState } from 'react';
import { BaseSearch } from 'alps-library/molecules/forms/elements/BaseSearch';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import { getTitle } from 'src/utils/Navigation';
import { filterSectionedData } from 'src/utils/filterHelpers';
import VideoWithPreview from 'src/components/media/video/videoWithPreview/VideoWithPreview';
import { SUBPAGE_KICKER } from '../Resources';
import BooksList from './BooksList';

const booksPath = routes.resources('books');
const Books = () => {
  const breadcrumbsUrls = [routes.resources(), booksPath];

  const { getPagePlaylists } = usePlaylists();
  const [books, setBooks] = useState<PlaylistType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<PlaylistType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getPagePlaylists(booksPath)
      // Други at the end of the list
      .then((data: PlaylistType[]) => {
        const sortedData = data.sort((a, b) => {
          if (a.title === 'Други') return 1;
          if (b.title === 'Други') return -1;
          return 0;
        });
        setBooks(sortedData);
        setFilteredBooks(sortedData);
      })
      .catch((err) => console.error(err));
  }, [getPagePlaylists]);

  const [isPlayingAsideVideo, setIsPlayingAsideVideo] = useState(false);

  const asideBookVideo = (
    <VideoWithPreview
      title='Книга "ПРОРОЧЕСТВОТО ЗА ЗВЕЗДАТА": Археология и история, свързани с Исус Христос'
      videoSrc="https://www.youtube.com/watch?v=XpKOUJIM28w"
      isActive={isPlayingAsideVideo}
      onActivate={() => setIsPlayingAsideVideo(true)}
    />
  );

  const relatedBooks = {
    heading: 'Полезни връзки',
    blocks: [
      {
        title: 'Електронна библиотека',
        url: 'https://bibliotekabg.com/',
        description:
          'Включва над 100 книги на Елън Уайт, както и друга адвентна литература',
        image: getImageTypeByUrl('/img/logos/BibliotekaBG.svg'),
        category: 'bibliotekabg.com'
      },
      {
        title: 'Четете книгите на Елън Уайт онлайн',
        url: 'https://m.egwwritings.org/bg/folders/1344',
        image: getImageTypeByUrl('/img/logos/whiteestate-logo.png'),
        category: 'egwwritings.org'
      },
      {
        title: 'Между редовете',
        description:
          'Предаване за книгите на издателство "Нов живот", съвместно с "Hope Channel Bulgaria"',
        category: 'YouTube плейлист',
        url: 'https://www.youtube.com/playlist?list=PLtKXLzSB_hV3NWlJ5o3LZWVq1X78n2vnB',
        image: getImageTypeByUrl('/img/logos/between-the-lines.webp')
      }
    ]
  };

  const isFiltered = searchQuery.length > 0;

  return (
    <Page
      title={getTitle(routes.resources('books'))}
      kicker={SUBPAGE_KICKER}
      breadcrumbsUrls={breadcrumbsUrls}
      aside={asideBookVideo}
      relatedPosts={relatedBooks}
    >
      <BaseSearch
        placeholder="Търси по име или автор на книга"
        hideSearchButton
        onSearch={(e: React.ChangeEvent<HTMLInputElement>) => {
          const q = e.target.value;
          setSearchQuery(q.trim());
          setFilteredBooks(filterSectionedData(books, q, ['title', 'author']));
        }}
        onSubmit={() => {
          return false;
        }}
        className="u-space--bottom"
      />

      {books.length > 0 && filteredBooks.length === 0 ? (
        <Caption>Няма намерени резултати.</Caption>
      ) : (
        <Accordion className="text">
          {filteredBooks.map((book) => (
            <BooksList
              key={`${book._id}-${isFiltered ? 'filtered' : 'all'}`}
              isFiltered={isFiltered}
              {...book}
            />
          ))}
        </Accordion>
      )}
    </Page>
  );
};

export default Books;
