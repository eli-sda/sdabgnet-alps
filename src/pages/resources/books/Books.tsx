import { useEffect, useState } from 'react';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import { getTitle } from 'src/utils/Navigation';
import { extractYouTubeId } from 'src/utils/extractYouTubeId';
import VideoWithPreview from 'src/components/videoWithPreview/VideoWithPreview';
import { SUBPAGE_KICKER } from '../Resources';
import BooksList from './BooksList';
import rawBooks from './books.json';

const books = rawBooks as BooksSection[];

const Books = () => {
  const [sections, setSections] = useState<BooksSection[]>([]);

  useEffect(() => {
    setSections(books);
  }, []);

  const breadcrumbsUrls = [routes.resources(), routes.resources('books')];

  const [isPlayingAsideVideo, setIsPlayingAsideVideo] = useState(false);

  const asideBookVideoUrl = 'https://www.youtube.com/embed/XpKOUJIM28w';
  const asideVideoId = extractYouTubeId(asideBookVideoUrl);

  const asideBookVideo = (
    <VideoWithPreview
      id={asideVideoId}
      title='Книга "ПРОРОЧЕСТВОТО ЗА ЗВЕЗДАТА": Археология и история, свързани с Исус Христос'
      videoSrc="https://www.youtube.com"
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
        {sections.map((section, i) => (
          <BooksList key={i} {...section} />
        ))}
      </Accordion>
    </Page>
  );
};

export default Books;
