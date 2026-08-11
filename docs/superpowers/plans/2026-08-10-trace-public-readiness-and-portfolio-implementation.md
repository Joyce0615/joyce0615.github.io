# Trace Public Readiness and Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sanitize Trace for a future public GitHub release, create a clean local Git baseline with verified tutorial screenshots, and add Trace to June Xie's website as the approved full-width flagship project.

**Architecture:** Keep release-safety logic in a reusable Node scanner, make Electron smoke tests self-contained, regenerate documentation images from the sanitized app, and copy only approved images into the static portfolio. The Trace repository remains local with no remote; the website receives a local commit but is not pushed.

**Tech Stack:** Electron 43, React 19, TypeScript 5.9, Vite 8, Monaco Editor, Node test runner, Playwright, static HTML/Tailwind CDN portfolio.

## Global Constraints

- Product name: `Trace`; descriptor: `Codebase Learning Studio`.
- Website layout: approved Option A, a full-width flagship card first in `Featured Systems`.
- Website images: sanitized screenshots 01, 03, and 05.
- Website status: `Private preview · GitHub release forthcoming`; no Trace GitHub link exists yet.
- Replace `/Users/bjin/GitHub/flashinfer`, `BJ`, and private local repository state; retain public nano-vllm, FlashInfer, Codex, and Claude references when useful.
- Do not commit the original unsanitized screenshots or any file containing a forbidden finding.
- Do not create a GitHub repository, configure a Trace remote, push Trace, or push the website.
- Preserve synthetic security fixtures such as `trace@example.com`, localhost URLs, and deliberate traversal tests through narrow scanner rules.
- If `npm audit` reports a vulnerability, record and resolve or explicitly block publication; do not suppress it.

---

### Task 1: Add the Public-Safety Gate and Sanitize Source Text

**Files:**
- Create: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/scripts/public-safety.mjs`
- Create: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tests/public-safety.test.mjs`
- Modify: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/package.json:8-16`
- Modify: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/.gitignore:1-5`
- Modify: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/README.md:43-51`
- Modify: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/src/App.tsx:865-875`

**Interfaces:**
- Produces: `scanPublicTree(rootPath: string): Promise<Violation[]>`, `scanPublicPaths(rootPath: string, relativePaths: string[]): Promise<Violation[]>`, and CLI modes `node scripts/public-safety.mjs` / `node scripts/public-safety.mjs --staged`.
- `Violation` is `{ path: string, rule: string, line?: number }`; output never echoes a credential-shaped value.
- Later tasks rely on `npm run scan:public` and `node scripts/public-safety.mjs --staged`.

- [ ] **Step 1: Write failing scanner tests**

Create `tests/public-safety.test.mjs` with three behaviors: detection, narrow synthetic-fixture handling, and a clean-tree assertion.

```js
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { scanPublicTree } from "../scripts/public-safety.mjs";

test("detects machine paths, personal initials, credential filenames, and credential shapes", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "trace-public-safety-"));
  try {
    await mkdir(path.join(root, "src"));
    await writeFile(path.join(root, "src", "bad.txt"), ["/Users", "private", "repo"].join("/") + "\n" + ["B", "J"].join(""));
    await writeFile(path.join(root, ".env.production"), "KEY=" + ["ghp", "x".repeat(36)].join("_"));
    const violations = await scanPublicTree(root);
    assert.deepEqual(new Set(violations.map((item) => item.rule)), new Set(["absolute-home-path", "personal-initials", "credential-file", "github-token"]));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("allows explicit public and synthetic fixtures", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "trace-public-allow-"));
  try {
    await writeFile(path.join(root, ".env.example"), "TRACE_URL=http://127.0.0.1:5173\n");
    await writeFile(path.join(root, "fixture.txt"), "trace@example.com\n/tmp/trace-practice/example\n");
    assert.deepEqual(await scanPublicTree(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("the Trace release tree contains no public-safety violations", async () => {
  assert.deepEqual(await scanPublicTree(path.resolve(".")), []);
});
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
node --test tests/public-safety.test.mjs
```

Expected: FAIL because `scripts/public-safety.mjs` does not exist.

- [ ] **Step 3: Implement the reusable scanner**

Create `scripts/public-safety.mjs`. Walk regular files while skipping `.git`, `node_modules`, `dist`, `.trace`, runtime artifacts, and binary extensions. Check every relative filename before content filtering. Use these exact rule contracts:

```js
const CONTENT_RULES = [
  ["absolute-home-path", /(?:\/Users\/|\/home\/|[A-Z]:\\Users\\)/g],
  ["personal-initials", /\bBJ\b/g],
  ["old-personal-name", /\b(?:Dongjun Xie|Joyce Xie|jinzhenghui)\b/gi],
  ["github-token", /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g],
  ["jwt", /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g],
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ["secret-assignment", /\b(?:api[_-]?key|client[_-]?secret|password)\b\s*[:=]\s*["'][A-Za-z0-9_+\/=.-]{20,}["']/gi],
];
const CREDENTIAL_FILES = /(?:^|\/)(?:\.env(?:\..+)?|id_rsa|id_ed25519|credentials\.json|[^/]+\.(?:pem|p12|key))$/i;
const ALLOWED_CREDENTIAL_FILES = new Set([".env.example"]);
```

For each content match, calculate the one-based line number and return only `{ path, rule, line }`. Support `--staged` by reading `git diff --cached --name-only -z` with `execFile`; pass that list to `scanPublicPaths`. Exit `1` when violations exist and print only path/rule/line.

- [ ] **Step 4: Run scanner unit tests and verify the intended remaining failure**

Run:

```bash
node --test tests/public-safety.test.mjs
```

Expected: fixture tests PASS; release-tree test FAIL on `README.md`, `tests/electron-smoke.mjs`, and `src/App.tsx` because source sanitization is not complete.

- [ ] **Step 5: Apply the source cleanup**

Make these exact changes:

```diff
-/Users/bjin/GitHub/flashinfer
+/path/to/flashinfer
```

In `README.md`, add: `Set TRACE_ELECTRON_REPO=/path/to/flashinfer when running the optional large-repository Electron check.`

```diff
-<button className="avatar">BJ</button>
+<button className="avatar" aria-label="June Xie profile">JX</button>
```

Expand `.gitignore` to:

```gitignore
node_modules/
dist/
.DS_Store
._*
.env
.env.*
!.env.example
*.log
.trace/
artifacts/
.cache/
coverage/
```

Add package scripts:

```json
"scan:public": "node scripts/public-safety.mjs",
"test:public": "node --test tests/public-safety.test.mjs"
```

Do not alter `tests/electron-smoke.mjs` yet; Task 2 owns its portable replacement.

- [ ] **Step 6: Run the complete Node test suite**

Run:

```bash
npm test
npm run scan:public
```

Expected before Task 2: only the hard-coded path in `tests/electron-smoke.mjs` remains. Record this expected failure and continue directly to Task 2. Do not initialize Git or commit because the existing tutorial screenshots still contain `BJ` and private local state.

---

### Task 2: Make Electron Verification Portable and Create the Sanitized Source Baseline

**Files:**
- Modify: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tests/electron-smoke.mjs:1-49`
- Test: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tests/public-safety.test.mjs`
- Test: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tests/electron-smoke.mjs`

**Interfaces:**
- Consumes: `TRACE_ELECTRON_REPO` as an optional explicit override.
- Produces: a default Electron smoke test that indexes `process.cwd()` and looks up `inspectRepository` in `electron/repository.mjs`.

- [ ] **Step 1: Update the public-safety test to require a portable Electron target**

Append this assertion:

```js
test("Electron smoke test has no machine-specific default", async () => {
  const source = await readFile(new URL("electron-smoke.mjs", new URL("./", import.meta.url)), "utf8");
  assert.match(source, /process\.env\.TRACE_ELECTRON_REPO\s*\?\?\s*process\.cwd\(\)/);
  assert.doesNotMatch(source, /\/Users\//);
});
```

Add `readFile` to the existing `node:fs/promises` import.

- [ ] **Step 2: Run the targeted test to verify RED**

Run: `node --test tests/public-safety.test.mjs`

Expected: FAIL because `tests/electron-smoke.mjs` still contains the machine-specific FlashInfer default.

- [ ] **Step 3: Replace private assertions with portable self-dogfood assertions**

Change the setup and lookup contract to:

```js
const repositoryPath = process.env.TRACE_ELECTRON_REPO ?? process.cwd();
const repositoryName = path.basename(repositoryPath);
const expectedCourseTitle = `${repositoryName} Deep Dive`;
const lookupQuestion = process.env.TRACE_ELECTRON_REPO
  ? "How many files are indexed?"
  : "Where is inspectRepository defined?";
```

Wait for `expectedCourseTitle`. In default mode, assert the response matches `/inspectRepository is defined at electron\/repository\.mjs:/`; with an override, assert a local-index answer and `0 agent credits` without naming a private symbol. Rename QA screenshots to `electron-self-dogfood-chat.png` and `electron-self-dogfood.png`.

- [ ] **Step 4: Install dependencies and run source verification**

Run:

```bash
npm ci
npm run build
npm test
npm run test:electron
npm run scan:public
```

Expected: all commands PASS. If Electron cannot launch because of an environment dependency, diagnose it before proceeding; do not weaken assertions.

- [ ] **Step 5: Initialize a local repository without adding screenshots or a remote**

Run:

```bash
git init
git symbolic-ref HEAD refs/heads/main
git add .gitignore README.md package.json package-lock.json tsconfig.json vite.config.ts index.html electron src tests scripts tutorial/README.md
node scripts/public-safety.mjs --staged
git diff --cached --check
git diff --cached --name-only
git remote -v
```

Expected: staged scan PASS; staged list excludes `tutorial/screenshots/`; `git remote -v` prints nothing.

- [ ] **Step 6: Commit sanitized source and portable verification**

Run:

```bash
git commit -m "chore: sanitize Trace for public release"
```

Expected: commit succeeds without containing original screenshot assets.

---

### Task 3: Regenerate the Tutorial, Strip Metadata, and Record the Audit

**Files:**
- Modify: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tests/ui-smoke.mjs:7-9,45-82,128-132`
- Modify: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tests/electron-smoke.mjs:8-10,34-45`
- Modify: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tutorial/README.md:1-170`
- Replace: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tutorial/screenshots/01-welcome.png`
- Replace: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tutorial/screenshots/02-adaptive-diagnostic.png`
- Replace: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tutorial/screenshots/03-skill-tree-and-guide.png`
- Replace: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tutorial/screenshots/04-source-linked-diagram.png`
- Replace: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tutorial/screenshots/05-side-chat-context.png`
- Delete: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tutorial/screenshots/06-flashinfer-real-repository.png`
- Create: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/tutorial/screenshots/06-trace-self-dogfood.png`
- Create: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/PUBLIC_RELEASE_SANITIZATION.md`
- Create: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio/GITHUB_PUBLICATION_CHECKLIST.md`

**Interfaces:**
- `TRACE_TUTORIAL_SCREENSHOTS=1` directs smoke-test captures to deterministic tutorial filenames.
- Normal smoke-test runs continue writing disposable assets under ignored `artifacts/qa/`.

- [ ] **Step 1: Add a failing filename contract to public-safety tests**

Assert that tutorial markdown references six existing images, includes `06-trace-self-dogfood.png`, and does not include `06-flashinfer-real-repository.png`.

```js
test("tutorial uses the sanitized six-image sequence", async () => {
  const tutorial = await readFile(new URL("../tutorial/README.md", import.meta.url), "utf8");
  assert.match(tutorial, /06-trace-self-dogfood\.png/);
  assert.doesNotMatch(tutorial, /06-flashinfer-real-repository\.png/);
  for (const name of ["01-welcome.png", "02-adaptive-diagnostic.png", "03-skill-tree-and-guide.png", "04-source-linked-diagram.png", "05-side-chat-context.png", "06-trace-self-dogfood.png"]) {
    await access(new URL(`../tutorial/screenshots/${name}`, import.meta.url));
  }
});
```

Add `access` to the test import.

- [ ] **Step 2: Run the test to verify RED**

Run: `node --test tests/public-safety.test.mjs`

Expected: FAIL because the tutorial still references the old FlashInfer screenshot.

- [ ] **Step 3: Parameterize screenshot destinations**

In both smoke scripts add:

```js
const tutorialCapture = process.env.TRACE_TUTORIAL_SCREENSHOTS === "1";
const artifactDirectory = path.resolve(tutorialCapture ? "tutorial/screenshots" : path.join("artifacts", "qa"));
const shot = (qaName, tutorialName) => path.join(artifactDirectory, tutorialCapture ? tutorialName : qaName);
```

Map web captures to `01-welcome.png` through `05-side-chat-context.png`. Skip the compact QA screenshot in tutorial mode. Map the final Electron capture to `06-trace-self-dogfood.png`; keep the chat screenshot QA-only.

- [ ] **Step 4: Update tutorial copy for portable dogfooding**

Rename section 11 to `Try Trace on a real repository`. Explain that the default Electron smoke test indexes Trace itself and that `TRACE_ELECTRON_REPO=/path/to/flashinfer npm run test:electron` is an optional large mixed Python/CUDA check. Reference `screenshots/06-trace-self-dogfood.png` and remove the fixed local path.

- [ ] **Step 5: Regenerate all screenshots from the sanitized build**

Run:

```bash
TRACE_TUTORIAL_SCREENSHOTS=1 npm run test:ui
TRACE_TUTORIAL_SCREENSHOTS=1 npm run test:electron
```

Expected: six images exist with the approved names; screenshots 03–06 show `JX`; screenshot 06 shows a clean self-dogfood repository view.

- [ ] **Step 6: Strip nonessential filesystem and PNG metadata**

Run `xattr -cr .` from the Trace project root. Re-encode screenshots with macOS `sips` into a temporary directory made with `mktemp -d`, replace only after all six conversions succeed, then verify with Pillow that image info contains no text, EXIF, or private metadata. Retaining a standard color profile is acceptable.

- [ ] **Step 7: Visually inspect every screenshot**

Open all six at original detail. Confirm no absolute path, `BJ`, unpublished commit, private remote, dirty private state, clipped panel, or unreadable 1580-pixel layout appears. If any defect exists, fix the source or capture flow and regenerate rather than painting over pixels.

- [ ] **Step 8: Write the sanitization report and publication checklist**

`PUBLIC_RELEASE_SANITIZATION.md` must contain a table with these completed items: two `/Users/bjin/...` replacements, `BJ` → `JX`, screenshots 01–06 regenerated, screenshot 06 changed to self-dogfood, extended attributes removed, release ignores expanded, scanner added, and no real credentials found. Include exact verification commands and results without copying credential-shaped data.

`GITHUB_PUBLICATION_CHECKLIST.md` must contain unchecked publication-day steps: rerun all tests/audit/scanner, inspect `git remote -v`, create the GitHub repository, add the verified remote, push `main`, verify the public file tree and README images, then update the website status/link in a separate commit.

- [ ] **Step 9: Verify, stage, scan, and commit tutorial artifacts**

Run:

```bash
npm run test:public
npm run scan:public
git add tutorial PUBLIC_RELEASE_SANITIZATION.md GITHUB_PUBLICATION_CHECKLIST.md tests/ui-smoke.mjs tests/electron-smoke.mjs
node scripts/public-safety.mjs --staged
git diff --cached --check
git commit -m "docs: refresh sanitized Trace tutorial"
git remote -v
```

Expected: commit succeeds; remote output remains empty.

---

### Task 4: Run the Trace Publication-Readiness Gate

**Files:**
- Verify: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio`

**Interfaces:**
- Produces: a clean, two-commit local `main` with no remote and a recorded verification result.

- [ ] **Step 1: Run the complete gate from a clean dependency install**

Run:

```bash
npm ci
npm run build
npm test
npm run test:ui
npm run test:electron
npm run scan:public
npm audit
```

Expected: all PASS and audit reports zero known vulnerabilities. If audit does not, stop and record the exact blocker in `PUBLIC_RELEASE_SANITIZATION.md` before proceeding.

- [ ] **Step 2: Verify Git and release boundaries**

Run:

```bash
git status --short
git log --oneline --decorate -2
git remote -v
git ls-files | sort
```

Expected: clean status, exactly the two intended baseline commits at the top, no remotes, no `artifacts/`, `.env*`, AppleDouble files, or credential-shaped files tracked.

---

### Task 5: Add the Approved Trace Flagship Card to the Personal Website

**Files:**
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/tests/site-content.test.mjs:28-56`
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/index.html:271-334`
- Create: `/Users/jinzhenghui/2026/Joyce/personal-website/assets/trace/01-welcome.png`
- Create: `/Users/jinzhenghui/2026/Joyce/personal-website/assets/trace/03-skill-tree-and-guide.png`
- Create: `/Users/jinzhenghui/2026/Joyce/personal-website/assets/trace/05-side-chat-context.png`

**Interfaces:**
- Consumes: sanitized Trace screenshots 01, 03, and 05.
- Produces: `<article data-project="trace">` as the first card in `#work`, with no Trace anchor until GitHub publication.

- [ ] **Step 1: Write the failing website test**

Add:

```js
test("features Trace first with sanitized local evidence and no premature GitHub link", async () => {
  const trace = html.match(/<article[^>]+data-project="trace"[\s\S]*?<\/article>/)?.[0];
  assert.ok(trace, "Trace flagship card is missing");
  assert.ok(html.indexOf('data-project="trace"') < html.indexOf(">AgentFlow<"));
  for (const text of ["Trace", "Codebase Learning Studio", "Electron", "React", "TypeScript", "Monaco", "Local Agents", "Private preview · GitHub release forthcoming"]) assert.match(trace, new RegExp(text));
  assert.doesNotMatch(trace, /href=/);
  assert.doesNotMatch(trace, /\/Users\/|\bBJ\b|github\.com/i);
  for (const file of ["01-welcome.png", "03-skill-tree-and-guide.png", "05-side-chat-context.png"]) await access(new URL(`assets/trace/${file}`, root));
});
```

- [ ] **Step 2: Run the website test to verify RED**

Run: `node --test tests/site-content.test.mjs`

Expected: FAIL because the Trace card and assets do not exist.

- [ ] **Step 3: Copy only approved sanitized images**

Copy the three source images from `../codebase-learning-studio/tutorial/screenshots/` into `assets/trace/`. Verify each destination is byte-identical to its sanitized source with `cmp`.

- [ ] **Step 4: Add the full-width flagship card before AgentFlow**

Use `data-project="trace"` and an `lg:col-span-2` article. Structure it as:

```html
<article data-project="trace" class="project-card glass overflow-hidden rounded-3xl lg:col-span-2">
  <div class="grid gap-0 xl:grid-cols-[.82fr_1.18fr]">
    <div class="p-7 sm:p-8">
      <div class="flex flex-wrap gap-2"><span class="chip">Featured · Desktop AI Learning</span><span class="chip chip-cyan">Electron</span></div>
      <h3 class="mt-5 font-display text-3xl font-bold text-white">Trace</h3>
      <p class="mt-2 font-mono text-xs font-bold uppercase tracking-[.15em] text-violet-300">Codebase Learning Studio</p>
      <p class="mt-4 text-lg leading-8 text-slate-400">A desktop-first learning environment that turns unfamiliar repositories into adaptive, source-grounded courses.</p>
      <div class="mt-6 flex flex-wrap gap-2"><span class="chip">React</span><span class="chip">TypeScript</span><span class="chip">Monaco</span><span class="chip">Local Agents</span></div>
      <span class="mt-7 inline-flex font-mono text-xs font-bold text-cyan-300">Private preview · GitHub release forthcoming</span>
    </div>
    <div class="grid gap-2 bg-slate-950/55 p-3 sm:grid-cols-[1.35fr_.65fr]">
      <img src="assets/trace/01-welcome.png" alt="Trace welcome screen for starting an adaptive codebase course" class="h-full min-h-64 w-full rounded-2xl object-cover object-top" />
      <div class="grid gap-2"><img src="assets/trace/03-skill-tree-and-guide.png" alt="Trace skill tree and next-move learning guide" class="h-full min-h-32 w-full rounded-2xl object-cover object-top" /><img src="assets/trace/05-side-chat-context.png" alt="Trace source reader with transparent context-pack details" class="h-full min-h-32 w-full rounded-2xl object-cover object-top" /></div>
    </div>
  </div>
  <div class="grid gap-3 border-t border-slate-800 p-5 sm:grid-cols-2 lg:grid-cols-4">
    <div class="rounded-2xl border border-slate-800 bg-slate-950/55 p-4"><p class="font-mono text-xs text-violet-300">REPOSITORY INDEX</p><p class="mt-2 text-sm leading-6 text-slate-300">Maps files, symbols, entry points, languages, Git versions, and source fingerprints locally.</p></div>
    <div class="rounded-2xl border border-slate-800 bg-slate-950/55 p-4"><p class="font-mono text-xs text-emerald-300">ADAPTIVE ROUTE</p><p class="mt-2 text-sm leading-6 text-slate-300">Builds diagnostic-driven skill graphs and marks only source-affected mastery stale.</p></div>
    <div class="rounded-2xl border border-slate-800 bg-slate-950/55 p-4"><p class="font-mono text-xs text-cyan-300">GROUNDED TUTOR</p><p class="mt-2 text-sm leading-6 text-slate-300">Links Monaco source, local lookup, lessons, and transparent context budgets.</p></div>
    <div class="rounded-2xl border border-slate-800 bg-slate-950/55 p-4"><p class="font-mono text-xs text-sky-300">SAFE PRACTICE</p><p class="mt-2 text-sm leading-6 text-slate-300">Creates isolated Git worktrees with diff inspection and guarded cleanup.</p></div>
  </div>
</article>
```

Change the Featured Systems intro from `Three examples` to `Four examples`. Do not alter AgentFlow, Agent Bridge, or AI Team Builder copy.

- [ ] **Step 5: Run the website suite and static checks**

Run:

```bash
node --test tests/site-content.test.mjs
rg -n '/Users/|\bBJ\b|github.com/Joyce0615/(trace|codebase-learning-studio)' index.html assets/trace tests/site-content.test.mjs
git diff --check
```

Expected: tests PASS; sensitive/dead-link search returns no matches; diff check passes.

- [ ] **Step 6: Verify desktop and mobile localhost rendering**

Start a local server on an available loopback port. With the in-app browser, inspect `#work` at desktop and mobile widths. Confirm the main welcome image preserves its headline and controls, detail images preserve the skill tree/context panel, alt text is descriptive, no horizontal overflow exists, and the existing cards remain aligned.

- [ ] **Step 7: Commit the website update locally**

Run:

```bash
git add index.html tests/site-content.test.mjs assets/trace
git diff --cached --check
git commit -m "feat: add Trace flagship project"
git status --short
```

Expected: clean website worktree. Do not push.

---

### Task 6: Final Cross-Repository Handoff

**Files:**
- Verify: `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio`
- Verify: `/Users/jinzhenghui/2026/Joyce/personal-website`

**Interfaces:**
- Produces: evidence-backed handoff and a localhost page left open for June's review.

- [ ] **Step 1: Re-run fresh completion checks**

In Trace, run `npm run build && npm test && npm run test:ui && npm run test:electron && npm run scan:public && npm audit`. In the website, run `node --test tests/site-content.test.mjs` and `git diff --check`.

- [ ] **Step 2: Confirm publication boundaries**

Confirm both worktrees are clean; Trace has no remote; website remote has not advanced beyond its pre-task remote commit; no push occurred.

- [ ] **Step 3: Report exact sanitization and next-day actions**

Summarize removed items from `PUBLIC_RELEASE_SANITIZATION.md`, list both local commit hashes, provide links to the cleaned project, report, publication checklist, website file, and plan, and leave the verified localhost homepage open. Explicitly state that the Trace GitHub repository has not yet been created and the website has not been pushed.
