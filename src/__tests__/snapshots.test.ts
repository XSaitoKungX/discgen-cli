import { describe, it, expect } from 'vitest';
import { generateIndexTs, generateEnvExample } from '../templates/base/index.js';
import { generateTypesTs } from '../templates/base/types.js';
import {
  generateCommandHandler,
  generateEventHandler,
  generateInteractionLoader,
} from '../templates/base/handlers.js';
import {
  generatePingCommand,
  generateUserinfoCommand,
  generateAvatarCommand,
  generateServerinfoCommand,
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
import {
  generateReadyEvent,
  generateInteractionCreateEvent,
  generateMessageCreateEvent,
} from '../templates/events/index.js';
import { generateDatabaseTs } from '../templates/database/index.js';
import { generatePackageJson } from '../generators/package.js';
import {
  generateLogMemberAdd,
  generateLogMemberRemove,
  generateLogMessageDelete,
  generateLogMessageUpdate,
  generateLogBanAdd,
  generateLogBanRemove,
} from '../templates/features/logging.js';
import type { WizardOptions } from '../types/index.js';

const base: WizardOptions = {
  projectName: 'snap-bot',
  commandType: 'slash',
  features: [],
  database: 'none',
  packageManager: 'npm',
  gitInit: false,
  installDeps: false,
};

const full: WizardOptions = {
  ...base,
  commandType: 'both',
  features: ['moderation', 'utility', 'fun', 'economy', 'components', 'i18n', 'logging'],
  database: 'sqlite',
};

describe('index.ts template', () => {
  it('slash-only base', () => expect(generateIndexTs(base)).toMatchSnapshot());
  it('prefix + both commands', () =>
    expect(generateIndexTs({ ...base, commandType: 'both' })).toMatchSnapshot());
  it('logging feature adds member/moderation intents', () =>
    expect(generateIndexTs({ ...base, features: ['logging'] })).toMatchSnapshot());
  it('mongodb initializes on startup', () =>
    expect(generateIndexTs({ ...base, database: 'mongodb' })).toMatchSnapshot());
  it('full stack', () => expect(generateIndexTs(full)).toMatchSnapshot());
});

describe('env example', () => {
  it('base', () => expect(generateEnvExample()).toMatchSnapshot());
  it('prefix adds PREFIX', () =>
    expect(generateEnvExample({ commandType: 'prefix' })).toMatchSnapshot());
  it('logging adds LOG_CHANNEL_ID', () =>
    expect(generateEnvExample({ features: ['logging'] })).toMatchSnapshot());
});

describe('types.ts', () => {
  it('matches snapshot', () => expect(generateTypesTs()).toMatchSnapshot());
});

describe('handlers', () => {
  it('slash command handler', () => expect(generateCommandHandler(base)).toMatchSnapshot());
  it('prefix command handler', () =>
    expect(generateCommandHandler({ ...base, commandType: 'prefix' })).toMatchSnapshot());
  it('both command handler', () =>
    expect(generateCommandHandler({ ...base, commandType: 'both' })).toMatchSnapshot());
  it('event handler', () => expect(generateEventHandler()).toMatchSnapshot());
  it('interaction loader', () => expect(generateInteractionLoader()).toMatchSnapshot());
});

const i18nOpts: WizardOptions = { ...base, features: ['i18n'] };

describe('utility commands', () => {
  it('ping', () => expect(generatePingCommand()).toMatchSnapshot());
  it('ping i18n', () => expect(generatePingCommand(true)).toMatchSnapshot());
  it('userinfo', () => expect(generateUserinfoCommand()).toMatchSnapshot());
  it('avatar', () => expect(generateAvatarCommand()).toMatchSnapshot());
  it('serverinfo', () => expect(generateServerinfoCommand()).toMatchSnapshot());
  it('help slash', () => expect(generateHelpCommand(base)).toMatchSnapshot());
  it('help prefix', () =>
    expect(generateHelpCommand({ ...base, commandType: 'prefix' })).toMatchSnapshot());
  it('help full', () => expect(generateHelpCommand(full)).toMatchSnapshot());
});

describe('moderation commands', () => {
  it('ban', () => expect(generateBanCommand()).toMatchSnapshot());
  it('ban i18n', () => expect(generateBanCommand(true)).toMatchSnapshot());
  it('kick', () => expect(generateKickCommand()).toMatchSnapshot());
  it('kick i18n', () => expect(generateKickCommand(true)).toMatchSnapshot());
  it('timeout', () => expect(generateTimeoutCommand()).toMatchSnapshot());
  it('timeout i18n', () => expect(generateTimeoutCommand(true)).toMatchSnapshot());
  it('warn', () => expect(generateWarnCommand()).toMatchSnapshot());
  it('warn i18n', () => expect(generateWarnCommand(true)).toMatchSnapshot());
});

describe('fun commands', () => {
  it('coinflip', () => expect(generateCoinflipCommand()).toMatchSnapshot());
  it('coinflip i18n', () => expect(generateCoinflipCommand(true)).toMatchSnapshot());
  it('8ball', () => expect(generateEightBallCommand()).toMatchSnapshot());
  it('8ball i18n', () => expect(generateEightBallCommand(true)).toMatchSnapshot());
  it('meme', () => expect(generateMemeCommand()).toMatchSnapshot());
});

describe('economy commands — no db', () => {
  it('balance', () => expect(generateBalanceCommand('none')).toMatchSnapshot());
  it('balance i18n', () => expect(generateBalanceCommand('none', true)).toMatchSnapshot());
  it('daily', () => expect(generateDailyCommand('none')).toMatchSnapshot());
  it('daily i18n', () => expect(generateDailyCommand('none', true)).toMatchSnapshot());
  it('leaderboard', () => expect(generateLeaderboardCommand('none')).toMatchSnapshot());
  it('leaderboard i18n', () => expect(generateLeaderboardCommand('none', true)).toMatchSnapshot());
});

describe('in-memory economy store', () => {
  it('matches snapshot', () => expect(generateInMemoryEconomyStore()).toMatchSnapshot());
});

describe('economy commands — sqlite', () => {
  it('balance', () => expect(generateBalanceCommand('sqlite')).toMatchSnapshot());
  it('balance i18n', () => expect(generateBalanceCommand('sqlite', true)).toMatchSnapshot());
  it('daily', () => expect(generateDailyCommand('sqlite')).toMatchSnapshot());
  it('leaderboard', () => expect(generateLeaderboardCommand('sqlite')).toMatchSnapshot());
});

describe('economy commands — postgresql', () => {
  it('balance', () => expect(generateBalanceCommand('postgresql')).toMatchSnapshot());
  it('daily', () => expect(generateDailyCommand('postgresql')).toMatchSnapshot());
  it('leaderboard', () => expect(generateLeaderboardCommand('postgresql')).toMatchSnapshot());
});

describe('economy commands — mongodb', () => {
  it('balance', () => expect(generateBalanceCommand('mongodb')).toMatchSnapshot());
  it('daily', () => expect(generateDailyCommand('mongodb')).toMatchSnapshot());
  it('leaderboard', () => expect(generateLeaderboardCommand('mongodb')).toMatchSnapshot());
});

describe('events', () => {
  it('ready', () => expect(generateReadyEvent()).toMatchSnapshot());
  it('interactionCreate', () => expect(generateInteractionCreateEvent(base)).toMatchSnapshot());
  it('interactionCreate i18n', () =>
    expect(generateInteractionCreateEvent(i18nOpts)).toMatchSnapshot());
  it('messageCreate', () => expect(generateMessageCreateEvent()).toMatchSnapshot());
});

describe('database templates', () => {
  it('sqlite', () => expect(generateDatabaseTs('sqlite')).toMatchSnapshot());
  it('postgresql', () => expect(generateDatabaseTs('postgresql')).toMatchSnapshot());
  it('mongodb', () => expect(generateDatabaseTs('mongodb')).toMatchSnapshot());
});

describe('logging event templates', () => {
  it('memberAdd', () => expect(generateLogMemberAdd()).toMatchSnapshot());
  it('memberRemove', () => expect(generateLogMemberRemove()).toMatchSnapshot());
  it('messageDelete', () => expect(generateLogMessageDelete()).toMatchSnapshot());
  it('messageUpdate', () => expect(generateLogMessageUpdate()).toMatchSnapshot());
  it('banAdd', () => expect(generateLogBanAdd()).toMatchSnapshot());
  it('banRemove', () => expect(generateLogBanRemove()).toMatchSnapshot());
});

describe('package.json generator', () => {
  it('base', () => expect(generatePackageJson(base)).toMatchSnapshot());
  it('sqlite db', () =>
    expect(generatePackageJson({ ...base, database: 'sqlite' })).toMatchSnapshot());
  it('pg db', () =>
    expect(generatePackageJson({ ...base, database: 'postgresql' })).toMatchSnapshot());
  it('mongodb db', () =>
    expect(generatePackageJson({ ...base, database: 'mongodb' })).toMatchSnapshot());
});
