import { useEffect, useState } from 'react';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import { getTitle } from 'src/utils/Navigation';
import VideoWithPreview from 'src/components/media/video/videoWithPreview/VideoWithPreview';
import { SUBPAGE_KICKER } from '../Resources';
import BooksList from './BooksList';

const Books = () => {
  const breadcrumbsUrls = [routes.resources(), routes.resources('books')];

  const { getResourcePlaylists } = usePlaylists();
  const [books, setBooks] = useState<PlaylistType[]>([]);

  useEffect(() => {
    getResourcePlaylists('books', undefined, false)
      //Други at the end of the list
      .then((data: PlaylistType[]) => {
        const sortedData = data.sort((a, b) => {
          if (a.title === 'Други') return 1;
          if (b.title === 'Други') return -1;
          return 0;
        });
        setBooks(sortedData);
      })
      .catch((err) => console.error(err));
  }, [getResourcePlaylists]);

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
        image: getImageTypeByUrl('/img/logos/lib.webp')
      },
      {
        title: 'Четете книгите на Елън Уайт онлайн',
        url: 'https://m.egwwritings.org/bg/folders/1344',
        image: getImageTypeByUrl('/img/logos/whiteestate-logo.png')
      }
    ]
  };

  return (
    <Page
      title={getTitle(routes.resources('books'))}
      kicker={SUBPAGE_KICKER}
      breadcrumbsUrls={breadcrumbsUrls}
      aside={asideBookVideo}
      relatedPosts={relatedBooks}
    >
      <Accordion className="text">
        {books.map((book, i) => (
          <BooksList key={i} {...book} />
        ))}
      </Accordion>
    </Page>
  );
};

export default Books;
