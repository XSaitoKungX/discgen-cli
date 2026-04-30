#!/usr/bin/env node
import { Command } from 'commander';
import { checkNodeVersion } from './utils/validate.js';
import { runWizard } from './cli/wizard.js';

checkNodeVersion();

const program = new Command();

program
  .name('discgen-cli')
  .description('Scaffold a production-ready Discord Bot in seconds.')
  .version('1.0.0')
  .argument('[name]', 'Project name')
  .option('--no-install', 'Skip dependency installation')
  .option('--no-git', 'Skip git initialization')
  .option('--dry-run', 'Preview generated files without writing to disk')
  .action(
    async (name: string | undefined, options: { install: boolean; git: boolean; dryRun: boolean }) => {
      try {
        await runWizard({
          initialName: name,
          dryRun: options.dryRun,
          skipPrompts:
            options.install === false || options.git === false
              ? {
                  installDeps: options.install,
                  gitInit: options.git,
                }
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
