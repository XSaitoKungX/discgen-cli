export type Feature =
  'moderation' | 'utility' | 'fun' | 'economy' | 'music' | 'components' | 'i18n' | 'logging';

export type Database = 'none' | 'sqlite' | 'postgresql' | 'mongodb';

export type PackageManager = 'npm' | 'pnpm' | 'bun' | 'yarn';

export type CommandType = 'slash' | 'prefix' | 'both';

export interface WizardOptions {
  projectName: string;
  commandType: CommandType;
  features: Feature[];
  database: Database;
  packageManager: PackageManager;
  gitInit: boolean;
  installDeps: boolean;
  dryRun?: boolean;
}
