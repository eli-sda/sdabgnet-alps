import routes from './routes';
import { lazy, Suspense, useEffect } from 'react';
import {
  Routes,
  Route,
  BrowserRouter,
  useLocation,
  Navigate
} from 'react-router-dom';

import Layout from './layout/Layout';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLessonUtils } from './hooks/useLessonUtils';

const NotFound = lazy(() => import('./pages/NotFound'));
const Home = lazy(() => import('./pages/Home'));
const Lessons = lazy(() => import('./pages/lesson/Lessons'));
const Lesson = lazy(() => import('./pages/lesson/Lesson'));
const Churches = lazy(() => import('./pages/Churches'));
const Books = lazy(() => import('./pages/Books'));
const Events = lazy(() => import('./pages/Events'));
const HealthInstitutions = lazy(() => import('./pages/HealthInstitutions'));
const ChurchLife = lazy(() => import('./pages/ChurchLife'));
const Info = lazy(() => import('./pages/Info'));
const Commune = lazy(() => import('./pages/Commune'));
const PastorOnline = lazy(() => import('./pages/pastorOnline/PastorOnline'));
const Media = lazy(() => import('./pages/Media'));
const Resources = lazy(() => import('./pages/Resources'));
const Health = lazy(() => import('./pages/Health'));
const Advertisements = lazy(
  () => import('./pages/advertisement/Advertisements')
);
const AdvertisementPage = lazy(
  () => import('./pages/advertisement/AdvertisementPage')
);
const Contact = lazy(() => import('./pages/Contact'));

// const theme = createTheme();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const RedirectToCurrentLesson = ({ basePath }: { basePath: string }) => {
  const { currentLessonParameters } = useLessonUtils();
  const { lessonYear, lessonQuarter, lessonNumber } = currentLessonParameters;

  return (
    <Navigate
      to={`${basePath}/${lessonYear % 100}/${lessonQuarter}/${lessonNumber}`}
      replace
    />
  );
};

const Router = () => (
  <Suspense fallback={<h2>Зареждане...</h2>}>
    <BrowserRouter>
      {/* <ThemeProvider theme={theme}> */}
      <ScrollToTop />
      <Routes>
        <Route path={routes.home} element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/index.html" element={<Home />} />
          {/* churchLife */}
          <Route path={routes.lesson} element={<Lesson />} />
          <Route path={routes.lesson_cq} element={<Lesson type="cq" />} />
          <Route path={routes.lesson_cc} element={<Lesson type="cc" />} />
          <Route
            path={routes.churchLife('lesson')}
            element={
              <RedirectToCurrentLesson basePath={routes.churchLife('lesson')} />
            }
          />
          <Route
            path={routes.churchLife('lesson-cq')}
            element={
              <RedirectToCurrentLesson
                basePath={routes.churchLife('lesson-cq')}
              />
            }
          />
          <Route
            path={routes.churchLife('lesson-cc')}
            element={
              <RedirectToCurrentLesson
                basePath={routes.churchLife('lesson-cc')}
              />
            }
          />
          <Route path={routes.churchLife('lessons')} element={<Lessons />} />
          <Route path={routes.churchLife('events')} element={<Events />} />
          <Route path={routes.churchLife()} element={<ChurchLife />} />

          <Route path={routes.commune()} element={<Commune />} />
          <Route
            path={routes.commune('pastor-online')}
            element={<PastorOnline />}
          />

          <Route path={routes.churches} element={<Churches />} />
          <Route path={routes.info('churches')} element={<Churches />} />
          <Route path={routes.info()} element={<Info />} />

          <Route path={routes.media()} element={<Media />} />

          <Route path={routes.resources()} element={<Resources />} />
          <Route path={routes.resources('books')} element={<Books />} />

          <Route path={routes.health()} element={<Health />} />

          <Route path={routes.advertisement()} element={<Advertisements />} />

          <Route
            path={routes.advertisement('buySell')}
            element={<AdvertisementPage type="buySell" />}
          />
          <Route
            path={routes.advertisement('services')}
            element={<AdvertisementPage type="services" />}
          />
          <Route
            path={routes.advertisement('other')}
            element={<AdvertisementPage type="other" />}
          />
          <Route
            path={routes.health('institutions')}
            element={<HealthInstitutions />}
          />

          <Route path={routes.contact} element={<Contact />} />

          {/* <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
          </Route> */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      {/* </ThemeProvider> */}
    </BrowserRouter>
  </Suspense>
);
export default Router;
