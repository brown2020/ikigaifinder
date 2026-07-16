# Orchestration Plan

## Mode Selection

- Repo: `/Users/stephenbrown/Code/OPENSOURCE/ikigaifinder`
- Branch: `dev`
- Work mode: Full workflow, scoped to one dependency-maintenance change
- Run folder: `agent-runs/2026-07-15-codebase-pass`
- Verifiable gates: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm outdated`, `npm audit`, Git diff/sync checks
- Human-decision blockers: Broad product changes, risky package migrations that cannot be locally verified, auth/rules/billing changes
- Resume policy: Re-run preflight, read `run-state.md` and `task-queue.md`, and continue only the recorded in-scope task

## Loop Plan

| Phase | Loop | Verify Gate | Stop Condition |
| --- | --- | --- | --- |
| Preflight and Repo Docs | Orchestration Planning Loop, Docs Sweep Loop | Docs match current repo and checks pass | Plan, state, queue, docs, and report pushed |
| Baseline Validation | Baseline Validation Loop | Lint, typecheck, tests, build, and dependency diagnostics are recorded | Baseline is clean or failures are reproducible and owned |
| Findings Backlog | Findings Queue Loop, Architecture Fitness Loop, Lean Code Loop | Evidence-backed backlog and scorecard | Backlog, scorecard, and queue are pushed |
| Execute Fixes | Task Queue Loop, Fix Validation Loop | Confirmed baseline bugs/warnings are fixed and targeted checks pass | In-scope fixes pass or are blocked with evidence |
| Package Cleanup | Package Cleanup Loop, Dead Code Loop | Kept package updates match lockfile churn; lint, tests, and build pass | Safe direct updates are complete; risky changes are deferred |
| Review | Judge Loop | Diff has no actionable correctness, scope, or architecture findings | `PASS` or failures are converted to bounded tasks |
| Stabilization | Stabilization Loop, Judge Loop | Final lint, tests, build, audit, and Git checks pass | Completion criteria pass or a real blocker is recorded |
| Integrate | Commit-Push Checkpoint Loop | Final report is pushed and local `dev` matches `origin/dev` | Clean synchronized repository |

## File Ownership

| Task | Owned Files | Notes |
| --- | --- | --- |
| T-001 | 00-orchestration-plan.md, run-state.md, task-queue.md | Startup planning and resume state |
| T-002 | 02-baseline-validation.md, 03-findings-backlog.md, task-queue.md | Establish baseline and evidence-backed package/fix scope |
| T-003 | package.json, package-lock.json, dependency-affected source/tests | Update direct dependencies and repair compatibility regressions |
| T-004 | 06-review.md, 07-stabilization-loop.md, final-report.md | Judge, stabilize, and document the verified result |
