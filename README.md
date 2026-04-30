# discgen-cli

> Scaffold a production-ready Discord Bot in seconds.

![npm](https://img.shields.io/npm/v/discgen-cli?style=flat-square)
![license](https://img.shields.io/github/license/xsaitox/discgen-cli?style=flat-square)
![node](https://img.shields.io/node/v/discgen-cli?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)

---

## What is this?

`discgen-cli` is an interactive CLI that scaffolds a fully structured Discord Bot project — with TypeScript, discord.js v14, a command/event handler system, and optional database support.

No more copy-pasting boilerplate. One command, ready to code.

---

## Usage

```bash
npx discgen-cli my-bot
```

Or without a name — the wizard will ask:

```bash
npx discgen-cli
```

---

## What gets generated

```
my-bot/
├── src/
│   ├── commands/       ← auto-loaded, organized by category
│   ├── events/         ← auto-loaded on startup
│   ├── handlers/       ← commandHandler + eventHandler
│   ├── types/          ← shared TypeScript interfaces
│   └── index.ts
├── .env.example
├── tsconfig.json
├── package.json
└── README.md
```

---

## Options

| Prompt | Choices |
|---|---|
| Command type | Slash Commands / Prefix / Both |
| Features | Moderation, Utility, Fun, Economy, Music |
| Database | None / SQLite / PostgreSQL |
| Package manager | npm / pnpm / bun |
| Git init | Yes / No |
| Install deps | Yes / No |

---

## Requirements

- Node.js >= 18
- A Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/applications))

---

## After scaffolding

```bash
cd my-bot
cp .env.example .env    # add your token + client ID
npm run deploy          # register slash commands
npm run dev             # start in watch mode
```

---

## Contributing

Pull requests are welcome! See [TODO.md](./TODO.md) for planned features and open tasks.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `feat: add xyz`
4. Open a Pull Request

---

## License

MIT — [xsaitox](https://xsaitox.dev)
