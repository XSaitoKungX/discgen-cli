# TODO

Tracked tasks and planned features for `discgen-cli`.
Priorities: `P1` critical · `P2` important · `P3` nice to have

---

## CLI Core

- [ ] `P1` Interactive wizard with `@clack/prompts`
- [ ] `P1` Argument parsing via `commander` (`--name`, `--template`, `--no-install`)
- [ ] `P1` File scaffolding with `fs-extra`
- [ ] `P1` Template system for all generated files
- [ ] `P1` Package manager detection (`npm` / `pnpm` / `bun`)
- [ ] `P1` Auto-install dependencies after scaffolding
- [ ] `P1` Git init support
- [ ] `P2` Overwrite confirmation if target directory exists
- [ ] `P2` Node.js version check (>= 18), exit with clear error if too old
- [ ] `P2` "Next steps" output after scaffolding
- [ ] `P3` `--dry-run` flag to preview generated files without writing

---

## Templates

- [ ] `P1` Base template (TypeScript, discord.js v14, command/event handler)
- [ ] `P1` Slash Commands template
- [ ] `P1` Prefix Commands template
- [ ] `P2` Moderation commands (`ban`, `kick`, `timeout`, `warn`)
- [ ] `P2` Utility commands (`ping`, `userinfo`, `serverinfo`)
- [ ] `P2` Fun commands (`coinflip`, `8ball`, `meme`)
- [ ] `P2` Economy commands (balance, daily, leaderboard — placeholder)
- [ ] `P3` Music commands (placeholder with note: requires voice deps)
- [ ] `P2` SQLite template (`better-sqlite3`)
- [ ] `P2` PostgreSQL template (`pg` + `drizzle-orm`)
- [ ] `P2` Auto-generated `README.md` per project
- [ ] `P3` Auto-generated `deploy-commands.ts` script

---

## Developer Experience

- [ ] `P1` `tsconfig.json` with strict mode
- [ ] `P1` `.eslintrc.json` with `@typescript-eslint`
- [ ] `P1` `.prettierrc` config
- [ ] `P1` `.gitignore` (node_modules, dist, .env)
- [ ] `P2` `.env.example` with all required variables
- [ ] `P2` `vitest` setup for CLI unit tests
- [ ] `P3` GitHub Actions CI workflow in generated project

---

## Publishing

- [ ] `P2` Publish to npm as `discgen-cli`
- [ ] `P2` GitHub Releases with changelog
- [ ] `P2` npm README with usage gif/demo
- [ ] `P3` Website page on xsaitox.dev

---

## Bugs / Known Issues

_None yet — project not started._
