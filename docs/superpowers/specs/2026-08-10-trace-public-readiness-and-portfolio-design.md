# Trace Public Readiness and Portfolio Design

## Objective

Prepare the extracted `codebase-learning-studio` project for a later public GitHub release and add it to June Xie's personal website without exposing machine-specific, personal, credential, or unpublished-repository information. The product name is **Trace** and the descriptive subtitle is **Codebase Learning Studio**.

This work stops short of creating a public GitHub repository, configuring a remote, or pushing the project. The website must therefore describe Trace as a private preview with a forthcoming GitHub release and must not contain a speculative or dead repository link.

## Source State

The source archive is `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio-with-tutorial.tar.gz`. It has been safety-checked for absolute paths, path traversal, links, and device entries, then extracted to `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio`.

The extracted project is a desktop-first Electron and React application. Its main boundaries are:

- `electron/`: trusted host for repository access, Git operations, course caches, learner-state persistence, context construction, practice worktrees, and local agent adapters.
- `src/`: sandboxed React renderer containing the welcome flow, adaptive diagnostic, skill tree, lesson/code/diagram/notes workspace, Monaco editor, tutor UI, quizzes, and practice controls.
- `tests/`: core security and behavior tests plus browser and Electron smoke tests.
- `tutorial/`: illustrated end-to-end usage guide and six screenshots.

The renderer receives repository capabilities only through the preload bridge. Repository-relative paths and symlink targets are validated by the trusted host. Codex and Claude calls are explicit, local, and read-only; deterministic indexing, diagnostics, starter courses, local lookup, and the featured nano-vllm course work without either agent.

## Product Narrative

Trace turns an unfamiliar local or remote Git repository into an adaptive, source-grounded learning path. Its strongest portfolio story is the combination of product design and systems safety:

1. It indexes files, symbols, languages, entry points, Git versions, and source fingerprints locally.
2. It maps a learner's existing knowledge through a zero-agent-credit diagnostic and constructs a prerequisite-aware skill graph.
3. It connects lessons, diagrams, timelines, Monaco source views, and tutor answers to validated source anchors.
4. It exposes Lean, Balanced, and Deep context packs with inclusion reasons, token estimates, omissions, cache hits, and estimated savings.
5. It records mastery from diagnostic, lesson, quiz, practice, self-report, note, and side-chat evidence, then marks only source-affected skills stale.
6. It creates isolated Git worktrees for practice, inspects diffs, and requires confirmation before discarding dirty work.

The website copy must not claim public adoption, performance benchmarks, production deployment, or user counts that are not present in the source material.

## Public-Release Sanitization

Use a comprehensive release scrub rather than a website-only cleanup.

### Confirmed findings

The initial audit found no embedded API keys, GitHub tokens, JWTs, private keys, real email addresses, or credential files. The following release-sensitive content was found:

| Finding | Current location | Required treatment |
| --- | --- | --- |
| Hard-coded local repository path `/Users/bjin/GitHub/flashinfer` | `README.md` | Replace with a portable `/path/to/flashinfer` example and document optional `TRACE_ELECTRON_REPO` usage. |
| Same hard-coded local path | `tests/electron-smoke.mjs` | Remove the machine-specific default. Use the project itself or a generated fixture by default; retain the environment-variable override for optional large-repository testing. |
| Personal initials `BJ` | `src/App.tsx` | Replace with the public-facing neutral initials `JX` or a generic user icon. The implementation should use `JX` for consistency with June Xie. |
| `BJ` shown in product screenshots | Tutorial screenshots 03–06 | Regenerate from the sanitized application so the images show `JX`. |
| Local FlashInfer commit and dirty state | Tutorial screenshot 06 | Replace with a clean, reproducible dogfood screenshot that does not reveal an unpublished local commit or dirty worktree. Prefer Trace learning its own clean repository. |
| macOS provenance extended attributes | Extracted files and screenshots | Remove extended attributes from the release tree and confirm the files remain readable. |
| Archive-side AppleDouble entries | Source archive root | Do not include AppleDouble files in the local Git baseline or future release archive. |

Public third-party references to `GeeeekExplorer/nano-vllm`, nano-vllm, FlashInfer, Codex, and Claude are product context rather than secrets and should remain when relevant. Test-only values such as `trace@example.com`, generic `/tmp/trace-practice/...` paths, localhost development URLs, and deliberate `secret.txt` traversal fixtures may remain because they are clearly synthetic.

### Repository hygiene

Expand `.gitignore` to exclude at minimum:

- `node_modules/`
- `dist/`
- `.DS_Store`
- `._*`
- `.env` and `.env.*`, while allowing a future `.env.example`
- `*.log`
- `.trace/`
- runtime caches and locally generated QA artifacts

Add an automated public-safety check that scans publishable text files for absolute user-home paths, the removed `BJ` identifier, known personal names not intended for this product, common token formats, JWTs, private-key headers, and secret-like assignments. The check must use a narrow allowlist for intentional synthetic security fixtures rather than disabling entire directories.

The check should also fail when a credential-shaped filename or forbidden runtime artifact would be included in the release tree.

### Sanitization report

Create `PUBLIC_RELEASE_SANITIZATION.md` in the Trace project. It must state:

- the exact categories inspected;
- each file or screenshot changed;
- the sensitive or machine-specific information removed or replaced, described without reproducing any real secret;
- which public third-party references were intentionally retained;
- the commands and results used to verify the cleaned tree;
- that no real credentials were detected during the audit.

## Tutorial and Screenshot Strategy

Regenerate all six tutorial screenshots after the source cleanup so the documentation and code agree. Use the sanitized application and a reproducible viewport matching the existing 1580-pixel-wide captures.

The screenshot sequence remains:

1. Welcome and repository selection.
2. Adaptive diagnostic.
3. Skill tree and Your Next Move guide.
4. Source-linked architecture diagram.
5. Quick Ask and transparent context pack.
6. Clean real-repository or self-dogfood view without private local state.

The images must not show absolute filesystem paths, unpublished repository URLs, personal initials other than `JX`, dirty worktree status from a private repository, or non-public commit identifiers. Strip unnecessary PNG metadata and macOS extended attributes after capture.

The personal website uses screenshots 01, 03, and 05: the welcome screen as the large visual, plus the skill-tree and context-pack screens as two supporting details. Screenshot 06 remains tutorial evidence but is not used on the portfolio.

## Personal Website Design

Add Trace as the first item in `Featured Systems`, ahead of AgentFlow. It is a full-width flagship card that follows the existing dark, glass-panel, violet/cyan/green visual system.

The card contains:

- Label: `Featured · Desktop AI Learning`
- Title: `Trace`
- Subtitle or nearby descriptor: `Codebase Learning Studio`
- Core copy: a desktop-first learning environment that turns unfamiliar repositories into adaptive, source-grounded courses.
- Four evidence areas:
  1. Local file, symbol, entry-point, and version indexing.
  2. Diagnostic-driven skill graphs, mastery evidence, and source-aware staleness.
  3. Monaco source reading, transparent context budgets, local lookup, and optional Codex/Claude tutoring.
  4. Isolated Git worktree practice with diff inspection and guarded cleanup.
- Technology tags: `Electron`, `React`, `TypeScript`, `Monaco`, and `Local Agents`.
- Status: `Private preview · GitHub release forthcoming`.

The card includes no GitHub anchor until the repository is actually public. Once a verified public URL exists, a later change may replace the status with a descriptive GitHub link that opens in a new tab with `rel="noopener noreferrer"`.

Copy the three selected sanitized images into a dedicated website asset directory such as `assets/trace/`, use descriptive filenames and alt text, and avoid referencing files outside the website repository.

## Portable Electron Smoke Test

Remove the machine-specific FlashInfer default from `tests/electron-smoke.mjs`. The standard smoke test must run on another contributor's machine without requiring `/Users/bjin/...` or a pre-existing external repository.

The default target should be the Trace repository itself after the clean local baseline exists, or a deterministic temporary Git fixture if self-indexing makes the assertions unstable. `TRACE_ELECTRON_REPO` remains an explicit override for optional large mixed-language repository testing. Assertions must target stable UI and behavior rather than a private branch, commit, path, or symbol.

## Local Git Baseline

After cleanup and verification, initialize a Git repository inside `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio` if one does not already exist. Create a clean local baseline commit that includes only publishable files.

Do not create a GitHub repository, configure a remote, add authentication material, or push during this work. Before the baseline commit, inspect the exact staged file list and run the public-safety check against staged content.

## Verification Gates

### Trace project

Run and require successful results from:

```bash
npm ci
npm run build
npm test
npm run test:ui
npm run test:electron
npm audit
```

Also require:

- the automated public-safety test passes;
- searches find no `/Users/bjin`, `BJ`, old personal names, credential patterns, or forbidden artifacts in publishable files;
- all six screenshots are visually reviewed after regeneration;
- screenshots contain no forbidden text and no unnecessary metadata;
- `git status --short` is clean after the local baseline commit;
- no Git remote is configured.

If `npm audit` reports a dependency vulnerability, do not hide or override the result. Record the package, severity, reachable surface, and proposed remediation before declaring the project publication-ready.

### Personal website

Extend the existing Node tests to require:

- a visible Trace flagship card;
- the approved title, descriptor, evidence, technology tags, and forthcoming status;
- three local Trace screenshots that exist on disk;
- no GitHub link associated with Trace before publication;
- no removed sensitive identifiers or machine-specific paths.

Run the full website test suite, validate the local asset requests, and inspect the homepage at desktop and mobile widths on localhost. The visual check must confirm that the large screenshot preserves the welcome-screen hierarchy and that the two supporting images retain the skill-tree and context-pack details without misleading crops.

## Commit and Publication Boundaries

Create separate commits for logically independent deliverables:

1. Trace sanitization and portable verification in the new local repository.
2. Trace tutorial screenshot refresh and sanitization report in the same local repository.
3. Trace portfolio card, website assets, and website tests in the existing personal website repository.

Do not push either repository as part of implementation. The website commit remains local until June reviews the localhost result. The Trace repository remains local with no remote until the separate GitHub publication session.

## Deliverables

- Sanitized `/Users/jinzhenghui/2026/Joyce/codebase-learning-studio` project.
- Updated tutorial and six sanitized screenshots.
- Project-level `PUBLIC_RELEASE_SANITIZATION.md`.
- Passing build, core, UI, Electron, audit, and public-safety checks, or a clearly documented blocking audit finding.
- Clean local Trace Git baseline with no remote.
- Updated personal website containing the approved full-width Trace flagship card and three local screenshots.
- Passing website tests and verified desktop/mobile localhost rendering.
- A short publication checklist for the future GitHub release session.
