import routes from 'src/routes';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { ContentBlock } from 'src/alps/molecules/blocks/ContentBlock';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';

const onlineBooksBlocks = [
  {
    title: 'Диета и храна',
    url: 'https://m.egwwritings.org/bg/book/13791.1',
    img: '/img/health/books/dieta-i-hrana.webp',
    description: 'Елън Уайт',
    cta: 'Чети онлайн'
  },
  {
    title: 'По стъпките на Великия лекар',
    url: 'https://m.egwwritings.org/bg/book/13845.3',
    img: '/img/health/books/po-stupkite-na-velikiya-lekar.webp',
    description: 'Елън Уайт',
    cta: 'Чети онлайн'
  }
];

const buyBooksBlocks = [
  {
    title: 'Как да сме здрави?',
    url: 'https://www.book.store.bg/p593363027/kak-da-sme-zdravi-delian-jordanov.html',
    description: 'Без лекарства, с природни лечения \n Делян Йорданов',
    img: '/img/health/books/kak-da-sme-zdravi.webp',
    cta: 'Купи'
  }
];

const relatedBooks = {
  heading: 'Книги за изтегляне',
  blocks: [
    {
      title: 'Съвети за диетата и храненето',
      url: '/resources/books#4eba2f1c-729e-45c0-b56f-e574004bd554',
      category: 'Ресурси - книги'
    },
    {
      title: 'По стъпките на Великия лекар',
      url: '/resources/books#f4cf45eb-777b-4f67-a6db-5ac03d7ccd1f',
      category: 'Ресурси - книги'
    },
    {
      title: 'Децата, дрогата, родителите',
      url: '/resources/books#0b200b72-98c7-45a4-a1d1-ab3b5dedc795',
      category: 'Ресурси - книги'
    },
    {
      title:
        'Горчивите методи на лечение. Пътищата на заблудата в алтернативните методи на лечение',
      url: '/resources/books#0d0e271b-3e34-49d6-8ae8-e1cedaecbcce',
      category: 'Ресурси - книги'
    }
  ]
};

type BookItem = {
  url: string;
  title: string;
  cta: string;
  img: string;
  description?: string;
};

const BookGroup = ({ title, books }: { title: string; books: BookItem[] }) => (
  <div className="u-spacing">
    <HeadingBlock title={title} />
    {books.map((book) => (
      <ContentBlock
        key={book.url}
        title={book.title}
        cta={book.cta}
        url={book.url}
        image={getImageTypeByUrl(book.img)}
        grayBackground={false}
        description={book.description}
      />
    ))}
  </div>
);

const healthBooksPath = routes.health('books');

const HealthBooks = (): JSX.Element => {
  const breadcrumbsUrls = [routes.health(), healthBooksPath];

  return (
    <Page
      title={getTitle(healthBooksPath)}
      breadcrumbsUrls={breadcrumbsUrls}
      relatedPosts={relatedBooks}
    >
      <section className="health-books-page u-spacing--double">
        <section className="u-spacing">
          <HeadingBlock title="Гледайте" />
          <VideoPlaylistList pagePath={healthBooksPath} />
        </section>

        <section className="u-spacing--double health-books-list">
          <BookGroup title="Четете онлайн" books={onlineBooksBlocks} />
          <BookGroup title="Купи книга" books={buyBooksBlocks} />

          <ContentBlock
            title='Издателство "Нов живот"'
            cta="Към онлайн книжарницата"
            url="https://newlife-bg.com/product-category/health/"
            image={getImageTypeByUrl('/img/logos/new-life_color.svg')}
            grayBackground={false}
            description="Предлага християнска литератира, както и книги на теми като здравословен начин на живот, диета и хранене, алтернативни методи на лечение и други. Виж предложенията им и се погрижи за своето здраве!"
          />
        </section>
      </section>
    </Page>
  );
};

export default HealthBooks;
