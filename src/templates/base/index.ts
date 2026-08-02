import type { WizardOptions } from '../../types/index.js';

export function generateIndexTs(opts: WizardOptions): string {
  const needsMessages = opts.commandType === 'prefix' || opts.commandType === 'both';
  const hasLogging = opts.features.includes('logging');
  const hasDatabase = opts.database !== 'none';
  const hasPrefixCmds = needsMessages;
  const prefixImport = hasPrefixCmds ? ', PrefixCommand' : '';
  const prefixClientDecl = hasPrefixCmds
    ? '\n    prefixCommands: Collection<string, PrefixCommand>;'
    : '';
  const prefixInit = hasPrefixCmds ? '\nclient.prefixCommands = new Collection();' : '';

  const intents: string[] = ['GatewayIntentBits.Guilds'];
  if (needsMessages || hasLogging) {
    intents.push('GatewayIntentBits.GuildMessages');
    intents.push('GatewayIntentBits.MessageContent');
  }
  if (hasLogging) {
    intents.push('GatewayIntentBits.GuildMembers');
    intents.push('GatewayIntentBits.GuildModeration');
  }
  const intentsStr = intents.map((i) => `    ${i},`).join('\n');

  const databaseImport = hasDatabase ? `\nimport { initDb } from './database/index.js';` : '';
  const databaseInit = hasDatabase
    ? `\nawait initDb();\nlogger.info('Database initialized.', 'db');`
    : '';

  return `import { Client, GatewayIntentBits, Collection } from 'discord.js';
import 'dotenv/config';
import { loadCommands } from './handlers/commandHandler.js';
import { loadComponents } from './handlers/interactionLoader.js';
import { loadEvents } from './handlers/eventHandler.js';
import { logger } from './utils/logger.js';
import { env } from './utils/env.js';${databaseImport}
import type { Command${prefixImport}, ButtonHandler, SelectHandler, ModalHandler } from './types/index.js';

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;${prefixClientDecl}
    buttons:  Collection<string, ButtonHandler>;
    selects:  Collection<string, SelectHandler>;
    modals:   Collection<string, ModalHandler>;
  }
}

const client = new Client({
  intents: [
${intentsStr}
  ],
});

client.commands = new Collection();${prefixInit}
client.buttons  = new Collection();
client.selects  = new Collection();
client.modals   = new Collection();

${databaseInit}
await loadCommands(client);
await loadComponents(client);
await loadEvents(client);

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection', error, 'process');
});

logger.info('Connecting to Discord...', 'bot');
await client.login(env.DISCORD_TOKEN);
`;
}

export function generateEnvExample(opts?: { commandType?: string; features?: string[] }): string {
  const needsPrefix = opts?.commandType === 'prefix' || opts?.commandType === 'both';
  const hasLogging = opts?.features?.includes('logging') ?? false;
  return `DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here${needsPrefix ? '\nPREFIX=!' : ''}${hasLogging ? '\nLOG_CHANNEL_ID=your_log_channel_id_here' : ''}
`;
}

export function generateGitignore(): string {
  return `node_modules/
dist/
.env
*.log
.DS_Store
`;
}

export function generateTsconfig(): string {
  return `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "types": ["node"],
    "outDir": "dist",
    "rootDir": "src",
    "types": ["node"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`;
}

export function generateEslintConfig(): string {
  return `import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
`;
}

export function generatePrettierrc(): string {
  return `{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
`;
}
