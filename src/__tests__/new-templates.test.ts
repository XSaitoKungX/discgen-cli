import { describe, it, expect } from 'vitest';
import { generateEnvValidatorTs } from '../templates/base/env.js';
import { generateCooldownTs } from '../templates/base/cooldown.js';
import { generateHelpCommand } from '../templates/commands/help.js';
import { generateEmbedTs } from '../templates/base/embed.js';
import { generatePaginatorTs } from '../templates/base/paginator.js';
import { generateLocaleEn, generateLocaleDe, generateI18nIndex, generateLocaleSwitchCommand } from '../templates/i18n/index.js';
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

describe('generateEmbedTs', () => {
  it('returns a non-empty string', () => {
    expect(generateEmbedTs().length).toBeGreaterThan(0);
  });

  it('exports Embed object', () => {
    expect(generateEmbedTs()).toContain('export const Embed');
  });

  it('defines all four presets', () => {
    const out = generateEmbedTs();
    expect(out).toContain('success');
    expect(out).toContain('error');
    expect(out).toContain('info');
    expect(out).toContain('warn');
  });

  it('uses EmbedBuilder from discord.js', () => {
    const out = generateEmbedTs();
    expect(out).toContain("from 'discord.js'");
    expect(out).toContain('EmbedBuilder');
  });

  it('defines COLORS with hex values', () => {
    const out = generateEmbedTs();
    expect(out).toContain('as const');
    expect(out).toContain('0x');
  });

  it('supports optional timestamp field', () => {
    expect(generateEmbedTs()).toContain('timestamp');
  });
});

describe('generatePaginatorTs', () => {
  it('returns a non-empty string', () => {
    expect(generatePaginatorTs().length).toBeGreaterThan(0);
  });

  it('exports paginate function', () => {
    expect(generatePaginatorTs()).toContain('export async function paginate');
  });

  it('uses ButtonBuilder from discord.js', () => {
    expect(generatePaginatorTs()).toContain('ButtonBuilder');
  });

  it('handles single-page case without buttons', () => {
    expect(generatePaginatorTs()).toContain('pages.length === 1');
  });

  it('disables buttons on collector end', () => {
    expect(generatePaginatorTs()).toContain('buildRow(current, pages.length, true)');
  });

  it('supports first/prev/next/last navigation', () => {
    const out = generatePaginatorTs();
    expect(out).toContain('pg_first');
    expect(out).toContain('pg_prev');
    expect(out).toContain('pg_next');
    expect(out).toContain('pg_last');
  });

  it('accepts idle timeout option', () => {
    expect(generatePaginatorTs()).toContain('idle');
  });

  it('uses ContainerBuilder (Components v2)', () => {
    expect(generatePaginatorTs()).toContain('ContainerBuilder');
  });

  it('uses IsComponentsV2 flag', () => {
    expect(generatePaginatorTs()).toContain('IsComponentsV2');
  });

  it('exports Page interface', () => {
    expect(generatePaginatorTs()).toContain('export interface Page');
  });
});

describe('i18n templates', () => {
  it('generateLocaleEn exports a Locale interface and default', () => {
    const out = generateLocaleEn();
    expect(out).toContain('export interface Locale');
    expect(out).toContain('export default en');
  });

  it('generateLocaleEn has all required sections', () => {
    const out = generateLocaleEn();
    expect(out).toContain('errors');
    expect(out).toContain('ping');
    expect(out).toContain('moderation');
    expect(out).toContain('economy');
    expect(out).toContain('fun');
  });

  it('generateLocaleEn uses string types in the interface', () => {
    expect(generateLocaleEn()).toContain('string;');
  });

  it('generateLocaleDe imports Locale type from en.ts', () => {
    const out = generateLocaleDe();
    expect(out).toContain("from './en.js'");
    expect(out).toContain('Locale');
  });

  it('generateLocaleDe satisfies Locale type annotation', () => {
    expect(generateLocaleDe()).toContain('de: Locale');
  });

  it('generateLocaleDe contains German strings', () => {
    const out = generateLocaleDe();
    expect(out).toContain('Münzen');
    expect(out).toContain('Befehl');
  });

  it('generateI18nIndex exports useT and setGuildLocale', () => {
    const out = generateI18nIndex();
    expect(out).toContain('export function useT');
    expect(out).toContain('export function setGuildLocale');
  });

  it('generateI18nIndex exports supportedLocales', () => {
    expect(generateI18nIndex()).toContain('export const supportedLocales');
  });

  it('generateI18nIndex imports en and de locales', () => {
    const out = generateI18nIndex();
    expect(out).toContain("import en from './en.js'");
    expect(out).toContain("import de from './de.js'");
  });

  it('generateLocaleSwitchCommand uses SlashCommandBuilder', () => {
    expect(generateLocaleSwitchCommand()).toContain('SlashCommandBuilder');
  });

  it('generateLocaleSwitchCommand requires ManageGuild permission', () => {
    expect(generateLocaleSwitchCommand()).toContain('ManageGuild');
  });

  it('generateLocaleSwitchCommand imports setGuildLocale', () => {
    expect(generateLocaleSwitchCommand()).toContain('setGuildLocale');
  });
});
