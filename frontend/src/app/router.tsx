import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./routes/Home'));
const Movies = lazy(() => import('./routes/Movies'));
const Characters = lazy(() => import('./routes/Characters'));
const Timeline = lazy(() => import('./routes/Timeline'));
const Search = lazy(() => import('./routes/Search'));
const About = lazy(() => import('./routes/About'));

const PageLoader = () => <div>Loading...</div>;

export const router = createBrowserRouter([
  { path: '/', element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
  { path: '/movies', element: <Suspense fallback={<PageLoader />}><Movies /></Suspense> },
  { path: '/characters', element: <Suspense fallback={<PageLoader />}><Characters /></Suspense> },
  { path: '/timeline', element: <Suspense fallback={<PageLoader />}><Timeline /></Suspense> },
  { path: '/search', element: <Suspense fallback={<PageLoader />}><Search /></Suspense> },
  { path: '/about', element: <Suspense fallback={<PageLoader />}><About /></Suspense> },
]);
