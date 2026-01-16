import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import { LinksData, MediaListSection } from '../links/MediaLinksPage';
import biblesJson from './online-bibles.json';

const Bibles = () => {
  const breadcrumbsUrls = [routes.info(), routes.info('bibles')];

  const { pageBackground } = usePagesMeta();

  return (
    <Page
      title={getTitle(routes.info('bibles'))}
      breadcrumbsUrls={breadcrumbsUrls}
      background={pageBackground}
      relatedPosts={{
        heading: 'Полезно',
        blocks: [
          {
            title: 'Аудио Библии',
            url: routes.resources('audio', 'bible'),
            category: 'Аудио ресурси'
          }
        ]
      }}
    >
      <MediaListSection sections={biblesJson as LinksData[]} doubleSpace />
    </Page>
  );
};
export default Bibles;
