import { useEffect, useState } from 'react';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Caption } from 'alps-library/atoms/text/Caption';
import { MediaBlockProps } from 'src/alps/molecules/blocks/MediaBlock';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import { PageSection } from 'src/organisms/PageSection';
import routes from 'src/routes';
import { getBreadcrumbs, getTitle } from 'src/utils/Navigation';
import { QuestionType } from 'src/contexts/QuestionsContext';
import { useQuestions } from 'src/hooks/useQuestions';
import {
  QuestionItem,
  QuestionsList
} from 'src/pages/pastorOnline/QuestionsList';
import PastorOnlineForm from './PastorOnlineForm';
import './PastorOnline.scss';

const PastorOnline = () => {
  const title = getTitle(routes.commune('pastor-online'));
  const breadcrumbs = getBreadcrumbs([
    routes.churchLife(),
    routes.commune(),
    routes.commune('pastor-online')
  ]);

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const { getQuestions } = useQuestions();

  useEffect(() => {
    getQuestions()
      .then(setQuestions)
      .catch((error) => console.error(error));
  }, [getQuestions]);

  const items: QuestionItem[] = questions.map(({ text, name, answer }) => ({
    text: text,
    avatar: '/img/pastorOnline/user-question-darker.svg',
    name: name,
    answer: {
      text: answer,
      avatar: '/img/pastorOnline/pastorVentsislavPanayotov.png',
      name: 'п-р Венцислав Панайотов'
    }
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
    <>
      <PageHeaderLong title={title} />

      <PageContent breadcrumbs={breadcrumbs}>
        <div className="pastor-online-caption u-shift--left--1-col--at-xxlarge u-space--right">
          <Caption>
            Тук са публикувани някои от зададените въпроси с отговори от{' '}
            <strong>п-р Венцислав Панайотов</strong>. <br /> Ако имате въпрос,
            който не откривате тук, свързан с християнския живот, можете да
            използвате формуляра и ще получите отговор по имейл.
          </Caption>
        </div>
      </PageContent>

      <PageSection
        aside={<PastorOnlineForm />}
        relatedPosts={{ heading: 'Полезно', blocks: relatedItems }}
        pageClassName="page-aside-top page-pastor-online"
      >
        <section className="c-comments u-spacing--double">
          <HeadingBlock title="Въпроси с отговори" />
          <QuestionsList items={items} />
        </section>
      </PageSection>
    </>
  );
};

export default PastorOnline;
