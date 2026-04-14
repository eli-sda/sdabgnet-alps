import { useEffect, useState } from 'react';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Caption } from 'alps-library/atoms/text/Caption';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import { PageSection } from 'src/organisms/PageSection';
import routes from 'src/routes';
import { getBreadcrumbs, getTitle } from 'src/utils/Navigation';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
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

  const relatedItems = [
    {
      title: 'Bible SDA UA – Telegram бот',
      description:
        'Бот за библейски въпроси и духовни теми, създаден от адвентисти на основата на Библията и писанията на Елън Уайт. Ако нещо ви затруднява, тук ще получите ясни обяснения и насоки.',
      image: getImageTypeByUrl('/img/pastorOnline/telegram-bot.webp'),
      url: 'https://t.me/bible_ua_gpt_bot'
    },
    {
      title: 'Bible SDA UA - бот',
      description:
        'Познатият бот за библейски въпроси, вече и като уебсайт. Основан на Библията и учението на адвентистите от седмия ден, тук ще получите ясни обяснения, насоки и подкрепа за духовния живот.',
      image: getImageTypeByUrl('/img/pastorOnline/bot-avatar.webp'),
      url: 'https://sda.bible-llm.com'
    }
  ];

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
