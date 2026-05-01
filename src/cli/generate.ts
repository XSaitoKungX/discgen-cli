import * as p from '@clack/prompts';
import path from 'path';
import fs from 'fs-extra';
import { generateSlashCommandFile, generatePrefixCommandFile } from '../templates/generate/command.js';
import { generateEventFile, KNOWN_EVENTS } from '../templates/generate/event.js';
import { generateGuardFile } from '../templates/generate/guard.js';
import { generateButtonFile, generateSelectFile, generateModalFile } from '../templates/generate/interaction.js';
import { generateServiceFile } from '../templates/generate/service.js';

type GenerateType = 'command' | 'event' | 'guard' | 'button' | 'select' | 'modal' | 'service';

const TYPE_ALIASES: Record<string, GenerateType> = {
  command: 'command', cmd: 'command', c: 'command',
  event:   'event',   evt: 'event',   e: 'event',
  guard:   'guard',   gd:  'guard',
  button:  'button',  btn: 'button',  b: 'button',
  select:  'select',  sel: 'select',  s: 'select',
  modal:   'modal',   m:   'modal',
  service: 'service', svc: 'service',
};

export interface GenerateInput {
  type?: string;
  name?: string;
  category?: string;
  prefix?: boolean;
  dryRun?: boolean;
}

export async function runGenerate(input: GenerateInput = {}): Promise<void> {
  p.intro('discgen generate');

  // --- resolve type ---
  let genType: GenerateType;
  if (input.type) {
    const resolved = TYPE_ALIASES[input.type.toLowerCase()];
    if (!resolved) {
      p.log.error(
        `Unknown type "${input.type}". Choose: command (cmd,c) | event (evt,e) | guard (gd) | button (btn,b) | select (sel,s) | modal (m)`,
      );
      p.cancel('Aborted.');
      process.exit(1);
    }
    genType = resolved;
  } else {
    const answer = await p.select({
      message: 'What do you want to generate?',
      options: [
        { value: 'command' as const, label: 'command', hint: 'slash or prefix command' },
        { value: 'event'   as const, label: 'event',   hint: 'Discord.js event handler' },
        { value: 'button'  as const, label: 'button',  hint: 'button interaction handler' },
        { value: 'select'  as const, label: 'select',  hint: 'select menu interaction handler' },
        { value: 'modal'   as const, label: 'modal',   hint: 'modal submit handler' },
        { value: 'guard'   as const, label: 'guard',   hint: 'permission / cooldown guard function' },
        { value: 'service' as const, label: 'service', hint: 'singleton service class (src/services/)' },
      ],
    });
    if (p.isCancel(answer)) { p.cancel('Aborted.'); process.exit(0); }
    genType = answer as GenerateType;
  }

  // --- event: pick from known list ---
  if (genType === 'event') {
    let eventName: string;
    if (input.name && (KNOWN_EVENTS as readonly string[]).includes(input.name)) {
      eventName = input.name;
    } else {
      const knownOptions = KNOWN_EVENTS.map((e) => ({ value: e, label: e }));
      const choices = input.name
        ? [{ value: input.name, label: `${input.name} (custom)` }, ...knownOptions]
        : knownOptions;
      const answer = await p.select({ message: 'Discord event to handle:', options: choices });
      if (p.isCancel(answer)) { p.cancel('Aborted.'); process.exit(0); }
      eventName = answer as string;
    }
    const filePath = path.join(process.cwd(), 'src', 'events', `${eventName}.ts`);
    await writeFile(filePath, generateEventFile(eventName), input.dryRun);
    p.outro('Done!');
    return;
  }

  // --- resolve name ---
  let name: string;
  if (input.name) {
    name = input.name.toLowerCase().replace(/\s+/g, '-');
  } else {
    const answer = await p.text({
      message: `Name for the ${genType}:`,
      validate: (v) => (v?.trim() ? undefined : 'Name is required.'),
    });
    if (p.isCancel(answer)) { p.cancel('Aborted.'); process.exit(0); }
    name = (answer as string).trim().toLowerCase().replace(/\s+/g, '-');
  }

  let filePath: string;
  let content: string;
  let nextStep: string | undefined;

  if (genType === 'command') {
    if (input.prefix) {
      filePath = path.join(process.cwd(), 'src', 'commands', 'prefix', `${name}.ts`);
      content = generatePrefixCommandFile(name);
    } else {
      let category = input.category?.toLowerCase();
      if (!category) {
        const answer = await p.text({
          message: 'Category (subfolder):',
          placeholder: 'utility',
          initialValue: 'utility',
          validate: (v) => (v?.trim() ? undefined : 'Category is required.'),
        });
        if (p.isCancel(answer)) { p.cancel('Aborted.'); process.exit(0); }
        category = ((answer as string).trim() || 'utility').toLowerCase();
      }
      filePath = path.join(process.cwd(), 'src', 'commands', category, `${name}.ts`);
      content = generateSlashCommandFile(name);
      nextStep = `Run \`npm run deploy\` to register /${name} with Discord.`;
    }
  } else if (genType === 'button') {
    filePath = path.join(process.cwd(), 'src', 'interactions', 'buttons', `${name}.ts`);
    content = generateButtonFile(name);
  } else if (genType === 'select') {
    filePath = path.join(process.cwd(), 'src', 'interactions', 'selects', `${name}.ts`);
    content = generateSelectFile(name);
  } else if (genType === 'modal') {
    filePath = path.join(process.cwd(), 'src', 'interactions', 'modals', `${name}.ts`);
    content = generateModalFile(name);
  } else if (genType === 'service') {
    filePath = path.join(process.cwd(), 'src', 'services', `${name}.ts`);
    content = generateServiceFile(name);
  } else {
    // guard
    filePath = path.join(process.cwd(), 'src', 'guards', `${name}.ts`);
    content = generateGuardFile(name);
  }

  await writeFile(filePath, content, input.dryRun);
  p.outro(nextStep ?? 'Done!');
}

async function writeFile(filePath: string, content: string, dryRun?: boolean): Promise<void> {
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

  if (dryRun) {
    p.log.info(`Dry run — would create: ${relPath}`);
    return;
  }

  if (await fs.pathExists(filePath)) {
    const overwrite = await p.confirm({ message: `"${relPath}" already exists. Overwrite?` });
    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel('Aborted. No files were modified.');
      return;
    }
  }

  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf8');
  p.log.success(`Created: ${relPath}`);
}
