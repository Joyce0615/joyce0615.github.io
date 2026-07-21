# Personal Website Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh Joyce's static website around a coherent Applied AI and Agent Systems narrative, connect six public projects and the forthcoming paper, and expose both tailored resumes.

**Architecture:** Keep the existing static site and responsive JavaScript behavior. Update editorial structure and project cards in `index.html`, convert `resume.html` into a two-version chooser, copy verified PDFs into a dedicated asset directory, and add DOM-string tests for copy, links, and status accuracy.

**Tech Stack:** HTML5, Tailwind CDN, vanilla JavaScript, Node built-in test runner, Python HTTP server, in-app browser.

## Global Constraints

- Retain the current dark visual identity and static HTML architecture.
- Headline: "Applied AI & Agent Systems Engineer."
- Link public work to `https://github.com/Joyce0615/<repository>`.
- Label the IEEE CCET 2026 paper "Accepted · Forthcoming" and provide no manuscript link.
- Remove unverifiable vanity metrics.
- Preserve responsive navigation, keyboard-visible interactions, semantic headings, useful alt text, and sufficient contrast.
- Present SiriusMindshare as one applied-AI role with production multi-agent and LVLM research workstreams.

---

### Task 1: Add website content contract tests

**Files:**
- Create: `/Users/jinzhenghui/2026/Joyce/personal-website/tests/site-content.test.mjs`
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/index.html`

**Interfaces:**
- Produces: source-level acceptance checks for the home and resume pages.

- [ ] **Step 1: Write the failing test.**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');

test('uses the agreed positioning and publication status', () => {
  assert.match(html, /Applied AI &amp; Agent Systems Engineer/);
  assert.match(html, /Accepted · Forthcoming/);
  assert.match(html, /IEEE CCET 2026/);
  assert.doesNotMatch(html, /20K\+/);
});

for (const repo of ['agent-bridge-rs', 'agent-hook', 'agentflow', 'chrome-in-context-search', 'kaggle-team', 'jsfetch']) {
  test(`links ${repo}`, () => {
    assert.match(html, new RegExp(`https://github\\.com/Joyce0615/${repo}`));
  });
}
```

- [ ] **Step 2: Run `node --test tests/site-content.test.mjs`; expect failure on new positioning, publication, and repository links.**
- [ ] **Step 3: Replace the title, hero, and About copy with the agreed Applied AI and agent-systems narrative.**
- [ ] **Step 4: Remove the code-line, project-count, and agent-count vanity badges.**
- [ ] **Step 5: Rerun the test; headline and vanity-stat assertions should pass while unfinished sections still fail.**

### Task 2: Rebuild featured and open-source project sections

**Files:**
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/index.html`
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/tests/site-content.test.mjs`

**Interfaces:**
- Consumes: evidence from local project READMEs.
- Produces: three detailed featured cards and compact cards for remaining repositories.

- [ ] **Step 1: Add an assertion that at least six descriptive GitHub anchors point to Joyce's repositories and open in a new tab.**
- [ ] **Step 2: Run the test and verify failure.**
- [ ] **Step 3: Feature AgentFlow and Agent Bridge with evidence-backed architecture details; retain AI Team Builder or AI Diary as the third visual case study only where its existing screenshots match.**
- [ ] **Step 4: Add compact Agent Hook, Chrome In-Context Search, Kaggle Team, and jsfetch cards with problem statement, concrete capabilities, technology tags, and public links.**
- [ ] **Step 5: Run `node --test tests/site-content.test.mjs`; expect all repository assertions to pass.**
- [ ] **Step 6: Commit with `git commit -m "feat: showcase agent systems portfolio"`.**

### Task 3: Connect SiriusMindshare experience and publication

**Files:**
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/index.html`
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/tests/site-content.test.mjs`

**Interfaces:**
- Produces: one Experience entry with two connected applied-AI workstreams and one publication card.

- [ ] **Step 1: Add tests for the exact paper title, accepted/presentation wording, forthcoming badge, absence of a manuscript link, and absence of "published at IEEE."**
- [ ] **Step 2: Run the test and verify failure because the publication section is absent.**
- [ ] **Step 3: Rewrite SiriusMindshare as applied-AI systems work spanning production multi-agent engineering and LVLM retail research; do not state that the paper uses multi-agent orchestration.**
- [ ] **Step 4: Add a Publications navigation item and section with the exact title, conference, and `Accepted · Forthcoming` badge.**
- [ ] **Step 5: Run tests and commit with `git commit -m "feat: connect applied AI work and IEEE research"`.**

### Task 4: Add the two verified resume downloads

**Files:**
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/resume.html`
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/index.html`
- Create: `/Users/jinzhenghui/2026/Joyce/personal-website/assets/resumes/Dongjun_Xie_Resume_2026_AI_LLM_Systems.pdf`
- Create: `/Users/jinzhenghui/2026/Joyce/personal-website/assets/resumes/Dongjun_Xie_Resume_2026_FDE_Applied_AI.pdf`
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/tests/site-content.test.mjs`

**Interfaces:**
- Consumes: verified PDFs from the resume plan.
- Produces: stable website download URLs.

- [ ] **Step 1: Add tests that `resume.html` contains AI / LLM Systems and FDE / Applied AI labels plus both exact PDF filenames.**
- [ ] **Step 2: Run tests and verify failure.**
- [ ] **Step 3: Copy the verified one-page PDFs into `assets/resumes/` without renaming.**
- [ ] **Step 4: Convert `resume.html` into two concise role-targeted cards with View/Download actions and a home-page link.**
- [ ] **Step 5: Relabel home-page resume actions as "Choose Resume" and point them to `resume.html`.**
- [ ] **Step 6: Run tests and commit with `git commit -m "feat: add tailored resume downloads"`.**

### Task 5: Accessibility, localhost, and browser verification

**Files:**
- Modify if defects are found: `/Users/jinzhenghui/2026/Joyce/personal-website/index.html`
- Modify if defects are found: `/Users/jinzhenghui/2026/Joyce/personal-website/resume.html`

**Interfaces:**
- Produces: verified localhost site opened for user review.

- [ ] **Step 1: Run `node --test tests/site-content.test.mjs`, `git diff --check`, and `git status --short`; expect passing tests and only intended changes.**
- [ ] **Step 2: Start `python -m http.server 4173 --bind 127.0.0.1`.**
- [ ] **Step 3: Inspect desktop layout, navigation, all project cards, Experience-to-Publication continuity, both resume paths, image loading, keyboard focus, and console output in the in-app browser.**
- [ ] **Step 4: Inspect a 390 x 844 mobile viewport, including the menu, section links, card wrapping, horizontal overflow, and resume chooser.**
- [ ] **Step 5: Fix defects and rerun static tests plus desktop/mobile inspection after each change.**
- [ ] **Step 6: Commit final fixes with `git commit -m "fix: polish responsive portfolio presentation"`.**
- [ ] **Step 7: Leave the final localhost homepage open for user review.**

