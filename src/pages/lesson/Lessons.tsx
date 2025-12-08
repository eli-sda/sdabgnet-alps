import routes from '../../routes';

import { getBreadcrumbs, getTitle } from 'src/utils/Navigation';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import LessonQuarterBlock from './LessonQuarterBlock';
import { useLessonUtils } from 'src/hooks/useLessonUtils';
import { LessonQuarterProvider } from 'src/providers/LessonQuarterProvider';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import { OLD_SITE } from 'src/constants';

const Lessons = () => {
  const { currentLessonParameters } = useLessonUtils();

  const breadcrumbsUrls = [routes.churchLife(), routes.churchLife('lessons')];
  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);
  const pageTitle = getTitle(routes.churchLife('lessons'));
  const { pageBackground } = usePagesMeta();

  return (
    <>
      <PageHeaderLong title={pageTitle} background={pageBackground} />
      <PageContent breadcrumbs={breadcrumbs}>
        <section className="u-spacing--triple">
          <LessonQuarterProvider>
            <LessonQuarterBlock
              {...currentLessonParameters}
              showLessonLink={true}
            />{' '}
          </LessonQuarterProvider>

          <LessonQuarterProvider>
            <LessonQuarterBlock
              {...currentLessonParameters}
              type="cq"
              showLessonLink={true}
            />
          </LessonQuarterProvider>

          <LessonQuarterProvider>
            <LessonQuarterBlock
              {...currentLessonParameters}
              type="cc"
              showLessonLink={true}
            />
          </LessonQuarterProvider>

          <h3 className="text u-padding--left">
            Съботно училищните <b>уроци за деца</b> може да намерите{' '}
            <a
              href={`${OLD_SITE}/page.php?id=kids#lessons`}
              target="_blank"
              rel="noopener noreferrer"
            >
              на стария сайт
              <i className="fas fa-external-link-alt u-space--quarter--left"></i>
            </a>
          </h3>
        </section>
      </PageContent>
    </>
  );
};
export default Lessons;
