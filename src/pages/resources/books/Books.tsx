import { useEffect, useState } from 'react';
import { Accordion } from 'alps-library/molecules/components/accordion/Accordion';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import BooksList from '../../BooksList';
import rawBooks from './books.json';

const books = rawBooks as BooksSection[];

const Books = () => {
  const [sections, setSections] = useState<BooksSection[]>([]);

  useEffect(() => {
    setSections(books);
  }, []);

  const breadcrumbsUrls = [routes.resources(), routes.resources('books')];

  return (
    <Page
      title={getTitle(routes.resources('books'))}
      kicker="Ресурси за изтегляне"
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <Accordion>
        {sections.map((section, i) => (
          <BooksList key={i} {...section} />
        ))}
      </Accordion>
    </Page>
  );
};

export default Books;
