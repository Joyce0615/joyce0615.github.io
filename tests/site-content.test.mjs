import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const resumeHtml = await readFile(new URL('resume.html', root), 'utf8');

test('uses the agreed positioning and publication status', () => {
  assert.match(html, /Applied AI &amp; Agent Systems Engineer/);
  assert.match(html, /Accepted · Forthcoming/);
  assert.match(html, /IEEE CCET 2026/);
  assert.doesNotMatch(html, /20K\+/);
});

test('uses June Xie contact details without LinkedIn', () => {
  for (const page of [html, resumeHtml]) {
    assert.match(page, /June Xie/);
    assert.doesNotMatch(page, /Joyce Xie|Dongjun Xie/i);
    assert.doesNotMatch(page, /linkedin(?:\.com)?/i);
  }

  assert.match(html, /\+1-213-477-3071/);
  assert.match(html, /tel:\+12134773071/);
  assert.match(html, /mailto:joycexie0615@gmail\.com/);
});

for (const project of [
  'Agent Bridge',
  'Agent Hook',
  'AgentFlow',
  'In-Context Search',
  'Kaggle Team',
  'jsfetch',
]) {
  test(`shows ${project}`, () => {
    assert.match(html, new RegExp(project));
  });
}

test('links only repositories that are publicly reachable', () => {
  assert.doesNotMatch(html, /github\.com\/Joyce0615\/(agentflow|agent-bridge-rs|agent-hook|kaggle-team)/);
  assert.match(html, /https:\/\/github\.com\/Joyce0615\/chrome-in-context-search/);
  assert.match(html, /https:\/\/github\.com\/Joyce0615\/jsfetch/);

  const links = [
    ...html.matchAll(
      /<a[^>]+href="https:\/\/github\.com\/Joyce0615\/[^\"]+"[^>]*>/g,
    ),
  ];
  assert.equal(links.length, 2);
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

test('offers both tailored resumes', async () => {
  assert.match(resumeHtml, /AI \/ LLM Systems/);
  assert.match(resumeHtml, /FDE \/ Applied AI/);
  assert.match(resumeHtml, /June_Xie_Resume_2026_AI_LLM_Systems\.pdf/);
  assert.match(resumeHtml, /June_Xie_Resume_2026_FDE_Applied_AI\.pdf/);

  await access(
    new URL('assets/resumes/June_Xie_Resume_2026_AI_LLM_Systems.pdf', root),
  );
  await access(
    new URL('assets/resumes/June_Xie_Resume_2026_FDE_Applied_AI.pdf', root),
  );
});
