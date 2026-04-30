export function generatePingCommand(): string {
  return `import { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong and shows latency.');

export async function execute(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
  const sent = await interaction.reply({
    components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent('Pinging...'))],
    flags: MessageFlags.IsComponentsV2,
    withResponse: true,
  });

  const latency = sent.resource.message.createdTimestamp - interaction.createdTimestamp;
  const wsLatency = client.ws.ping;

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        \`🏓 Pong!\\n**Latency:** \${latency}ms | **WebSocket:** \${wsLatency}ms\`,
      ),
    );

  await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}

export function generateUserinfoCommand(): string {
  return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Shows information about a user.')
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to get info about').setRequired(false),
  );

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const target = interaction.options.getUser('user') ?? interaction.user;
  const member = interaction.guild?.members.cache.get(target.id);
  const joinedAt = member?.joinedTimestamp ? \`<t:\${Math.floor(member.joinedTimestamp / 1000)}:R>\` : 'N/A';

  const container = new ContainerBuilder()
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            \`## \${target.tag}\\n**ID:** \${target.id}\\n**Joined Discord:** <t:\${Math.floor(target.createdTimestamp / 1000)}:R>\\n**Joined Server:** \${joinedAt}\`,
          ),
        )
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(target.displayAvatarURL())),
    )
    .addSeparatorComponents(new SeparatorBuilder());

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}

export function generateServerinfoCommand(): string {
  return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('serverinfo')
  .setDescription('Shows information about this server.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    return;
  }

  const iconURL = guild.iconURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png';

  const container = new ContainerBuilder()
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            \`## \${guild.name}\\n**Owner:** <@\${guild.ownerId}>\\n**Members:** \${guild.memberCount}\\n**Created:** <t:\${Math.floor(guild.createdTimestamp / 1000)}:R>\`,
          ),
        )
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(iconURL)),
    )
    .addSeparatorComponents(new SeparatorBuilder());

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}
