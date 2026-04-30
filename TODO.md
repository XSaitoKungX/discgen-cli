# TODO

Tracked tasks and planned features for `discgen-cli`.
Priorities: `P1` critical · `P2` important · `P3` nice to have

---

## CLI Core

- [x] `P1` Interactive wizard with `@clack/prompts`
- [x] `P1` Argument parsing via `commander` (`--name`, `--no-install`, `--no-git`)
- [x] `P1` File scaffolding with `fs-extra`
- [x] `P1` Template system for all generated files
- [x] `P1` Package manager detection (`npm` / `pnpm` / `bun`)
- [x] `P1` Auto-install dependencies after scaffolding
- [x] `P1` Git init support
- [x] `P2` Overwrite confirmation if target directory exists
- [x] `P2` Node.js version check (>= 18), exit with clear error if too old
- [x] `P2` "Next steps" output after scaffolding
- [x] `P3` `--dry-run` flag to preview generated files without writing

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

---

## Developer Experience

- [x] `P1` `tsconfig.json` with strict mode
- [x] `P1` `eslint.config.mjs` with `@typescript-eslint` (ESLint 10 flat config)
- [x] `P1` `.prettierrc` config
- [x] `P1` `.gitignore` (node_modules, dist, .env)
- [x] `P2` `.env.example` with all required variables
- [x] `P2` `vitest` setup for CLI unit tests (32 tests passing)
- [x] `P3` GitHub Actions CI workflow in generated project

---

## Publishing

- [ ] `P2` Publish to npm as `discgen-cli`
- [ ] `P2` GitHub Releases with changelog
- [ ] `P2` npm README with usage gif/demo
- [ ] `P3` Website page on xsaitox.dev

---

## Bugs / Known Issues

_None._
