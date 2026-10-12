import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('dom-theme - globals.css binds body to canvas and text design tokens', () => {
  const globalsCssPath = path.resolve(
    import.meta.dirname,
    '../src/styles/globals.css'
  );
  const content = fs.readFileSync(globalsCssPath, 'utf-8');

  assert.equal(
    content.includes('background-color: var(--color-bg-canvas);'),
    true,
    'globals.css must set body background-color to var(--color-bg-canvas)'
  );
  assert.equal(
    content.includes('color: var(--color-text-primary);'),
    true,
    'globals.css must set body color to var(--color-text-primary)'
  );
});

test('dom-theme - tokens.css defines distinct tokens preventing light theme white-on-white text', () => {
  const tokensCssPath = path.resolve(
    import.meta.dirname,
    '../src/styles/tokens.css'
  );
  const content = fs.readFileSync(tokensCssPath, 'utf-8');

  // Verify dark tokens
  assert.equal(
    content.includes('--color-bg-canvas: var(--color-obsidian-900);'),
    true
  );
  assert.equal(
    content.includes('--color-text-primary: var(--color-obsidian-100);'),
    true
  );

  // Verify light theme overrides
  const lightBlock =
    content.split("[data-theme='light']")[1]?.split('}')[0] ?? '';
  assert.equal(
    lightBlock.includes('--color-bg-canvas: #f8fafc;'),
    true,
    'Light theme canvas must be light background (#f8fafc)'
  );
  assert.equal(
    lightBlock.includes('--color-text-primary: var(--color-obsidian-950);'),
    true,
    'Light theme text must be dark primary text (obsidian-950), preventing white-on-white contrast failures'
  );
});
