import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import './Page.scss';
import { PageSection } from './PageSection';
import { BreakoutBlockProps } from 'alps-library/molecules/blocks/breackoutBlock/BreakoutBlock';
import { RelatedPostsProps } from 'src/alps/organisms/asides/RelatedPosts';

export interface PageProps {
  children?: React.ReactNode;
  breadcrumbsUrls?: string[];
  kicker?: string;
  title: string;
  subtitle?: string;
  url?: string; //url from router to determinate the breadcrumbs
  breakout?: BreakoutBlockProps;
  aside?: React.ReactNode;
  relatedPosts?: RelatedPostsProps;
}

export const Page = ({
  title,
  kicker,
  subtitle,
  breadcrumbsUrls = [],
  children,
  breakout,
  aside,
  relatedPosts
}: PageProps): JSX.Element => {
  return (
    <>
      <PageHeaderLong title={title} kicker={kicker} subtitle={subtitle} />
      <PageSection
        breadcrumbsUrls={breadcrumbsUrls}
        breakout={breakout}
        aside={aside}
        relatedPosts={relatedPosts}
      >
        {children}
      </PageSection>
    </>
  );
};
