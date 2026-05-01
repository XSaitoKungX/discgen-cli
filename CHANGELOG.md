# Changelog

All notable changes to `discgen-cli` will be documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.2.0] — 2026-05-01

### Added

- **`--template <preset>` flag** — skip the interactive wizard with a preset: `basic`, `moderation`, or `full`
  - `basic` — slash commands, no features, no database
  - `moderation` — slash commands, moderation + utility features, no database
  - `full` — slash + prefix, all features, SQLite
- **Env validator template** (`src/utils/env.ts`) — generated bots now ship with a typed env validation module that checks `DISCORD_TOKEN` and `CLIENT_ID` on startup and exits with a clear error if any are missing
- **Cooldown utility template** (`src/utils/cooldown.ts`) — per-user command cooldown helper with auto-cleanup to prevent memory leaks
- **Help command template** (`src/commands/utility/help.ts`) — auto-generated `/help` command using Components v2 for slash bots; plain message reply for prefix bots

### Fixed

- `src/index.ts`: replaced `createRequire(import.meta.url)` (invalid in CJS output) with `readFileSync` + `__dirname` to read version from `package.json`

### Tests

- 56 tests passing (up from 40)

---

## [1.1.1] — 2026-05-01

### Fixed

- Release workflow split into two independent jobs so GitHub Release is created even if npm publish fails
- Replaced `softprops/action-gh-release` with `gh release create` (pre-installed GitHub CLI) for more reliable release creation
- CI matrix corrected: Node 18 removed — `vitest` v4 requires Node >= 20 (`node:util styleText` not available in Node 18)

---

## [1.1.0] — 2026-05-01

### Added

- **Logger template** — every generated bot now ships with `src/utils/logger.ts`:
  - Zero dependencies (pure Node.js, no pino/winston)
  - Log levels: `debug`, `info`, `warn`, `error` with ANSI colors + icons
  - Context parameter: `logger.info('msg', 'ready')` → `[ready]` tag in output
  - Error stack traces automatically appended on `logger.error()`
  - `LOG_LEVEL` env var support (default: `info`)
  - `error` → `stderr`, all others → `stdout`
- **Logger wired into generated bot** — `ready.ts`, `interactionCreate.ts` and `index.ts` all use the logger instead of `console.log/error`
- **`unhandledRejection` handler** in generated `index.ts` — logs uncaught errors via `logger.error`
- **GitHub Actions CI** (`.github/workflows/ci.yml`) — Node 18/20/22 matrix, runs lint + build + tests on push/PR to discgen-cli repo
- **GitHub Actions Release** (`.github/workflows/release.yml`) — auto-publishes to npm and creates a GitHub Release on `v*` tag push

### How to use auto-release

```bash
# bump version in package.json, then:
git tag v1.1.0
git push origin v1.1.0
# → CI runs, npm publish fires, GitHub Release is created automatically
```

---

## [1.0.1] — 2026-05-01

### Fixed

- README banner now uses the correct SVG logo (`assets/logo.svg`) — the `assets/banner.png` reference was broken
- Added `📦 Installation` section to README with all three usage options (npx, global install, local dependency) — usage after `npm install discgen-cli` was previously undocumented

---

## [1.0.0] — 2026-05-01

### Added

- Interactive wizard via `@clack/prompts` (project name, command type, features, database, package manager, git, install)
- Argument parsing via `commander`: positional `[name]`, `--no-install`, `--no-git`, `--dry-run`
- `--dry-run` flag: previews all files that would be generated without writing to disk
- Node.js version guard — exits with a clear error on Node < 18
- Overwrite confirmation when target directory already exists
- "Next steps" output after successful scaffolding
- Package manager auto-detection (`npm` / `pnpm` / `bun`)
- Git repository initialization + initial commit after scaffolding

### Templates

- Base bot: `src/index.ts`, `src/types/index.ts`, command handler, event handler, `deploy-commands.ts`
- Slash Commands, Prefix Commands, or Both
- Moderation commands: `ban`, `kick`, `timeout`, `warn`
- Utility commands: `ping`, `userinfo`, `serverinfo` — Discord Components v2
- Fun commands: `coinflip`, `8ball`, `meme` — Discord Components v2
- Economy commands: `balance`, `daily`, `leaderboard` — Discord Components v2
- Music commands: `play`, `stop` (placeholder, requires `@discordjs/voice`)
- SQLite database setup via `better-sqlite3`
- PostgreSQL database setup via `pg` + `drizzle-orm`
- Auto-generated `README.md`, `.env.example`, `.gitignore`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc`
- GitHub Actions CI workflow (`.github/workflows/ci.yml`) — Node 18/20/22 matrix

### Tech Stack

- CLI: `@clack/prompts` ^1.3, `commander` ^14, `fs-extra` ^11, `detect-package-manager` ^3
- Build: `tsup` ^8.5, `tsx` ^4.21, `typescript` ^6
- Lint: `eslint` ^10 (flat config), `@typescript-eslint` ^8
- Tests: `vitest` ^4 — 32 unit tests
- Generated bot targets: `discord.js` ^14.18, `dotenv` ^16
