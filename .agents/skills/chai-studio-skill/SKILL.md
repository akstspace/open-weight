---
name: chai-studio-skill
description: Use when a project is connected to Chai Studio MCP for application-aware design system work, Chai-governed redesigns, preset/ruleset selection, UI audits, audit uploads, and violation follow-up. Triggers when the user mentions Chai Studio, chai-studio.json, Chai MCP, design presets, audit rulesets, redesign workflow, uploading UI audit results, or syncing project design guidance with MCP.
license: MIT
metadata:
  version: 1.0.0
  owner: akshayt
  short-description: Use Chai Studio MCP for design rules and audits
---

# Chai Studio MCP

Use this skill to make Chai Studio MCP the only source of truth for design context and audit rules.

## First Move

1. Look for `chai-studio.json` at the project root.
2. If it is missing, call `get-applications`, ask the user to choose which application to configure, then create `chai-studio.json` from that selection.
3. Read the configured application, preset, and audit rulesets before editing UI or running audits.
4. Always fetch design and rule context live from MCP before editing UI or running audits.

For the config schema and examples, read `references/config.md`.
For full workflows, redesign protocol, and payload patterns, read `references/workflows.md`.

## Default Project Contract

`chai-studio.json` identifies the project's default Chai Studio application. Once present, use it without repeatedly asking the user:

- `applicationId`: default application for audits and design context.
- `presetId`: preferred design preset; verify against Chai Studio when possible.
- `auditRuleSetIds`: default rulesets for audit uploads. Pick this from the selected application's `auditRuleSetIds`, then validate them with `get-rulesets` using `applicationId`.

Do not invent IDs. Fetch them from Chai Studio MCP.

## MCP Tool Map

- `get-profile`
  - **Purpose**: Confirm authentication when the connection is uncertain.
- `get-applications`
  - **Purpose**: Fetches all applications belonging to the authenticated user.
  - **Includes**: Crucial metadata linking each app to its design system (`presetId`) and its array of connected audit rulesets (`auditRuleSetIds`).
- `get-design-doc`
  - **Input**: `applicationId`
  - **Purpose**: Dynamically generates and returns a complete `DESIGN.md` document matching the "preset" linked to that specific application. This dictates all token-level stylings (colors, typography, spacing, shadows).
- `get-presets`
  - **Purpose**: Fetches all raw design presets configuration data associated with the user.
- `get-rulesets`
  - **Input**: `applicationId`
  - **Purpose**: Looks up the `auditRuleSetIds` tied to the given application and returns the full rule definitions. This tells an agent exactly what constraints rules apply when editing the UI or performing an audit for that app.
- `get_audits`
  - **Input**: `applicationId` (optional)
  - **Purpose**: Fetches the history of audit runs (id, status, severity counts, etc).
- `get_audit_violations`
  - **Input**: `auditId` (plus optional filters like status, severity, category)
  - **Purpose**: Fetches the granular violations for a specific audit. Crucially, each finding returns an `aiFixPrompt`, the exact `codeSnippet`, and guidance to allow an agent to immediately patch the failing file.
- `add_audit_results`
  - **Input**: Comprehensive audit block including `applicationId`, `auditRuleSetId`, `status`, and array of violations.
  - **Purpose**: Legacy batch upload path. Use only when streaming tools are unavailable.
- `start_audit_run`
  - **Input**: `applicationId`, `auditRuleSetId`, optional `summary`, optional `totalRulesEvaluated`
  - **Purpose**: Creates one audit run before analysis so findings can be uploaded as they are discovered.
- `add_audit_violation`
  - **Input**: `auditId`, `violation`
  - **Purpose**: Uploads one violation to the existing audit run. The server skips duplicates for the same audit when the same rule/file/line/snippet/description is uploaded again.
- `complete_audit_run`
  - **Input**: `auditId`, `status`, optional `summary`, optional `totalRulesEvaluated`
  - **Purpose**: Marks a streaming audit run `completed` or `failed` after all findings have been uploaded.
- `update_violation_status`
  - **Input**: `violationId`, `status`
  - **Purpose**: Allows the agent or IDE to automatically mark an open violation as resolved, ignored, or a `false_positive`. If all violations in an audit run are squashed, this tool auto-resolves the parent audit status.

Name hygiene matters: do not rename MCP tools when calling them. Chai Studio currently exposes both hyphenated (`get-profile`, `get-design-doc`, `get-rulesets`, `get-applications`, `get-presets`) and underscored (`get_audits`, `get_audit_violations`, `start_audit_run`, `add_audit_violation`, `complete_audit_run`, `add_audit_results`, `update_violation_status`) tool names.

If there is a `DESIGN.md` or `DESIGN-RULES.md` already present in the workspace, you MUST delete it. The source of truth is strictly the Chai Studio MCP server. Do not create or maintain local design mirror docs.

## Redesign Flow

When the user asks to redesign a page, component, app surface, visual system, or interaction, read `references/workflows.md#redesign-workflow` and follow that protocol. The mandatory loop is:

1. **Context**: Read `chai-studio.json`, then fetch live context with `get-applications`, `get-design-doc`, `get-rulesets`, and `get-presets`.
2. **Plan**: Identify affected files/routes/components and translate Chai Studio preset/ruleset constraints into implementation decisions.
3. **Implement**: Redesign with the MCP `DESIGN.md` and linked rulesets as the source of truth.
4. **Validate**: After write changes are done, always run the project build when a build command is available, plus relevant static checks. If Chrome DevTools MCP or Playwright MCP is available, ask the user whether they want browser tests/review through those MCPs.
5. **Audit**: Reconcile prior audits, then create a fresh streaming audit run per configured ruleset.
6. **Fix**: Fix every genuine violation introduced or remaining in scope, re-validate, then mark fixed prior violations with `update_violation_status`.

Do not stop after a visual pass. A Chai Studio redesign is complete only after implementation, validation, audit upload, and verified violation status updates are handled or explicitly blocked.

## Project Spec Execution Protocol

To follow Chai Studio project specifications effectively, treat project rules as a layered contract:

1. Read application-level `DESIGN.md` first via `get-design-doc(applicationId)` and extract hard constraints.
2. Read configured rulesets via `get-rulesets(applicationId)` and map rule IDs/categories/severities.
3. Read configured preset via `get-presets` for token-level styling guidance.

Priority order when rules conflict:

1. Safety and explicit user instruction
2. Chai Studio `DESIGN.md` hard constraints
3. Chai Studio ruleset severity and guidance
4. Preset/token conventions
5. Explicit user preferences for this task

When producing findings or fixes:

- Keep changes minimal and targeted; do not refactor unrelated surfaces.
- Provide exact path + line/snippet + impact + concrete fix.
- Prioritize critical accessibility, keyboard, focus/dialog, and metadata correctness issues before lower-severity visual polish.
- Avoid introducing prohibited patterns from project specs (for example unnecessary decorative motion or forbidden visual cliches).

## Audit Standards

Audit workflow is mandatory and always two-phase:

1. Reconcile previous audits first.
2. Start and upload a new audit run.

When the user asks for an audit, always run phase 1 before phase 2.

Audit depth is mandatory:

- Audit each and every relevant page and each and every relevant component in scope.
- Produce granular findings per page/component (do not collapse multiple issues into one vague item).
- Include exact artifact context in every finding: page/screen, component name, file path, and line/snippet when available.

Before uploading:

1. Identify the configured app and rulesets from `chai-studio.json`.
2. Get previous audits with `get_audits` for the same `applicationId`.
3. For relevant prior runs, fetch findings with `get_audit_violations`.
4. Verify in current code/UI whether prior issues are fixed.
5. For each verified fix, call `update_violation_status` before the new run.
6. Audit the actual files or UI surfaces requested by the user.
7. Classify each finding into supported MCP categories and severities before upload.
8. Report each violation with exact file path, line/snippet, why it matters, and a concrete fix.
9. Ensure each finding is grounded in Chai Studio `DESIGN.md` and/or ruleset guidance.
10. Upload only genuine findings unless the user explicitly asks for dummy/test audits.
11. Start one new audit run with `start_audit_run`, upload each violation immediately with `add_audit_violation`, then call `complete_audit_run` when finished. If there are zero violations, still start and complete the run.
12. Keep an in-memory set of uploaded finding fingerprints for the current run and skip repeats before calling MCP. Use at least `ruleId`, `filePath`, `lineStart`, `lineEnd`, normalized `codeSnippet`, and normalized `violationDescription` in the fingerprint.
13. If `chai-studio.json` has multiple `auditRuleSetIds`, audit each ruleset separately. For every ruleset, create one audit run, evaluate that ruleset's rules, upload only findings from that ruleset to that run, then complete that run before moving on or after finishing the ruleset's pass.

Browser/runtime validation:

- If Chrome DevTools MCP, Playwright MCP, or equivalent browser MCP tooling is available, ask the user whether they want browser tests and runtime review through those MCPs before running them.
- If the user agrees, open the app and validate in runtime in addition to static code review.
- Use browser/devtools-style checks for rendered behavior: accessibility tree/labels, keyboard flow, focus handling, responsive behavior, and interaction states.
- Record whether each finding came from static review, runtime validation, or both.

Build verification:

- Once write changes are complete, always run the project build command when one exists (`build` script, framework build command, or documented equivalent).
- Run the build before final audit upload when feasible, so audit results reflect buildable code.
- If the build cannot run because dependencies, environment variables, or tooling are missing, report the exact blocker and run the strongest available fallback checks.

Each uploaded violation must include a self-contained `aiFixPrompt` that another agent could use without reading the whole conversation.

Chai Studio validation constraints to respect:

- `add_audit_results.status` must be `completed` or `failed`.
- `violations` max length is 200 per upload.
- `complete_audit_run.status` must be `completed` or `failed`.
- Prefer streaming uploads (`start_audit_run` -> `add_audit_violation` -> `complete_audit_run`) over batch uploads.
- `severity` must be one of: `critical`, `high`, `medium`, `low`.
- `category` must be one of: `accessibility`, `visual`, `typography`, `color`, `layout`, `motion`, `interaction`, `responsive`, `metadata`, `performance`, `content`.
- Provide line numbers as positive integers when present.

## Status Updates

Only mark a violation resolved after verifying the code or UI changed. Use:

- `resolved`: fixed and verified.
- `ignored`: intentionally accepted by the team or outside scope.
- `false_positive`: rule did not actually apply.

When changing statuses, include the resolver identity when available.

When running audits, status reconciliation is mandatory:

- Always check previous audits first.
- Resolve already-fixed violations before creating a fresh audit run.
- Do not skip the new run after reconciliation.

Fix workflow requirement:

- When the user asks to fix audit entries, implement code/UI fixes for the selected violations.
- After each fix, re-validate (runtime when available).
- Then call `update_violation_status` so each fixed item is marked appropriately (`resolved`, `ignored`, or `false_positive` with evidence).

## Safety

- Do not create dummy audits unless the user asks for test data.
- Do not create or update local design-spec mirror files (`DESIGN.md`, `DESIGN-RULES.md`) as part of this skill.
- Do not migrate UI libraries, rewrite the design system, or refactor broad UI areas just to satisfy an audit.
- Prefer Chai Studio IDs and tokens over memory or guesses.
