export type Feature = 'moderation' | 'utility' | 'fun' | 'economy' | 'music' | 'components';

export type Database = 'none' | 'sqlite' | 'postgresql';

export type PackageManager = 'npm' | 'pnpm' | 'bun';

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
