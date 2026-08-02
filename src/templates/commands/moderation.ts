export function generateBanCommand(hasI18n = false): string {
  const i18nImport = hasI18n ? `\nimport { useT } from '../../i18n/index.js';` : '';
  const i18nInit = hasI18n ? `\n  const t = useT(interaction.guildId);` : '';
  const noTarget = hasI18n ? `t.moderation.noTarget` : `'❌ User not found in this server.'`;
  const cantBan = hasI18n ? `t.moderation.cantTarget` : `'❌ I cannot ban this user.'`;
  const success = hasI18n
    ? `t.moderation.banned(target.tag, reason)`
    : `\`✅ Banned **\${target.tag}**\\n**Reason:** \${reason}\``;

  return `import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';${i18nImport}

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

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const target = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason') ?? 'No reason provided';
  const member = interaction.guild?.members.cache.get(target.id);

  if (!member) {
    await interaction.reply({
      components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(${noTarget}))],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  if (!member.bannable) {
    await interaction.reply({
      components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(${cantBan}))],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  await member.ban({ reason });

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(${success}),
    );

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}

export function generateKickCommand(hasI18n = false): string {
  const i18nImport = hasI18n ? `\nimport { useT } from '../../i18n/index.js';` : '';
  const i18nInit = hasI18n ? `\n  const t = useT(interaction.guildId);` : '';
  const noTarget = hasI18n ? `t.moderation.noTarget` : `'❌ User not found in this server.'`;
  const cantKick = hasI18n ? `t.moderation.cantTarget` : `'❌ I cannot kick this user.'`;
  const success = hasI18n
    ? `t.moderation.kicked(target.tag, reason)`
    : `\`✅ Kicked **\${target.tag}**\\n**Reason:** \${reason}\``;

  return `import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';${i18nImport}

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

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const target = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason') ?? 'No reason provided';
  const member = interaction.guild?.members.cache.get(target.id);

  if (!member) {
    await interaction.reply({
      components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(${noTarget}))],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  if (!member.kickable) {
    await interaction.reply({
      components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(${cantKick}))],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  await member.kick(reason);

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(${success}),
    );

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}

export function generateTimeoutCommand(hasI18n = false): string {
  const i18nImport = hasI18n ? `\nimport { useT } from '../../i18n/index.js';` : '';
  const i18nInit = hasI18n ? `\n  const t = useT(interaction.guildId);` : '';
  const noTarget = hasI18n ? `t.moderation.noTarget` : `'❌ User not found in this server.'`;
  const success = hasI18n
    ? `t.moderation.timedOut(target.tag, \`\${minutes} minute(s)\`)`
    : `\`✅ Timed out **\${target.tag}** for **\${minutes}** minute(s)\\n**Reason:** \${reason}\``;

  return `import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';${i18nImport}

export const data = new SlashCommandBuilder()
  .setName('timeout')
  .setDescription('Times out a member.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to timeout').setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName('minutes')
      .setDescription('Duration in minutes (max 40320)')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(40320),
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason').setRequired(false),
  );

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const target = interaction.options.getUser('user', true);
  const minutes = interaction.options.getInteger('minutes', true);
  const reason = interaction.options.getString('reason') ?? 'No reason provided';
  const member = interaction.guild?.members.cache.get(target.id);

  if (!member) {
    await interaction.reply({
      components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(${noTarget}))],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  await member.timeout(minutes * 60 * 1000, reason);

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(${success}),
    );

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}

export function generateWarnCommand(hasI18n = false): string {
  const i18nImport = hasI18n ? `\nimport { useT } from '../../i18n/index.js';` : '';
  const i18nInit = hasI18n ? `\n  const t = useT(interaction.guildId);` : '';
  const success = hasI18n
    ? `t.moderation.warned(target.tag, reason)`
    : `\`⚠️ **\${target.tag}** has been warned\\n**Reason:** \${reason}\``;

  return `import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';${i18nImport}

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

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const target = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason', true);

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(${success}),
    );

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}
