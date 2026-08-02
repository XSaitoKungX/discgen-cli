# TODO

Authoritative backlog and known-issues list for `discgen-cli`.

Priorities:

- `P1` — release blocker, data-loss/security risk, or advertised core behavior is broken
- `P2` — important correctness, testing, or maintainability work
- `P3` — useful enhancement after core guarantees are covered

## P1 — correctness and safety

- [ ] **Complete Prefix feature parity.** Prefix and Both projects now receive working `help` and
      `ping` commands, but Moderation, Utility, Fun, Economy, Music, Components, and i18n command packs
      are slash-only. Either generate real prefix variants or hide incompatible feature choices for a
      prefix-only wizard.
- [ ] **Compile generated projects in CI.** Snapshot and substring tests prove text stability, not
      that every generated variant typechecks. Add a hermetic matrix covering Slash/Prefix/Both,
      presets, every database, and feature combinations; run generated `tsc --noEmit` without network
      access.
- [ ] **Make overwrite recoverable.** The wizard currently deletes an accepted existing target
      before the new scaffold is complete. Generate into a sibling temporary directory, then swap it
      into place; restore or retain the original if generation fails.
- [ ] **Remove lower-layer process termination.** `src/cli/prompts.ts`, `wizard.ts`, and
      `generate.ts` still call `process.exit`. Model cancellation and invalid input as typed outcomes
      handled once by `src/index.ts`, with cancellation exiting successfully and without a stack trace.

## P2 — quality and maintainability

### Generator integrity

- [ ] Derive feature names, labels, package dependencies, file manifests, help text, and
      compatibility from one typed feature registry. The current parallel conditionals can drift.
- [ ] Split `src/templates/commands/economy.ts` into per-database strategy fragments; the current
      file duplicates command rendering across four storage modes and is the largest maintenance
      hotspot.
- [ ] Validate dynamically imported commands, events, and interaction handlers with explicit type
      guards and report duplicate names/custom IDs instead of silently skipping or replacing entries.
- [ ] Guard interaction-loader directory reads with `statSync().isDirectory()` as the command
      loader already does.
- [ ] Catch rejected async event handlers at the registration boundary and log the event name.
      `void event.execute(...)` currently delegates failures to the global rejection handler.
- [ ] Extend environment validation from Discord credentials to selected database settings and
      `LOG_CHANNEL_ID`, while distinguishing required and optional variables.
- [ ] Replace PostgreSQL startup DDL with a documented migration workflow before the schema grows;
      the current initializer is intentionally minimal.
- [ ] Configure Discord partials and document privileged-intent requirements so audit logging has
      predictable coverage for uncached messages and members.
- [ ] Persist i18n guild choices through the selected storage adapter and translate all generated
      user-facing command responses, not only the current subset.

### CLI behavior

- [ ] Add `--output <dir>` with containment rules and a clear interaction with the positional
      project name.
- [ ] Add a non-interactive mode that never opens prompts and fails with structured diagnostics
      when required options are missing.
- [ ] Add `--json` output for automation (`target`, written files, selected package manager,
      warnings).
- [ ] Add `discgen-cli list` for presets, features, databases, and `generate` types.
- [ ] Add `discgen-cli doctor` to check generated Node versions, environment keys, dependency
      drift, loader output, and TypeScript configuration.
- [ ] Add `discgen-cli upgrade` only after template-version metadata and a safe three-way migration
      design exist.

### Testing and verification

- [ ] Add behavioral tests for Wizard cancellation, preset overrides, overwrite refusal, dry-run,
      failed Git initialization, and failed dependency installation.
- [ ] Test that every path produced by the file manifest stays beneath the project root.
- [ ] Add tests for duplicate command/event/interaction IDs and malformed dynamically imported
      modules.
- [ ] Add coverage reporting with a documented threshold; prioritize branch coverage in
      orchestration and validation.
- [ ] Add generated-project runtime smoke tests for loader discovery after `npm run build`.
- [ ] Review and triage the one low-severity advisory reported by `npm install`. Do not run
      `npm audit fix` blindly; record the affected package, exploitability, and chosen resolution.

### Release and repository hygiene

- [ ] Add the generated-project compile/load smoke matrix to CI before publishing.
- [ ] Make the release job depend on the full CI gate and fail closed; the GitHub Release job
      currently runs with `if: always()`.
- [ ] Generate release notes robustly when the tag has no matching changelog section.
- [ ] Add `CONTRIBUTING.md` and a lightweight issue/PR template for this repository.
- [ ] Decide whether `dist/` remains committed. If yes, verify it in CI; if no, remove it from Git
      and build only for package publication.

## P3 — product roadmap

- [ ] Redis-backed cache/rate-limit feature.
- [ ] Ticket system with permission checks and transcript export.
- [ ] Persistent leveling/XP with a rank command and leaderboard.
- [ ] Giveaways with durable timers, reroll, and restart recovery.
- [ ] Reaction roles and button roles backed by the selected database.
- [ ] Welcome/farewell messages with configurable destinations.
- [ ] Persistent reminders with restart recovery.
- [ ] Polls with durable voting and close times.
- [ ] Auto-role assignment with documented permission requirements.
- [ ] Suggestions with threads, voting, and moderation state.
- [ ] Guild-specific tags/custom commands.
- [ ] Real music support after selecting a maintained audio/source stack.
- [ ] Shell completion for Bash, Zsh, Fish, and PowerShell.
- [ ] `generate middleware` and `generate task` after loader contracts exist for both.
- [ ] Optional editor recommendations for generated projects.
- [ ] Documentation site or terminal recording after the CLI contract stabilizes.

## Completed in the current 1.6 work

- [x] Consolidated agent guidance into `AGENTS.md`; removed stale `CLAUDE.md` and `PROMPT.md`.
- [x] Centralized validation for project names, generated names, event names, and categories;
      blocked traversal, separators, and Windows reserved device names.
- [x] Switched Commander startup to `parseAsync()` and added a clear Node version error boundary.
- [x] Raised the supported runtime to Node.js `>=22.13.0` and aligned CI with Node 22/24.
- [x] Updated root and generated dependencies to the newest mutually compatible releases.
- [x] Kept TypeScript 6 because `@typescript-eslint@8.65` excludes TypeScript 7; aligned Node types
      with the minimum supported Node 22 runtime.
- [x] Changed generated production builds from a single `tsup` entry bundle to full-tree `tsc`
      compilation so dynamic loaders can discover commands, events, and interactions in `dist/`.
- [x] Initialized SQLite, PostgreSQL, and MongoDB before handler loading and validated database
      connection variables at the database boundary.
- [x] Added real Prefix `help` and `ping` commands and stopped emitting slash feature commands for
      prefix-only projects.
- [x] Made Economy claims coherent and atomic: no-database projects use one shared in-memory store;
      SQLite uses a transaction, PostgreSQL serializes each user through an advisory transaction
      lock, and MongoDB uses a conditional update with duplicate-key recovery.
- [x] Removed the unused generated `drizzle-kit` and `tsup` dependencies.
- [x] Added an explicit root `typecheck` script and included it in the publish gate.
- [x] Reworked README and design documentation to describe actual behavior and limitations.

## Maturity assessment notes

The codebase is a local scaffolding CLI rather than an on-chain protocol, so arithmetic,
decentralization, and transaction-ordering categories from the maturity framework are not directly
applicable. Relevant findings are:

- **Input/auth boundary:** improved by central path-segment validation; shell execution remains
  constrained to package-manager and Git choices.
- **Complexity:** generally small modules, with Economy template duplication and parallel feature
  registries as the main hotspots.
- **Documentation:** consolidated and materially improved; release/version documents still need an
  automated consistency gate.
- **Low-level operations:** no native/unsafe code in the CLI; generated SQLite introduces a native
  dependency and needs cross-platform smoke coverage.
- **Testing:** broad template snapshots exist, but orchestration, compiled generated output, loader
  behavior, and concurrency are not sufficiently verified.
- **Auditing/operations:** logging exists for generated bots, but repository incident response,
  coverage thresholds, and a reviewed dependency-advisory process remain incomplete.
