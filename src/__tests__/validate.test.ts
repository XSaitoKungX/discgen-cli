import { describe, it, expect } from 'vitest';
import { validateFileName, validateProjectName } from '../utils/validate.js';

describe('validateProjectName', () => {
  it('returns undefined for valid names', () => {
    expect(validateProjectName('my-bot')).toBeUndefined();
    expect(validateProjectName('my_bot')).toBeUndefined();
    expect(validateProjectName('@scope/my-bot')).toBeUndefined();
    expect(validateProjectName('a')).toBeUndefined();
  });

  it('returns error for empty string', () => {
    expect(validateProjectName('')).toBeDefined();
    expect(validateProjectName('   ')).toBeDefined();
  });

  it('returns error for names with invalid characters', () => {
    expect(validateProjectName('my bot')).toBeDefined();
    expect(validateProjectName('my/bot')).toBeDefined();
    expect(validateProjectName('my@bot')).toBeDefined();
  });

  it('returns error for uppercase names', () => {
    expect(validateProjectName('MyBot123')).toBeDefined();
  });

  it('returns error for unsafe npm package names', () => {
    expect(validateProjectName('_my-bot')).toBeDefined();
    expect(validateProjectName('.my-bot')).toBeDefined();
    expect(validateProjectName('my..bot')).toBeDefined();
  });

  it('returns error for names over 214 chars', () => {
    const longName = 'a'.repeat(215);
    expect(validateProjectName(longName)).toBeDefined();
  });

  it('accepts names at exactly 214 chars', () => {
    const maxName = 'a'.repeat(214);
    expect(validateProjectName(maxName)).toBeUndefined();
  });
});

describe('validateFileName', () => {
  it('returns undefined for kebab-case names', () => {
    expect(validateFileName('ping')).toBeUndefined();
    expect(validateFileName('role-check')).toBeUndefined();
    expect(validateFileName('ticket-2')).toBeUndefined();
  });

  it('returns error for names that are not safe module filenames', () => {
    expect(validateFileName('RoleCheck')).toBeDefined();
    expect(validateFileName('role_check')).toBeDefined();
    expect(validateFileName('-role-check')).toBeDefined();
    expect(validateFileName('role/check')).toBeDefined();
  });
});
