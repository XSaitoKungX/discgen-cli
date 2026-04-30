export function generateTypesTs(): string {
  return `import type { SlashCommandBuilder, ChatInputCommandInteraction, Client, Message } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction, client: Client) => Promise<void>;
}

export interface PrefixCommand {
  name: string;
  description: string;
  execute: (message: Message, args: string[], client: Client) => Promise<void>;
}

export interface Event {
  name: string;
  once?: boolean;
  execute: (...args: unknown[]) => Promise<void> | void;
}
`;
}
