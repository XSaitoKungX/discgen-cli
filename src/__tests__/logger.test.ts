import { describe, it, expect } from 'vitest';
import { generateLoggerTs } from '../templates/base/logger.js';

describe('generateLoggerTs', () => {
  it('returns a non-empty string', () => {
    expect(generateLoggerTs().length).toBeGreaterThan(0);
  });

  it('exports a logger object', () => {
    expect(generateLoggerTs()).toContain('export const logger');
  });

  it('has all four log levels', () => {
    const output = generateLoggerTs();
    expect(output).toContain('debug');
    expect(output).toContain('info');
    expect(output).toContain('warn');
    expect(output).toContain('error');
  });

  it('respects LOG_LEVEL env var', () => {
    expect(generateLoggerTs()).toContain('LOG_LEVEL');
  });

  it('writes errors to stderr', () => {
    expect(generateLoggerTs()).toContain('process.stderr');
  });

  it('writes non-errors to stdout', () => {
    expect(generateLoggerTs()).toContain('process.stdout');
  });

  it('includes context support', () => {
    expect(generateLoggerTs()).toContain('context');
  });

  it('includes error stack trace support', () => {
    expect(generateLoggerTs()).toContain('error.stack');
  });
});
