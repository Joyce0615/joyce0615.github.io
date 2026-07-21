# Joyce Resume and Personal Website Refresh

## Objective

Increase Joyce Xie's interview conversion for early-career Applied AI, AI/LLM Systems, and Forward Deployed Engineer roles. Produce two ATS-friendly one-page resumes and refresh the personal website so both artifacts tell one coherent story: Joyce builds production applied-AI systems spanning multi-agent products, agent infrastructure, and LVLM-based retail research.

## Deliverables

1. `Dongjun_Xie_Resume_2026_AI_LLM_Systems.docx` and matching PDF.
2. `Dongjun_Xie_Resume_2026_FDE_Applied_AI.docx` and matching PDF.
3. Updated static personal website in `personal-website/`.
4. A local web server opened in the in-app browser for visual review.

The existing resume files remain unchanged as source references.

## Shared Positioning

Use the headline and narrative "Applied AI & Agent Systems Engineer." Present Joyce as an engineer who moves between product delivery and systems depth: full-stack LLM applications, agent orchestration, tool integration, context and memory pipelines, evaluation, guardrails, deployment, and observability.

SiriusMindshare is one applied-AI role with two related workstreams, not two unrelated experiences:

- Production multi-agent product engineering.
- LVLM-based retail video intelligence research.

The bridge is applied-AI systems engineering: prompt and context pipelines, structured inference, quality assessment, and reliable delivery. Do not claim that the paper itself uses multi-agent orchestration unless the source material proves it.

## Resume Design

### Visual system

Preserve the existing single-column, black-and-white, conventional resume format. Keep section order, typography character, and compact entry structure recognizable while improving density.

- US Letter, exactly one page per version.
- Narrower but professional page margins and section spacing.
- Approximately 9.5-10 pt minimum body text, with readable line height.
- Compact header and contact row.
- ATS-safe text, real bullets, standard headings, and no decorative sidebars or skill charts.
- Hyperlinks for email, LinkedIn, GitHub, and portfolio where space permits.
- Export both DOCX and PDF; render and inspect the final page before delivery.

Remove low-signal content such as "Vibe Coding," broad unsupported proficiency claims, and coursework that does not improve role fit. Preserve factual metrics only when already supported by Joyce's source material; do not invent usage, performance, funding, or adoption numbers.

### AI/LLM Systems version

Prioritize systems architecture, reliability, and technical depth.

- Summary: production agent systems, orchestration, context/memory, tools, evals, guardrails, and cloud infrastructure.
- SiriusMindshare: multi-agent architecture, cache-aware prompt assembly, context compression, structured inference/reliability, and the accepted retail LVLM research paper.
- Featured projects: AgentFlow, Agent Bridge, and Kaggle Team.
- Compact additional open-source line: Agent Hook and jsfetch when space permits.
- Skills order: Agent/LLM Systems; Languages; Infrastructure/Cloud; Frameworks/Data.

### FDE / Applied AI version

Prioritize end-to-end ownership, customer-facing deployment, product judgment, and integration breadth.

- Summary: turning ambiguous workflows into deployed AI products using TypeScript/Python, full-stack delivery, tool/API integration, and evaluation.
- SiriusMindshare: applied-AI product delivery plus the connected LVLM research workstream.
- Retain concise evidence from the two 1 Thing Against Racism internships to demonstrate cross-platform delivery and stakeholder-facing product work.
- Featured projects: Agent Hook, Chrome In-Context Search, and AgentFlow or Agent Bridge, selected by available page space and strongest job alignment.
- Skills order: TypeScript/Python and full-stack stack; LLM/agent capabilities; cloud/deployment; data systems.

### Publication wording

Use a compact line within SiriusMindshare or a one-line Selected Publication/Recognition entry:

> Co-developed an LVLM-based retail attention-quality assessment framework; paper accepted for publication and presentation at IEEE CCET 2026 (forthcoming).

When space allows, include the exact title: "From Aisle Video to Shelf Intelligence: A Generative AI and LVLM Framework for Retail Attention Quality Assessment." Do not link to a manuscript or describe it as already published.

## Website Design

Retain the current static HTML architecture and dark visual identity. Improve editorial focus rather than rebuilding the site in a new framework.

### Information architecture

1. Hero: "Applied AI & Agent Systems Engineer," concise value proposition, GitHub/resume/contact actions.
2. About: unified applied-AI narrative across product systems and research.
3. Featured work: three deeper case studies selected from AgentFlow, Agent Bridge, and one highly demonstrable product project.
4. Open-source projects: compact cards for Agent Hook, Chrome In-Context Search, Kaggle Team, jsfetch, and remaining relevant projects.
5. Experience: SiriusMindshare presented as one role with two connected workstreams, followed by earlier internships.
6. Publication: accepted IEEE CCET 2026 paper labeled "Accepted · Forthcoming," with no manuscript link.
7. Skills, education, and contact.

### Content rules

- Link each public project to `https://github.com/Joyce0615/<repository>`.
- Base descriptions on repository evidence and existing resume source material.
- Remove or replace unverifiable vanity statistics such as generic code-line or agent-count badges.
- Use concrete engineering language: architecture, tools, boundaries, reliability mechanisms, and delivery outcomes.
- Avoid implying that all projects are production deployments or that the forthcoming paper is public.

### Interaction and accessibility

- Preserve responsive navigation and existing lightweight motion where it aids hierarchy.
- Ensure keyboard-visible links and buttons, useful alt text, semantic headings, sufficient color contrast, and mobile-friendly project layouts.
- Resume actions must clearly distinguish the two resume variants.

## Verification

### Resumes

- Render each DOCX to page PNGs and PDF.
- Confirm exactly one page for each version.
- Inspect at 100% for clipping, cramped text, broken links, awkward wraps, and inconsistent spacing.
- Extract final text to verify headings, dates, publication status, and ATS-readable content.

### Website

- Serve locally over HTTP.
- Inspect desktop and mobile layouts in the in-app browser.
- Verify navigation, project links, resume links, publication wording, responsive layout, and absence of console errors.
- Open the final localhost page for user review.

## Out of Scope

- Publishing or deploying the site to a remote host.
- Publishing or exposing the non-public paper.
- Creating claims, metrics, or technologies not supported by the local repositories and supplied materials.
- Per-company resume rewrites beyond the two agreed variants.
