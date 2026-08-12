import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { RouteError } from './routes/RouteError';
import { NotFound } from './routes/NotFound';
import { RouteLoading } from './components/RouteLoading';

const Home = lazy(() => import('./routes/Home'));
const Movies = lazy(() => import('./routes/Movies'));
const Characters = lazy(() => import('./routes/Characters'));
const Timeline = lazy(() => import('./routes/Timeline'));
const Search = lazy(() => import('./routes/Search'));
const About = lazy(() => import('./routes/About'));

const DashboardPage = lazy(() => import('./routes/app/DashboardPage'));
const ExplorePage = lazy(() => import('./routes/app/ExplorePage'));
const LibraryPage = lazy(() => import('./routes/app/LibraryPage'));
const SettingsPage = lazy(() => import('./routes/app/SettingsPage'));

const ShellShowcase = lazy(() => import('./routes/ShellShowcase'));
const RoutingShowcase = lazy(() => import('./routes/RoutingShowcase'));

const PageFallback = () => <RouteLoading label="Loading route view..." />;

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <RouteError />,
    children: [
      // Public Routes
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'movies',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Movies />
          </Suspense>
        ),
      },
      {
        path: 'characters',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Characters />
          </Suspense>
        ),
      },
      {
        path: 'timeline',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Timeline />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Search />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageFallback />}>
            <About />
          </Suspense>
        ),
      },

      // Application Shell Routes
      {
        path: 'app',
        element: <AppLayout />,
        errorElement: <RouteError />,
        children: [
          {
            index: true,
            element: <Navigate to="/app/dashboard" replace />,
          },
          {
            path: 'dashboard',
            handle: {
              title: 'Dashboard',
              breadcrumb: 'Dashboard',
              navigationKey: 'dashboard',
            },
            element: (
              <Suspense fallback={<PageFallback />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: 'explore',
            handle: {
              title: 'Explore Engine',
              breadcrumb: 'Explore Engine',
              navigationKey: 'explore',
            },
            element: (
              <Suspense fallback={<PageFallback />}>
                <ExplorePage />
              </Suspense>
            ),
          },
          {
            path: 'library',
            handle: {
              title: 'Asset Library',
              breadcrumb: 'Asset Library',
              navigationKey: 'library',
            },
            element: (
              <Suspense fallback={<PageFallback />}>
                <LibraryPage />
              </Suspense>
            ),
          },
          {
            path: 'settings',
            handle: {
              title: 'System Settings',
              breadcrumb: 'System Settings',
              navigationKey: 'settings',
            },
            element: (
              <Suspense fallback={<PageFallback />}>
                <SettingsPage />
              </Suspense>
            ),
          },
        ],
      },

      // Development Showcase Routes
      {
        path: 'showcase/shell',
        element: (
          <Suspense fallback={<PageFallback />}>
            <ShellShowcase />
          </Suspense>
        ),
      },
      {
        path: 'showcase/routing',
        element: <AppLayout />,
        errorElement: <RouteError />,
        children: [
          {
            index: true,
            handle: {
              title: 'Routing Showcase',
              breadcrumb: 'Routing Showcase',
              navigationKey: 'showcase',
            },
            element: (
              <Suspense fallback={<PageFallback />}>
                <RoutingShowcase />
              </Suspense>
            ),
          },
        ],
      },

      // Wildcard 404 Route
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
