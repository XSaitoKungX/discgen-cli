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
    'discord.js': '^14.26.3',
    dotenv: '^17.4.2',
  };

  const devDeps: Record<string, string> = {
    '@types/node': '^22.19.17',
    '@typescript-eslint/eslint-plugin': '^8.59.1',
    '@typescript-eslint/parser': '^8.59.1',
    eslint: '^9.39.4',
    prettier: '^3.8.3',
    tsup: '^8.5.1',
    tsx: '^4.21.0',
    typescript: '^5.9.3',
  };

  if (opts.database === 'sqlite') {
    deps['better-sqlite3'] = '^12.9.0';
    devDeps['@types/better-sqlite3'] = '^7.6.13';
  }

  if (opts.database === 'postgresql') {
    deps['drizzle-orm'] = '^0.45.2';
    deps['pg'] = '^8.20.0';
    devDeps['drizzle-kit'] = '^0.31.10';
    devDeps['@types/pg'] = '^8.20.0';
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
    engines: { node: '>=22' },
  };
}
