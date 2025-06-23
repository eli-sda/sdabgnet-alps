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
}

//see BasicPage from alps
export const PageSection = ({
  breadcrumbsUrls = [],
  children,
  breakout,
  aside,
  relatedPosts
}: PageSectionProps): JSX.Element => {
  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);
  const hasSidebar = aside || breakout || relatedPosts;
  return (
    <PageContent breadcrumbs={breadcrumbs}>
      <ArticleContent
        sidebar={
          hasSidebar && (
            <>
              {breakout && <BreakoutBlock {...breakout} />}
              {aside && <Aside>{aside}</Aside>}
              {relatedPosts && <RelatedPosts {...relatedPosts} />}
            </>
          )
        }
      >
        {children}
      </ArticleContent>
    </PageContent>
  );
};
