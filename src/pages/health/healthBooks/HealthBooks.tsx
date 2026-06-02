import routes from 'src/routes';
import { ContentBlock } from 'src/alps/molecules/blocks/ContentBlock';
import { Button } from 'src/alps/atoms/Button';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import './HealthBooks.scss';

const booksBlocks = [
  {
    title: 'Диета и храна',
    url: 'https://m.egwwritings.org/bg/book/13791.1',
    img: '/img/health/books/dieta-i-hrana.webp',
    description: 'Елън Уайт',
    cta: 'Прочети'
  },
  {
    title: 'По стъпките на Великия лекар',
    url: 'https://m.egwwritings.org/bg/book/13845.3',
    img: '/img/health/books/po-stupkite-na-velikiya-lekar.webp',
    description: 'Елън Уайт',
    cta: 'Прочети'
  },
  {
    title: 'Как да сме здрави?',
    url: 'https://www.book.store.bg/p593363027/kak-da-sme-zdravi-delian-jordanov.html',
    description: 'Без лекарства, с природни лечения \n Делян Йорданов',
    img: '/img/health/books/kak-da-sme-zdravi.webp',
    cta: 'Купи'
  }
];

const relatedBooks = {
  heading: 'Още книги за здравето',
  blocks: [
    {
      title: 'Съвети за диетата и храненето',
      url: '/resources/books?title=%D0%A1%D1%8A%D0%B2%D0%B5%D1%82%D0%B8+%D0%B7%D0%B0+%D0%B4%D0%B8%D0%B5%D1%82%D0%B0%D1%82%D0%B0+%D0%B8+%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B5%D1%82%D0%BE#4eba2f1c-729e-45c0-b56f-e574004bd554',
      category: 'Ресурси - книги'
    },
    {
      title: 'По стъпките на Великия лекар',
      url: '/resources/books?title=%D0%9F%D0%BE+%D1%81%D1%82%D1%8A%D0%BF%D0%BA%D0%B8%D1%82%D0%B5+%D0%BD%D0%B0+%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%B8%D1%8F+%D0%BB%D0%B5%D0%BA%D0%B0%D1%80#f4cf45eb-777b-4f67-a6db-5ac03d7ccd1f',
      category: 'Ресурси - книги'
    },
    {
      title: 'Децата, дрогата, родителите',
      url: '/resources/books?title=%D0%94%D0%B5%D1%86%D0%B0%D1%82%D0%B0%2C+%D0%B4%D1%80%D0%BE%D0%B3%D0%B0%D1%82%D0%B0%2C+%D1%80%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D0%B8%D1%82%D0%B5#0b200b72-98c7-45a4-a1d1-ab3b5dedc795',
      category: 'Ресурси - книги'
    },
    {
      title:
        'Горчивите методи на лечение. Пътищата на заблудата в алтернативните методи на лечение',
      url: '/resources/books?title=%D0%93%D0%BE%D1%80%D1%87%D0%B8%D0%B2%D0%B8%D1%82%D0%B5+%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D0%B8+%D0%BD%D0%B0+%D0%BB%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5.+%D0%9F%D1%8A%D1%82%D0%B8%D1%89%D0%B0%D1%82%D0%B0+%D0%BD%D0%B0+%D0%B7%D0%B0%D0%B1%D0%BB%D1%83%D0%B4%D0%B0%D1%82%D0%B0+%D0%B2+%D0%B0%D0%BB%D1%82%D0%B5%D1%80%D0%BD%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D0%B8%D1%82%D0%B5+%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D0%B8+%D0%BD%D0%B0+%D0%BB%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5#0d0e271b-3e34-49d6-8ae8-e1cedaecbcce',
      category: 'Ресурси - книги'
    }
  ]
};

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
        <VideoPlaylistList pagePath={healthBooksPath} />

        <section className="u-spacing health-books-list">
          {booksBlocks.map((book) => (
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
        </section>

        <section className="new-life-ad u-spacing">
          <div className="new-life-ad-content">
            <img
              src="/img/logos/new-life_color.svg"
              className="new-life-logo u-space--right"
            />

            <p className="u-theme--color--darker u-font--secondary--m">
              Издателство &quot;Нов живот&quot; предлага книги на теми като
              здравословен начин на живот, диета и хранене, алтернативни методи
              на лечение и други. Виж предложенията им и се погрижи за своето
              здраве!
            </p>
          </div>

          <Button
            as="a"
            url="https://newlife-bg.com/product-category/health/"
            label="Отвори страницата"
            isExternal
            outline
          />
        </section>
      </section>
    </Page>
  );
};

export default HealthBooks;
