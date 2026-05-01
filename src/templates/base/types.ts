export function generateTypesTs(): string {
  return `import type {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonInteraction,
  AnySelectMenuInteraction,
  ModalSubmitInteraction,
  Client,
  Message,
} from 'discord.js';

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

export interface ButtonHandler {
  customId: string;
  execute: (interaction: ButtonInteraction, client: Client) => Promise<void>;
}

export interface SelectHandler {
  customId: string;
  execute: (interaction: AnySelectMenuInteraction, client: Client) => Promise<void>;
}

export interface ModalHandler {
  customId: string;
  execute: (interaction: ModalSubmitInteraction, client: Client) => Promise<void>;
}
`;
}
