# discgen-cli

Generate a typed Discord.js v14 bot starter without assembling the project by hand. The interactive
wizard creates strict TypeScript, command and event loaders, optional feature packs, databases, CI,
and project metadata for future tooling.

## Requirements

- Node.js `>=24`
- npm, pnpm, Bun, or Yarn for generated projects
- A Discord application and bot token

## Quick start

```bash
npx discgen-cli my-bot
cd my-bot
cp .env.example .env
npm run deploy
npm run dev
```

Set `DISCORD_TOKEN` and `CLIENT_ID` in `.env` before starting the bot. Run the wizard without a
name with `npx discgen-cli`, or preview its complete output with `--dry-run`.

```bash
npx discgen-cli my-bot --output ./apps/bots/my-bot
npx discgen-cli my-bot --template full --no-install --no-git
discgen-cli list
```

## CLI reference

```text
discgen-cli [name] [options]
```

| Option                | Description                                |
| --------------------- | ------------------------------------------ |
| `--template <preset>` | Use `basic`, `moderation`, or `full`       |
| `--output <dir>`      | Scaffold into an explicit output directory |
| `--no-install`        | Do not install dependencies                |
| `--no-git`            | Do not initialize Git                      |
| `--dry-run`           | Print generated paths without writes       |

`discgen-cli list` prints the supported presets, command modes, feature packs, databases, and
single-file generator types.

### Add a file to an existing project

```text
discgen-cli generate <type> [name] [options]
discgen-cli g <type> [name] [options]
```

Supported types are `command`, `event`, `button`, `select`, `modal`, `guard`, and `service`.
Common aliases include `cmd`, `evt`, `btn`, `sel`, and `svc`.

```bash
discgen-cli g command greet --category utility
discgen-cli g command greet --prefix
discgen-cli g event guildMemberAdd
discgen-cli g button confirm --dry-run
```

Project names, generated names, and categories are validated before paths are constructed. They
cannot contain traversal sequences, separators, or Windows reserved device names.

## Wizard choices

| Choice          | Values                                                              |
| --------------- | ------------------------------------------------------------------- |
| Command mode    | Slash, Prefix, Both                                                 |
| Features        | Moderation, Utility, Fun, Economy, Music, Components, i18n, Logging |
| Database        | None, SQLite, PostgreSQL, MongoDB                                   |
| Package manager | npm, pnpm, Bun, Yarn                                                |

The slash-command path is feature-complete. Prefix and Both projects receive typed `help` and
`ping` commands; parity for optional feature packs is tracked in [TODO.md](./TODO.md).

## Generated project

Generated projects include strict NodeNext TypeScript, dynamic command/event/interaction loaders,
environment validation, logging, cooldown, embed and paginator helpers, a GitHub Actions workflow,
and `.discgen.json` metadata. Production builds use `tsc` to preserve every dynamically loaded
module in `dist/`.

Database choices add the required dependencies, environment example, initialization, and schema:

- SQLite: `better-sqlite3`
- PostgreSQL: `pg` and `drizzle-orm`
- MongoDB: `mongoose`

### Economy

Economy commands persist balances and daily-claim timestamps with a selected database. Daily claims
are serialized per user: SQLite uses a transaction, PostgreSQL an advisory transaction lock, and
MongoDB a conditional update with duplicate-key recovery. Without a database, one shared in-memory
store makes daily rewards immediately visible to `/balance` and `/leaderboard`; that state resets
when the bot restarts.

## Scripts

### This repository

```bash
npm run lint
npm run typecheck
npm run test -- --run
npm run build
```

### Generated projects

| Script              | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Run with `tsx watch`                        |
| `npm run typecheck` | Check TypeScript without emitting output    |
| `npm run build`     | Compile the complete `src/` tree with `tsc` |
| `npm start`         | Run `dist/index.js`                         |
| `npm run deploy`    | Register slash commands                     |

## Project documentation

- [DESIGN.md](./DESIGN.md) documents architecture and invariants.
- [TODO.md](./TODO.md) is the authoritative known-issues backlog.
- [CHANGELOG.md](./CHANGELOG.md) records releases.
- [SECURITY.md](./SECURITY.md) explains vulnerability reporting.
- [AGENTS.md](./AGENTS.md) contains repository guidance for coding agents.

## Contributing

Run lint, typecheck, tests, and build before opening a focused Conventional Commit. Review intended
snapshot changes and keep the changelog and TODO backlog aligned with behavior.

## License

MIT
