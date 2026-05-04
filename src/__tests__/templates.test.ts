import { describe, it, expect } from 'vitest';
import { generateIndexTs, generateEnvExample, generateGitignore } from '../templates/base/index.js';
import { generateTypesTs } from '../templates/base/types.js';
import { generateCommandHandler, generateEventHandler } from '../templates/base/handlers.js';
import { generatePingCommand } from '../templates/commands/utility.js';
import { generateBanCommand } from '../templates/commands/moderation.js';
import { generateCoinflipCommand } from '../templates/commands/fun.js';
import { generateDatabaseTs } from '../templates/database/index.js';
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

describe('generateIndexTs', () => {
  it('is a non-empty string', () => {
    expect(generateIndexTs(baseOpts)).toBeTruthy();
  });

  it('includes GuildMessages intent for prefix bots', () => {
    const result = generateIndexTs({ ...baseOpts, commandType: 'prefix' });
    expect(result).toContain('GuildMessages');
    expect(result).toContain('MessageContent');
  });

  it('does not include GuildMessages for slash-only bots', () => {
    const result = generateIndexTs({ ...baseOpts, commandType: 'slash' });
    expect(result).not.toContain('GuildMessages');
  });
});

describe('generateEnvExample', () => {
  it('contains required env vars', () => {
    const result = generateEnvExample();
    expect(result).toContain('DISCORD_TOKEN');
    expect(result).toContain('CLIENT_ID');
    expect(result).toContain('GUILD_ID');
  });
});

describe('generateGitignore', () => {
  it('ignores node_modules and .env', () => {
    const result = generateGitignore();
    expect(result).toContain('node_modules');
    expect(result).toContain('.env');
  });
});

describe('generateTypesTs', () => {
  it('exports Command and Event interfaces', () => {
    const result = generateTypesTs();
    expect(result).toContain('Command');
    expect(result).toContain('Event');
  });
});

describe('generateCommandHandler', () => {
  it('is a non-empty string', () => {
    expect(generateCommandHandler(baseOpts)).toBeTruthy();
  });
});

describe('generateEventHandler', () => {
  it('is a non-empty string', () => {
    expect(generateEventHandler()).toBeTruthy();
  });
});

describe('command templates', () => {
  it('ping command contains SlashCommandBuilder', () => {
    expect(generatePingCommand()).toContain('SlashCommandBuilder');
  });

  it('ban command contains PermissionFlagsBits.BanMembers', () => {
    expect(generateBanCommand()).toContain('BanMembers');
  });

  it('ban command uses Components v2', () => {
    expect(generateBanCommand()).toContain('ContainerBuilder');
    expect(generateBanCommand()).toContain('IsComponentsV2');
  });

  it('coinflip command contains random', () => {
    expect(generateCoinflipCommand()).toContain('Math.random');
  });
});

describe('generateDatabaseTs', () => {
  it('returns empty string for none', () => {
    expect(generateDatabaseTs('none')).toBe('');
  });

  it('returns sqlite setup for sqlite', () => {
    expect(generateDatabaseTs('sqlite')).toContain('better-sqlite3');
  });

  it('returns drizzle setup for postgresql', () => {
    expect(generateDatabaseTs('postgresql')).toContain('drizzle');
  });
});
