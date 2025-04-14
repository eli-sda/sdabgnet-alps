import routes from '../../routes';
import { getBreadcrumbs, getTitle } from 'src/utils/Navigation';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import LessonQuarterBlock from './LessonQuarterBlock';
import { useLessonUtils } from 'src/hooks/useLessonUtils';
import { LessonQuarterProvider } from 'src/providers/LessonQuarterProvider';

const Lessons = () => {
  const { currentLessonParameters } = useLessonUtils();

  const breadcrumbsUrls = [routes.churchLife(), routes.churchLife('lessons')];
  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);
  return (
    <>
      <PageHeaderLong title={getTitle(routes.churchLife('lessons'))} />
      <PageContent breadcrumbs={breadcrumbs}>
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
      </PageContent>
    </>
  );
};
export default Lessons;
