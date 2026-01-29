import { useLocation } from 'react-router-dom';
import { PageMetaType } from 'src/utils/PageMeta';
import { getTitle, findMenuItemByUrl } from 'src/utils/Navigation';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import { Page } from './Page';
import { PageLinkItem } from './PageLinkItem';

export const PageWithSubpages = ({
  breadcrumbsUrls
}: {
  breadcrumbsUrls: string[];
}) => {
  const { getMetaMap } = usePagesMeta();
  const location = useLocation();
  const path = location.pathname;

  const title = getTitle(path);

  const mainNavItem = findMenuItemByUrl(path);
  const subnav = mainNavItem?.subnav || [];

  // show only non-disabled subnav items
  const subnavPaths: string[] = subnav
    .filter((item) => !item.isDisabled)
    .map((item) => item.url)
    .filter((url): url is string => Boolean(url));

  const metaMap = getMetaMap(subnavPaths);

  return (
    <Page
      title={title}
      breadcrumbsUrls={breadcrumbsUrls}
      blockType="wrap6"
      pageClassName="full-page"
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
    </Page>
  );
};
