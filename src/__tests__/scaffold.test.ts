import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { scaffoldProject } from '../generators/files.js';
import type { WizardOptions } from '../types/index.js';

const baseOpts: WizardOptions = {
  projectName: 'test-bot',
  commandType: 'slash',
  features: [],
  database: 'none',
  packageManager: 'npm',
  gitInit: false,
  installDeps: false,
  generatorVersion: '1.2.3',
};

describe('scaffoldProject', () => {
  it('writes discgen metadata for future upgrades', async () => {
    const targetDir = await mkdtemp(join(tmpdir(), 'discgen-test-'));

    try {
      await scaffoldProject(baseOpts, targetDir);
      const raw = await readFile(join(targetDir, '.discgen.json'), 'utf8');
      const metadata = JSON.parse(raw) as Record<string, unknown>;

      expect(metadata.generator).toBe('discgen-cli');
      expect(metadata.generatorVersion).toBe('1.2.3');
      expect(metadata.projectName).toBe('test-bot');
      expect(metadata.commandType).toBe('slash');
    } finally {
      await rm(targetDir, { recursive: true, force: true });
    }
  });
});
