<div align="center">

<img src="https://raw.githubusercontent.com/XSaitoKungX/discgen-cli/main/assets/banner.png" alt="discgen-cli" width="100%" />

<br />

<h1>⚡ discgen-cli</h1>

<p><strong>Scaffold a production-ready Discord Bot in seconds — not hours.</strong></p>

<p>
  <a href="https://www.npmjs.com/package/discgen-cli">
    <img src="https://img.shields.io/npm/v/discgen-cli?style=for-the-badge&logo=npm&logoColor=white&color=CB3837" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/discgen-cli">
    <img src="https://img.shields.io/npm/dm/discgen-cli?style=for-the-badge&logo=npm&logoColor=white&color=CB3837" alt="npm downloads" />
  </a>
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/node/v/discgen-cli?style=for-the-badge&logo=nodedotjs&logoColor=white&color=339933" alt="node version" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://discord.js.org">
    <img src="https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="discord.js" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/XSaitoKungX/discgen-cli?style=for-the-badge&color=brightgreen" alt="license" />
  </a>
</p>

<p>
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-what-gets-generated">Generated Output</a> ·
  <a href="#-flags">Flags</a> ·
  <a href="#-contributing">Contributing</a>
</p>

<br />

</div>

---

## 🚀 Quick Start

```bash
npx discgen-cli my-bot
```

No installation needed. The interactive wizard does the rest.

```bash
# or — let the wizard ask for the name
npx discgen-cli
```

---

## ✨ Features

<table>
  <tr>
    <td align="center" width="200">
      <h3>🎛️ Interactive Wizard</h3>
      <p>Beautiful terminal UI powered by <code>@clack/prompts</code> — feels like <code>create-vite</code></p>
    </td>
    <td align="center" width="200">
      <h3>⚡ Components v2</h3>
      <p>All UI uses Discord's modern Components v2 API — no legacy Embeds</p>
    </td>
    <td align="center" width="200">
      <h3>🗃️ Database Ready</h3>
      <p>Choose SQLite <em>(better-sqlite3)</em> or PostgreSQL <em>(drizzle-orm)</em> — wired up from day one</p>
    </td>
  </tr>
  <tr>
    <td align="center" width="200">
      <h3>🔧 DX First</h3>
      <p>ESLint 10, Prettier, strict TypeScript 6, tsup build — zero config needed</p>
    </td>
    <td align="center" width="200">
      <h3>📦 Auto Install</h3>
      <p>Detects your package manager (npm / pnpm / bun) and installs deps automatically</p>
    </td>
    <td align="center" width="200">
      <h3>🔍 Dry Run</h3>
      <p>Preview every file that would be generated — before writing a single byte</p>
    </td>
  </tr>
</table>

---

## 🎬 Demo

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
│  ◼ Moderation  ◼ Utility  ◻ Fun  ◻ Economy  ◻ Music
│
◇  Database
│  None
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
│       └── ci.yml              ← Node 18 / 20 / 22 matrix
├── src/
│   ├── commands/
│   │   ├── moderation/         ← ban, kick, timeout, warn
│   │   └── utility/            ← ping, userinfo, serverinfo
│   ├── events/
│   │   ├── ready.ts
│   │   └── interactionCreate.ts
│   ├── handlers/
│   │   ├── commandHandler.ts   ← auto-loads all commands
│   │   └── eventHandler.ts     ← auto-loads all events
│   ├── types/
│   │   └── index.ts            ← Command & Event interfaces
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

| Prompt          | Choices                                        |
|-----------------|------------------------------------------------|
| Command type    | Slash Commands · Prefix Commands · Both        |
| Features        | Moderation · Utility · Fun · Economy · Music   |
| Database        | None · SQLite · PostgreSQL                     |
| Package manager | npm · pnpm · bun (auto-detected)               |
| Git init        | Yes · No                                       |
| Install deps    | Yes · No                                       |

---

## 🚩 Flags

| Flag            | Description                                          |
|-----------------|------------------------------------------------------|
| `--no-install`  | Skip dependency installation                         |
| `--no-git`      | Skip git initialization                              |
| `--dry-run`     | Preview generated files without writing to disk      |
| `--version`     | Print version                                        |
| `--help`        | Show help                                            |

```bash
# Preview what would be generated — nothing is written
npx discgen-cli my-bot --dry-run

# Skip install and git in one go
npx discgen-cli my-bot --no-install --no-git
```

---

## 🛠️ Generated Bot: Tech Stack

<table>
  <tr>
    <th>Layer</th>
    <th>Technology</th>
  </tr>
  <tr>
    <td>Language</td>
    <td>
      <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    </td>
  </tr>
  <tr>
    <td>Discord</td>
    <td>
      <img src="https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square&logo=discord&logoColor=white" alt="discord.js" />
      &nbsp;+ Components v2
    </td>
  </tr>
  <tr>
    <td>Runtime</td>
    <td>
      <img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
    </td>
  </tr>
  <tr>
    <td>Build</td>
    <td>
      <img src="https://img.shields.io/badge/tsup-bundler-yellow?style=flat-square" alt="tsup" />
    </td>
  </tr>
  <tr>
    <td>Lint</td>
    <td>
      <img src="https://img.shields.io/badge/ESLint-10-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint" />
      &nbsp;flat config + @typescript-eslint v8
    </td>
  </tr>
  <tr>
    <td>Format</td>
    <td>
      <img src="https://img.shields.io/badge/Prettier-3-F7B93E?style=flat-square&logo=prettier&logoColor=black" alt="Prettier" />
    </td>
  </tr>
  <tr>
    <td>Database</td>
    <td>SQLite <em>(better-sqlite3)</em> &nbsp;or&nbsp; PostgreSQL <em>(pg + drizzle-orm)</em></td>
  </tr>
</table>

---

## ▶️ After Scaffolding

```bash
cd my-bot
cp .env.example .env   # fill in DISCORD_TOKEN + CLIENT_ID
npm run deploy         # register slash commands with Discord
npm run dev            # start bot in watch mode
```

<details>
<summary>📋 All available scripts in the generated bot</summary>

| Script           | Description                          |
|------------------|--------------------------------------|
| `npm run dev`    | Start bot in watch mode (tsx)        |
| `npm run build`  | Compile TypeScript → dist/           |
| `npm start`      | Run compiled bot                     |
| `npm run deploy` | Register slash commands with Discord |
| `npm run lint`   | Run ESLint                           |
| `npm run format` | Format with Prettier                 |

</details>

---

## 📋 Requirements

- **Node.js >= 18** — checked automatically, exits with a clear error if too old
- **A Discord Bot Token** — [Discord Developer Portal →](https://discord.com/developers/applications)

---

## 🤝 Contributing

Pull requests are welcome! Check [TODO.md](./TODO.md) for open tasks and [CHANGELOG.md](./CHANGELOG.md) for what's new.

```bash
git clone https://github.com/XSaitoKungX/discgen-cli
cd discgen-cli
npm install

npm run dev      # run CLI locally
npm run test     # run 32 unit tests
npm run build    # compile to dist/
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
  <img src="https://img.shields.io/badge/Get%20it%20on-npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="Get it on npm" />
</a>

</div>
