import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const resumeHtml = await readFile(new URL('resume.html', root), 'utf8');

test('uses the agreed positioning and publication status', () => {
  assert.match(html, /Applied AI &amp; Agent Systems Engineer/);
  assert.match(html, /Accepted · Forthcoming/);
  assert.match(html, /IEEE CCET 2026/);
  assert.doesNotMatch(html, /20K\+/);
});

for (const repo of [
  'agent-bridge-rs',
  'agent-hook',
  'agentflow',
  'chrome-in-context-search',
  'kaggle-team',
  'jsfetch',
]) {
  test(`links ${repo}`, () => {
    assert.match(html, new RegExp(`https://github\\.com/Joyce0615/${repo}`));
  });
}

test('project links are safe and descriptive', () => {
  const links = [
    ...html.matchAll(
      /<a[^>]+href="https:\/\/github\.com\/Joyce0615\/[^\"]+"[^>]*>/g,
    ),
  ];
  assert.ok(links.length >= 6);
  for (const [tag] of links) {
    assert.match(tag, /target="_blank"/);
    assert.match(tag, /rel="noopener noreferrer"/);
  }
});

test('paper is forthcoming and has no manuscript link', () => {
  assert.match(html, /From Aisle Video to Shelf Intelligence/);
  assert.match(html, /accepted for publication and presentation/i);
  assert.doesNotMatch(html, /href="[^"]+"[^>]*>\s*(Paper|PDF|Read paper)/i);
  assert.doesNotMatch(html, /published at IEEE/i);
});

test('offers both tailored resumes', () => {
  assert.match(resumeHtml, /AI \/ LLM Systems/);
  assert.match(resumeHtml, /FDE \/ Applied AI/);
  assert.match(resumeHtml, /Dongjun_Xie_Resume_2026_AI_LLM_Systems\.pdf/);
  assert.match(resumeHtml, /Dongjun_Xie_Resume_2026_FDE_Applied_AI\.pdf/);
});
