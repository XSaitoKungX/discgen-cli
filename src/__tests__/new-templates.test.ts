import { describe, it, expect } from 'vitest';
import { generateEnvValidatorTs } from '../templates/base/env.js';
import { generateCooldownTs } from '../templates/base/cooldown.js';
import { generateHelpCommand } from '../templates/commands/help.js';
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

describe('generateEnvValidatorTs', () => {
  it('returns a non-empty string', () => {
    expect(generateEnvValidatorTs().length).toBeGreaterThan(0);
  });

  it('validates DISCORD_TOKEN', () => {
    expect(generateEnvValidatorTs()).toContain('DISCORD_TOKEN');
  });

  it('validates CLIENT_ID', () => {
    expect(generateEnvValidatorTs()).toContain('CLIENT_ID');
  });

  it('exits on missing variables', () => {
    expect(generateEnvValidatorTs()).toContain('process.exit(1)');
  });

  it('exports env object', () => {
    expect(generateEnvValidatorTs()).toContain('export const env');
  });
});

describe('generateCooldownTs', () => {
  it('returns a non-empty string', () => {
    expect(generateCooldownTs().length).toBeGreaterThan(0);
  });

  it('exports getRemainingCooldown', () => {
    expect(generateCooldownTs()).toContain('getRemainingCooldown');
  });

  it('exports setCooldown', () => {
    expect(generateCooldownTs()).toContain('setCooldown');
  });

  it('uses a Map for timestamps', () => {
    expect(generateCooldownTs()).toContain('new Map');
  });

  it('auto-cleans expired entries', () => {
    expect(generateCooldownTs()).toContain('setTimeout');
  });
});

describe('generateHelpCommand', () => {
  it('returns a non-empty string for slash bots', () => {
    expect(generateHelpCommand(baseOpts).length).toBeGreaterThan(0);
  });

  it('uses SlashCommandBuilder for slash bots', () => {
    expect(generateHelpCommand(baseOpts)).toContain('SlashCommandBuilder');
  });

  it('uses Components v2 ContainerBuilder for slash bots', () => {
    expect(generateHelpCommand(baseOpts)).toContain('ContainerBuilder');
  });

  it('uses IsComponentsV2 flag', () => {
    expect(generateHelpCommand(baseOpts)).toContain('IsComponentsV2');
  });

  it('generates prefix variant for prefix bots', () => {
    const result = generateHelpCommand({ ...baseOpts, commandType: 'prefix' });
    expect(result).not.toContain('SlashCommandBuilder');
    expect(result).toContain('Message');
  });

  it('uses slash variant for both bots', () => {
    const result = generateHelpCommand({ ...baseOpts, commandType: 'both' });
    expect(result).toContain('SlashCommandBuilder');
  });
});
