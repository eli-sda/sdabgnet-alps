import { useEffect, useState } from 'react';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import { getTitle } from 'src/utils/Navigation';
import BooksList from './BooksList';
import rawBooks from './books.json';

const books = rawBooks as BooksSection[];

const Books = () => {
  const [sections, setSections] = useState<BooksSection[]>([]);

  useEffect(() => {
    setSections(books);
  }, []);

  const breadcrumbsUrls = [routes.resources(), routes.resources('books')];

  const asideBookVideo = (
    <Figure
      videoSrc="https://www.youtube.com/embed/XpKOUJIM28w?si=euk4RQ2pPbGIDviU"
      caption='Книга "ПРОРОЧЕСТВОТО ЗА ЗВЕЗДАТА": Археология и история, свързани с Исус Христос'
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
      kicker="Ресурси за изтегляне"
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
