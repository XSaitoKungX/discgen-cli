import type { WizardOptions } from '../../types/index.js';

export function generateIndexTs(opts: WizardOptions): string {
  const needsMessages = opts.commandType === 'prefix' || opts.commandType === 'both';

  return `import { Client, GatewayIntentBits, Collection } from 'discord.js';
import 'dotenv/config';
import { loadCommands } from './handlers/commandHandler.js';
import { loadComponents } from './handlers/interactionLoader.js';
import { loadEvents } from './handlers/eventHandler.js';
import { logger } from './utils/logger.js';
import { env } from './utils/env.js';
import type { Command, ButtonHandler, SelectHandler, ModalHandler } from './types/index.js';

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
    buttons:  Collection<string, ButtonHandler>;
    selects:  Collection<string, SelectHandler>;
    modals:   Collection<string, ModalHandler>;
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,${needsMessages ? '\n    GatewayIntentBits.GuildMessages,\n    GatewayIntentBits.MessageContent,' : ''}
  ],
});

client.commands = new Collection();
client.buttons  = new Collection();
client.selects  = new Collection();
client.modals   = new Collection();

await loadCommands(client);
await loadComponents(client);
await loadEvents(client);

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection', error, 'process');
});

await client.login(env.DISCORD_TOKEN);
logger.info('Connecting to Discord...', 'bot');
`;
}

export function generateEnvExample(): string {
  return `DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
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
    "outDir": "dist",
    "rootDir": "src",
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
