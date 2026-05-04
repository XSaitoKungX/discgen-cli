# TODO

Tracked tasks and planned features for `discgen-cli`.
Priorities: `P1` critical · `P2` important · `P3` nice to have

---

## CLI Core

- [x] `P1` Interactive wizard with `@clack/prompts`
- [x] `P1` Argument parsing via `commander` (`--name`, `--no-install`, `--no-git`, `--template`)
- [x] `P1` File scaffolding with native `node:fs/promises` (replaced `fs-extra`)
- [x] `P1` Template system for all generated files
- [x] `P1` Package manager detection via lockfile sniffing — native, zero-dep (replaced `detect-package-manager`)
- [x] `P1` Yarn support (added alongside npm/pnpm/bun)
- [x] `P1` Auto-install dependencies after scaffolding
- [x] `P1` Git init support
- [x] `P2` Overwrite confirmation if target directory exists
- [x] `P2` Node.js version check (>= 22), exit with clear error if too old
- [x] `P2` "Next steps" output after scaffolding
- [x] `P3` `--dry-run` flag to preview generated files without writing
- [x] `P2` `--template <preset>` flag: `basic` | `moderation` | `full`
- [x] `P1` `generate` subcommand (`discgen-cli g command|event|guard|button|select|modal|service <name>`)
- [x] `P1` Component interactions system (buttons, select menus, modals) with full routing in `interactionCreate`
- [ ] `P2` `--output <dir>` flag to scaffold into an explicit directory instead of `<cwd>/<name>`
- [ ] `P2` `discgen-cli list` subcommand — prints all available templates, presets, and generate types
- [ ] `P2` `discgen-cli upgrade` subcommand — diff & patch an existing project to the latest template version
- [ ] `P3` `--json` flag — output scaffolding result as machine-readable JSON (path, files written, pm used)
- [ ] `P3` Shell completions (`discgen-cli completion bash|zsh|fish`) via `commander`

---

## Templates

- [x] `P1` Base template (TypeScript, discord.js v14, command/event handler)
- [x] `P1` Slash Commands template
- [x] `P1` Prefix Commands template — full routing via `messageCreate` + `client.prefixCommands`
- [x] `P2` Moderation commands (`ban`, `kick`, `timeout`, `warn`)
- [x] `P2` Utility commands (`ping`, `userinfo`, `serverinfo`, `avatar`) — Components v2
- [x] `P2` Fun commands (`coinflip`, `8ball`, `meme`) — Components v2
- [x] `P2` Economy commands (balance, daily, leaderboard) — database-aware (SQLite/PostgreSQL/in-memory)
- [x] `P3` Music commands (placeholder with note: requires voice deps)
- [x] `P2` SQLite template (`better-sqlite3`) — `users` table with `balance` + `last_daily`
- [x] `P2` PostgreSQL template (`pg` + `drizzle-orm`) — `users` table with `balance` + `lastDaily`
- [x] `P2` Auto-generated `README.md` per project
- [x] `P3` Auto-generated `deploy-commands.ts` script — skips `prefix/` folder
- [x] `P2` Logger utility (`src/utils/logger.ts`) — zero-dependency, log levels, colors, context, stderr/stdout
- [x] `P2` Env validator utility (`src/utils/env.ts`) — typed env check on startup, exits with clear error
- [x] `P2` Cooldown utility (`src/utils/cooldown.ts`) — per-user command cooldown with auto-cleanup
- [x] `P2` Help command (`src/commands/utility/help.ts`) — dynamic list, Components v2 for slash / plain text for prefix
- [x] `P2` `generate service` subcommand — singleton service class in `src/services/`
- [ ] `P1` **MongoDB template** — `mongoose` ODM, `users` collection, typed schema — parity with SQLite/PG
- [ ] `P2` **Redis feature** — optional caching layer (`ioredis`), session/rate-limit store, generated `src/cache/index.ts`
- [x] `P2` **i18n feature** — `src/i18n/en.ts` + `de.ts` (typed `.ts` locales, `as const`), `useT(guildId)` helper, `setGuildLocale()`, `/locale` command (ManageGuild), wizard-selectable
- [ ] `P2` **Ticket system feature** — `/ticket open|close|add|remove`, channel creation, transcript export to text file
- [ ] `P2` **Leveling/XP feature** — XP per message, level-up event, rank card command (`/rank`), leaderboard — DB-aware
- [ ] `P2` **Giveaway feature** — `/giveaway start|end|reroll`, timer, winner selection, embed UI
- [ ] `P2` **Logging/Audit feature** — guild event logging (`memberAdd`, `messageDelete`, etc.) to a configurable channel
- [ ] `P3` **Reaction roles feature** — embed + reaction → role assignment, stored in DB, admin `/reactionrole` setup command
- [ ] `P3` **Welcome/Farewell feature** — `guildMemberAdd/Remove` handler, configurable embed, optional DM
- [ ] `P3` **Reminder feature** — `/remind <time> <message>`, persistent timers stored in DB, DM on trigger
- [ ] `P3` **Poll feature** — `/poll create`, reaction or button voting, auto-close after duration, result embed
- [ ] `P3` **Auto-role feature** — assign role(s) on member join, configurable via `.env`
- [ ] `P3` **Suggestion feature** — `/suggest`, thread per suggestion, upvote/downvote via buttons, mod `/suggest approve|deny`
- [ ] `P3` **Tags/Custom commands feature** — guild-specific text responses stored in DB, `/tag create|edit|delete|list`
- [ ] `P3` Music — real implementation with `@discordjs/voice` + `play-dl` / `ytdl-core` alternative

---

## Developer Experience

- [x] `P1` `tsconfig.json` with strict mode
- [x] `P1` `eslint.config.mjs` with `@typescript-eslint` (ESLint 10 flat config)
- [x] `P1` `.prettierrc` config
- [x] `P1` `.gitignore` (node_modules, dist, .env)
- [x] `P2` `.env.example` with all required variables (includes `PREFIX=!` for prefix bots)
- [x] `P2` `vitest` setup for CLI unit tests — 184 tests passing, `vitest.config.ts` with `pool: forks`
- [x] `P3` GitHub Actions CI workflow in generated project
- [x] `P2` GitHub Actions CI for discgen-cli repo (Node 20/22 matrix)
- [x] `P2` GitHub Actions Release workflow (auto-publish on `v*` tag)
- [ ] `P2` **`discgen-cli doctor`** — diagnose a scaffolded project: missing `.env` keys, outdated deps, wrong Node version, broken `tsconfig.json` paths
- [ ] `P2` **Snapshot tests** — `toMatchSnapshot()` for every template generator so regressions in generated code are caught immediately
- [ ] `P2` **Prettier in generated project** — add `format` script + `lint-staged` + `husky` pre-commit hook so code stays formatted out of the box
- [x] `P2` **`src/utils/paginator.ts`** — reusable embed paginator (⏮◀ X/Y ▶⏭ buttons), idle timeout, per-user collector, auto-disable on end
- [x] `P2` **`src/utils/embed.ts`** — typed `Embed.success/error/info/warn/default()` builder with consistent colour palette, optional fields/footer/thumbnail/timestamp
- [ ] `P3` **VSCode workspace settings** — `.vscode/settings.json` + `extensions.json` (ESLint, Prettier, discord.js snippets)
- [ ] `P3` **Dockerfile + docker-compose** — production-ready container template, optional during wizard
- [ ] `P3` **`CONTRIBUTING.md` + `CODE_OF_CONDUCT.md`** — generated in project for open-source bots
- [ ] `P3` **`generate middleware`** — generate a typed middleware/guard that wraps command execution (rate-limit, role check, etc.)
- [ ] `P3` **`generate cron`** — generate a cron-job style interval task in `src/tasks/` that auto-registers on startup
- [ ] `P3` **E2E smoke test** — run `discgen-cli --template basic --name e2e-bot --no-install --no-git` in CI and verify `tsc --noEmit` passes on the output

---

## Publishing

- [x] `P2` Publish to npm as `discgen-cli`
- [ ] `P2` GitHub Releases with changelog (automated via release.yml from v1.1.1)
- [x] `P2` npm README with usage demo
- [ ] `P3` Website page on xsaitox.dev
- [ ] `P3` Interactive demo / StackBlitz embed on the website

---

## Bugs / Known Issues

_None._
