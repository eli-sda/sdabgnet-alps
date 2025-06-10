import { PageLinkItem } from './PageLinkItem';
import { Grid } from 'alps-library/atoms/grids/Grid';
import {
  getTitle,
  primaryNavigationItems,
  getBreadcrumbs
} from 'src/utils/Navigation';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import { useLocation } from 'react-router-dom';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageMetaType } from 'src/utils/PageMeta';
import { PageContent } from 'src/alps/organisms/content/PageContent';

export const PageWithSubpages = ({breadcrumbsUrls}:{breadcrumbsUrls: string[]}) => {
  const { getMetaMap } = usePagesMeta();
  const location = useLocation();
  const path = location.pathname;

  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);
  const title = getTitle(path);

  const mainNavItem = primaryNavigationItems.find((item) => item.url === path);
  const subnav = mainNavItem?.subnav || [];

  const subnavPaths: string[] = subnav
    .map((item) => item.url)
    .filter((url): url is string => Boolean(url));

  const metaMap = getMetaMap(subnavPaths);

  return (
    <>
      <PageHeaderLong title={title} />
      <PageContent breadcrumbs={breadcrumbs}></PageContent>
      <Grid
        className={'l-grid l-grid--7-col l-grid-wrap l-grid-wrap--6-of-7'}
        seven={true}
        as="section"
        wrap={'6'}
      >
        {Object.values(metaMap).map(
          ({ path, title, description }: PageMetaType, idx) => (
            <PageLinkItem
              key={idx}
              url={path}
              title={title}
              description={description}
            />
          )
        )}
      </Grid>
    </>
  );
};
