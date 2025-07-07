import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import './Page.scss';
import { PageSection, PageSectionBlockType } from './PageSection';
import { BreakoutBlockProps } from 'alps-library/molecules/blocks/breackoutBlock/BreakoutBlock';
import { RelatedPostsProps } from 'src/alps/organisms/asides/RelatedPosts';
import { SourceSet } from 'alps-library/atoms/images/SourceSet';

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
  background?: SourceSet;
  blockType?: PageSectionBlockType;
}

export const Page = ({
  title,
  kicker,
  subtitle,
  breadcrumbsUrls = [],
  children,
  breakout,
  aside,
  relatedPosts,
  background,
  blockType
}: PageProps): JSX.Element => {
  return (
    <>
      <PageHeaderLong
        title={title}
        kicker={kicker}
        subtitle={subtitle}
        background={background}
      />
      <PageSection
        breadcrumbsUrls={breadcrumbsUrls}
        breakout={breakout}
        aside={aside}
        relatedPosts={relatedPosts}
        blockType={blockType}
      >
        {children}
      </PageSection>
    </>
  );
};
