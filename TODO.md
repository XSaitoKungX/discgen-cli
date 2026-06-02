# TODO

Roadmap for `discgen-cli`.

Priority guide:
- `P0` release blocker
- `P1` high-value next work
- `P2` important improvement
- `P3` nice to have

Status guide:
- `[ ]` planned
- `[~]` in progress
- `[x]` shipped

---

## Release Baseline

Current shipped foundation:
- `[x]` Interactive Clack wizard
- `[x]` Presets: `basic`, `moderation`, `full`
- `[x]` Slash, prefix, and mixed command scaffolding
- `[x]` `generate` subcommand for commands, events, guards, buttons, selects, modals, and services
- `[x]` Discord.js v14 TypeScript bot template
- `[x]` Component routing for buttons, selects, and modals
- `[x]` SQLite and PostgreSQL database templates
- `[x]` i18n template with typed `en` and `de` locales
- `[x]` Logger, env validation, cooldown, embed helper, and paginator utilities
- `[x]` Generated GitHub Actions CI
- `[x]` npm publishing for `discgen-cli`

---

## 1. Stabilize The CLI

- `[ ]` `P0` Add CI smoke tests that scaffold `basic`, `moderation`, and `full`, then run `npm install`, `npm run typecheck`, `npm run lint`, and `npm run build` in each output.
- `[ ]` `P0` Add snapshot tests for generated files, grouped by preset and optional feature.
- `[x]` `P0` Add `npm run typecheck` to release validation for the CLI package.
- `[ ]` `P1` Add `discgen-cli doctor` for scaffolded projects.
  Acceptance: reports missing `.env` keys, unsupported Node version, missing dependencies, outdated generated scripts, and invalid `tsconfig`.
- `[ ]` `P1` Add safer overwrite handling.
  Acceptance: warn when target directory is non-empty, support `--force`, and never delete without explicit confirmation.
- `[ ]` `P2` Add `--json` output for automation.
  Acceptance: returns project path, preset, package manager, written files, skipped steps, and warnings.

---

## 2. Improve CLI UX

- `[x]` `P1` Add `--output <dir>` to scaffold into an explicit directory.
- `[x]` `P1` Add `discgen-cli list`.
  Acceptance: prints presets, feature flags, database options, command types, and generate types.
- `[x]` `P1` Improve validation for generated names.
  Acceptance: reject invalid npm package names for projects and invalid file/module names for generated files.
- `[ ]` `P2` Add clearer post-scaffold guidance when install, git init, or deploy steps fail.
- `[ ]` `P2` Add shell completions for Bash, Zsh, and Fish.
- `[ ]` `P3` Add a non-interactive mode that fails fast when required arguments are missing.

---

## 3. Template Quality

- `[ ]` `P0` Ensure every generated preset passes TypeScript, ESLint, and build checks.
- `[x]` `P1` Add generated-project `typecheck` script and use it in generated CI.
- `[ ]` `P1` Add Prettier coverage for generated projects.
  Acceptance: `format` script covers `src`, config files, and Markdown.
- `[ ]` `P1` Review Components v2 usage for Discord.js compatibility and graceful fallback messaging.
- `[ ]` `P1` Make economy templates fully database-parity tested for none, SQLite, and PostgreSQL.
- `[ ]` `P2` Add VS Code workspace recommendations.
- `[ ]` `P2` Add Dockerfile and docker-compose templates as wizard options.
- `[ ]` `P2` Add `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` template options.

---

## 4. Feature Templates

- `[ ]` `P1` MongoDB template.
  Acceptance: uses `mongoose`, typed user schema, and economy parity with SQLite/PostgreSQL.
- `[ ]` `P1` Ticket system.
  Acceptance: `/ticket open|close|add|remove`, permission checks, transcript export, and database-aware state.
- `[ ]` `P1` Logging and audit feature.
  Acceptance: configurable channel and handlers for member join/leave, message delete, moderation actions, and errors.
- `[ ]` `P2` Leveling and XP feature.
  Acceptance: XP per message, level-up event, `/rank`, and leaderboard.
- `[ ]` `P2` Giveaway feature.
  Acceptance: `/giveaway start|end|reroll`, timer persistence, winner selection, and embed UI.
- `[ ]` `P2` Welcome and farewell feature.
- `[ ]` `P2` Reaction roles feature.
- `[ ]` `P2` Poll feature.
- `[ ]` `P2` Suggestions feature.
- `[ ]` `P2` Tags and custom text commands.
- `[ ]` `P3` Reminder feature with persistent timers.
- `[ ]` `P3` Auto-role feature.
- `[ ]` `P3` Real music implementation.
  Acceptance: uses maintained voice/audio dependencies and documents external requirements.

---

## 5. Existing Project Support

- `[ ]` `P1` Add `discgen-cli upgrade`.
  Acceptance: detects generated project version, previews changes, supports dry-run, and writes a backup before patching.
- `[x]` `P1` Store generator metadata in scaffolded projects.
  Acceptance: writes `.discgen.json` with CLI version, preset, selected features, database, and command type.
- `[ ]` `P2` Add template diff output for upgrades.
- `[ ]` `P2` Add migration notes when generated package versions change.

---

## 6. Publishing And Docs

- `[ ]` `P1` Automate GitHub releases from version tags.
  Acceptance: includes changelog, npm version, and generated artifact summary.
- `[ ]` `P1` Add release checklist to `CHANGELOG.md` workflow.
- `[ ]` `P2` Add website page on `xsaitox.dev`.
- `[ ]` `P2` Add interactive demo or StackBlitz-style preview.
- `[ ]` `P2` Document every preset with screenshots or terminal captures.
- `[ ]` `P3` Add advanced docs for extending handlers, database adapters, and components.

---

## Known Issues

- `[ ]` `P0` Generated templates need CI smoke coverage across every preset to prevent lint/type regressions.
- `[ ]` `P1` Generated SQLite projects may show a `prebuild-install` deprecation warning through native dependencies; monitor `better-sqlite3` alternatives or upstream changes.
