export function generatePaginatorTs(): string {
  return `import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, InteractionCollector, ButtonInteraction } from 'discord.js';

const IDLE_MS = 60_000;

/** A single page: a heading and body text shown inside a ContainerBuilder. */
export interface Page {
  heading: string;
  body: string;
}

interface PaginatorOptions {
  interaction: ChatInputCommandInteraction;
  pages: Page[];
  /** How long to wait for input before disabling buttons (default: 60 s) */
  idle?: number;
}

function buildContainer(page: Page, index: number, total: number): ContainerBuilder {
  return new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(\`## \${page.heading}\`),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(page.body),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(\`-# Page \${index + 1} of \${total}\`),
    );
}

function buildRow(page: number, total: number, disabled = false): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('pg_first')
      .setEmoji('⏮')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled || page === 0),
    new ButtonBuilder()
      .setCustomId('pg_prev')
      .setEmoji('◀')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled || page === 0),
    new ButtonBuilder()
      .setCustomId('pg_index')
      .setLabel(\`\${page + 1} / \${total}\`)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId('pg_next')
      .setEmoji('▶')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled || page === total - 1),
    new ButtonBuilder()
      .setCustomId('pg_last')
      .setEmoji('⏭')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled || page === total - 1),
  );
}

export async function paginate(opts: PaginatorOptions): Promise<void> {
  const { interaction, pages, idle = IDLE_MS } = opts;

  if (pages.length === 0) {
    const empty = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent('No pages to display.'));
    await interaction.reply({ components: [empty], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
    return;
  }

  if (pages.length === 1) {
    const container = buildContainer(pages[0]!, 0, 1);
    await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    return;
  }

  let current = 0;

  const reply = await interaction.reply({
    components: [buildContainer(pages[0]!, 0, pages.length), buildRow(0, pages.length)],
    flags: MessageFlags.IsComponentsV2,
    withResponse: true,
  });

  const message = reply.resource?.message;
  if (!message) return;

  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (i: ButtonInteraction) => i.user.id === interaction.user.id,
    idle,
  }) as InteractionCollector<ButtonInteraction>;

  collector.on('collect', async (btn: ButtonInteraction) => {
    switch (btn.customId) {
      case 'pg_first': current = 0; break;
      case 'pg_prev':  current = Math.max(0, current - 1); break;
      case 'pg_next':  current = Math.min(pages.length - 1, current + 1); break;
      case 'pg_last':  current = pages.length - 1; break;
    }

    await btn.update({
      components: [buildContainer(pages[current]!, current, pages.length), buildRow(current, pages.length)],
    });
  });

  collector.on('end', async () => {
    await interaction.editReply({
      components: [buildContainer(pages[current]!, current, pages.length), buildRow(current, pages.length, true)],
    }).catch(() => null);
  });
}
`;
}
