import type { WizardOptions } from '../../types/index.js';

export function generateCommandHandler(opts: WizardOptions): string {
  const hasPrefixCommands = opts.commandType === 'prefix' || opts.commandType === 'both';
  const hasSlashCommands  = opts.commandType === 'slash'  || opts.commandType === 'both';

  return `import { readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import type { Client } from 'discord.js';
import type { Command${hasPrefixCommands ? ', PrefixCommand' : ''} } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client: Client): Promise<void> {
  const commandsPath = join(__dirname, '..', 'commands');
  const entries = readdirSync(commandsPath);

  for (const entry of entries) {
    const entryPath = join(commandsPath, entry);
    if (!statSync(entryPath).isDirectory()) continue;

    const files = readdirSync(entryPath).filter((f) => /\.[jt]s$/.test(f) && !f.endsWith('.d.ts'));

    for (const file of files) {
      const filePath = join(entryPath, file);
${hasPrefixCommands ? `
      // Prefix commands live in commands/prefix/ and use a default export
      if (entry === 'prefix') {
        const mod = await import(pathToFileURL(filePath).href) as { default?: PrefixCommand };
        const cmd = mod.default;
        if (cmd?.name && cmd?.execute) {
          client.prefixCommands.set(cmd.name, cmd);
        }
        continue;
      }
` : ''}${hasSlashCommands ? `
      const mod = await import(pathToFileURL(filePath).href) as Record<string, unknown>;
      if ('data' in mod && 'execute' in mod) {
        const command = mod as unknown as Command;
        client.commands.set(command.data.name, command);
      }` : ''}
    }
  }
}
`;
}

export function generateInteractionLoader(): string {
  return `import { existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import type { Client } from 'discord.js';
import type { ButtonHandler, SelectHandler, ModalHandler } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadComponents(client: Client): Promise<void> {
  const interactionsPath = join(__dirname, '..', 'interactions');
  if (!existsSync(interactionsPath)) return;

  const subdirs = readdirSync(interactionsPath);

  for (const subdir of subdirs) {
    const dirPath = join(interactionsPath, subdir);
    const files = readdirSync(dirPath).filter((f) => /\.[jt]s$/.test(f) && !f.endsWith('.d.ts'));

    for (const file of files) {
      const filePath = join(dirPath, file);
      const mod = await import(pathToFileURL(filePath).href) as { default: unknown };
      const handler = mod.default as { customId?: string; execute?: unknown };

      if (!handler?.customId || !handler?.execute) continue;

      if (subdir === 'buttons') {
        client.buttons.set(handler.customId, handler as ButtonHandler);
      } else if (subdir === 'selects') {
        client.selects.set(handler.customId, handler as SelectHandler);
      } else if (subdir === 'modals') {
        client.modals.set(handler.customId, handler as ModalHandler);
      }
    }
  }
}
`;
}

export function generateEventHandler(): string {
  return `import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import type { Client } from 'discord.js';
import type { Event } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadEvents(client: Client): Promise<void> {
  const eventsPath = join(__dirname, '..', 'events');
  const files = readdirSync(eventsPath).filter((f) => /\.[jt]s$/.test(f) && !f.endsWith('.d.ts'));

  for (const file of files) {
    const filePath = join(eventsPath, file);
    const event = await import(pathToFileURL(filePath).href) as { default: Event };

    if (event.default.once) {
      client.once(event.default.name, (...args) => void event.default.execute(...args));
    } else {
      client.on(event.default.name, (...args) => void event.default.execute(...args));
    }
  }
}
`;
}
