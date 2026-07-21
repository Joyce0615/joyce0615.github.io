# Dual One-Page Resumes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce verified one-page AI/LLM Systems and FDE/Applied AI resumes in DOCX and PDF while preserving Joyce's existing single-column resume character.

**Architecture:** A deterministic Python builder will hold shared facts, variant-specific summaries and project selections, and one compact style system. Content tests will inspect generated DOCX text and structure; the bundled document renderer will produce final PDFs and PNGs for page-count and visual QA.

**Tech Stack:** Bundled Python runtime, `python-docx`, OOXML hyperlinks, LibreOffice via the Documents skill renderer, `pytest`.

## Global Constraints

- US Letter, exactly one page per version.
- Preserve the existing conventional single-column black-and-white format.
- Body text must remain approximately 9.5-10 pt or larger and readable.
- Existing source resume files remain unchanged.
- Do not invent metrics, adoption, publication status, or technical details.
- Describe the IEEE CCET 2026 paper as accepted and forthcoming, never already published.
- Deliver DOCX and matching PDF for both variants.

---

### Task 1: Create the resume content contract

**Files:**
- Create: `/Users/jinzhenghui/2026/Joyce/resumes/tests/test_resume_content.py`
- Create: `/Users/jinzhenghui/2026/Joyce/resumes/build_resumes.py`

**Interfaces:**
- Produces: `build_resume(variant: str, output_path: pathlib.Path) -> None`.
- Produces: `AI_LLM` and `FDE_APPLIED_AI` variant identifiers.

- [ ] **Step 1: Write failing content tests**

```python
from pathlib import Path
from docx import Document
from build_resumes import AI_LLM, FDE_APPLIED_AI, build_resume

def text_of(path: Path) -> str:
    doc = Document(path)
    return "\n".join(p.text for p in doc.paragraphs)

def test_ai_resume_has_systems_projects_and_forthcoming_paper(tmp_path):
    out = tmp_path / "ai.docx"
    build_resume(AI_LLM, out)
    text = text_of(out)
    assert "AgentFlow" in text
    assert "Agent Bridge" in text
    assert "Kaggle Team" in text
    assert "accepted for publication and presentation at IEEE CCET 2026" in text
    assert "Vibe Coding" not in text

def test_fde_resume_has_delivery_projects_and_forthcoming_paper(tmp_path):
    out = tmp_path / "fde.docx"
    build_resume(FDE_APPLIED_AI, out)
    text = text_of(out)
    assert "Agent Hook" in text
    assert "In-Context Search" in text
    assert "TypeScript" in text and "Python" in text
    assert "accepted for publication and presentation at IEEE CCET 2026" in text
    assert "published at IEEE" not in text
```

- [ ] **Step 2: Run `python -m pytest tests/test_resume_content.py -v` and expect failure because `build_resumes` does not exist.**
- [ ] **Step 3: Implement shared facts and variant payloads.** Define the two identifiers, shared contact/education/employment facts, `PAPER_LINE`, and evidence-backed project bullets sourced from the local READMEs.
- [ ] **Step 4: Implement deterministic DOCX construction.** Use explicit US Letter geometry, 0.55-0.62 inch margins, 9.5-10 pt body text, compact section rhythm, real bullets, tab-stop dates, and OOXML hyperlinks. Keep SiriusMindshare as one entry and place the paper line after the production multi-agent bullets.
- [ ] **Step 5: Run `python -m pytest tests/test_resume_content.py -v`; expect both tests to pass.**

### Task 2: Generate and structurally verify both resumes

**Files:**
- Create: `/Users/jinzhenghui/2026/Joyce/resumes/Dongjun_Xie_Resume_2026_AI_LLM_Systems.docx`
- Create: `/Users/jinzhenghui/2026/Joyce/resumes/Dongjun_Xie_Resume_2026_FDE_Applied_AI.docx`
- Modify: `/Users/jinzhenghui/2026/Joyce/resumes/tests/test_resume_content.py`

**Interfaces:**
- Consumes: `build_resume()`.
- Produces: stable final filenames used by the website.

- [ ] **Step 1: Add page-geometry and hyperlink assertions.**

```python
def test_generated_resumes_use_letter_page_and_have_links(tmp_path):
    for variant in (AI_LLM, FDE_APPLIED_AI):
        out = tmp_path / f"{variant}.docx"
        build_resume(variant, out)
        doc = Document(out)
        section = doc.sections[0]
        assert round(section.page_width.inches, 1) == 8.5
        assert round(section.page_height.inches, 1) == 11.0
        targets = [rel.target_ref for rel in doc.part.rels.values() if rel.reltype.endswith("hyperlink")]
        assert any("linkedin.com/in/dongjun-xie" in target for target in targets)
        assert any("github.com/Joyce0615" in target for target in targets)
```

- [ ] **Step 2: Run the tests and confirm failure until link support is complete.**
- [ ] **Step 3: Add `add_hyperlink(paragraph, label, url)` plus `main()` that writes the two exact deliverable filenames.**
- [ ] **Step 4: Run `python build_resumes.py`; expect both non-empty DOCX files.**
- [ ] **Step 5: Run all content and structure tests; expect PASS.**

### Task 3: Render, tighten, and approve the one-page layouts

**Files:**
- Modify: `/Users/jinzhenghui/2026/Joyce/resumes/build_resumes.py`
- Create: both matching PDFs.
- Create for QA only: `/Users/jinzhenghui/2026/Joyce/resumes/.qa/<variant>/page-1.png`

**Interfaces:**
- Consumes: final DOCX files.
- Produces: four resume deliverables and QA renders.

- [ ] **Step 1: Render each DOCX with `render_docx.py ... --output_dir .qa/<variant> --emit_pdf`.**
- [ ] **Step 2: Assert each output directory contains exactly one `page-*.png`.**
- [ ] **Step 3: Inspect both PNGs at 100% for title/contact alignment, bullet wraps, clipping, page-bottom clearance, and natural spacing.**
- [ ] **Step 4: If needed, remove the lowest-signal bullet before reducing body text below 9.5 pt; regenerate and rerender after every change.**
- [ ] **Step 5: Copy renderer PDFs to the two stable deliverable PDF filenames.**
- [ ] **Step 6: Run final tests and `pdfinfo <file> | rg '^Pages:\s+1$'` for both PDFs; expect PASS and one page.**

