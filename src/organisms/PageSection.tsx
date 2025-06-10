import {
  BreakoutBlock,
  BreakoutBlockProps
} from 'alps-library/molecules/blocks/breackoutBlock/BreakoutBlock';
import { Aside } from 'alps-library/organisms/asides/aside/Aside';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import { getBreadcrumbs } from 'src/utils/Navigation';

export interface PageSectionProps {
  children?: React.ReactNode;
  breadcrumbsUrls?: string[];
  /**
   * Specify breakout inside sideBar
   */
  breakout?: BreakoutBlockProps;
  aside?: React.ReactNode;
}

//see BasicPage from alps
export const PageSection = ({
  breadcrumbsUrls = [],
  children,
  breakout,
  aside
}: PageSectionProps): JSX.Element => {
  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);
  const hasSidebar = aside || breakout;
  return (
    <section
      className={`l-main__content u-padding--zero--sides u-spacing--double--until-xxlarge l-grid l-grid--7-col l-grid-wrap l-grid-wrap--6-of-7 u-shift--left--1-col--at-${
        hasSidebar ? 'xxlarge' : 'large'
      }`}
      id="top"
    >
      <section
        className={`c-article l-grid-item l-grid-item--l--4-col ${
          hasSidebar ? 'l-grid-item--xl--3-col' : ''
        }`}
      >
        <div className="c-article__body">
          <PageContent breadcrumbs={breadcrumbs}>{children}</PageContent>
        </div>
      </section>
      {hasSidebar && (
        <div
          className={
            'c-sidebar u-padding--zero--sides u-spacing l-grid-item l-grid-item--l--2-col l-grid-item--xl--2-col'
          }
        >
          {breakout && <BreakoutBlock {...breakout} />}
          {aside && <Aside>{aside}</Aside>}
          {/* {relatedPosts && <RelatedPosts {...relatedPosts} />} */}
        </div>
      )}
    </section>
  );
};
