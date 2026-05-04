import type { WizardOptions } from '../../types/index.js';

export function generateReadyEvent(): string {
  return `import type { Client } from 'discord.js';
import type { Event } from '../types/index.js';
import { logger } from '../utils/logger.js';

const event: Event = {
  name: 'ready',
  once: true,
  execute(...args: unknown[]): void {
    const client = args[0] as Client;
    logger.info(\`Logged in as \${client.user?.tag ?? 'unknown'}\`, 'ready');
    logger.info(\`Serving \${client.guilds.cache.size} guild(s)\`, 'ready');
  },
};

export default event;
`;
}

export function generateInteractionCreateEvent(opts: WizardOptions): string {
  if (opts.commandType === 'prefix') {
    return `import type { Event } from '../types/index.js';

const event: Event = {
  name: 'interactionCreate',
  execute(): void {
    // No slash command handling — prefix-only bot
  },
};

export default event;
`;
  }

  return `import { Events } from 'discord.js';
import type { Interaction, Client } from 'discord.js';
import type { Event } from '../types/index.js';
import { logger } from '../utils/logger.js';

const event: Event = {
  name: Events.InteractionCreate,
  async execute(...args: unknown[]): Promise<void> {
    const interaction = args[0] as Interaction;
    const client = args[1] as Client;

    // ── Slash commands ──────────────────────────────────────────────────────
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        await interaction.reply({ content: 'Unknown command.', ephemeral: true });
        return;
      }

      logger.debug(\`Executing /\${interaction.commandName}\`, 'command');

      try {
        await command.execute(interaction, client);
      } catch (error) {
        logger.error(\`Failed to execute /\${interaction.commandName}\`, error, 'command');
        const msg = { content: 'There was an error executing that command.', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(msg);
        } else {
          await interaction.reply(msg);
        }
      }
      return;
    }

    // ── Button interactions ─────────────────────────────────────────────────
    if (interaction.isButton()) {
      const handler = client.buttons.get(interaction.customId);
      if (!handler) return;

      try {
        await handler.execute(interaction, client);
      } catch (error) {
        logger.error(\`Button handler failed: \${interaction.customId}\`, error, 'button');
        await interaction.reply({ content: 'There was an error handling that button.', ephemeral: true }).catch(() => null);
      }
      return;
    }

    // ── Select menu interactions ────────────────────────────────────────────
    if (interaction.isAnySelectMenu()) {
      const handler = client.selects.get(interaction.customId);
      if (!handler) return;

      try {
        await handler.execute(interaction, client);
      } catch (error) {
        logger.error(\`Select handler failed: \${interaction.customId}\`, error, 'select');
        await interaction.reply({ content: 'There was an error handling that selection.', ephemeral: true }).catch(() => null);
      }
      return;
    }

    // ── Modal submissions ───────────────────────────────────────────────────
    if (interaction.isModalSubmit()) {
      const handler = client.modals.get(interaction.customId);
      if (!handler) return;

      try {
        await handler.execute(interaction, client);
      } catch (error) {
        logger.error(\`Modal handler failed: \${interaction.customId}\`, error, 'modal');
        await interaction.reply({ content: 'There was an error handling that submission.', ephemeral: true }).catch(() => null);
      }
      return;
    }
  },
};

export default event;
`;
}

export function generateMessageCreateEvent(): string {
  return `import { Events } from 'discord.js';
import type { Message, Client } from 'discord.js';
import type { Event } from '../types/index.js';
import { logger } from '../utils/logger.js';

const PREFIX = process.env.PREFIX ?? '!';

const event: Event = {
  name: Events.MessageCreate,
  async execute(...args: unknown[]): Promise<void> {
    const message = args[0] as Message;
    const client  = args[1] as Client;

    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const parts = message.content.slice(PREFIX.length).trim().split(/\\s+/);
    const commandName = parts.shift()?.toLowerCase();
    if (!commandName) return;

    const command = client.prefixCommands?.get(commandName);
    if (!command) return;

    logger.debug(\`Executing prefix !\${commandName}\`, 'command');

    try {
      await command.execute(message, parts, client);
    } catch (error) {
      logger.error(\`Prefix command failed: \${commandName}\`, error, 'command');
      await message.reply('There was an error executing that command.').catch(() => null);
    }
  },
};

export default event;
`;
}
