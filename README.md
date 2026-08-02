<div align="center">

<img src="https://raw.githubusercontent.com/XSaitoKungX/discgen-cli/main/assets/banner.png" alt="discgen-cli banner" width="100%" />

<br />
<br />

<img src="https://raw.githubusercontent.com/XSaitoKungX/discgen-cli/main/assets/icon.png" alt="discgen-cli icon" width="80" height="80" />

<h1>discgen-cli</h1>

<p><strong>Generate a typed Discord bot starter without assembling the project by hand.</strong></p>

<p>
  <a href="https://www.npmjs.com/package/discgen-cli">
    <img src="https://img.shields.io/npm/v/discgen-cli?style=for-the-badge&logo=npm&logoColor=white&color=CB3837" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/discgen-cli">
    <img src="https://img.shields.io/npm/dm/discgen-cli?style=for-the-badge&logo=npm&logoColor=white&color=CB3837" alt="npm downloads" />
  </a>
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/node/v/discgen-cli?style=for-the-badge&logo=nodedotjs&logoColor=white&color=339933" alt="Node.js version" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/XSaitoKungX/discgen-cli?style=for-the-badge&color=brightgreen" alt="MIT license" />
  </a>
</p>

</div>

`discgen-cli` is an interactive TypeScript CLI for creating Discord.js v14 projects. It
generates strict TypeScript, command and event loaders, Discord Components v2 examples,
optional database integrations, CI configuration, and common utilities.

The slash-command path is the primary, feature-complete workflow. Prefix projects include
working `help` and `ping` commands plus typed routing; parity for every optional feature pack
is tracked in [TODO.md](./TODO.md).

## Requirements

- Node.js `>=22.13.0`
- npm, pnpm, Bun, or Yarn for the generated project
- A Discord application and bot token

## Quick start

```bash
npx discgen-cli my-bot
cd my-bot
cp .env.example .env
```

Add `DISCORD_TOKEN` and `CLIENT_ID`, then run:

```bash
npm run deploy
npm run dev
```

Use the interactive wizard without a positional name:

```bash
npx discgen-cli
```

Preview the complete file list without writing anything:

```bash
npx discgen-cli my-bot --dry-run
```

Skip the wizard with a preset:

```bash
npx discgen-cli my-bot --template basic
npx discgen-cli my-bot --template moderation
npx discgen-cli my-bot --template full
```

## CLI reference

### Create a project

```text
discgen-cli [name] [options]
```

| Option                | Description                                   |
| --------------------- | --------------------------------------------- |
| `--template <preset>` | Use `basic`, `moderation`, or `full`          |
| `--no-install`        | Do not install generated dependencies         |
| `--no-git`            | Do not initialize and commit a Git repository |
| `--dry-run`           | Print generated paths without writing files   |
| `--version`           | Print the CLI version                         |
| `--help`              | Print command help                            |

Project names are single safe path segments. Letters, numbers, hyphens, and underscores are
accepted; path traversal and Windows device names are rejected.

### Add a file to an existing project

```text
discgen-cli generate <type> [name] [options]
discgen-cli g <type> [name] [options]
```

| Type      | Aliases    | Destination                 |
| --------- | ---------- | --------------------------- |
| `command` | `cmd`, `c` | `src/commands/<category>/`  |
| `event`   | `evt`, `e` | `src/events/`               |
| `button`  | `btn`, `b` | `src/interactions/buttons/` |
| `select`  | `sel`, `s` | `src/interactions/selects/` |
| `modal`   | `m`        | `src/interactions/modals/`  |
| `guard`   | `gd`       | `src/guards/`               |
| `service` | `svc`      | `src/services/`             |

Examples:

```bash
discgen-cli g command greet
discgen-cli g command ban --category moderation
discgen-cli g command greet --prefix
discgen-cli g event guildMemberAdd
discgen-cli g button confirm --dry-run
discgen-cli g service avatar-api
```

Generated names and categories use the same safe-segment validation as project names.

## Wizard choices

| Prompt                  | Choices                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| Command type            | Slash, Prefix, Both                                                 |
| Features                | Moderation, Utility, Fun, Economy, Music, Components, i18n, Logging |
| Database                | None, SQLite, PostgreSQL, MongoDB                                   |
| Package manager         | npm, pnpm, Bun, Yarn                                                |
| Git initialization      | Yes or no                                                           |
| Dependency installation | Yes or no                                                           |

Package-manager detection checks `bun.lock`, `bun.lockb`, `pnpm-lock.yaml`, and `yarn.lock`;
npm is the fallback.

### Presets

| Preset       | Command type | Features                                            | Database |
| ------------ | ------------ | --------------------------------------------------- | -------- |
| `basic`      | Slash        | None                                                | None     |
| `moderation` | Slash        | Moderation, Utility                                 | None     |
| `full`       | Both         | Moderation, Utility, Fun, Economy, Components, i18n | SQLite   |

CLI flags such as `--no-install` and `--no-git` override preset defaults.

## Generated project

The exact tree depends on the selected options:

```text
my-bot/
├── .github/workflows/ci.yml
├── src/
│   ├── commands/
│   │   ├── utility/
│   │   ├── moderation/
│   │   ├── fun/
│   │   ├── economy/
│   │   ├── music/
│   │   └── prefix/
│   ├── database/
│   ├── events/
│   ├── handlers/
│   ├── i18n/
│   ├── interactions/
│   ├── types/
│   ├── utils/
│   ├── deploy-commands.ts
│   └── index.ts
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json
├── README.md
└── tsconfig.json
```

Every project includes:

- strict TypeScript and NodeNext module resolution;
- `tsc` production builds that preserve dynamically loaded command and event files;
- automatic command, event, button, select-menu, and modal loading;
- typed environment validation for Discord credentials;
- a zero-dependency logger, cooldown helper, embed builder, and paginator;
- slash-command deployment for guild or global registration;
- GitHub Actions on Node.js 22 and 24.

Database selections add:

- SQLite through `better-sqlite3`;
- PostgreSQL through `pg` and `drizzle-orm`;
- MongoDB through `mongoose`.

The generated entry point initializes the selected database before loading handlers.
`DATABASE_URL` or `MONGODB_URI` is added to `.env.example` when required.

## Feature notes

### Components v2

The Components feature generates typed button, select-menu, and modal handlers plus a `/demo`
command. Handlers are routed by `customId` and loaded from `src/interactions/`.

### i18n

The i18n feature generates English and German TypeScript locale modules. A `Locale` interface
checks translation completeness, and `useT(guildId)` selects the current in-memory guild locale.
Persistence is intentionally left to the selected database integration.

### Logging

The Logging feature generates member, moderation, message-edit, and message-delete audit events.
Set `LOG_CHANNEL_ID` and enable the required privileged intents in the Discord Developer Portal.
Deleted content is only available when Discord supplied or cached it.

### Economy

SQLite, PostgreSQL, and MongoDB persist balances and daily-claim timestamps. Daily claims are
serialized per user so a concurrent interaction cannot award the same daily reward twice. The
no-database variant uses one shared in-memory store, making a claimed reward immediately visible to
`/balance` and `/leaderboard`; it resets whenever the bot process restarts.

## Scripts

### This repository

```bash
npm run dev
npm run lint
npm run typecheck
npm run test -- --run
npm run build
npm run format
```

### Generated projects

| Script           | Purpose                                     |
| ---------------- | ------------------------------------------- |
| `npm run dev`    | Run with `tsx watch`                        |
| `npm run build`  | Compile the complete `src/` tree with `tsc` |
| `npm start`      | Run `dist/index.js`                         |
| `npm run deploy` | Register slash commands                     |
| `npm run lint`   | Run ESLint                                  |
| `npm run format` | Format generated source                     |

## Project documentation

- [DESIGN.md](./DESIGN.md) explains architecture, data flow, and design invariants.
- [TODO.md](./TODO.md) is the authoritative backlog and known-issues list.
- [CHANGELOG.md](./CHANGELOG.md) records released and unreleased changes.
- [SECURITY.md](./SECURITY.md) explains responsible vulnerability reporting.
- [AGENTS.md](./AGENTS.md) is the single source of repository instructions for coding agents.

## Contributing

```bash
git clone https://github.com/XSaitoKungX/discgen-cli.git
cd discgen-cli
npm install
npm run lint
npm run typecheck
npm run test -- --run
npm run build
```

Use a focused branch and Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`,
`test:`, `chore:`). Before opening a pull request, update snapshots deliberately, add a
changelog entry for notable changes, and keep [TODO.md](./TODO.md) accurate.

## License

MIT © [xsaitox](https://xsaitox.dev)
