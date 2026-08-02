import type { WizardOptions } from '../../types/index.js';
import { getRunCommand } from '../../utils/pm.js';

export function generateDeployCommandsTs(): string {
  return `import { REST, Routes } from 'discord.js';
import { readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId) {
  throw new Error('DISCORD_TOKEN and CLIENT_ID must be set in .env');
}

const commands: unknown[] = [];
const commandsPath = join(__dirname, 'commands');
const categories = readdirSync(commandsPath);

for (const category of categories) {
  if (category === 'prefix') continue; // prefix commands are not slash commands
  const catPath = join(commandsPath, category);
  if (!statSync(catPath).isDirectory()) continue;
  const files = readdirSync(catPath).filter((f) => /\.[jt]s$/.test(f) && !f.endsWith('.d.ts'));
  for (const file of files) {
    const filePath = join(catPath, file);
    const mod = await import(pathToFileURL(filePath).href) as { data?: { toJSON: () => unknown } };
    if (mod.data) commands.push(mod.data.toJSON());
  }
}

const rest = new REST().setToken(token);

console.log(\`Deploying \${commands.length} command(s)...\`);

if (guildId) {
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
  console.log(\`✅ Deployed to guild \${guildId}\`);
} else {
  await rest.put(Routes.applicationCommands(clientId), { body: commands });
  console.log('✅ Deployed globally');
}
`;
}

export function generateReadme(opts: WizardOptions): string {
  const deployCommand = getRunCommand(opts.packageManager, 'deploy');
  const devCommand = getRunCommand(opts.packageManager, 'dev');
  const buildCommand = getRunCommand(opts.packageManager, 'build');
  const lintCommand = getRunCommand(opts.packageManager, 'lint');
  const formatCommand = getRunCommand(opts.packageManager, 'format');

  return `# ${opts.projectName}

A Discord Bot built with [discord.js](https://discord.js.org/) v14 and TypeScript.

## Setup

\`\`\`bash
cp .env.example .env   # fill in DISCORD_TOKEN and CLIENT_ID
${deployCommand}         # register slash commands
${devCommand}            # start in watch mode
\`\`\`

## Scripts

| Script | Description |
|--------|-------------|
| \`${devCommand}\` | Start bot in watch mode |
| \`${buildCommand}\` | Compile TypeScript |
| \`${getRunCommand(opts.packageManager, 'start')}\` | Run compiled bot |
| \`${deployCommand}\` | Register slash commands |
| \`${lintCommand}\` | Run ESLint |
| \`${formatCommand}\` | Format with Prettier |

## Requirements

- Node.js >= 22.13.0
- A Discord Bot Token — [Discord Developer Portal](https://discord.com/developers/applications)

## License

MIT
`;
}
