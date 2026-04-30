export function generateBanCommand(): string {
  return `import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Bans a member from the server.')
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to ban').setRequired(true),
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason for the ban').setRequired(false),
  );

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const target = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason') ?? 'No reason provided';
  const member = interaction.guild?.members.cache.get(target.id);

  if (!member) {
    await interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    return;
  }

  if (!member.bannable) {
    await interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });
    return;
  }

  await member.ban({ reason });
  await interaction.reply(\`✅ Banned **\${target.tag}** | Reason: \${reason}\`);
}

export default { data, execute } satisfies Command;
`;
}

export function generateKickCommand(): string {
  return `import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kicks a member from the server.')
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to kick').setRequired(true),
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason for the kick').setRequired(false),
  );

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const target = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason') ?? 'No reason provided';
  const member = interaction.guild?.members.cache.get(target.id);

  if (!member) {
    await interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    return;
  }

  if (!member.kickable) {
    await interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });
    return;
  }

  await member.kick(reason);
  await interaction.reply(\`✅ Kicked **\${target.tag}** | Reason: \${reason}\`);
}

export default { data, execute } satisfies Command;
`;
}

export function generateTimeoutCommand(): string {
  return `import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('timeout')
  .setDescription('Times out a member.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to timeout').setRequired(true),
  )
  .addIntegerOption((option) =>
    option.setName('minutes').setDescription('Duration in minutes (max 40320)').setRequired(true).setMinValue(1).setMaxValue(40320),
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason').setRequired(false),
  );

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const target = interaction.options.getUser('user', true);
  const minutes = interaction.options.getInteger('minutes', true);
  const reason = interaction.options.getString('reason') ?? 'No reason provided';
  const member = interaction.guild?.members.cache.get(target.id);

  if (!member) {
    await interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    return;
  }

  await member.timeout(minutes * 60 * 1000, reason);
  await interaction.reply(\`✅ Timed out **\${target.tag}** for \${minutes} minute(s) | Reason: \${reason}\`);
}

export default { data, execute } satisfies Command;
`;
}

export function generateWarnCommand(): string {
  return `import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Warns a member.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to warn').setRequired(true),
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason for the warning').setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const target = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason', true);

  await interaction.reply(\`⚠️ **\${target.tag}** has been warned | Reason: \${reason}\`);
}

export default { data, execute } satisfies Command;
`;
}
