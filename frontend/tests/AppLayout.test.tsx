import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../src/app/layouts/AppLayout.js';
import { ThemeProvider } from '../src/providers/theme/theme-provider.js';

test('AppLayout - renders without ShellProvider context error on /app route', () => {
  const router = createMemoryRouter(
    [
      {
        path: '/app',
        element: React.createElement(
          ThemeProvider,
          null,
          React.createElement(AppLayout)
        ),
        children: [{ path: 'dashboard', element: null }],
      },
    ],
    { initialEntries: ['/app/dashboard'] }
  );

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(React.createElement(RouterProvider, { router }));
  });

  assert.equal(html.includes('MarvelVerse App'), true);
  assert.equal(html.includes('Dashboard'), true);
});

test('AppLayout - renders without ShellProvider context error on showcase route', () => {
  const router = createMemoryRouter(
    [
      {
        path: '/showcase/routing',
        element: React.createElement(
          ThemeProvider,
          null,
          React.createElement(AppLayout)
        ),
      },
    ],
    { initialEntries: ['/showcase/routing'] }
  );

  let html = '';
  assert.doesNotThrow(() => {
    html = renderToString(React.createElement(RouterProvider, { router }));
  });

  assert.equal(html.includes('MarvelVerse Platform'), true);
});
