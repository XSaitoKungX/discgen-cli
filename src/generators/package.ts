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
    'discord.js': '^14.26.2',
    dotenv: '^16.5.0',
  };

  const devDeps: Record<string, string> = {
    '@types/node': '^22.15.0',
    '@typescript-eslint/eslint-plugin': '^8.32.0',
    '@typescript-eslint/parser': '^8.32.0',
    eslint: '^9.27.0',
    prettier: '^3.5.3',
    tsup: '^8.4.0',
    tsx: '^4.19.4',
    typescript: '^5.8.3',
  };

  if (opts.database === 'sqlite') {
    deps['better-sqlite3'] = '^11.9.1';
    devDeps['@types/better-sqlite3'] = '^7.6.13';
  }

  if (opts.database === 'postgresql') {
    deps['drizzle-orm'] = '^0.41.0';
    deps['pg'] = '^8.14.1';
    devDeps['drizzle-kit'] = '^0.30.6';
    devDeps['@types/pg'] = '^8.11.13';
  }

  const scripts: Record<string, string> = {
    dev: 'tsx watch src/index.ts',
    build: 'tsup src/index.ts --format cjs --dts',
    start: 'node dist/index.cjs',
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
