export function generateLogMemberAdd(): string {
  return `import { Events, EmbedBuilder } from 'discord.js';
import type { GuildMember } from 'discord.js';
import type { Event } from '../types/index.js';

const event: Event = {
  name: Events.GuildMemberAdd,
  async execute(...args: unknown[]): Promise<void> {
    const member = args[0] as GuildMember;
    const channelId = process.env.LOG_CHANNEL_ID;
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('Member Joined')
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: 'User',    value: \`<@\${member.id}> (\${member.user.tag})\`, inline: true },
        { name: 'Account', value: \`<t:\${Math.floor(member.user.createdTimestamp / 1000)}:R>\`, inline: true },
      )
      .setFooter({ text: \`ID: \${member.id}\` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};

export default event;
`;
}

export function generateLogMemberRemove(): string {
  return `import { Events, EmbedBuilder } from 'discord.js';
import type { GuildMember, PartialGuildMember } from 'discord.js';
import type { Event } from '../types/index.js';

const event: Event = {
  name: Events.GuildMemberRemove,
  async execute(...args: unknown[]): Promise<void> {
    const member = args[0] as GuildMember | PartialGuildMember;
    const channelId = process.env.LOG_CHANNEL_ID;
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('Member Left')
      .setThumbnail(member.user?.displayAvatarURL() ?? null)
      .addFields(
        { name: 'User', value: member.user ? \`<@\${member.id}> (\${member.user.tag})\` : \`ID: \${member.id}\`, inline: true },
      )
      .setFooter({ text: \`ID: \${member.id}\` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};

export default event;
`;
}

export function generateLogMessageDelete(): string {
  return `import { Events, EmbedBuilder } from 'discord.js';
import type { Message, PartialMessage } from 'discord.js';
import type { Event } from '../types/index.js';

const event: Event = {
  name: Events.MessageDelete,
  async execute(...args: unknown[]): Promise<void> {
    const message = args[0] as Message | PartialMessage;
    if (message.author?.bot) return;

    const channelId = process.env.LOG_CHANNEL_ID;
    if (!channelId) return;

    const logChannel = message.guild?.channels.cache.get(channelId);
    if (!logChannel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle('Message Deleted')
      .addFields(
        { name: 'Author',  value: message.author ? \`<@\${message.author.id}>\` : 'Unknown', inline: true },
        { name: 'Channel', value: \`<#\${message.channelId}>\`, inline: true },
        { name: 'Content', value: message.content?.slice(0, 1024) || '*Content unavailable*' },
      )
      .setFooter({ text: \`Message ID: \${message.id}\` })
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  },
};

export default event;
`;
}

export function generateLogMessageUpdate(): string {
  return `import { Events, EmbedBuilder } from 'discord.js';
import type { Message, PartialMessage } from 'discord.js';
import type { Event } from '../types/index.js';

const event: Event = {
  name: Events.MessageUpdate,
  async execute(...args: unknown[]): Promise<void> {
    const oldMessage = args[0] as Message | PartialMessage;
    const newMessage = args[1] as Message | PartialMessage;

    if (newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const channelId = process.env.LOG_CHANNEL_ID;
    if (!channelId) return;

    const logChannel = newMessage.guild?.channels.cache.get(channelId);
    if (!logChannel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('Message Edited')
      .addFields(
        { name: 'Author',  value: newMessage.author ? \`<@\${newMessage.author.id}>\` : 'Unknown', inline: true },
        { name: 'Channel', value: \`<#\${newMessage.channelId}>\`, inline: true },
        { name: 'Before',  value: oldMessage.content?.slice(0, 512) || '*Content unavailable*' },
        { name: 'After',   value: newMessage.content?.slice(0, 512) || '*Content unavailable*' },
      )
      .setFooter({ text: \`Message ID: \${newMessage.id}\` })
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  },
};

export default event;
`;
}

export function generateLogBanAdd(): string {
  return `import { Events, EmbedBuilder } from 'discord.js';
import type { Guild, User } from 'discord.js';
import type { Event } from '../types/index.js';

const event: Event = {
  name: Events.GuildBanAdd,
  async execute(...args: unknown[]): Promise<void> {
    const { guild, user } = args[0] as { guild: Guild; user: User };
    const channelId = process.env.LOG_CHANNEL_ID;
    if (!channelId) return;

    const channel = guild.channels.cache.get(channelId);
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('Member Banned')
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'User', value: \`<@\${user.id}> (\${user.tag})\`, inline: true },
      )
      .setFooter({ text: \`ID: \${user.id}\` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};

export default event;
`;
}

export function generateLogBanRemove(): string {
  return `import { Events, EmbedBuilder } from 'discord.js';
import type { Guild, User } from 'discord.js';
import type { Event } from '../types/index.js';

const event: Event = {
  name: Events.GuildBanRemove,
  async execute(...args: unknown[]): Promise<void> {
    const { guild, user } = args[0] as { guild: Guild; user: User };
    const channelId = process.env.LOG_CHANNEL_ID;
    if (!channelId) return;

    const channel = guild.channels.cache.get(channelId);
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('Member Unbanned')
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'User', value: \`<@\${user.id}> (\${user.tag})\`, inline: true },
      )
      .setFooter({ text: \`ID: \${user.id}\` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};

export default event;
`;
}
