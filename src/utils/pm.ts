import fs from 'node:fs';
import path from 'node:path';
import type { PackageManager } from '../types/index.js';

export function detectPackageManager(): PackageManager {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'bun.lock')) || fs.existsSync(path.join(cwd, 'bun.lockb'))) return 'bun';
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

export function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm': return 'pnpm install';
    case 'bun':  return 'bun install';
    case 'yarn': return 'yarn';
    default:     return 'npm install';
  }
}

export function getRunCommand(pm: PackageManager, script: string): string {
  switch (pm) {
    case 'pnpm': return `pnpm ${script}`;
    case 'bun':  return `bun run ${script}`;
    case 'yarn': return `yarn ${script}`;
    default:     return `npm run ${script}`;
  }
}
