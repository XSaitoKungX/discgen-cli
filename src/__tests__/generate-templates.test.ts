import { describe, it, expect } from 'vitest';
import { generateSlashCommandFile, generatePrefixCommandFile, kebabToCamel } from '../templates/generate/command.js';
import { generateEventFile, KNOWN_EVENTS } from '../templates/generate/event.js';
import { generateGuardFile } from '../templates/generate/guard.js';

describe('kebabToCamel', () => {
  it('leaves plain names unchanged', () => {
    expect(kebabToCamel('greet')).toBe('greet');
  });

  it('converts kebab-case to camelCase', () => {
    expect(kebabToCamel('my-command')).toBe('myCommand');
  });

  it('handles multiple hyphens', () => {
    expect(kebabToCamel('role-check-guard')).toBe('roleCheckGuard');
  });
});

describe('generateSlashCommandFile', () => {
  it('returns a non-empty string', () => {
    expect(generateSlashCommandFile('greet').length).toBeGreaterThan(0);
  });

  it('uses SlashCommandBuilder', () => {
    expect(generateSlashCommandFile('greet')).toContain('SlashCommandBuilder');
  });

  it('sets the command name', () => {
    expect(generateSlashCommandFile('greet')).toContain("setName('greet')");
  });

  it('uses the Command type', () => {
    expect(generateSlashCommandFile('greet')).toContain('satisfies Command');
  });

  it('exports data and execute', () => {
    const out = generateSlashCommandFile('greet');
    expect(out).toContain('export const data');
    expect(out).toContain('export async function execute');
  });

  it('uses kebab-case name in setName', () => {
    expect(generateSlashCommandFile('my-command')).toContain("setName('my-command')");
  });
});

describe('generatePrefixCommandFile', () => {
  it('returns a non-empty string', () => {
    expect(generatePrefixCommandFile('greet').length).toBeGreaterThan(0);
  });

  it('uses PrefixCommand type', () => {
    expect(generatePrefixCommandFile('greet')).toContain('PrefixCommand');
  });

  it('sets the command name', () => {
    expect(generatePrefixCommandFile('greet')).toContain("name: 'greet'");
  });

  it('does not include SlashCommandBuilder', () => {
    expect(generatePrefixCommandFile('greet')).not.toContain('SlashCommandBuilder');
  });

  it('converts kebab-case name to camelCase variable', () => {
    const out = generatePrefixCommandFile('my-command');
    expect(out).toContain('const myCommand');
    expect(out).toContain("name: 'my-command'");
  });
});

describe('generateEventFile', () => {
  it('returns a non-empty string', () => {
    expect(generateEventFile('messageCreate').length).toBeGreaterThan(0);
  });

  it('sets once: true for ready event', () => {
    expect(generateEventFile('ready')).toContain('once: true');
  });

  it('sets once: false for other events', () => {
    expect(generateEventFile('messageCreate')).toContain('once: false');
  });

  it('uses Event type', () => {
    expect(generateEventFile('messageCreate')).toContain("import type { Event }");
  });

  it('sets the event name', () => {
    expect(generateEventFile('guildMemberAdd')).toContain("name: 'guildMemberAdd'");
  });

  it('KNOWN_EVENTS includes common events', () => {
    expect(KNOWN_EVENTS).toContain('ready');
    expect(KNOWN_EVENTS).toContain('messageCreate');
    expect(KNOWN_EVENTS).toContain('interactionCreate');
    expect(KNOWN_EVENTS).toContain('guildMemberAdd');
  });
});

describe('generateGuardFile', () => {
  it('returns a non-empty string', () => {
    expect(generateGuardFile('permissions').length).toBeGreaterThan(0);
  });

  it('generates a named guard function', () => {
    expect(generateGuardFile('permissions')).toContain('permissionsGuard');
  });

  it('returns Promise<boolean>', () => {
    expect(generateGuardFile('permissions')).toContain('Promise<boolean>');
  });

  it('converts kebab-case to camelCase guard name', () => {
    expect(generateGuardFile('role-check')).toContain('roleCheckGuard');
  });

  it('uses ChatInputCommandInteraction', () => {
    expect(generateGuardFile('permissions')).toContain('ChatInputCommandInteraction');
  });
});
