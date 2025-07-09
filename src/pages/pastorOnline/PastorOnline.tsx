import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import PastorOnlineForm from './PastorOnlineForm';
import PastorOnlineQestions from 'src/pages/pastorOnline/PastorOnlineQuestions.json';
import {
  QuestionItem,
  QuestionsList
} from 'src/pages/pastorOnline/QuestionsList';
import { PortableTextBlock } from '@portabletext/types';
import { Caption } from 'alps-library/atoms/text/Caption';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { MediaBlockProps } from 'src/alps/molecules/blocks/MediaBlock';

const PastorOnline = () => {
  const title = getTitle(routes.commune('pastor-online'));
  const breadcrumbsUrls = [
    routes.churchLife(),
    routes.commune(),
    routes.commune('pastor-online')
  ];

  const items: QuestionItem[] = PastorOnlineQestions.map((item) => ({
    text: item.text,
    avatar: '/img/pastorOnline/user-question-darker.svg',
    name: item.name,
    answer: item.answer
      ? {
          text: item.answer as PortableTextBlock[],
          avatar: '/img/pastorOnline/pastorVentsislavPanayotov.png',
          name: 'п-р Венцислав Панайотов'
        }
      : undefined
  }));

  const relatedItems: MediaBlockProps[] = [];
  const relatedQuestion: MediaBlockProps = {
    title: 'GotQuestions.org',
    description: 'Българската версия на сайта с отговорени библейски въпроси',
    image: {
      alt: '',
      srcSet: {
        default: '/img/pastorOnline/logo_gotQuestions.svg',
        500: '',
        750: '',
        1200: ''
      }
    },
    url: 'https://www.gotquestions.org/Bulgarian/'
  };
  relatedItems.push(relatedQuestion);
  return (
    <Page
      title={title}
      breadcrumbsUrls={breadcrumbsUrls}
      aside={<PastorOnlineForm />}
      relatedPosts={{ heading: 'Полезно', blocks: relatedItems }}
      pageClassName='page-aside-top'
    >
      <Caption>
        Тук са публикувани някои от зададените въпроси с отговори от{' '}
        <strong>п-р Венцислав Панайотов</strong>. <br /> Ако имате въпрос, който
        не откривате тук, свързан с християнския живот, можете да използвате
        формуляра и ще получите отговор по имейл.
      </Caption>

      <section className="c-comments u-spacing--double">
        <HeadingBlock title="Въпроси с отговори" />
        <QuestionsList items={items} />
      </section>
    </Page>
  );
};

export default PastorOnline;
