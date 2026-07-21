# Resume V3 Typography and Wording Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver two one-page, role-targeted resumes whose DOCX and PDF outputs use real Times New Roman, match the original resume's compact line rhythm, and use evidence-dense language derived from current AI/LLM and FDE job requirements.

**Architecture:** Keep the retained original DOCX as the immutable package template and continue patching only `word/document.xml` plus hyperlink relationships. Add deterministic OOXML font and bullet-spacing normalization in the resume composer, export PDFs through Microsoft Word on macOS, and verify content, page count, font embedding, and website byte identity through automated tests plus rendered visual inspection.

**Tech Stack:** Python 3.12, lxml, python-docx for inspection tests, zipfile/OOXML patching, Microsoft Word AppleScript automation, pypdf/pdfplumber, Poppler, unittest, Node.js test runner.

## Global Constraints

- Keep `/Users/jinzhenghui/2026/Joyce/resumes/Dongjun_Xie's_Resume_2026.docx` byte-for-byte unchanged at SHA-256 `24cf931ebee21d2bcbc8fb19e11e8e8bd38404b1741f75c41504691871af55fb`.
- Preserve the original page geometry, section order, centered blue underlined name, centered contact row, uppercase ruled headings, right-aligned dates, selective bold evidence, italic stacks, and real round bullets.
- Use Times New Roman explicitly for every visible Latin run.
- Use exact 12-point line spacing and 0-point before/after spacing for wrapped bullets.
- Keep both final PDFs to exactly one US Letter page.
- Describe the IEEE CCET 2026 paper as accepted and forthcoming, never already published or publicly available.
- Do not initialize a Git repository in `/Users/jinzhenghui/2026/Joyce/resumes`; only the website repository receives commits.
- Do not change website layout or copy; only replace its two existing resume PDF assets.

---

### Task 1: Add typography and spacing regression tests

**Files:**
- Modify: `/Users/jinzhenghui/2026/Joyce/resumes/tests/test_resume_content.py`
- Test: `/Users/jinzhenghui/2026/Joyce/resumes/tests/test_resume_content.py`

**Interfaces:**
- Consumes: `build_resume(variant: str, output_path: Path) -> None` from `build_resumes.py`.
- Produces: regression tests that require explicit Times New Roman run properties and exact bullet spacing.

- [ ] **Step 1: Add a helper that inspects visible OOXML runs**

```python
import zipfile
from lxml import etree

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W}


def document_root(path: Path):
    with zipfile.ZipFile(path) as archive:
        return etree.fromstring(archive.read("word/document.xml"))
```

- [ ] **Step 2: Write the failing Times New Roman test**

```python
def test_all_visible_runs_explicitly_use_times_new_roman(self):
    for variant in (AI_LLM, FDE_APPLIED_AI):
        output = self.root / f"{variant}.docx"
        build_resume(variant, output)
        root = document_root(output)
        for run in root.findall(".//w:r", NS):
            text = "".join(run.itertext()).strip()
            if not text:
                continue
            fonts = run.find("w:rPr/w:rFonts", NS)
            self.assertIsNotNone(fonts, text)
            self.assertEqual(fonts.get(f"{{{W}}}ascii"), "Times New Roman")
            self.assertEqual(fonts.get(f"{{{W}}}hAnsi"), "Times New Roman")
```

- [ ] **Step 3: Write the failing exact bullet-rhythm test**

```python
def test_bullets_use_exact_twelve_point_line_spacing_without_paragraph_gap(self):
    for variant in (AI_LLM, FDE_APPLIED_AI):
        output = self.root / f"{variant}.docx"
        build_resume(variant, output)
        root = document_root(output)
        bullets = root.findall(".//w:p[w:pPr/w:numPr]", NS)
        self.assertTrue(bullets)
        for paragraph in bullets:
            spacing = paragraph.find("w:pPr/w:spacing", NS)
            self.assertEqual(spacing.get(f"{{{W}}}line"), "240")
            self.assertEqual(spacing.get(f"{{{W}}}lineRule"), "exact")
            self.assertEqual(spacing.get(f"{{{W}}}before"), "0")
            self.assertEqual(spacing.get(f"{{{W}}}after"), "0")
```

- [ ] **Step 4: Run the tests and confirm they fail for the intended reasons**

Run:

```bash
/Users/jinzhenghui/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 \
  -m unittest discover -s tests -v
```

Expected: the new font test fails because inherited runs lack `w:rFonts`; the spacing test fails because bullet `w:lineRule` is `auto`.

---

### Task 2: Normalize Times New Roman and compact bullet rhythm at the OOXML source

**Files:**
- Modify: `/Users/jinzhenghui/2026/Joyce/resumes/build_resumes.py`
- Test: `/Users/jinzhenghui/2026/Joyce/resumes/tests/test_resume_content.py`

**Interfaces:**
- Consumes: `TemplateComposer.run(kind: str, text: str)` and `TemplateComposer.bullet(segments)`.
- Produces: `_force_times_new_roman(run) -> None` and `_set_exact_bullet_spacing(paragraph) -> None`; every generated visible run carries deterministic fonts and every bullet carries exact spacing.

- [ ] **Step 1: Add the run-font normalizer**

```python
def _force_times_new_roman(run) -> None:
    rpr = run.find("w:rPr", NS)
    if rpr is None:
        rpr = etree.Element(f"{{{W}}}rPr")
        run.insert(0, rpr)
    fonts = rpr.find("w:rFonts", NS)
    if fonts is None:
        fonts = etree.Element(f"{{{W}}}rFonts")
        rpr.insert(0, fonts)
    for attribute in ("ascii", "hAnsi", "eastAsia", "cs"):
        fonts.set(f"{{{W}}}{attribute}", "Times New Roman")
```

- [ ] **Step 2: Apply the font normalizer to every generated text run**

```python
def run(self, kind: str, text: str):
    run = deepcopy(self.run_templates[kind])
    self._replace_run_text(run, text)
    _force_times_new_roman(run)
    return run
```

Also normalize every visible run in the cloned name paragraph before it is appended, so the name cannot inherit a theme font.

- [ ] **Step 3: Add exact bullet spacing**

```python
def _set_exact_bullet_spacing(paragraph) -> None:
    ppr = paragraph.find("w:pPr", NS)
    spacing = ppr.find("w:spacing", NS)
    if spacing is None:
        spacing = etree.SubElement(ppr, f"{{{W}}}spacing")
    spacing.set(f"{{{W}}}line", "240")
    spacing.set(f"{{{W}}}lineRule", "exact")
    spacing.set(f"{{{W}}}before", "0")
    spacing.set(f"{{{W}}}after", "0")
```

```python
def bullet(self, segments):
    paragraph = self.paragraph(23, segments)
    _set_exact_bullet_spacing(paragraph)
    return paragraph
```

- [ ] **Step 4: Run the resume test suite**

Run:

```bash
/Users/jinzhenghui/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 \
  -m unittest discover -s tests -v
```

Expected: all tests pass, including the two new typography tests.

---

### Task 3: Rewrite both variants around researched hiring signals

**Files:**
- Modify: `/Users/jinzhenghui/2026/Joyce/resumes/build_resumes.py`
- Create: `/Users/jinzhenghui/2026/Joyce/resumes/metrics-to-confirm.md`
- Modify: `/Users/jinzhenghui/2026/Joyce/resumes/tests/test_resume_content.py`

**Interfaces:**
- Consumes: `VARIANTS`, `_plain`, `_bold`, `_italic`, and the repository facts documented in the approved design.
- Produces: two distinct content variants plus a private checklist of candidate unverified metrics.

- [ ] **Step 1: Add failing content-positioning tests**

```python
def test_ai_resume_emphasizes_production_quality_and_evaluation(self):
    output = self.root / "ai.docx"
    build_resume(AI_LLM, output)
    text = text_of(output).lower()
    for phrase in ("evaluation", "guardrails", "crash recovery", "audit"):
        self.assertIn(phrase, text)


def test_fde_resume_emphasizes_discovery_integrations_and_delivery(self):
    output = self.root / "fde.docx"
    build_resume(FDE_APPLIED_AI, output)
    text = text_of(output).lower()
    for phrase in ("ambiguous", "integration", "end-to-end", "reusable"):
        self.assertIn(phrase, text)
```

- [ ] **Step 2: Run the tests and confirm the wording tests fail**

Run the full unittest command from Task 2.

Expected: at least one required researched phrase is absent from each current variant.

- [ ] **Step 3: Rewrite the AI/LLM Systems variant**

Use four SiriusMindshare bullets with this content structure:

1. Production scope: five role-specific agents across five operating workflows.
2. Efficiency: approximately 4K cached tokens per request plus the four-stage/80% compaction policy.
3. Reliability: deterministic tool governance, evaluation gates, crash recovery, observability, and audit evidence.
4. Research continuity: extend the same evaluation discipline to the LVLM retail framework and forthcoming IEEE CCET 2026 paper.

Use three projects:

- AgentFlow: typed graph orchestration, parallel scheduling, human/automated gates, and mission recovery/evidence.
- Agent Bridge: five-verb runtime, local/AWS providers, Python/TypeScript SDKs, three storage tiers, five MCP tools, cost/audit controls.
- Kaggle Team: three roles, four phases, CV-to-LB score feedback, context compaction, and cost tracking.

- [ ] **Step 4: Rewrite the FDE/Applied AI variant**

Use four SiriusMindshare bullets with this content structure:

1. Translate ambiguous operating requirements into five deployed agent workflows.
2. Own end-to-end full-stack delivery across Next.js, TypeScript, AWS, APIs, streaming UX, and monitoring.
3. Turn recurring needs into reusable orchestration/context patterns while improving cost and reliability.
4. Apply the platform's evaluation discipline to the LVLM research work and forthcoming paper.

Use three projects:

- Agent Hook: event-to-agent delivery, six event sources, capabilities, approvals, retries, and SQLite audit history.
- In-Context Search: six AI/search providers and three user surfaces.
- AgentFlow: visual workflow design, REST/WebSocket integration, human gates, and provider-neutral backends.

- [ ] **Step 5: Create the metrics confirmation checklist**

The checklist must separate verified resume-ready facts from estimates that require Joyce's confirmation:

```markdown
# Resume Metrics to Confirm

## Verified and used

- Five specialized SiriusMindshare agents across five workflows.
- Approximately 4K cached static tokens per request.
- Four-stage context compression triggered at 80% capacity.
- 40% response-time improvement in Hate Crime Tracker frequent queries.

## Candidate estimates — do not treat as confirmed

- Approximate inference latency or per-call cost reduction from prompt caching.
- Approximate reduction in manual workflow time after deploying the five agents.
- Number of active users, customer teams, or production sessions for the agent platform.
- Number of external systems or APIs integrated in customer workflows.
- Evaluation pass-rate, failure-rate, or recovery-rate improvement after guardrails.
```

- [ ] **Step 6: Run the full content and formatting test suite**

Expected: every resume test passes and neither variant contains `published at IEEE` or another claim that the paper is already public.

---

### Task 4: Export PDFs through Microsoft Word and verify embedded fonts

**Files:**
- Create: `/Users/jinzhenghui/2026/Joyce/resumes/export_with_word.py`
- Create: `/Users/jinzhenghui/2026/Joyce/resumes/verify_resume_outputs.py`
- Modify: `/Users/jinzhenghui/2026/Joyce/resumes/tests/test_resume_content.py`

**Interfaces:**
- Consumes: final DOCX paths from `OUTPUTS`.
- Produces: `export_pdf_with_word(docx_path: Path, pdf_path: Path) -> None` and `verify_pdf(path: Path) -> dict[str, object]`.

- [ ] **Step 1: Add a Word export helper**

```python
from pathlib import Path
import subprocess


def export_pdf_with_word(docx_path: Path, pdf_path: Path) -> None:
    docx_path = docx_path.resolve()
    pdf_path = pdf_path.resolve()
    script = f'''
tell application "Microsoft Word"
    set sourceFile to POSIX file "{docx_path}" as alias
    set outputFile to POSIX file "{pdf_path}"
    set activeDocument to open sourceFile
    save as activeDocument file name outputFile file format format PDF
    close activeDocument saving no
end tell
'''
    subprocess.run(["osascript", "-e", script], check=True)
    if not pdf_path.exists() or pdf_path.stat().st_size == 0:
        raise RuntimeError(f"Microsoft Word did not create {pdf_path}")
```

Escape embedded quotes/backslashes in resolved paths before interpolation, even though the current filenames contain neither.

- [ ] **Step 2: Add PDF verification**

```python
from pypdf import PdfReader


def verify_pdf(path: Path) -> dict[str, object]:
    reader = PdfReader(path)
    fonts = set()
    for page in reader.pages:
        resources = page["/Resources"].get_object()
        font_dict = resources.get("/Font", {}).get_object()
        for font in font_dict.values():
            fonts.add(str(font.get_object().get("/BaseFont", "")))
    return {"pages": len(reader.pages), "fonts": sorted(fonts)}
```

The command-line verifier must exit nonzero unless the document has one page, contains a Times New Roman base font, and contains neither `LiberationSerif` nor `LinuxLibertine`.

- [ ] **Step 3: Build the DOCX files and export both PDFs through Word**

Run:

```bash
/Users/jinzhenghui/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 build_resumes.py
/Users/jinzhenghui/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 export_with_word.py
```

Expected: Word writes both stable PDF filenames in `/Users/jinzhenghui/2026/Joyce/resumes`.

- [ ] **Step 4: Verify page count and embedded fonts**

Run:

```bash
/Users/jinzhenghui/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 verify_resume_outputs.py
```

Expected: each PDF reports one page, Times New Roman font names, and no Liberation Serif/Linux Libertine.

- [ ] **Step 5: Render and inspect both Word-generated PDFs**

Run Poppler into a new `mktemp -d /private/tmp/joyce-resume-v3-qa.XXXXXX` directory. Inspect every generated page at 100% and compare the font shapes, baseline rhythm, date alignment, bullets, and bottom clearance to the retained original PDF.

---

### Task 5: Synchronize website assets and run final verification

**Files:**
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/assets/resumes/Dongjun_Xie_Resume_2026_AI_LLM_Systems.pdf`
- Modify: `/Users/jinzhenghui/2026/Joyce/personal-website/assets/resumes/Dongjun_Xie_Resume_2026_FDE_Applied_AI.pdf`

**Interfaces:**
- Consumes: verified final PDFs from Task 4.
- Produces: byte-identical website resume downloads.

- [ ] **Step 1: Copy both final PDFs to the website asset paths**

```bash
cp ../resumes/Dongjun_Xie_Resume_2026_AI_LLM_Systems.pdf assets/resumes/
cp ../resumes/Dongjun_Xie_Resume_2026_FDE_Applied_AI.pdf assets/resumes/
```

- [ ] **Step 2: Confirm byte identity**

```bash
cmp ../resumes/Dongjun_Xie_Resume_2026_AI_LLM_Systems.pdf assets/resumes/Dongjun_Xie_Resume_2026_AI_LLM_Systems.pdf
cmp ../resumes/Dongjun_Xie_Resume_2026_FDE_Applied_AI.pdf assets/resumes/Dongjun_Xie_Resume_2026_FDE_Applied_AI.pdf
```

Expected: both commands exit 0 with no output.

- [ ] **Step 3: Run resume and website tests**

```bash
cd /Users/jinzhenghui/2026/Joyce/resumes
/Users/jinzhenghui/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m unittest discover -s tests -v

cd /Users/jinzhenghui/2026/Joyce/personal-website
/Users/jinzhenghui/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-content.test.mjs
git diff --check
```

Expected: all resume and site tests pass with zero failures, and `git diff --check` prints nothing.

- [ ] **Step 4: Commit website assets and implementation documentation**

```bash
git add assets/resumes/Dongjun_Xie_Resume_2026_AI_LLM_Systems.pdf \
        assets/resumes/Dongjun_Xie_Resume_2026_FDE_Applied_AI.pdf
git commit -m "fix: embed resume fonts and tighten wording"
```

- [ ] **Step 5: Confirm final repository state**

Run `git status --short` in the website repository.

Expected: no output.
