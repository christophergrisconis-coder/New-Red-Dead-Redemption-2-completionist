# Copilot Instructions for Red Dead Completionist

## Goals
- Prefer small, shippable changes that preserve existing behavior unless the request explicitly asks for a redesign.
- Treat incomplete feature behavior as a bug and verify the final UI/flow works end-to-end.

## Before Editing
- Identify the exact files and routes involved before proposing changes.
- Restate the acceptance criteria as a short checklist in your own working notes.
- If requirements are ambiguous, choose the safest implementation path and call out assumptions in the final summary.

## Implementation Rules
- Keep edits minimal and scoped to the requested task.
- Do not refactor unrelated files in the same change.
- Preserve existing component and routing patterns in `src/routes/`, `src/components/`, and `mobile/src/`.
- When changing user-visible flows (auth, dashboards, progression, unlocks), verify both success and failure states.

## Verification Rules
- For web changes, run:
  - `npm run lint`
  - `npm run build`
- For mobile changes, run at least one startup check from `mobile/`:
  - `npm run start` (or platform-specific start command when requested)
- If any command cannot be run, clearly state what was skipped and why.

## Completion Checklist
- Confirm requested behavior is implemented.
- Confirm no unrelated files were changed.
- Report exact files touched and any follow-up risk.
- Suggest the next 1-3 concrete steps only when they are useful.

## Progress Updates
- Provide short progress updates while working.
- For long tasks, report what was completed and what is next.
