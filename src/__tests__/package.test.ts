import { describe, it, expect } from 'vitest';
import { generatePackageJson } from '../generators/package.js';
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

describe('generatePackageJson', () => {
  it('sets the correct project name', () => {
    const pkg = generatePackageJson(baseOpts);
    expect(pkg.name).toBe('test-bot');
  });

  it('always includes discord.js and dotenv', () => {
    const pkg = generatePackageJson(baseOpts);
    expect(pkg.dependencies['discord.js']).toBeDefined();
    expect(pkg.dependencies['dotenv']).toBeDefined();
  });

  it('adds better-sqlite3 for sqlite database', () => {
    const pkg = generatePackageJson({ ...baseOpts, database: 'sqlite' });
    expect(pkg.dependencies['better-sqlite3']).toBeDefined();
  });

  it('adds drizzle-orm and pg for postgresql', () => {
    const pkg = generatePackageJson({ ...baseOpts, database: 'postgresql' });
    expect(pkg.dependencies['drizzle-orm']).toBeDefined();
    expect(pkg.dependencies['pg']).toBeDefined();
  });

  it('does not add db deps when database is none', () => {
    const pkg = generatePackageJson(baseOpts);
    expect(pkg.dependencies['better-sqlite3']).toBeUndefined();
    expect(pkg.dependencies['drizzle-orm']).toBeUndefined();
  });

  it('includes all required scripts', () => {
    const pkg = generatePackageJson(baseOpts);
    expect(pkg.scripts['dev']).toBeDefined();
    expect(pkg.scripts['build']).toBeDefined();
    expect(pkg.scripts['start']).toBeDefined();
    expect(pkg.scripts['deploy']).toBeDefined();
  });

  it('sets engines.node to >=22', () => {
    const pkg = generatePackageJson(baseOpts);
    expect(pkg.engines['node']).toBe('>=22');
  });
});
