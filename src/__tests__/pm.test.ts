import { describe, it, expect } from 'vitest';
import { getInstallCommand, getRunCommand } from '../utils/pm.js';

describe('getInstallCommand', () => {
  it('returns npm install for npm', () => {
    expect(getInstallCommand('npm')).toBe('npm install');
  });

  it('returns pnpm install for pnpm', () => {
    expect(getInstallCommand('pnpm')).toBe('pnpm install');
  });

  it('returns bun install for bun', () => {
    expect(getInstallCommand('bun')).toBe('bun install');
  });

  it('returns yarn for yarn', () => {
    expect(getInstallCommand('yarn')).toBe('yarn');
  });
});

describe('getRunCommand', () => {
  it('returns npm run dev for npm', () => {
    expect(getRunCommand('npm', 'dev')).toBe('npm run dev');
  });

  it('returns pnpm dev for pnpm', () => {
    expect(getRunCommand('pnpm', 'dev')).toBe('pnpm dev');
  });

  it('returns bun run dev for bun', () => {
    expect(getRunCommand('bun', 'dev')).toBe('bun run dev');
  });

  it('returns yarn dev for yarn', () => {
    expect(getRunCommand('yarn', 'dev')).toBe('yarn dev');
  });
});
