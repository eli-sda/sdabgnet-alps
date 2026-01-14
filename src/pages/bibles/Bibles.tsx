import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinksData, MediaListSection } from '../links/MediaLinksPage';
import biblesJson from './online-bibles.json';
import { RelatedPosts } from '../../alps/organisms/asides/RelatedPosts';

const Bibles = () => {
  const breadcrumbsUrls = [routes.info(), routes.info('bibles')];

  return (
    <Page
      title={getTitle(routes.info('bibles'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <MediaListSection sections={biblesJson as LinksData[]} doubleSpace />

      <div className="u-space--double--top">
        <RelatedPosts
          heading="Още Библии"
          blocks={[
            {
              title: 'Аудио Библии',
              url: routes.resources('audio', 'bible'),
              category: 'Аудио ресурси'
            }
          ]}
        />
      </div>
    </Page>
  );
};
export default Bibles;
