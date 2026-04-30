import type { WizardOptions } from '../../types/index.js';

export function generateReadyEvent(): string {
  return `import type { Client } from 'discord.js';
import type { Event } from '../types/index.js';
import { logger } from '../utils/logger.js';

const event: Event = {
  name: 'ready',
  once: true,
  execute(client: Client): void {
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
  async execute(interaction: Interaction, client: Client): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

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
      const message = { content: 'There was an error executing that command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(message);
      } else {
        await interaction.reply(message);
      }
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

const PREFIX = process.env.PREFIX ?? '!';

const event: Event = {
  name: Events.MessageCreate,
  async execute(message: Message, client: Client): Promise<void> {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    // TODO: implement prefix command routing
    void client;
    void args;
  },
};

export default event;
`;
}
