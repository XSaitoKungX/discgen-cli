# TODO

Authoritative backlog and known-issues list for `discgen-cli`.

- `P1`: release blocker, security risk, or advertised behavior is broken
- `P2`: important correctness, testing, or maintainability work
- `P3`: post-foundation enhancement

## P1 — release confidence

- [ ] Add a hermetic generated-project CI matrix covering Slash, Prefix, Both, each database, and
      selected feature combinations. It must typecheck and build generated projects without network
      access after dependency setup.
- [ ] Make overwrite recoverable. Scaffold to a sibling temporary directory, then swap it into place
      only after successful generation; retain the existing target on failure.
- [ ] Remove lower-layer `process.exit` calls. Model cancellation and invalid input as typed outcomes
      handled once by `src/index.ts`.
- [ ] Complete Prefix feature parity, or hide feature packs that have no prefix implementation.

## P2 — correctness and maintainability

- [ ] Derive feature labels, dependencies, file manifests, help text, and compatibility from one
      typed feature registry.
- [ ] Split `src/templates/commands/economy.ts` into storage strategy fragments.
- [ ] Validate dynamically imported modules with explicit type guards; report duplicates instead of
      silently replacing command names or interaction IDs.
- [ ] Add `--json` output and a genuinely non-interactive mode for automation.
- [ ] Add generated-project loader-discovery runtime smoke tests after build.
- [ ] Replace PostgreSQL startup DDL with documented migrations before the schema expands.
- [ ] Persist i18n guild choices through the selected storage adapter.
- [ ] Review the low-severity dependency advisory reported by npm; do not run automatic audit fixes
      without reviewing the affected dependency and exploitability.
- [ ] Make the release workflow depend on all CI checks and fail closed.

## P3 — product roadmap

- [ ] `doctor` and safe three-way `upgrade` workflows using `.discgen.json` metadata.
- [ ] Shell completion for Bash, Zsh, Fish, and PowerShell.
- [ ] Persistent reminders, tickets, polls, reaction roles, tags, and leveling features.
- [ ] Document or select a maintained music/audio source stack before advertising real music support.

## Completed in 2.0.1

- [x] Consolidated repository agent guidance into `AGENTS.md` and removed parallel instruction files.
- [x] Added central safe-segment validation and blocked traversal and Windows device-name targets.
- [x] Added `list`, `--output`, and generated `.discgen.json` metadata.
- [x] Updated root and generated dependency metadata and aligned the Node.js baseline to `>=24`.
- [x] Switched generated production builds to full-tree `tsc` compilation for dynamic loaders.
- [x] Added generated database initialization and environment validation.
- [x] Added typed Prefix `help` and `ping` commands.
- [x] Made Economy daily claims coherent and atomic across all storage modes.
- [x] Added root typechecking and a publication gate that runs lint, typecheck, tests, and build.
