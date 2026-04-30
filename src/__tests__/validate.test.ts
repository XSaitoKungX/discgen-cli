import { describe, it, expect } from 'vitest';
import { validateProjectName } from '../utils/validate.js';

describe('validateProjectName', () => {
  it('returns undefined for valid names', () => {
    expect(validateProjectName('my-bot')).toBeUndefined();
    expect(validateProjectName('my_bot')).toBeUndefined();
    expect(validateProjectName('MyBot123')).toBeUndefined();
    expect(validateProjectName('a')).toBeUndefined();
  });

  it('returns error for empty string', () => {
    expect(validateProjectName('')).toBeDefined();
    expect(validateProjectName('   ')).toBeDefined();
  });

  it('returns error for names with invalid characters', () => {
    expect(validateProjectName('my bot')).toBeDefined();
    expect(validateProjectName('my.bot')).toBeDefined();
    expect(validateProjectName('my/bot')).toBeDefined();
    expect(validateProjectName('my@bot')).toBeDefined();
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
