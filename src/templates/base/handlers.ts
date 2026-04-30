import type { WizardOptions } from '../../types/index.js';

export function generateCommandHandler(opts: WizardOptions): string {
  const hasPrefixCommands = opts.commandType === 'prefix' || opts.commandType === 'both';
  const hasSlashCommands = opts.commandType === 'slash' || opts.commandType === 'both';

  return `import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import type { Client } from 'discord.js';
import type { Command${hasPrefixCommands ? ', PrefixCommand' : ''} } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client: Client): Promise<void> {
  const commandsPath = join(__dirname, '..', 'commands');
  const categories = readdirSync(commandsPath);

  for (const category of categories) {
    const categoryPath = join(commandsPath, category);
    const files = readdirSync(categoryPath).filter((f) => f.endsWith('.js'));

    for (const file of files) {
      const filePath = join(categoryPath, file);
      const module = await import(pathToFileURL(filePath).href) as Record<string, unknown>;
${hasSlashCommands ? `
      if ('data' in module && 'execute' in module) {
        const command = module as Command;
        client.commands.set(command.data.name, command);
      }` : ''}
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
  const files = readdirSync(eventsPath).filter((f) => f.endsWith('.js'));

  for (const file of files) {
    const filePath = join(eventsPath, file);
    const event = await import(pathToFileURL(filePath).href) as Event;

    if (event.once) {
      client.once(event.name, (...args) => void event.execute(...args));
    } else {
      client.on(event.name, (...args) => void event.execute(...args));
    }
  }
}
`;
}
