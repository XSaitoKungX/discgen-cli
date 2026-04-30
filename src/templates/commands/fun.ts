export function generateCoinflipCommand(): string {
  return `import { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('coinflip')
  .setDescription('Flip a coin — heads or tails?');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const result = Math.random() < 0.5 ? '🪙 **Heads!**' : '🪙 **Tails!**';

  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(result));

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}

export function generateEightBallCommand(): string {
  return `import { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

const RESPONSES = [
  'It is certain.',
  'Without a doubt.',
  'Yes, definitely.',
  'Most likely.',
  'Ask again later.',
  'Cannot predict now.',
  "Don't count on it.",
  'Very doubtful.',
  'My reply is no.',
];

export const data = new SlashCommandBuilder()
  .setName('8ball')
  .setDescription('Ask the magic 8-ball a question.')
  .addStringOption((option) =>
    option.setName('question').setDescription('Your question').setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const question = interaction.options.getString('question', true);
  const answer = RESPONSES[Math.floor(Math.random() * RESPONSES.length)] ?? 'Unknown';

  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(\`🎱 **\${question}\`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(answer));

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}

export function generateMemeCommand(): string {
  return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  SeparatorBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client, MessageActionRowComponentBuilder } from 'discord.js';
import type { Command } from '../../types/index.js';

interface MemeResponse {
  title: string;
  url: string;
  postLink: string;
}

export const data = new SlashCommandBuilder()
  .setName('meme')
  .setDescription('Get a random meme.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  await interaction.deferReply();

  try {
    const res = await fetch('https://meme-api.com/gimme');
    const json = await res.json() as MemeResponse;

    const container = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(\`## \${json.title}\`))
      .addSeparatorComponents(new SeparatorBuilder())
      .addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(json.url)),
      );

    const linkRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder().setLabel('View on Reddit').setStyle(ButtonStyle.Link).setURL(json.postLink),
    );

    await interaction.editReply({
      components: [container, linkRow],
      flags: MessageFlags.IsComponentsV2,
    });
  } catch {
    await interaction.editReply('Could not fetch a meme right now. Try again later.');
  }
}

export default { data, execute } satisfies Command;
`;
}
