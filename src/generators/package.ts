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
    'discord.js': '^14.27.0',
    dotenv: '^17.4.2',
  };

  const devDeps: Record<string, string> = {
    '@types/node': '^22.20.1',
    '@typescript-eslint/eslint-plugin': '^8.65.0',
    '@typescript-eslint/parser': '^8.65.0',
    eslint: '^10.8.0',
    prettier: '^3.9.6',
    tsx: '^4.23.1',
    typescript: '^6.0.3',
  };

  if (opts.database === 'sqlite') {
    deps['better-sqlite3'] = '^13.0.1';
    devDeps['@types/better-sqlite3'] = '^7.6.13';
  }

  if (opts.database === 'postgresql') {
    deps['drizzle-orm'] = '^0.45.2';
    deps['pg'] = '^8.22.0';
    devDeps['@types/pg'] = '^8.20.0';
  }

  if (opts.database === 'mongodb') {
    deps['mongoose'] = '^9.8.1';
  }

  const scripts: Record<string, string> = {
    dev: 'tsx watch src/index.ts',
    build: 'tsc',
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
    engines: { node: '>=22.13.0' },
  };
}
