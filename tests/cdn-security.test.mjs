import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const pages = readdirSync('.').filter(name => name.endsWith('.html'))
  .map(name => ({ name, html: readFileSync(name, 'utf8') }))
  .filter(({ html }) => html.includes('cdn.jsdelivr.net/npm/mermaid@'));

test('all CDN Mermaid versions include the August 2026 security patches', () => {
  assert.equal(pages.length, 6);
  for (const { name, html } of pages) {
    const match = html.match(/mermaid@(\d+)\.(\d+)\.(\d+)\//);
    assert.ok(match, `${name}: pin an exact release`);
    const [, major, minor, patch] = match.map(Number);
    assert.ok((major === 10 && minor === 9 && patch >= 8)
      || (major === 11 && (minor > 16 || (minor === 16 && patch >= 1))), name);
  }
});

test('Mermaid initializers keep strict security enabled', () => {
  for (const { name, html } of pages) {
    const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
      .map(match => match[1]).find(code => code.includes('mermaid.initialize'));
    let config;
    vm.runInNewContext(script.replace(/^\s*import mermaid from [^;]+;/m, ''), {
      mermaid: { initialize: value => { config = value; } },
    });
    assert.equal(config.securityLevel ?? 'strict', 'strict', name);
  }
});

test('classic CDN scripts require SHA-384 integrity and anonymous CORS', () => {
  for (const { name, html } of pages.filter(({ name }) => name.endsWith('Claude-Code.html'))) {
    const tag = html.match(/<script\b[^>]*src="https:\/\/cdn\.jsdelivr\.net\/npm\/mermaid@[^>]+>/)?.[0];
    assert.match(tag, /integrity="sha384-[A-Za-z0-9+/]{64}"/, name);
    assert.match(tag, /crossorigin="anonymous"/, name);
  }
});
