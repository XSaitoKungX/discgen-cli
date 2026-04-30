export function generateBalanceCommand(): string {
  return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

// TODO: Connect to your database of choice
const balances = new Map<string, number>();

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Check your wallet balance.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const balance = balances.get(interaction.user.id) ?? 0;

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(\`## \${interaction.user.username}'s Wallet\`),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(\`💰 **Balance:** \${balance} coins\`));

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}

export function generateDailyCommand(): string {
  return `import { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

// TODO: Connect to your database of choice
const balances = new Map<string, number>();
const cooldowns = new Map<string, number>();
const DAILY_AMOUNT = 100;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily reward.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const now = Date.now();
  const lastClaim = cooldowns.get(interaction.user.id) ?? 0;

  if (now - lastClaim < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (now - lastClaim)) / 1000 / 60);
    await interaction.reply({ content: \`⏳ Come back in **\${remaining}** minutes.\`, ephemeral: true });
    return;
  }

  const current = balances.get(interaction.user.id) ?? 0;
  balances.set(interaction.user.id, current + DAILY_AMOUNT);
  cooldowns.set(interaction.user.id, now);

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        \`✅ You claimed your daily **\${DAILY_AMOUNT}** coins!\\n**New balance:** \${current + DAILY_AMOUNT} coins\`,
      ),
    );

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}

export function generateLeaderboardCommand(): string {
  return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

// TODO: Connect to your database of choice
const balances = new Map<string, number>();

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Shows the top 10 richest users.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const sorted = [...balances.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  if (sorted.length === 0) {
    await interaction.reply({ content: 'No economy data yet.', ephemeral: true });
    return;
  }

  const rows = sorted
    .map(([id, bal], i) => \`**\${i + 1}.** <@\${id}> — \${bal} coins\`)
    .join('\\n');

  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent('## 💰 Leaderboard'))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(rows));

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}
