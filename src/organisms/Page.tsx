import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
// import { Text } from 'alps-library/atoms/text/Text';
import './Page.scss';
import { PageSection } from './PageSection';
import { BreakoutBlockProps } from 'alps-library/molecules/blocks/breackoutBlock/BreakoutBlock';

export interface PageProps {
  children?: React.ReactNode;
  breadcrumbsUrls?: string[];
  kicker?: string;
  title: string;
  subtitle?: string;
  url?: string; //url from router to determinate the breadcrumbs
  breakout?: BreakoutBlockProps;
  aside?: React.ReactNode;
}

export const Page = ({
  title,
  kicker,
  subtitle,
  breadcrumbsUrls = [],
  children,
  breakout,
  aside
}: PageProps): JSX.Element => {
  return (
    <>
      <PageHeaderLong title={title} kicker={kicker} subtitle={subtitle} />
      <PageSection
        breadcrumbsUrls={breadcrumbsUrls}
        breakout={breakout}
        aside={aside}
      >
        {children}
      </PageSection>
    </>
  );
};
