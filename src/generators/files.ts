import fs from 'fs-extra';
import path from 'path';
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
import { generateCommandHandler, generateInteractionLoader, generateEventHandler } from '../templates/base/handlers.js';
import { generateDeployCommandsTs, generateReadme } from '../templates/base/deploy.js';
import { generateCiWorkflow } from '../templates/base/ci.js';
import { generateLoggerTs } from '../templates/base/logger.js';
import { generateEnvValidatorTs } from '../templates/base/env.js';
import { generateCooldownTs } from '../templates/base/cooldown.js';
import { generateReadyEvent, generateInteractionCreateEvent, generateMessageCreateEvent } from '../templates/events/index.js';
import { generatePingCommand, generateUserinfoCommand, generateServerinfoCommand } from '../templates/commands/utility.js';
import { generateHelpCommand } from '../templates/commands/help.js';
import { generateBanCommand, generateKickCommand, generateTimeoutCommand, generateWarnCommand } from '../templates/commands/moderation.js';
import { generateCoinflipCommand, generateEightBallCommand, generateMemeCommand } from '../templates/commands/fun.js';
import { generateBalanceCommand, generateDailyCommand, generateLeaderboardCommand } from '../templates/commands/economy.js';
import { generatePlayCommand, generateStopCommand } from '../templates/commands/music.js';
import { generateDemoCommand } from '../templates/commands/demo.js';
import { generateExampleButton, generateOpenModalButton } from '../templates/interactions/button.js';
import { generateExampleSelect } from '../templates/interactions/select.js';
import { generateExampleModal } from '../templates/interactions/modal.js';
import { generateDatabaseTs, generateDatabaseEnvVars } from '../templates/database/index.js';

interface FileEntry {
  filePath: string;
  content: string;
}

function buildFileList(opts: WizardOptions, projectDir: string): FileEntry[] {
  const files: FileEntry[] = [];

  const add = (relative: string, content: string): void => {
    files.push({ filePath: path.join(projectDir, relative), content });
  };

  // ── Root config ────────────────────────────────────────────────────────────
  add('package.json',      JSON.stringify(generatePackageJson(opts), null, 2) + '\n');
  add('tsconfig.json',     generateTsconfig());
  add('eslint.config.mjs', generateEslintConfig());
  add('.prettierrc',       generatePrettierrc());
  add('.gitignore',        generateGitignore());
  add('README.md',         generateReadme(opts.projectName));

  let envExample = generateEnvExample();
  const dbEnvVars = generateDatabaseEnvVars(opts.database);
  if (dbEnvVars) envExample += dbEnvVars;
  add('.env.example', envExample);

  // ── Handlers ───────────────────────────────────────────────────────────────
  add('src/handlers/commandHandler.ts',    generateCommandHandler(opts));
  add('src/handlers/interactionLoader.ts', generateInteractionLoader());
  add('src/handlers/eventHandler.ts',      generateEventHandler());

  // ── Entry point ────────────────────────────────────────────────────────────
  add('src/index.ts',         generateIndexTs(opts));
  add('src/types/index.ts',   generateTypesTs());
  add('src/deploy-commands.ts', generateDeployCommandsTs());

  // ── Events ─────────────────────────────────────────────────────────────────
  add('src/events/ready.ts',             generateReadyEvent());
  add('src/events/interactionCreate.ts', generateInteractionCreateEvent(opts));
  if (opts.commandType === 'prefix' || opts.commandType === 'both') {
    add('src/events/messageCreate.ts', generateMessageCreateEvent());
  }

  // ── Commands ───────────────────────────────────────────────────────────────
  add('src/commands/utility/ping.ts', generatePingCommand());
  add('src/commands/utility/help.ts', generateHelpCommand(opts));

  if (opts.features.includes('utility')) {
    add('src/commands/utility/userinfo.ts',   generateUserinfoCommand());
    add('src/commands/utility/serverinfo.ts', generateServerinfoCommand());
  }
  if (opts.features.includes('moderation')) {
    add('src/commands/moderation/ban.ts',     generateBanCommand());
    add('src/commands/moderation/kick.ts',    generateKickCommand());
    add('src/commands/moderation/timeout.ts', generateTimeoutCommand());
    add('src/commands/moderation/warn.ts',    generateWarnCommand());
  }
  if (opts.features.includes('fun')) {
    add('src/commands/fun/coinflip.ts', generateCoinflipCommand());
    add('src/commands/fun/8ball.ts',    generateEightBallCommand());
    add('src/commands/fun/meme.ts',     generateMemeCommand());
  }
  if (opts.features.includes('economy')) {
    add('src/commands/economy/balance.ts',     generateBalanceCommand());
    add('src/commands/economy/daily.ts',       generateDailyCommand());
    add('src/commands/economy/leaderboard.ts', generateLeaderboardCommand());
  }
  if (opts.features.includes('music')) {
    add('src/commands/music/play.ts', generatePlayCommand());
    add('src/commands/music/stop.ts', generateStopCommand());
  }

  // ── Component interactions ─────────────────────────────────────────────────
  if (opts.features.includes('components')) {
    add('src/commands/utility/demo.ts',             generateDemoCommand());
    add('src/interactions/buttons/example-button.ts', generateExampleButton());
    add('src/interactions/buttons/open-modal.ts',     generateOpenModalButton());
    add('src/interactions/selects/example-select.ts', generateExampleSelect());
    add('src/interactions/modals/example-modal.ts',   generateExampleModal());
  }

  // ── Database ───────────────────────────────────────────────────────────────
  if (opts.database !== 'none') {
    add('src/database/index.ts', generateDatabaseTs(opts.database));
  }

  // ── Utilities ──────────────────────────────────────────────────────────────
  add('src/utils/logger.ts',   generateLoggerTs());
  add('src/utils/env.ts',      generateEnvValidatorTs());
  add('src/utils/cooldown.ts', generateCooldownTs());

  // ── CI ─────────────────────────────────────────────────────────────────────
  add('.github/workflows/ci.yml', generateCiWorkflow());

  return files;
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
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
  }
}
