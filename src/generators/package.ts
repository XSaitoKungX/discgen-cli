import type { WizardOptions } from '../types/index.js';

interface PackageJson {
  name: string;
  version: string;
  description: string;
  type: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  engines: Record<string, string>;
}

export function generatePackageJson(opts: WizardOptions): PackageJson {
  const deps: Record<string, string> = {
    'discord.js': 'latest',
    dotenv: 'latest',
  };

  const devDeps: Record<string, string> = {
    '@types/node': 'latest',
    '@typescript-eslint/eslint-plugin': 'latest',
    '@typescript-eslint/parser': 'latest',
    eslint: 'latest',
    prettier: 'latest',
    tsup: 'latest',
    tsx: 'latest',
    typescript: 'latest',
  };

  if (opts.database === 'sqlite') {
    deps['better-sqlite3'] = 'latest';
    devDeps['@types/better-sqlite3'] = 'latest';
  }

  if (opts.database === 'postgresql') {
    deps['drizzle-orm'] = 'latest';
    deps['pg'] = 'latest';
    devDeps['drizzle-kit'] = 'latest';
    devDeps['@types/pg'] = 'latest';
  }

  const scripts: Record<string, string> = {
    dev: 'tsx watch src/index.ts',
    build: 'tsup src/index.ts --format esm',
    start: 'node dist/index.js',
    deploy: 'tsx src/deploy-commands.ts',
    lint: 'eslint src',
    format: 'prettier --write src',
  };

  return {
    name: opts.projectName,
    version: '1.0.0',
    description: `Discord bot: ${opts.projectName}`,
    type: 'module',
    scripts,
    dependencies: deps,
    devDependencies: devDeps,
    engines: { node: '>=18' },
  };
}
