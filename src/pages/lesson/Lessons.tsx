import routes from '../../routes';
import { getBreadcrumbs, getTitle } from 'src/utils/Navigation';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import { getCurrentLesson } from './LessonUtils';
import LessonQuarterBlock from './LessonQuarterBlock';

const Lessons = () => {
  const breadcrumbsUrls = [routes.churchLife(), routes.churchLife('lessons')];
  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);

  const lessonParams = getCurrentLesson();
  const {
    year: lessonYear,
    quarter: lessonQuarter,
    lessonNumber
  } = lessonParams;
  const params = { lessonYear, lessonQuarter, lessonNumber };

  return (
    <>
      <PageHeaderLong title={getTitle(routes.churchLife('lessons'))} />
      <PageContent breadcrumbs={breadcrumbs}>
        <LessonQuarterBlock {...params} />
        <LessonQuarterBlock {...params} type="cq" />
        <LessonQuarterBlock {...params} type="cc" />
      </PageContent>
    </>
  );
};
export default Lessons;
