# Orchestration Plan

## Mode Selection

- Repo: `/Users/stephenbrown/Code/OPENSOURCE/ikigaifinder`
- Branch: `dev`
- Work mode: `full`
- Run folder: `agent-runs/2026-06-20-codebase-pass`
- Verifiable gates: Git remote read, fast-forward sync, dry-run push, `npm run lint`, `npm run build`, targeted search evidence, `git diff --check`, post-push branch sync.
- Human-decision blockers: product roadmap reprioritization, broad architecture redesign, auth/security-rule behavior changes that cannot be verified locally, missing external secrets for live AI/Firebase behavior.
- Resume policy: resume from `run-state.md`, `task-queue.md`, latest phase report, and Git state; push any validated local phase commit before new edits.

## Loop Plan

| Phase | Loop | Verify Gate | Stop Condition |
| --- | --- | --- | --- |
| Preflight and Repo Docs | Orchestration Planning Loop, Docs Sweep Loop | Docs match current repo and checks pass | Plan, state, queue, docs, and report pushed |
| Baseline Validation | Baseline Validation Loop, Quality Gate Selection Loop | Lint/build/test status classified with commands and ownership | Baseline clean or failures documented without source edits |
| Findings Backlog | Findings Queue Loop, Architecture Fitness Loop, Lean Code Loop | Evidence-backed backlog and scorecard | Backlog, scorecard, and queue are pushed |
| Execute Fixes and Improvements | Task Queue Loop, Fix Validation Loop, Lean Code Loop | Highest-priority local task passes targeted checks and quality gate | Focused fix is pushed or blocked with evidence |
| Package and Dead-Code Cleanup | Package Cleanup Loop, Dead Code Loop | Safe cleanup has search/compiler evidence and lint/build pass | Cleanup pushed or deferred with reason |
| Review | Judge Loop | Diff/reports/checks pass reviewer rubric | PASS or bounded follow-up tasks created |
| Stabilization Loop | Stabilization Loop, Judge Loop | Completion criteria pass | Clean pushed branch or real blocker recorded |
| Integrator | Final Completion Gate | Final checks, branch sync, and reports complete | Final report pushed |

## File Ownership

| Task | Owned Files | Notes |
| --- | --- | --- |
| T-001 | `agent-runs/2026-06-20-codebase-pass/*`, `AGENTS.md`, `spec.md` | Startup planning, resume state, and evidence-backed doc drift fixes |
| T-002 | `agent-runs/2026-06-20-codebase-pass/02-baseline-validation.md`, `run-state.md`, `task-queue.md` | Baseline command results and validation gaps |
| T-003 | `agent-runs/2026-06-20-codebase-pass/03-findings-backlog.md`, `task-queue.md` | Evidence-backed backlog and architecture/lean-code scorecard |
| T-004 | `src/constants/systemPrompt.ts`, `src/constants/questions.ts`, `src/types/index.ts`, `spec.md`, `agent-runs/2026-06-20-codebase-pass/*` | Focused M7 cleanup if search/build evidence confirms unused legacy exports |
