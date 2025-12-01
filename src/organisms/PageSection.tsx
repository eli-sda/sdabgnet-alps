import {
  BreakoutBlock,
  BreakoutBlockProps
} from 'alps-library/molecules/blocks/breackoutBlock/BreakoutBlock';
import { Aside } from 'alps-library/organisms/asides/aside/Aside';
import { ArticleContent } from 'alps-library/organisms/content/articleContent/ArticleContent';
import { Grid } from 'alps-library/atoms/grids/Grid';
import {
  RelatedPosts,
  RelatedPostsProps
} from 'src/alps/organisms/asides/RelatedPosts';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import { getBreadcrumbs } from 'src/utils/Navigation';
import { ArchiveContent } from './Content/ArchiveContent';

export type PageSectionBlockType = 'archive' | 'article' | 'wrap6';

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
  blockType?: PageSectionBlockType;
  pageClassName?: string;
}

//see BasicPage from alps
export const PageSection = ({
  breadcrumbsUrls = [],
  children,
  breakout,
  aside,
  relatedPosts,
  blockType,
  pageClassName = ''
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
        <ArticleContent
          sidebar={sidebar}
          hasDropcap={false}
          pageClassName={pageClassName}
        >
          {children}
        </ArticleContent>
      )}
      {blockType == 'archive' && (
        <ArchiveContent sidebar={sidebar} pageClassName={pageClassName}>
          {children}
        </ArchiveContent>
      )}
      {blockType == 'wrap6' && (
        <Grid
          className={`l-grid l-grid--7-col l-grid-wrap l-grid-wrap--6-of-7 ${pageClassName}`}
          seven={true}
          as="section"
          wrap={'6'}
        >
          {children}
        </Grid>
      )}
      {blockType == undefined && (!!children || !!aside) && (
        <section
          className={`l-main__content u-padding--zero--sides u-spacing--double--until-large l-grid l-grid--7-col l-grid-wrap l-grid-wrap--6-of-7 u-shift--left--1-col--at-${
            hasSidebar ? 'xxlarge' : 'large'
          } ${pageClassName}`}
        >
          <section
            className={`page_cont c-article l-grid-item l-grid-item--l--4-col ${
              hasSidebar ? 'l-grid-item--xl--3-col' : ''
            }`}
          >
            <div className="c-article__body">{children}</div>
          </section>
          {hasSidebar && (
            <div
              className={
                'c-sidebar u-padding--zero--sides u-spacing--double l-grid-item l-grid-item--l--2-col l-grid-item--xl--2-col'
              }
            >
              {sidebar}
            </div>
          )}
        </section>
      )}
    </PageContent>
  );
};
