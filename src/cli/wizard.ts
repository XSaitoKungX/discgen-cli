import * as p from '@clack/prompts';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { runPrompts } from './prompts.js';
import { scaffoldProject } from '../generators/files.js';
import { detectPackageManager, getInstallCommand, getRunCommand } from '../utils/pm.js';
import type { WizardOptions } from '../types/index.js';

interface WizardInput {
  initialName?: string;
  dryRun?: boolean;
  template?: string;
  skipPrompts?: Partial<WizardOptions>;
}

const PRESETS: Record<string, Partial<WizardOptions>> = {
  basic: {
    commandType: 'slash',
    features: [],
    database: 'none',
    gitInit: true,
    installDeps: true,
  },
  moderation: {
    commandType: 'slash',
    features: ['moderation', 'utility'],
    database: 'none',
    gitInit: true,
    installDeps: true,
  },
  full: {
    commandType: 'both',
    features: ['moderation', 'utility', 'fun', 'economy', 'components'],
    database: 'sqlite',
    gitInit: true,
    installDeps: true,
  },
};

export async function runWizard(input: WizardInput = {}): Promise<void> {
  p.intro('discgen-cli — Scaffold a Discord Bot in seconds');

  const detectedPm = await detectPackageManager();

  let opts: WizardOptions;

  if (input.template) {
    const preset = PRESETS[input.template];
    if (!preset) {
      p.log.warn(`Unknown template "${input.template}". Choose: basic | moderation | full`);
      p.cancel('Aborted.');
      process.exit(1);
    }
    const projectName = input.initialName ?? 'my-discord-bot';
    opts = {
      projectName,
      packageManager: detectedPm,
      ...preset,
    } as WizardOptions;
    p.log.info(`Using preset: ${input.template}`);
  } else if (input.skipPrompts && isComplete(input.skipPrompts)) {
    opts = input.skipPrompts as WizardOptions;
  } else {
    opts = await runPrompts(input.initialName);
    if (!opts.packageManager) {
      opts.packageManager = detectedPm;
    }
  }

  opts.dryRun = input.dryRun ?? false;

  const targetDir = path.resolve(process.cwd(), opts.projectName);

  if (opts.dryRun) {
    p.log.info(`Dry run — files that would be generated in ./${opts.projectName}:`);
    await scaffoldProject(opts, targetDir);
    p.outro('Dry run complete. No files were written.');
    return;
  }

  if (await fs.pathExists(targetDir)) {
    const overwrite = await p.confirm({
      message: `Directory "${opts.projectName}" already exists. Overwrite?`,
    });

    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel('Aborted. No files were modified.');
      return;
    }

    await fs.remove(targetDir);
  }

  const scaffoldSpinner = p.spinner();
  scaffoldSpinner.start('Scaffolding project...');

  try {
    await scaffoldProject(opts, targetDir);
    scaffoldSpinner.stop('Project scaffolded.');
  } catch (err) {
    scaffoldSpinner.stop('Scaffolding failed.');
    throw err;
  }

  if (opts.gitInit) {
    try {
      execSync('git init', { cwd: targetDir, stdio: 'ignore' });
      execSync('git add -A', { cwd: targetDir, stdio: 'ignore' });
      execSync('git commit -m "chore: initial scaffold from discgen-cli"', {
        cwd: targetDir,
        stdio: 'ignore',
      });
      p.log.success('Git repository initialized.');
    } catch {
      p.log.warn('Could not initialize git repository. Skipping.');
    }
  }

  if (opts.installDeps) {
    const installSpinner = p.spinner();
    const installCmd = getInstallCommand(opts.packageManager);
    installSpinner.start(`Installing dependencies with ${opts.packageManager}...`);

    try {
      execSync(installCmd, { cwd: targetDir, stdio: 'ignore' });
      installSpinner.stop('Dependencies installed.');
    } catch {
      installSpinner.stop('Dependency installation failed. Run it manually.');
      p.log.warn(`Run \`${installCmd}\` inside the project folder.`);
    }
  }

  const devCmd = getRunCommand(opts.packageManager, 'dev');
  const deployCmd = getRunCommand(opts.packageManager, 'deploy');

  p.outro(
    [
      `✅ Done! Your bot is ready.`,
      ``,
      `  Next steps:`,
      `    cd ${opts.projectName}`,
      `    cp .env.example .env    # add DISCORD_TOKEN + CLIENT_ID`,
      `    ${deployCmd}            # register slash commands`,
      `    ${devCmd}               # start in watch mode`,
    ].join('\n'),
  );
}

function isComplete(opts: Partial<WizardOptions>): boolean {
  return (
    opts.projectName !== undefined &&
    opts.commandType !== undefined &&
    opts.features !== undefined &&
    opts.database !== undefined &&
    opts.packageManager !== undefined &&
    opts.gitInit !== undefined &&
    opts.installDeps !== undefined
  );
}
