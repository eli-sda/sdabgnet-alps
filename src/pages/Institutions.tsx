import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { LinksData, SectionList } from './links/MediaLinksPage';
import { getTitle } from 'src/utils/Navigation';
import institutionsLinks from './institutions.json';

const Institutions = (): JSX.Element => {
  const breadcrumbsUrls = [routes.info(), routes.info('institutions')];
  return (
    <Page
      title={getTitle(routes.info('institutions'))}
      breadcrumbsUrls={breadcrumbsUrls}
      relatedPosts={{
        heading: 'Други връзки',
        blocks: [
          {
            title: getTitle(routes.media('radio')),
            url: routes.media('radio'),
            category: getTitle(routes.media())
          },
          {
            title: getTitle(routes.media('tv')),
            url: routes.media('tv'),
            category: getTitle(routes.media())
          }
        ]
      }}
    >
      <SectionList
        sections={institutionsLinks as LinksData[]}
        doubleSpace={false}
      />
    </Page>
  );
};

export default Institutions;
