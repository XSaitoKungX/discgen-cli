import fs from 'node:fs/promises';
import path from 'node:path';
import type { WizardOptions } from '../types/index.js';
import { generatePackageJson } from './package.js';
import {
  generateIndexTs,
  generateEnvExample,
  generateGitignore,
  generateTsconfig,
  generateEslintConfig,
  generatePrettierrc,
} from '../templates/base/index.js';
import { generateTypesTs } from '../templates/base/types.js';
import {
  generateCommandHandler,
  generateInteractionLoader,
  generateEventHandler,
} from '../templates/base/handlers.js';
import { generateDeployCommandsTs, generateReadme } from '../templates/base/deploy.js';
import { generateCiWorkflow } from '../templates/base/ci.js';
import { generateLoggerTs } from '../templates/base/logger.js';
import { generateEnvValidatorTs } from '../templates/base/env.js';
import { generateCooldownTs } from '../templates/base/cooldown.js';
import { generateEmbedTs } from '../templates/base/embed.js';
import { generatePaginatorTs } from '../templates/base/paginator.js';
import {
  generateLocaleEn,
  generateLocaleDe,
  generateI18nIndex,
  generateLocaleSwitchCommand,
} from '../templates/i18n/index.js';
import {
  generateReadyEvent,
  generateInteractionCreateEvent,
  generateMessageCreateEvent,
} from '../templates/events/index.js';
import {
  generatePingCommand,
  generatePrefixPingCommand,
  generateUserinfoCommand,
  generateServerinfoCommand,
  generateAvatarCommand,
} from '../templates/commands/utility.js';
import { generateHelpCommand } from '../templates/commands/help.js';
import {
  generateBanCommand,
  generateKickCommand,
  generateTimeoutCommand,
  generateWarnCommand,
} from '../templates/commands/moderation.js';
import {
  generateCoinflipCommand,
  generateEightBallCommand,
  generateMemeCommand,
} from '../templates/commands/fun.js';
import {
  generateBalanceCommand,
  generateDailyCommand,
  generateLeaderboardCommand,
} from '../templates/commands/economy.js';
import { generateInMemoryEconomyStore } from '../templates/economy/store.js';
import { generatePlayCommand, generateStopCommand } from '../templates/commands/music.js';
import { generateDemoCommand } from '../templates/commands/demo.js';
import {
  generateExampleButton,
  generateOpenModalButton,
} from '../templates/interactions/button.js';
import { generateExampleSelect } from '../templates/interactions/select.js';
import { generateExampleModal } from '../templates/interactions/modal.js';
import { generateDatabaseTs, generateDatabaseEnvVars } from '../templates/database/index.js';
import {
  generateLogMemberAdd,
  generateLogMemberRemove,
  generateLogMessageDelete,
  generateLogMessageUpdate,
  generateLogBanAdd,
  generateLogBanRemove,
} from '../templates/features/logging.js';

interface FileEntry {
  filePath: string;
  content: string;
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function removeDir(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

export { pathExists };

function buildFileList(opts: WizardOptions, projectDir: string): FileEntry[] {
  const files: FileEntry[] = [];

  const add = (relative: string, content: string): void => {
    files.push({ filePath: path.join(projectDir, relative), content });
  };

  // ── Root config ────────────────────────────────────────────────────────────
  add('package.json', JSON.stringify(generatePackageJson(opts), null, 2) + '\n');
  add('tsconfig.json', generateTsconfig());
  add('.discgen.json', JSON.stringify(generateDiscgenConfig(opts), null, 2) + '\n');
  add('eslint.config.mjs', generateEslintConfig());
  add('.prettierrc', generatePrettierrc());
  add('.gitignore', generateGitignore());
  add('README.md', generateReadme(opts));

  let envExample = generateEnvExample({ commandType: opts.commandType, features: opts.features });
  const dbEnvVars = generateDatabaseEnvVars(opts.database);
  if (dbEnvVars) envExample += dbEnvVars;
  add('.env.example', envExample);

  // ── Handlers ───────────────────────────────────────────────────────────────
  add('src/handlers/commandHandler.ts', generateCommandHandler(opts));
  add('src/handlers/interactionLoader.ts', generateInteractionLoader());
  add('src/handlers/eventHandler.ts', generateEventHandler());

  // ── Entry point ────────────────────────────────────────────────────────────
  add('src/index.ts', generateIndexTs(opts));
  add('src/types/index.ts', generateTypesTs());
  add('src/deploy-commands.ts', generateDeployCommandsTs());

  // ── Events ─────────────────────────────────────────────────────────────────
  add('src/events/ready.ts', generateReadyEvent());
  add('src/events/interactionCreate.ts', generateInteractionCreateEvent(opts));
  if (opts.commandType === 'prefix' || opts.commandType === 'both') {
    add('src/events/messageCreate.ts', generateMessageCreateEvent());
  }

  // ── Commands ───────────────────────────────────────────────────────────────
  const hasI18n = opts.features.includes('i18n');
  const hasSlashCommands = opts.commandType === 'slash' || opts.commandType === 'both';
  const hasPrefixCommands = opts.commandType === 'prefix' || opts.commandType === 'both';

  if (hasSlashCommands) {
    add('src/commands/utility/ping.ts', generatePingCommand(hasI18n));
    add('src/commands/utility/help.ts', generateHelpCommand(opts));
  }
  if (hasPrefixCommands) {
    const prefixHelpOpts: WizardOptions = {
      ...opts,
      commandType: 'prefix',
      features: [],
    };
    add('src/commands/prefix/ping.ts', generatePrefixPingCommand());
    add('src/commands/prefix/help.ts', generateHelpCommand(prefixHelpOpts));
  }

  if (hasSlashCommands && opts.features.includes('utility')) {
    add('src/commands/utility/userinfo.ts', generateUserinfoCommand());
    add('src/commands/utility/serverinfo.ts', generateServerinfoCommand());
    add('src/commands/utility/avatar.ts', generateAvatarCommand());
  }
  if (hasSlashCommands && opts.features.includes('moderation')) {
    add('src/commands/moderation/ban.ts', generateBanCommand(hasI18n));
    add('src/commands/moderation/kick.ts', generateKickCommand(hasI18n));
    add('src/commands/moderation/timeout.ts', generateTimeoutCommand(hasI18n));
    add('src/commands/moderation/warn.ts', generateWarnCommand(hasI18n));
  }
  if (hasSlashCommands && opts.features.includes('fun')) {
    add('src/commands/fun/coinflip.ts', generateCoinflipCommand(hasI18n));
    add('src/commands/fun/8ball.ts', generateEightBallCommand(hasI18n));
    add('src/commands/fun/meme.ts', generateMemeCommand());
  }
  if (hasSlashCommands && opts.features.includes('economy')) {
    if (opts.database === 'none') {
      add('src/economy/store.ts', generateInMemoryEconomyStore());
    }
    add('src/commands/economy/balance.ts', generateBalanceCommand(opts.database, hasI18n));
    add('src/commands/economy/daily.ts', generateDailyCommand(opts.database, hasI18n));
    add('src/commands/economy/leaderboard.ts', generateLeaderboardCommand(opts.database, hasI18n));
  }
  if (hasSlashCommands && opts.features.includes('music')) {
    add('src/commands/music/play.ts', generatePlayCommand());
    add('src/commands/music/stop.ts', generateStopCommand());
  }

  // ── Component interactions ─────────────────────────────────────────────────
  if (hasSlashCommands && opts.features.includes('components')) {
    add('src/commands/utility/demo.ts', generateDemoCommand());
    add('src/interactions/buttons/example-button.ts', generateExampleButton());
    add('src/interactions/buttons/open-modal.ts', generateOpenModalButton());
    add('src/interactions/selects/example-select.ts', generateExampleSelect());
    add('src/interactions/modals/example-modal.ts', generateExampleModal());
  }

  // ── i18n ───────────────────────────────────────────────────────────────────
  if (hasSlashCommands && opts.features.includes('i18n')) {
    add('src/i18n/en.ts', generateLocaleEn());
    add('src/i18n/de.ts', generateLocaleDe());
    add('src/i18n/index.ts', generateI18nIndex());
    add('src/commands/utility/locale.ts', generateLocaleSwitchCommand());
  }

  // ── Logging / Audit ────────────────────────────────────────────────────────
  if (opts.features.includes('logging')) {
    add('src/events/logMemberAdd.ts', generateLogMemberAdd());
    add('src/events/logMemberRemove.ts', generateLogMemberRemove());
    add('src/events/logMessageDelete.ts', generateLogMessageDelete());
    add('src/events/logMessageUpdate.ts', generateLogMessageUpdate());
    add('src/events/logBanAdd.ts', generateLogBanAdd());
    add('src/events/logBanRemove.ts', generateLogBanRemove());
  }

  // ── Database ───────────────────────────────────────────────────────────────
  if (opts.database !== 'none') {
    add('src/database/index.ts', generateDatabaseTs(opts.database));
  }

  // ── Utilities ──────────────────────────────────────────────────────────────
  add('src/utils/logger.ts', generateLoggerTs());
  add('src/utils/env.ts', generateEnvValidatorTs());
  add('src/utils/cooldown.ts', generateCooldownTs());
  add('src/utils/embed.ts', generateEmbedTs());
  add('src/utils/paginator.ts', generatePaginatorTs());

  // ── CI ─────────────────────────────────────────────────────────────────────
  add('.github/workflows/ci.yml', generateCiWorkflow());

  return files;
}

function generateDiscgenConfig(opts: WizardOptions): Record<string, unknown> {
  return {
    schemaVersion: 1,
    generator: 'discgen-cli',
    generatorVersion: opts.generatorVersion ?? 'unknown',
    projectName: opts.projectName,
    commandType: opts.commandType,
    features: opts.features,
    database: opts.database,
    packageManager: opts.packageManager,
  };
}

export async function scaffoldProject(opts: WizardOptions, targetDir: string): Promise<void> {
  const files = buildFileList(opts, targetDir);

  if (opts.dryRun) {
    for (const { filePath } of files) {
      console.log('  ' + path.relative(targetDir, filePath).replace(/\\/g, '/'));
    }
    return;
  }

  for (const { filePath, content } of files) {
    await ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
  }
}
