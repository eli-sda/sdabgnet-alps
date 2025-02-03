import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageContent } from 'alps-library/organisms/content/pageContent/PageContent';
import { BreadcrumbItemProps } from 'src/alps/molecules/navigation/Breadcrumbs';
import { Aside } from 'alps-library/organisms/asides/aside/Aside';
import { getTitle } from 'src/utils/Navigation';
import routes from 'src/routes';
// import { Text } from 'alps-library/atoms/text/Text';
import './Page.scss';

export interface PageProps {
  children?: React.ReactNode;
  breadcrumbsUrls?: string[];
  kicker?: string;
  title: string;
  subtitle?: string;
  url?: string; //url from router to determinate the breadcrumbs
  aside?: React.ReactNode;
}

export const Page = ({
  title,
  kicker,
  subtitle,
  breadcrumbsUrls = [],
  children,
  aside
}: PageProps): JSX.Element => {
  const breadcrumbs: BreadcrumbItemProps[] =
    breadcrumbsUrls.length > 0
      ? [
          {
            text: 'Начало',
            url: routes.home,
            useNavLink: true
          }
        ]
      : [];
  breadcrumbsUrls.forEach((url, i) => {
    breadcrumbs.push({
      text: getTitle(url),
      url: i === breadcrumbsUrls.length - 1 ? undefined : url,
      useNavLink: true
    });
  });

  return (
    <>
      <PageHeaderLong title={title} kicker={kicker} subtitle={subtitle} />
      <section
        className={`l-main__content u-padding--zero--sides u-spacing--double--until-xxlarge l-grid l-grid--7-col l-grid-wrap l-grid-wrap--6-of-7 
        u-shift--left--1-col--at-${aside ? 'xxlarge' : 'large'}`}
        id="top"
      >
        <section
          className={`c-article l-grid-item l-grid-item--l--4-col ${
            aside ? 'l-grid-item--xl--3-col' : ''
          }`}
        >
          <div className="c-article__body">
            <PageContent breadcrumbs={breadcrumbs}>{children}</PageContent>
          </div>
        </section>

        {aside && (
          <div
            className={
              'c-sidebar u-padding--zero--sides u-spacing l-grid-item l-grid-item--l--2-col l-grid-item--xl--2-col'
            }
          >
            {/* {breakout && <BreakoutBlock {...breakout} />} */}
            {aside && <Aside>{aside}</Aside>}
            {/* {relatedPosts && <RelatedPosts {...relatedPosts} />} */}
          </div>
        )}
      </section>
    </>
  );
};
