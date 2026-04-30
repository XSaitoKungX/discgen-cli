export function generatePlayCommand(): string {
  return `import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

// NOTE: Music functionality requires additional voice dependencies.
// Install them with: npm install @discordjs/voice @discordjs/opus ytdl-core

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play a song in your voice channel. (Requires voice dependencies)')
  .addStringOption((option) =>
    option.setName('query').setDescription('Song name or YouTube URL').setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  await interaction.reply({
    content: '🎵 Music support requires \`@discordjs/voice\`. See the README for setup instructions.',
    ephemeral: true,
  });
}

export default { data, execute } satisfies Command;
`;
}

export function generateStopCommand(): string {
  return `import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop playback and leave the voice channel.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  await interaction.reply({
    content: '🎵 Music support requires \`@discordjs/voice\`. See the README for setup instructions.',
    ephemeral: true,
  });
}

export default { data, execute } satisfies Command;
`;
}
