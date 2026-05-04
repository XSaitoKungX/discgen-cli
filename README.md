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
  <a href="#-features">Features</a> ·
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
      Beautiful terminal UI powered by <code>@clack/prompts</code> — answers 6 questions and you're done
    </td>
    <td align="center" width="200">
      <strong>⚡ Components v2</strong><br/>
      Every generated command uses modern Discord UI — containers, sections, thumbnails — no legacy embeds
    </td>
    <td align="center" width="200">
      <strong>🔘 Full Interaction System</strong><br/>
      Buttons, select menus &amp; modals with auto-loading handlers and typed routing out of the box
    </td>
  </tr>
  <tr>
    <td align="center" width="200">
      <strong>🌐 i18n Ready</strong><br/>
      TypeScript-native multi-language support — typed <code>useT()</code> helper, <code>/locale</code> command, zero JSON files
    </td>
    <td align="center" width="200">
      <strong>🗃️ Database Ready</strong><br/>
      SQLite <em>(better-sqlite3)</em> or PostgreSQL <em>(drizzle-orm)</em> wired from day one with typed schemas
    </td>
    <td align="center" width="200">
      <strong>🛠️ generate</strong><br/>
      Add commands, events, buttons, modals, services &amp; more to an existing project with one command
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

> **Requires Node.js >= 22.** Checked on startup — exits with a clear error if too old.

---

## 🚀 Quick Start

```bash
npx discgen-cli my-bot
```

The wizard asks you 7 questions and scaffolds everything — including CI/CD, a logger, env validation, embed helpers, a paginator, and complete component interaction routing.

```bash
# Let the wizard ask for the name
npx discgen-cli

# Preview every file that would be written — nothing touches the disk
npx discgen-cli my-bot --dry-run

# Skip wizard entirely with a preset
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
│  Slash Commands
│
◆  Select features
│  ◼ Moderation  ◼ Utility  ◼ Components  ◼ i18n  ◻ Fun  ◻ Economy  ◻ Music
│
◇  Database
│  SQLite
│
◇  Package manager
│  npm  (detected)
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
└  Done! Your bot is ready.

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
│   │   ├── moderation/                ← ban, kick, timeout, warn  (Components v2)
│   │   ├── utility/                   ← ping, help, userinfo, serverinfo, avatar, locale*
│   │   ├── fun/                       ← coinflip, 8ball, meme  (Components v2)
│   │   ├── economy/                   ← balance, daily, leaderboard  (db-aware, Components v2)
│   │   ├── music/                     ← play, stop  (placeholder)
│   │   └── prefix/                    ← prefix commands (if commandType includes prefix)
│   ├── events/
│   │   ├── ready.ts
│   │   ├── interactionCreate.ts       ← routes slash, buttons, selects, modals
│   │   └── messageCreate.ts           ← routes prefix commands (if applicable)
│   ├── handlers/
│   │   ├── commandHandler.ts          ← auto-loads slash + prefix commands
│   │   ├── interactionLoader.ts       ← auto-loads all component handlers
│   │   └── eventHandler.ts            ← auto-loads all events
│   ├── interactions/                  ← "Components" feature
│   │   ├── buttons/
│   │   │   ├── example-button.ts
│   │   │   └── open-modal.ts
│   │   ├── selects/
│   │   │   └── example-select.ts
│   │   └── modals/
│   │       └── example-modal.ts
│   ├── i18n/                          ← "i18n" feature  (*)
│   │   ├── en.ts                      ← master locale, exports Locale interface
│   │   ├── de.ts                      ← German translation, typed against Locale
│   │   └── index.ts                   ← useT(), setGuildLocale(), supportedLocales
│   ├── database/
│   │   └── index.ts                   ← SQLite or PostgreSQL setup (if selected)
│   ├── services/                      ← generated with: discgen-cli g service <name>
│   ├── types/
│   │   └── index.ts                   ← Command, PrefixCommand, Event, ButtonHandler, …
│   ├── utils/
│   │   ├── logger.ts                  ← zero-dep ANSI logger  (debug / info / warn / error)
│   │   ├── env.ts                     ← typed env validator — exits on missing vars
│   │   ├── cooldown.ts                ← per-user cooldown with auto-cleanup
│   │   ├── embed.ts                   ← Embed.success / .error / .info / .warn / .default
│   │   └── paginator.ts               ← paginate() — Components v2 ⏮◀ X/Y ▶⏭ navigator
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

> `*` — only present when the corresponding feature is selected

---

## 🧩 Features

### Wizard Options

| Prompt | Choices |
|---|---|
| Command type | **Slash** · Prefix · Both |
| Features | Moderation · Utility · Fun · Economy · **Components** · **i18n** · Music |
| Database | None · SQLite · PostgreSQL |
| Package manager | npm · pnpm · bun · yarn (auto-detected from lockfile) |
| Git init | Yes · No |
| Install deps | Yes · No |

### `--template` Presets

Skip the wizard entirely:

| Preset | Command type | Features | Database |
|---|---|---|---|
| `basic` | Slash | — | None |
| `moderation` | Slash | Moderation, Utility | None |
| `full` | Both | Moderation, Utility, Fun, Economy, Components, **i18n** | SQLite |

---

## 🔘 Component Interactions

When you select the **Components** feature, your bot is scaffolded with a complete interaction routing system:

```
interactionCreate.ts
  ├── isChatInputCommand()  →  client.commands   (slash commands)
  ├── isButton()            →  client.buttons    (button clicks)
  ├── isAnySelectMenu()     →  client.selects    (select menus)
  └── isModalSubmit()       →  client.modals     (modal forms)
```

Handlers are **auto-loaded** from `src/interactions/` on startup — drop a file in, it just works. A full `/demo` command is included that showcases a Components v2 layout with a button, select menu, and a "Open Form" button that triggers a modal.

---

## 🌐 i18n — TypeScript-native Localization

When you select the **i18n** feature, your bot gets a fully typed multi-language system — **no JSON files, no external libraries**.

### What gets generated

| File | Purpose |
|---|---|
| `src/i18n/en.ts` | Master locale — exports the `Locale` interface and English strings |
| `src/i18n/de.ts` | German translation — typed against `Locale`, TypeScript enforces completeness |
| `src/i18n/index.ts` | `useT()`, `setGuildLocale()`, `getLocale()`, `supportedLocales` |
| `src/commands/utility/locale.ts` | `/locale` slash command (requires `ManageGuild` permission) |

### Usage

```ts
// In any command:
const t = useT(interaction.guildId);

await interaction.reply(t.ping.pinging);
await interaction.reply(t.moderation.banned(target.tag, reason));
await interaction.reply(t.economy.dailyCooldown('2h 15m'));
```

### Adding a new language

```ts
// src/i18n/fr.ts
import type { Locale } from './en.js';

const fr: Locale = {
  errors: { commandFailed: 'Une erreur est survenue.', /* ... */ },
  // TypeScript will error if any key is missing or has the wrong shape
};

export default fr;
```

Then register it in `src/i18n/index.ts`:

```ts
import fr from './fr.js';
const locales: Record<string, Locale> = { en, de, fr };
```

### Persisting guild locales

`setGuildLocale()` stores the choice in memory. To persist across restarts, save it in your database on `/locale` and restore it on startup:

```ts
// On startup — restore saved locales from DB
for (const row of db.prepare('SELECT guild_id, locale FROM settings').all()) {
  setGuildLocale(row.guild_id, row.locale);
}
```

---

## 🎨 Utility Helpers (always generated)

### `Embed` — typed embed builder

```ts
import { Embed } from './utils/embed.js';

await interaction.reply({
  embeds: [
    Embed.success({ title: 'Done!', description: 'Action completed.', timestamp: true }),
    Embed.error({ description: 'Something went wrong.' }),
    Embed.info({ title: 'Info', fields: [{ name: 'Key', value: 'Value' }] }),
  ],
});
```

Five presets with consistent colors: `success` · `error` · `info` · `warn` · `default`

### `paginate()` — Components v2 page navigator

```ts
import { paginate } from './utils/paginator.js';

await paginate({
  interaction,
  pages: [
    { heading: 'Page 1', body: 'First page content...' },
    { heading: 'Page 2', body: 'Second page content...' },
    { heading: 'Page 3', body: 'Third page content...' },
  ],
});
```

Renders a fully navigable Components v2 layout with ⏮ ◀ `1 / 3` ▶ ⏭ buttons. Only the user who ran the command can navigate. Buttons auto-disable after 60 seconds of inactivity.

---

## 🚩 CLI Reference

### Create a new project

```
discgen-cli [name] [flags]
```

| Flag | Description |
|---|---|
| `--template <preset>` | Skip wizard: `basic` \| `moderation` \| `full` |
| `--no-install` | Skip dependency installation |
| `--no-git` | Skip git initialization |
| `--dry-run` | Preview generated files without writing |
| `--version` | Print version |
| `--help` | Show help |

> `name` is a **positional argument**, not a flag: `discgen-cli my-bot`, not `--name my-bot`

### Generate files — `generate` / `g`

```
discgen-cli generate <type> [name] [flags]
discgen-cli g <type> [name] [flags]
```

---

## ⚡ `generate` Subcommand

Add individual files to an **existing** bot project — like `nest generate` for NestJS.

### Commands

```bash
discgen-cli g command greet                      # slash → src/commands/utility/greet.ts
discgen-cli g command ban --category moderation  # custom subfolder
discgen-cli g command greet --prefix             # prefix → src/commands/prefix/greet.ts
```

### Events

```bash
discgen-cli g event guildMemberAdd   # → src/events/guildMemberAdd.ts
discgen-cli g event                  # interactive: pick from 15 known Discord events
```

### Component Interactions

```bash
discgen-cli g button confirm         # → src/interactions/buttons/confirm.ts
discgen-cli g select role-picker     # → src/interactions/selects/role-picker.ts
discgen-cli g modal feedback         # → src/interactions/modals/feedback.ts
```

### Services & Guards

```bash
discgen-cli g service avatar-api     # → src/services/avatar-api.ts  (singleton class)
discgen-cli g guard permissions      # → src/guards/permissions.ts
```

### Type Aliases

| Full | Aliases |
|---|---|
| `command` | `cmd`, `c` |
| `event` | `evt`, `e` |
| `button` | `btn`, `b` |
| `select` | `sel`, `s` |
| `modal` | `m` |
| `guard` | `gd` |
| `service` | `svc` |

```bash
# All equivalent
discgen-cli g command greet
discgen-cli g cmd greet
discgen-cli g c greet

# Dry-run: preview path without writing
discgen-cli g button confirm --dry-run
```

---

## ▶️ After Scaffolding

```bash
cd my-bot
cp .env.example .env
```

Fill in your credentials from the [Discord Developer Portal](https://discord.com/developers/applications):

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=your_server_id_here
```

```bash
npm run deploy    # register slash commands with Discord
npm run dev       # start bot in watch mode (tsx watch)
```

<details>
<summary>All scripts in the generated bot</summary>

| Script | Description |
|---|---|
| `npm run dev` | Start in watch mode (`tsx watch`) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run compiled bot from `dist/` |
| `npm run deploy` | Register slash commands with Discord |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

</details>

---

## 🛠️ Tech Stack

### discgen-cli itself

| | |
|---|---|
| Prompts | `@clack/prompts` |
| CLI parsing | `commander` |
| File I/O | native `node:fs/promises` |
| PM detection | native lockfile sniffing (no dependencies) |

### Generated bot

| Layer | Technology |
|---|---|
| Language | TypeScript (strict mode) |
| Discord | discord.js v14 + Components v2 |
| Runtime | Node.js >= 22 |
| Build | tsup (ESM) |
| Lint | ESLint 10 flat config + @typescript-eslint v8 |
| Format | Prettier 3 |
| Database | `better-sqlite3` · `pg` + `drizzle-orm` |
| CI | GitHub Actions (Node 20 / 22 matrix) |

---

## 🤝 Contributing

Pull requests are welcome! See [TODO.md](./TODO.md) for open tasks and [CHANGELOG.md](./CHANGELOG.md) for what's changed.

```bash
git clone https://github.com/XSaitoKungX/discgen-cli
cd discgen-cli
npm install

npm run dev      # run CLI locally with tsx
npm test         # 184 unit tests
npm run build    # compile to dist/
npm run lint     # ESLint
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
