import routes from '../../routes';

import { getBreadcrumbs, getTitle } from 'src/utils/Navigation';
import { PageHeader } from 'alps-library/organisms/sections/pageHeader/PageHeader';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import LessonQuarterBlock from './LessonQuarterBlock';
import { useLessonUtils } from 'src/hooks/useLessonUtils';
import { LessonQuarterProvider } from 'src/providers/LessonQuarterProvider';
import { usePagesMeta } from 'src/hooks/usePagesMeta';

const Lessons = () => {
  const { currentLessonParameters } = useLessonUtils();

  const breadcrumbsUrls = [routes.churchLife(), routes.churchLife('lessons')];
  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);
  const pageTitle = getTitle(routes.churchLife('lessons'));
  const { pageBackground } = usePagesMeta();

  return (
    <>
      <PageHeader title={pageTitle} background={pageBackground} />
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
        </section>
      </PageContent>
    </>
  );
};
export default Lessons;
