# Resume V3 Typography and Wording Design

## Objective

Produce two one-page resumes—AI/LLM Systems and FDE/Applied AI—that preserve the original resume's visual character while improving role alignment, evidence density, and interview defensibility.

## Visual Authority

The retained original DOCX controls structure and the retained original PDF controls rendered appearance.

- Use Times New Roman explicitly for every visible Latin run. The original PDF embeds Times New Roman; the current generated PDFs incorrectly substitute Liberation Serif and Linux Libertine.
- Keep the original page geometry: approximately 0.30-inch left/right margins, 0.25-inch top margin, and 0.54-inch bottom margin.
- Keep the original type scale: 14-point rendered name, 10-point contact and summary body, and 10.5-point section labels, entries, skills, and bullets.
- Use exact 12-point line spacing for wrapped bullets and 0-point paragraph spacing before/after. The target is the original PDF's approximately 12.1-point baseline rhythm, not the current 15–18-point bullet rhythm.
- Preserve the centered blue underlined name, centered contact row, uppercase ruled headings, right-aligned dates, selective bold evidence, italic technology stacks, and real round bullets.
- Generate the final PDF through Microsoft Word so the PDF embeds Times New Roman rather than a LibreOffice substitute.

## Content Strategy

Both resumes retain the original order: Summary, Education, Technical Skills, Professional Experience, Projects.

### AI/LLM Systems

Position Joyce as an engineer who productionizes agent systems rather than merely prototypes them. Prioritize:

- orchestration, tool use, context and memory;
- evaluation, failure modes, guardrails, observability, and human gates;
- latency, token cost, reliability, crash recovery, and auditability;
- production ownership across TypeScript, Python, Rust, AWS, and GCP.

### FDE/Applied AI

Position Joyce as an engineer who turns ambiguous workflows into deployed systems. Prioritize:

- discovery, requirements translation, solution design, and end-to-end delivery;
- enterprise APIs, authentication, integrations, and reusable implementation patterns;
- customer/domain empathy, production adoption, and debugging across the stack;
- agent evaluation, escalation boundaries, and reliability in real workflows.

## Evidence and Quantification

Use this evidence hierarchy:

1. Existing verified impact metrics: 5 specialized agents, approximately 4K cached tokens, 80% compaction threshold, 40% response-time improvement, and other facts retained from the original resume.
2. Repository-verifiable scope metrics: Agent Bridge's five verbs, two SDKs, three storage tiers, and five MCP tools; AgentFlow's typed graph, parallel scheduling, gates, policies, and mission lifecycle; Agent Hook's event sources and bounded execution; In-Context Search's six providers; Kaggle Team's three roles, four phases, and score/cost feedback loop.
3. Conservative estimated outcome metrics only where they materially improve a bullet and remain defensible in an interview. Record these separately in a metrics-to-confirm checklist. Do not present fabricated precision.

Every bullet should express a compact causal chain: problem or scope → technical decision → reliability, delivery, or user outcome. Avoid feature inventories, generic adjectives, and claims that cannot be explained from the code or work history.

## SiriusMindshare Narrative

Keep one Machine Learning Engineer role. Connect the production multi-agent platform and LVLM paper as one applied-AI trajectory:

1. production agent workflows established orchestration, context, tool, and evaluation patterns;
2. the same reliability and evaluation discipline was extended to multimodal retail-attention assessment;
3. the resulting paper was accepted for publication and presentation at IEEE CCET 2026 and remains forthcoming.

Do not imply the paper is already public or published.

## Deliverables

- AI/LLM Systems DOCX and PDF, one page.
- FDE/Applied AI DOCX and PDF, one page.
- A private metrics-to-confirm checklist beside the resume sources.
- Updated website PDF assets at the existing filenames; no website layout changes.

## Verification Gates

- The original DOCX SHA-256 remains unchanged.
- Both DOCX files explicitly declare Times New Roman for visible text.
- Both PDFs embed Times New Roman and do not contain Liberation Serif or Linux Libertine.
- Wrapped bullet baselines are approximately 12 points and adjacent bullets have no added paragraph gap.
- Both PDFs have exactly one page and are visually inspected at 100%.
- Content tests confirm variant-specific projects, forthcoming publication language, hyperlinks, and prohibited-claim checks.
- Website resume assets are byte-identical to the final PDFs and existing website tests still pass.
