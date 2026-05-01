#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join } from 'path';
import { Command } from 'commander';
import { checkNodeVersion } from './utils/validate.js';
import { runWizard } from './cli/wizard.js';

checkNodeVersion();

const { version } = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'),
) as { version: string };

const program = new Command();

program
  .name('discgen-cli')
  .description('Scaffold a production-ready Discord Bot in seconds.')
  .version(version)
  .argument('[name]', 'Project name')
  .option('--no-install', 'Skip dependency installation')
  .option('--no-git', 'Skip git initialization')
  .option('--dry-run', 'Preview generated files without writing to disk')
  .option('--template <preset>', 'Skip wizard with a preset: basic | moderation | full')
  .action(
    async (
      name: string | undefined,
      options: { install: boolean; git: boolean; dryRun: boolean; template?: string },
    ) => {
      try {
        await runWizard({
          initialName: name,
          dryRun: options.dryRun ?? false,
          template: options.template,
          skipPrompts:
            options.install === false || options.git === false
              ? { installDeps: options.install, gitInit: options.git }
              : undefined,
        });
      } catch (err) {
        if (err instanceof Error) {
          console.error(`\nError: ${err.message}`);
        } else {
          console.error('\nAn unexpected error occurred.');
        }
        process.exit(1);
      }
    },
  );

program.parse();
