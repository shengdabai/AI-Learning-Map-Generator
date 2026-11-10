import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

function loadAtlas({ observer = true, scrollY = 400, height = 1000 } = {}) {
  const styles = new Map();
  const progress = new Map();
  const events = new Map();
  const attributes = new Map();
  const classes = new Set();
  const link = {
    getAttribute: () => '#section',
    setAttribute: (key, value) => attributes.set(key, value),
    removeAttribute: key => attributes.delete(key),
    classList: { toggle: (key, active) => active ? classes.add(key) : classes.delete(key) },
  };
  const section = { id: 'section' };
  let callback;
  const observed = [];
  const context = {
    document: {
      documentElement: { scrollHeight: height, style: { setProperty: (k, v) => styles.set(k, v) } },
      querySelector: () => ({ setAttribute: (k, v) => progress.set(k, v) }),
      querySelectorAll: selector => selector === '.toc a' ? [link] : [section],
    },
    innerHeight: 200,
    scrollY,
    addEventListener: (name, handler) => events.set(name, handler),
  };
  context.window = context;
  if (observer) context.IntersectionObserver = class {
    constructor(handler) { callback = handler; }
    observe(target) { observed.push(target); }
  };
  vm.runInNewContext(readFileSync('assets/mental-model-atlas.js', 'utf8'), context);
  return { styles, progress, events, attributes, classes, callback, observed, section, context };
}

test('progress initializes and updates without IntersectionObserver', () => {
  const atlas = loadAtlas({ observer: false });
  assert.equal(atlas.styles.get('--read'), '50%');
  assert.equal(atlas.progress.get('aria-valuenow'), '50');
  atlas.context.scrollY = 800;
  atlas.events.get('scroll')();
  assert.equal(atlas.styles.get('--read'), '100%');
  atlas.context.scrollY = 200;
  atlas.events.get('resize')();
  assert.equal(atlas.styles.get('--read'), '25%');
});

test('progress stays in range during overscroll and on short pages', () => {
  for (const [options, expected] of [
    [{ scrollY: -50 }, '0'], [{ scrollY: 1000 }, '100'], [{ height: 100 }, '0'],
  ]) {
    const atlas = loadAtlas(options);
    assert.equal(atlas.progress.get('aria-valuenow'), expected);
    assert.equal(atlas.styles.get('--read'), `${expected}%`);
  }
});

test('visible sections still update navigation when IntersectionObserver exists', () => {
  const atlas = loadAtlas();
  assert.deepEqual(atlas.observed, [atlas.section]);
  atlas.callback([{ isIntersecting: true, intersectionRatio: 0.5, target: atlas.section }]);
  assert.equal(atlas.attributes.get('aria-current'), 'location');
  assert.ok(atlas.classes.has('is-active'));
  atlas.callback([{ isIntersecting: true, intersectionRatio: 1, target: { id: 'other' } }]);
  assert.equal(atlas.attributes.has('aria-current'), false);
  assert.equal(atlas.classes.has('is-active'), false);
});
