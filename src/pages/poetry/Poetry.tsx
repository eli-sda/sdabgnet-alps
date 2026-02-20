import { useEffect } from 'react';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { usePoetry } from 'src/hooks/usePoetry';
import PopupContent from 'src/components/popupContent/PopupContent';
import PoetryForm from './PoetryForm';
import './Poetry.scss';

const renderText = (text: string) => {
  const parts = text.split(/(<i>[\s\S]*?<\/i>)/g);

  return parts.map((part, index) => {
    if (part.startsWith('<i>') && part.endsWith('</i>')) {
      const content = part.replace(/<\/?i>/g, '');
      return <em key={index}>{content}</em>;
    }

    return part;
  });
};

const relatedPosts = {
  heading: 'Още поезия',
  blocks: [
    {
      title: 'Стихосбирка „Приказка за любовта“',
      url: '/pdf/stihosbirka_elena_ivanova.pdf',
      useLinkAsA: true,
      category: 'Елена Иванова'
    },
    {
      title: 'Орхидея - блог със стихове',
      url: 'https://orhideq07.blogspot.com/',
      category: 'Цветелина Чолакова'
    }
  ]
};

const Poetry = () => {
  const breadcrumbsUrls = [routes.churchLife(), routes.churchLife('poetry')];

  const { poetry, getPoetry } = usePoetry();

  useEffect(() => {
    void getPoetry();
  }, [getPoetry]);

  return (
    <Page
      title={getTitle(routes.churchLife('poetry'))}
      breadcrumbsUrls={breadcrumbsUrls}
      aside={<PoetryForm />}
      relatedPosts={relatedPosts}
      pageClassName="page-aside-top"
    >
      <section className="poetry-stories text">
        <ul>
          {poetry?.map(({ title, author, date, text }, index) => (
            <li key={index} className="u-font--secondary--l">
              <PopupContent
                title={title}
                buttonLabel={title}
                faIconClass="fas fa-feather-alt"
                asLink={true}
                maxWidth="sm"
              >
                <div className="poem text u-padding--top">
                  <div className="poem-text">
                    <p>{renderText(text)}</p>
                    <div className="details u-space--top u-space--right">
                      {author && <p>{author}</p>}
                      {date && <p>{date}</p>}
                    </div>
                  </div>
                </div>
              </PopupContent>
              <div className="u-font--secondary--xs">{author}</div>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
};

export default Poetry;
