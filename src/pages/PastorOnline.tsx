import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import PastorOnlineForm from './PastorOnlineForm';
import PastorOnlineQestions from 'src/pages/PastorOnlineQuestions.json';
import { QuestionItem, Questions } from 'src/alps/organisms/sections/Questions';
import { PortableTextBlock } from '@portabletext/types';
import { Caption } from 'alps-library/atoms/text/Caption';

const PastorOnline = () => {
  const title = getTitle(routes.commune('pastor-online'));
  const breadcrumbsUrls = [
    routes.churchLife(),
    routes.commune('pastor-online')
  ];

  const items: QuestionItem[] = PastorOnlineQestions.map((item) => ({
    byline: 'image',
    text: item.text,
    avatar: '/img/question_avatar.png',
    name: item.name,
    replies: item.answer
      ? [
          {
            byline: 'image',
            text: item.answer as PortableTextBlock[],
            avatar: '/img/pastor.jpg',
            name: 'п-р Венцислав Панайотов'
          }
        ]
      : undefined
  }));

  return (
    <Page
      title={title}
      breadcrumbsUrls={breadcrumbsUrls}
      aside={<PastorOnlineForm />}
    >
      <Caption>
        Тук са публикувани някои от зададените въпроси с отговори от{' '}
        <strong>п-р Венцислав Панайотов</strong>. <br /> Ако имате въпрос, който
        не откривате тук, свързан с християнския живот, можете да използвате
        формуляра и ще получите отговор по имейл.
      </Caption>

      <Questions title="Въпроси" items={items}></Questions>
    </Page>
  );
};

export default PastorOnline;
