# TODO

Tracked tasks and planned features for `discgen-cli`.
Priorities: `P1` critical · `P2` important · `P3` nice to have

---

## CLI Core

- [x] `P1` Interactive wizard with `@clack/prompts`
- [x] `P1` Argument parsing via `commander` (`--name`, `--no-install`, `--no-git`, `--template`)
- [x] `P1` File scaffolding with `fs-extra`
- [x] `P1` Template system for all generated files
- [x] `P1` Package manager detection (`npm` / `pnpm` / `bun`)
- [x] `P1` Auto-install dependencies after scaffolding
- [x] `P1` Git init support
- [x] `P2` Overwrite confirmation if target directory exists
- [x] `P2` Node.js version check (>= 18), exit with clear error if too old
- [x] `P2` "Next steps" output after scaffolding
- [x] `P3` `--dry-run` flag to preview generated files without writing
- [x] `P2` `--template <preset>` flag: `basic` | `moderation` | `full`

---

## Templates

- [x] `P1` Base template (TypeScript, discord.js v14, command/event handler)
- [x] `P1` Slash Commands template
- [x] `P1` Prefix Commands template
- [x] `P2` Moderation commands (`ban`, `kick`, `timeout`, `warn`)
- [x] `P2` Utility commands (`ping`, `userinfo`, `serverinfo`) — Components v2
- [x] `P2` Fun commands (`coinflip`, `8ball`, `meme`) — Components v2
- [x] `P2` Economy commands (balance, daily, leaderboard) — Components v2
- [x] `P3` Music commands (placeholder with note: requires voice deps)
- [x] `P2` SQLite template (`better-sqlite3`)
- [x] `P2` PostgreSQL template (`pg` + `drizzle-orm`)
- [x] `P2` Auto-generated `README.md` per project
- [x] `P3` Auto-generated `deploy-commands.ts` script
- [x] `P2` Logger utility (`src/utils/logger.ts`) — zero-dependency, log levels, colors, context, stderr/stdout
- [x] `P2` Env validator utility (`src/utils/env.ts`) — typed env check on startup, exits with clear error
- [x] `P2` Cooldown utility (`src/utils/cooldown.ts`) — per-user command cooldown with auto-cleanup
- [x] `P2` Help command (`src/commands/utility/help.ts`) — Components v2 for slash bots

---

## Developer Experience

- [x] `P1` `tsconfig.json` with strict mode
- [x] `P1` `eslint.config.mjs` with `@typescript-eslint` (ESLint 10 flat config)
- [x] `P1` `.prettierrc` config
- [x] `P1` `.gitignore` (node_modules, dist, .env)
- [x] `P2` `.env.example` with all required variables
- [x] `P2` `vitest` setup for CLI unit tests (56 tests passing)
- [x] `P3` GitHub Actions CI workflow in generated project
- [x] `P2` GitHub Actions CI for discgen-cli repo (Node 18/20/22 matrix)
- [x] `P2` GitHub Actions Release workflow (auto-publish on `v*` tag)

---

## Publishing

- [x] `P2` Publish to npm as `discgen-cli`
- [ ] `P2` GitHub Releases with changelog (automated via release.yml from v1.1.1)
- [x] `P2` npm README with usage demo
- [ ] `P3` Website page on xsaitox.dev

---

## Bugs / Known Issues

_None._
