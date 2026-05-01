export function generateDemoCommand(): string {
  return `import {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('demo')
  .setDescription('Interactive component demo: buttons, select menus, and a modal form.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('## 🎛️ Component Demo'),
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        'Click a **button**, pick from the **select menu**, or open the **modal form**.',
      ),
    );

  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('example_button')
      .setLabel('Click me')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('open_modal')
      .setLabel('Open Form')
      .setStyle(ButtonStyle.Secondary),
  );

  const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('example_select')
      .setPlaceholder('Pick an option')
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel('Option A').setValue('opt_a'),
        new StringSelectMenuOptionBuilder().setLabel('Option B').setValue('opt_b'),
        new StringSelectMenuOptionBuilder().setLabel('Option C').setValue('opt_c'),
      ),
  );

  await interaction.reply({
    components: [container, buttonRow, selectRow],
    flags: MessageFlags.IsComponentsV2,
  });
}

export default { data, execute } satisfies Command;
`;
}
