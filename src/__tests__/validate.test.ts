import { describe, it, expect } from 'vitest';
import { validateFileSegment, validateProjectName } from '../utils/validate.js';

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

  it('rejects Windows reserved file names', () => {
    expect(validateProjectName('CON')).toBeDefined();
    expect(validateProjectName('lpt1')).toBeDefined();
  });
});

describe('validateFileSegment', () => {
  it('accepts safe file and directory names', () => {
    expect(validateFileSegment('my-command')).toBeUndefined();
    expect(validateFileSegment('utility_2')).toBeUndefined();
  });

  it('rejects traversal and path separators', () => {
    expect(validateFileSegment('../escape')).toBeDefined();
    expect(validateFileSegment('nested/name')).toBeDefined();
    expect(validateFileSegment('nested\\name')).toBeDefined();
  });

  it('uses the supplied field label in errors', () => {
    expect(validateFileSegment('', 'Category')).toContain('Category');
  });
});
