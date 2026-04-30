import { detect } from 'detect-package-manager';
import type { PackageManager } from '../types/index.js';

export async function detectPackageManager(): Promise<PackageManager> {
  try {
    const detected = await detect();
    if (detected === 'npm' || detected === 'pnpm' || detected === 'bun') {
      return detected;
    }
    return 'npm';
  } catch {
    return 'npm';
  }
}

export function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm install';
    case 'bun':
      return 'bun install';
    default:
      return 'npm install';
  }
}

export function getRunCommand(pm: PackageManager, script: string): string {
  switch (pm) {
    case 'pnpm':
      return `pnpm ${script}`;
    case 'bun':
      return `bun run ${script}`;
    default:
      return `npm run ${script}`;
  }
}
