import routes from './routes';
import { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Layout from './layout/Layout';
import ChurchLife from './pages/ChurchLife';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

const NotFound = lazy(() => import('./pages/NotFound'));
const Home = lazy(() => import('./pages/Home'));
const Lesson = lazy(() => import('./pages/lesson/Lesson'));
const Churches = lazy(() => import('./pages/Churches'));
const Books = lazy(() => import('./pages/Books'));
const Events = lazy(() => import('./pages/Events'));
const HealthInstitutions = lazy(() => import('./pages/HealthInstitutions'));

// const theme = createTheme();

const Router = () => (
  <Suspense fallback={<h2>Зареждане...</h2>}>
    <BrowserRouter>
      {/* <ThemeProvider theme={theme}> */}
      <Routes>
        <Route path={routes.home} element={<Layout />}>
          <Route index element={<Home />} />
          {/* churchLife */}
          <Route path={routes.lesson} element={<Lesson />} />
          <Route path={routes.churchLife('lesson')} element={<Lesson />} />
          <Route path={routes.churchLife('events')} element={<Events />} />
          <Route path={routes.churchLife()} element={<ChurchLife />} />

          <Route path={routes.churches} element={<Churches />} />
          <Route path={routes.info('churches')} element={<Churches />} />
          <Route path={routes.resources('books')} element={<Books />} />
          <Route
            path={routes.health('institutions')}
            element={<HealthInstitutions />}
          />
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
