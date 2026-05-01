<div align="center">

<img src="https://raw.githubusercontent.com/XSaitoKungX/discgen-cli/main/assets/banner.png" alt="discgen-cli banner" width="100%" />

<br />
<br />

<img src="https://raw.githubusercontent.com/XSaitoKungX/discgen-cli/main/assets/icon.png" alt="discgen-cli icon" width="80" height="80" />

<h1>discgen-cli</h1>

<p><strong>Scaffold a production-ready Discord Bot in seconds — not hours.</strong></p>

<p>
  <a href="https://www.npmjs.com/package/discgen-cli">
    <img src="https://img.shields.io/npm/v/discgen-cli?style=for-the-badge&logo=npm&logoColor=white&color=CB3837" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/discgen-cli">
    <img src="https://img.shields.io/npm/dm/discgen-cli?style=for-the-badge&logo=npm&logoColor=white&color=CB3837" alt="npm downloads" />
  </a>
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/node/v/discgen-cli?style=for-the-badge&logo=nodedotjs&logoColor=white&color=339933" alt="Node.js" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://discord.js.org">
    <img src="https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="discord.js" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/XSaitoKungX/discgen-cli?style=for-the-badge&color=brightgreen" alt="MIT License" />
  </a>
</p>

<p>
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-what-gets-generated">Generated Output</a> ·
  <a href="#-cli-reference">CLI Reference</a> ·
  <a href="#-generate-subcommand">generate</a> ·
  <a href="#-contributing">Contributing</a>
</p>

</div>

---

## ✨ Why discgen-cli?

<table>
  <tr>
    <td align="center" width="200">
      <strong>🎛️ Interactive Wizard</strong><br/>
      Beautiful terminal UI powered by <code>@clack/prompts</code>
    </td>
    <td align="center" width="200">
      <strong>⚡ Components v2</strong><br/>
      Modern Discord UI — containers, sections, thumbnails — no legacy embeds
    </td>
    <td align="center" width="200">
      <strong>🔘 Interactions</strong><br/>
      Full routing for buttons, select menus &amp; modals out of the box
    </td>
  </tr>
  <tr>
    <td align="center" width="200">
      <strong>🛠️ generate</strong><br/>
      Add commands, events, buttons, modals &amp; more to an existing project with one command
    </td>
    <td align="center" width="200">
      <strong>🗃️ Database Ready</strong><br/>
      SQLite <em>(better-sqlite3)</em> or PostgreSQL <em>(drizzle-orm)</em> wired from day one
    </td>
    <td align="center" width="200">
      <strong>🚀 TypeScript Strict</strong><br/>
      Full strict mode, ESLint 10, Prettier — zero config needed
    </td>
  </tr>
</table>

---

## 📦 Installation

```bash
# No install needed — always uses latest version
npx discgen-cli my-bot

# Or install globally
npm install -g discgen-cli
discgen-cli my-bot
```

---

## 🚀 Quick Start

```bash
npx discgen-cli my-bot
```

The wizard asks you 6 questions and scaffolds everything — including CI/CD, a logger, env validation, and component interaction handlers.

```bash
# Let the wizard ask for the name
npx discgen-cli

# Preview every file that would be written — nothing touches the disk
npx discgen-cli my-bot --dry-run

# Skip wizard with a preset
npx discgen-cli my-bot --template basic
npx discgen-cli my-bot --template moderation
npx discgen-cli my-bot --template full
```

---

## 🎬 Wizard Demo

```text
┌  discgen-cli — Scaffold a Discord Bot in seconds
│
◇  Project name
│  my-bot
│
◇  Command type
│  Slash Commands (recommended)
│
◆  Select features
│  ◼ Moderation  ◼ Utility  ◼ Components  ◻ Fun  ◻ Economy  ◻ Music
│
◇  Database
│  SQLite
│
◇  Package manager
│  npm
│
◇  Initialize a git repository?
│  Yes
│
◇  Install dependencies?
│  Yes
│
◒  Scaffolding project...
◒  Installing dependencies with npm...
│
└  ✅ Done! Your bot is ready.

   Next steps:
     cd my-bot
     cp .env.example .env    # add DISCORD_TOKEN + CLIENT_ID
     npm run deploy          # register slash commands
     npm run dev             # start in watch mode
```

---

## 📁 What Gets Generated

```text
my-bot/
├── .github/
│   └── workflows/
│       └── ci.yml                     ← Node 20 / 22 CI matrix
├── src/
│   ├── commands/
│   │   ├── moderation/                ← ban, kick, timeout, warn
│   │   └── utility/                   ← ping, help, userinfo, serverinfo
│   ├── events/
│   │   ├── ready.ts
│   │   └── interactionCreate.ts       ← routes slash, buttons, selects, modals
│   ├── handlers/
│   │   ├── commandHandler.ts          ← auto-loads all commands
│   │   ├── interactionLoader.ts       ← auto-loads all component handlers
│   │   └── eventHandler.ts            ← auto-loads all events
│   ├── interactions/                  ← when "Components" feature is selected
│   │   ├── buttons/
│   │   │   ├── example-button.ts
│   │   │   └── open-modal.ts          ← opens a modal on click
│   │   ├── selects/
│   │   │   └── example-select.ts
│   │   └── modals/
│   │       └── example-modal.ts
│   ├── types/
│   │   └── index.ts                   ← Command, Event, ButtonHandler, SelectHandler, ModalHandler
│   ├── utils/
│   │   ├── logger.ts                  ← zero-dep ANSI logger (debug/info/warn/error)
│   │   ├── env.ts                     ← typed env validator — exits on missing vars
│   │   └── cooldown.ts                ← per-user command cooldown with auto-cleanup
│   ├── database/
│   │   └── index.ts                   ← SQLite or PostgreSQL setup (if selected)
│   ├── deploy-commands.ts
│   └── index.ts
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🧩 Wizard Options

| Prompt          | Choices |
|-----------------|---------|
| Command type    | **Slash** (recommended) · Prefix · Both |
| Features        | Moderation · Utility · **Components** · Fun · Economy · Music |
| Database        | None · SQLite · PostgreSQL |
| Package manager | npm · pnpm · bun (auto-detected) |
| Git init        | Yes · No |
| Install deps    | Yes · No |

### `--template` Presets

Skip the wizard entirely with a preset:

| Preset | Command type | Features | Database |
|---|---|---|---|
| `basic` | Slash | — | None |
| `moderation` | Slash | Moderation, Utility | None |
| `full` | Both | Moderation, Utility, Fun, Economy, **Components** | SQLite |

---

## 🚩 CLI Reference

### Create a new project

```bash
discgen-cli [name] [flags]

Flags:
  --template <preset>   Skip wizard: basic | moderation | full
  --no-install          Skip dependency installation
  --no-git              Skip git initialization
  --dry-run             Preview generated files without writing
  --version             Print version
  --help                Show help
```

### Add files to an existing project — `generate`

```bash
discgen-cli generate <type> [name] [flags]
discgen-cli g <type> [name] [flags]        # short alias
```

---

## ⚡ `generate` Subcommand

Add individual files to an **existing** bot project — like `nest generate` for NestJS.

### Commands

```bash
discgen-cli g command greet                  # slash command → src/commands/utility/greet.ts
discgen-cli g command ban --category moderation  # custom subfolder
discgen-cli g command greet --prefix         # prefix command → src/commands/prefix/greet.ts
```

### Events

```bash
discgen-cli g event guildMemberAdd           # → src/events/guildMemberAdd.ts
discgen-cli g event                          # interactive: pick from 15 known Discord events
```

### Component Interactions

```bash
discgen-cli g button confirm                 # → src/interactions/buttons/confirm.ts
discgen-cli g select role-picker             # → src/interactions/selects/role-picker.ts
discgen-cli g modal feedback                 # → src/interactions/modals/feedback.ts
```

### Guards

```bash
discgen-cli g guard permissions              # → src/guards/permissions.ts
```

### Type aliases

| Full name | Aliases |
|---|---|
| `command` | `cmd`, `c` |
| `event` | `evt`, `e` |
| `button` | `btn`, `b` |
| `select` | `sel`, `s` |
| `modal` | `m` |
| `guard` | `gd` |

```bash
# All equivalent
discgen-cli g command greet
discgen-cli g cmd greet
discgen-cli g c greet

# Dry-run: preview path without writing
discgen-cli g button confirm --dry-run
```

---

## 🔘 Component Interactions (in generated bots)

When you select the **Components** feature, your bot is scaffolded with a complete interaction system:

```
interactionCreate.ts
  ├── isChatInputCommand()  → client.commands   (slash commands)
  ├── isButton()            → client.buttons    (button clicks)
  ├── isAnySelectMenu()     → client.selects    (select menus)
  └── isModalSubmit()       → client.modals     (modal forms)
```

Handlers are auto-loaded from `src/interactions/` on startup — add a file, it just works.

A full `/demo` slash command is included that sends a **Components v2** layout with a button, select menu, and a "Open Form" button that triggers a modal.

---

## ▶️ After Scaffolding

```bash
cd my-bot
cp .env.example .env
```

Open `.env` and fill in your credentials from the [Discord Developer Portal](https://discord.com/developers/applications):

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=your_server_id_here        # for guild-scoped slash command deploys
```

```bash
npm run deploy    # register slash commands with Discord
npm run dev       # start bot in watch mode
```

<details>
<summary>📋 All scripts in the generated bot</summary>

| Script | Description |
|---|---|
| `npm run dev` | Start bot in watch mode (tsx watch) |
| `npm run build` | Compile TypeScript → dist/ |
| `npm start` | Run compiled bot from dist/ |
| `npm run deploy` | Register slash commands with Discord |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

</details>

---

## 🛠️ Generated Bot: Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (strict mode) |
| Discord | discord.js v14 + Components v2 |
| Runtime | Node.js >= 22 |
| Build | tsup (ESM + CJS) |
| Lint | ESLint 10 flat config + @typescript-eslint v8 |
| Format | Prettier 3 |
| Database | better-sqlite3 or pg + drizzle-orm |
| CI | GitHub Actions (Node 20 / 22 matrix) |

---

## 📋 Requirements

- **Node.js >= 22** — LTS, checked on startup, exits with a clear error if too old
- **A Discord Bot Token** — [Discord Developer Portal →](https://discord.com/developers/applications)

---

## 🤝 Contributing

Pull requests are welcome! See [TODO.md](./TODO.md) for open tasks and [CHANGELOG.md](./CHANGELOG.md) for what's changed.

```bash
git clone https://github.com/XSaitoKungX/discgen-cli
cd discgen-cli
npm install

npm run dev        # run CLI locally with tsx
npm run test       # run 110 unit tests
npm run build      # compile to dist/
npm run lint       # ESLint
```

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `feat: add xyz`
4. Open a Pull Request

---

## 📄 License

MIT © [xsaitox](https://xsaitox.dev)

<div align="center">

<br />

**Built with ❤️ for the Discord developer community**

<a href="https://www.npmjs.com/package/discgen-cli">
  <img src="https://img.shields.io/badge/Get%20it%20on-npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm" />
</a>

</div>
