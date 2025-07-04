import {
  BreakoutBlock,
  BreakoutBlockProps
} from 'alps-library/molecules/blocks/breackoutBlock/BreakoutBlock';
import { Aside } from 'alps-library/organisms/asides/aside/Aside';
import { ArticleContent } from 'alps-library/organisms/content/articleContent/ArticleContent';
import {
  RelatedPosts,
  RelatedPostsProps
} from 'src/alps/organisms/asides/RelatedPosts';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import { getBreadcrumbs } from 'src/utils/Navigation';
import { ArchiveContent } from './Content/ArchiveContent';

export interface PageSectionProps {
  children?: React.ReactNode;
  breadcrumbsUrls?: string[];
  /**
   * Specify breakout inside sideBar
   */
  breakout?: BreakoutBlockProps;
  /**
   * Specify aside inside sideBar
   */
  aside?: React.ReactNode;
  /**
   * Specify relatedPosts inside sideBar
   */
  relatedPosts?: RelatedPostsProps;
  blockType?: 'archive' | 'article';
}

//see BasicPage from alps
export const PageSection = ({
  breadcrumbsUrls = [],
  children,
  breakout,
  aside,
  relatedPosts,
  blockType='article'
}: PageSectionProps): JSX.Element => {
  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);
  const hasSidebar = aside || breakout || relatedPosts;

  const sidebar = hasSidebar && (
    <>
      {breakout && <BreakoutBlock {...breakout} />}
      {aside && <Aside>{aside}</Aside>}
      {relatedPosts && <RelatedPosts {...relatedPosts} />}
    </>
  );

  return (
    <PageContent breadcrumbs={breadcrumbs}>
      {blockType == 'article' && (
        <ArticleContent sidebar={sidebar}>{children}</ArticleContent>
      )}
      {blockType == 'archive' && (
        <ArchiveContent sidebar={sidebar}>{children}</ArchiveContent>
      )}
    </PageContent>
  );
};
