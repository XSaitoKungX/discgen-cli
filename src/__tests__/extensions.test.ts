import { describe, it, expect } from 'vitest';
import { generateBalanceCommand, generateDailyCommand, generateLeaderboardCommand } from '../templates/commands/economy.js';
import { generateAvatarCommand } from '../templates/commands/utility.js';
import { generateHelpCommand } from '../templates/commands/help.js';
import { generateMessageCreateEvent } from '../templates/events/index.js';
import { generateCommandHandler } from '../templates/base/handlers.js';
import { generateIndexTs } from '../templates/base/index.js';
import { generateServiceFile } from '../templates/generate/service.js';
import type { WizardOptions } from '../types/index.js';

const baseOpts: WizardOptions = {
  projectName: 'test-bot',
  commandType: 'slash',
  features: [],
  database: 'none',
  packageManager: 'npm',
  gitInit: false,
  installDeps: false,
};

// ── Economy: database-aware ─────────────────────────────────────────────────

describe('economy commands — no database', () => {
  it('balance uses in-memory Map', () => {
    expect(generateBalanceCommand('none')).toContain('new Map');
  });
  it('daily uses in-memory Map', () => {
    expect(generateDailyCommand('none')).toContain('new Map');
  });
  it('leaderboard uses in-memory Map', () => {
    expect(generateLeaderboardCommand('none')).toContain('new Map');
  });
});

describe('economy commands — sqlite', () => {
  it('balance imports from database', () => {
    expect(generateBalanceCommand('sqlite')).toContain("from '../../database/index.js'");
  });
  it('balance uses db.prepare', () => {
    expect(generateBalanceCommand('sqlite')).toContain('db.prepare');
  });
  it('daily uses ON CONFLICT upsert', () => {
    expect(generateDailyCommand('sqlite')).toContain('ON CONFLICT');
  });
  it('leaderboard queries ORDER BY balance DESC', () => {
    expect(generateLeaderboardCommand('sqlite')).toContain('ORDER BY balance DESC');
  });
});

describe('economy commands — postgresql', () => {
  it('balance imports drizzle-orm helpers', () => {
    expect(generateBalanceCommand('postgresql')).toContain("from 'drizzle-orm'");
  });
  it('balance uses db.select', () => {
    expect(generateBalanceCommand('postgresql')).toContain('db.select()');
  });
  it('daily uses onConflictDoUpdate', () => {
    expect(generateDailyCommand('postgresql')).toContain('onConflictDoUpdate');
  });
  it('leaderboard uses desc ordering', () => {
    expect(generateLeaderboardCommand('postgresql')).toContain('desc(users.balance)');
  });
});

// ── Avatar command ──────────────────────────────────────────────────────────

describe('generateAvatarCommand', () => {
  it('returns a non-empty string', () => {
    expect(generateAvatarCommand().length).toBeGreaterThan(0);
  });
  it('uses SlashCommandBuilder', () => {
    expect(generateAvatarCommand()).toContain('SlashCommandBuilder');
  });
  it('command name is avatar', () => {
    expect(generateAvatarCommand()).toContain("setName('avatar')");
  });
  it('uses ThumbnailBuilder for the avatar image', () => {
    expect(generateAvatarCommand()).toContain('ThumbnailBuilder');
  });
  it('includes a link button for full-size avatar', () => {
    expect(generateAvatarCommand()).toContain('ButtonStyle.Link');
  });
  it('uses IsComponentsV2 flag', () => {
    expect(generateAvatarCommand()).toContain('IsComponentsV2');
  });
  it('satisfies Command type', () => {
    expect(generateAvatarCommand()).toContain('satisfies Command');
  });
});

// ── Help: dynamic feature sections ─────────────────────────────────────────

describe('generateHelpCommand — dynamic sections', () => {
  it('always includes /ping and /help in general section', () => {
    const out = generateHelpCommand(baseOpts);
    expect(out).toContain('/ping');
    expect(out).toContain('/help');
  });
  it('includes utility commands when feature selected', () => {
    const out = generateHelpCommand({ ...baseOpts, features: ['utility'] });
    expect(out).toContain('/userinfo');
    expect(out).toContain('/serverinfo');
  });
  it('omits utility commands when feature not selected', () => {
    const out = generateHelpCommand(baseOpts);
    expect(out).not.toContain('/userinfo');
  });
  it('includes moderation commands when feature selected', () => {
    const out = generateHelpCommand({ ...baseOpts, features: ['moderation'] });
    expect(out).toContain('/ban');
    expect(out).toContain('/kick');
  });
  it('includes economy commands when feature selected', () => {
    const out = generateHelpCommand({ ...baseOpts, features: ['economy'] });
    expect(out).toContain('/balance');
    expect(out).toContain('/daily');
  });
  it('prefix help lists prefix commands', () => {
    const out = generateHelpCommand({ ...baseOpts, commandType: 'prefix', features: ['moderation'] });
    expect(out).toContain('!help');
    expect(out).toContain('!ban');
  });
});

// ── messageCreate: real prefix routing ─────────────────────────────────────

describe('generateMessageCreateEvent', () => {
  it('routes to client.prefixCommands', () => {
    expect(generateMessageCreateEvent()).toContain('client.prefixCommands');
  });
  it('executes the command handler', () => {
    expect(generateMessageCreateEvent()).toContain('command.execute(message, parts, client)');
  });
  it('has try/catch error handling', () => {
    expect(generateMessageCreateEvent()).toContain('catch (error)');
  });
  it('respects PREFIX env var', () => {
    expect(generateMessageCreateEvent()).toContain('process.env.PREFIX');
  });
  it('ignores bot messages', () => {
    expect(generateMessageCreateEvent()).toContain('message.author.bot');
  });
});

// ── commandHandler: prefix loading ─────────────────────────────────────────

describe('generateCommandHandler — prefix', () => {
  it('loads prefix commands from commands/prefix/', () => {
    const out = generateCommandHandler({ ...baseOpts, commandType: 'prefix' });
    expect(out).toContain("entry === 'prefix'");
  });
  it('accesses mod.default for prefix commands', () => {
    const out = generateCommandHandler({ ...baseOpts, commandType: 'prefix' });
    expect(out).toContain('mod.default');
  });
  it('registers to client.prefixCommands', () => {
    const out = generateCommandHandler({ ...baseOpts, commandType: 'prefix' });
    expect(out).toContain('client.prefixCommands.set');
  });
  it('imports PrefixCommand type when prefix mode', () => {
    const out = generateCommandHandler({ ...baseOpts, commandType: 'prefix' });
    expect(out).toContain('PrefixCommand');
  });
  it('does not reference prefix for slash-only bots', () => {
    const out = generateCommandHandler({ ...baseOpts, commandType: 'slash' });
    expect(out).not.toContain('prefixCommands');
  });
});

// ── index.ts: prefixCommands collection ────────────────────────────────────

describe('generateIndexTs — prefix', () => {
  it('declares prefixCommands on Client for prefix bots', () => {
    const out = generateIndexTs({ ...baseOpts, commandType: 'prefix' });
    expect(out).toContain('prefixCommands');
  });
  it('initializes prefixCommands Collection for prefix bots', () => {
    const out = generateIndexTs({ ...baseOpts, commandType: 'prefix' });
    expect(out).toContain('client.prefixCommands = new Collection()');
  });
  it('does not declare prefixCommands for slash-only bots', () => {
    const out = generateIndexTs({ ...baseOpts, commandType: 'slash' });
    expect(out).not.toContain('prefixCommands');
  });
  it('logs before calling client.login', () => {
    const out = generateIndexTs(baseOpts);
    const logIdx = out.indexOf('Connecting to Discord');
    const loginIdx = out.indexOf('client.login');
    expect(logIdx).toBeLessThan(loginIdx);
  });
});

// ── generate service template ───────────────────────────────────────────────

describe('generateServiceFile', () => {
  it('creates a singleton class', () => {
    expect(generateServiceFile('avatar-api')).toContain('static instance');
  });
  it('uses PascalCase class name', () => {
    expect(generateServiceFile('avatar-api')).toContain('class AvatarApiService');
  });
  it('exports a default instance', () => {
    expect(generateServiceFile('avatar-api')).toContain('export const avatarApiService');
  });
  it('has getInstance static method', () => {
    expect(generateServiceFile('my-service')).toContain('static getInstance()');
  });
  it('handles single-word names', () => {
    expect(generateServiceFile('cache')).toContain('class CacheService');
    expect(generateServiceFile('cache')).toContain('export const cacheService');
  });
});
