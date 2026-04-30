import * as p from '@clack/prompts';
import type { WizardOptions, CommandType, Feature, Database, PackageManager } from '../types/index.js';

export async function runPrompts(initialName?: string): Promise<WizardOptions> {
  const projectName = initialName ?? (await p.text({
    message: 'Project name:',
    placeholder: 'my-discord-bot',
    validate(value) {
      if (!value?.trim()) return 'Name cannot be empty.';
      if (!/^[a-z0-9-_]+$/i.test(value)) return 'Use letters, numbers, hyphens, or underscores.';
      return undefined;
    },
  }));

  if (p.isCancel(projectName)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const commandType = await p.select<CommandType>({
    message: 'Command type:',
    options: [
      { value: 'slash', label: 'Slash Commands', hint: 'Modern / interactions' },
      { value: 'prefix', label: 'Prefix Commands', hint: 'Classic !command style' },
      { value: 'both', label: 'Both', hint: 'Slash + Prefix' },
    ],
  });

  if (p.isCancel(commandType)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const features = await p.multiselect<Feature>({
    message: 'Select features:',
    options: [
      { value: 'moderation', label: 'Moderation', hint: 'ban, kick, timeout, warn' },
      { value: 'utility', label: 'Utility', hint: 'ping, userinfo, serverinfo' },
      { value: 'fun', label: 'Fun', hint: 'coinflip, 8ball, meme' },
      { value: 'economy', label: 'Economy', hint: 'balance, daily, leaderboard' },
      { value: 'music', label: 'Music', hint: 'placeholder (requires voice deps)' },
    ],
    required: false,
  });

  if (p.isCancel(features)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const database = await p.select<Database>({
    message: 'Database:',
    options: [
      { value: 'none', label: 'None' },
      { value: 'sqlite', label: 'SQLite', hint: 'better-sqlite3' },
      { value: 'postgresql', label: 'PostgreSQL', hint: 'pg + drizzle-orm' },
    ],
  });

  if (p.isCancel(database)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const packageManager = await p.select<PackageManager>({
    message: 'Package manager:',
    options: [
      { value: 'npm', label: 'npm' },
      { value: 'pnpm', label: 'pnpm' },
      { value: 'bun', label: 'bun' },
    ],
  });

  if (p.isCancel(packageManager)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const gitInit = await p.confirm({ message: 'Initialize a git repository?' });
  if (p.isCancel(gitInit)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const installDeps = await p.confirm({ message: 'Install dependencies?' });
  if (p.isCancel(installDeps)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  return {
    projectName: projectName as string,
    commandType: commandType as CommandType,
    features: features as Feature[],
    database: database as Database,
    packageManager: packageManager as PackageManager,
    gitInit: gitInit as boolean,
    installDeps: installDeps as boolean,
  };
}
