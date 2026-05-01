import type { Database } from '../../types/index.js';

export function generateBalanceCommand(db: Database): string {
  if (db === 'sqlite') {
    return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { db } from '../../database/index.js';

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Check your wallet balance.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const row = db.prepare('SELECT balance FROM users WHERE id = ?').get(interaction.user.id) as { balance: number } | undefined;
  const balance = row?.balance ?? 0;

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

  if (db === 'postgresql') {
    return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { db, users } from '../../database/index.js';
import { eq } from 'drizzle-orm';

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Check your wallet balance.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const [row] = await db.select().from(users).where(eq(users.id, interaction.user.id));
  const balance = row?.balance ?? 0;

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

  // No database — in-memory fallback
  return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

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

export function generateDailyCommand(db: Database): string {
  if (db === 'sqlite') {
    return `import { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { db } from '../../database/index.js';

const DAILY_AMOUNT = 100;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily reward.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const userId = interaction.user.id;
  const now = Date.now();

  const row = db.prepare('SELECT balance, last_daily FROM users WHERE id = ?').get(userId) as
    | { balance: number; last_daily: number | null }
    | undefined;

  const lastClaim = row?.last_daily ?? 0;

  if (now - lastClaim < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (now - lastClaim)) / 1000 / 60);
    await interaction.reply({ content: \`⏳ Come back in **\${remaining}** minutes.\`, ephemeral: true });
    return;
  }

  const current = row?.balance ?? 0;
  const newBalance = current + DAILY_AMOUNT;

  db.prepare(\`
    INSERT INTO users (id, balance, last_daily) VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET balance = excluded.balance, last_daily = excluded.last_daily
  \`).run(userId, newBalance, now);

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        \`✅ You claimed your daily **\${DAILY_AMOUNT}** coins!\\n**New balance:** \${newBalance} coins\`,
      ),
    );

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
  }

  if (db === 'postgresql') {
    return `import { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { db, users } from '../../database/index.js';
import { eq } from 'drizzle-orm';

const DAILY_AMOUNT = 100;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily reward.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const userId = interaction.user.id;
  const now = new Date();

  const [row] = await db.select().from(users).where(eq(users.id, userId));
  const lastClaim = row?.lastDaily?.getTime() ?? 0;

  if (Date.now() - lastClaim < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - lastClaim)) / 1000 / 60);
    await interaction.reply({ content: \`⏳ Come back in **\${remaining}** minutes.\`, ephemeral: true });
    return;
  }

  const current = row?.balance ?? 0;
  const newBalance = current + DAILY_AMOUNT;

  await db
    .insert(users)
    .values({ id: userId, balance: newBalance, lastDaily: now })
    .onConflictDoUpdate({ target: users.id, set: { balance: newBalance, lastDaily: now } });

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        \`✅ You claimed your daily **\${DAILY_AMOUNT}** coins!\\n**New balance:** \${newBalance} coins\`,
      ),
    );

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
  }

  // No database — in-memory fallback
  return `import { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

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

export function generateLeaderboardCommand(db: Database): string {
  if (db === 'sqlite') {
    return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { db } from '../../database/index.js';

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Shows the top 10 richest users.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const rows = db.prepare('SELECT id, balance FROM users ORDER BY balance DESC LIMIT 10').all() as { id: string; balance: number }[];

  if (rows.length === 0) {
    await interaction.reply({ content: 'No economy data yet.', ephemeral: true });
    return;
  }

  const lines = rows.map((r, i) => \`**\${i + 1}.** <@\${r.id}> — \${r.balance} coins\`).join('\\n');

  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent('## 💰 Leaderboard'))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(lines));

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
  }

  if (db === 'postgresql') {
    return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { db, users } from '../../database/index.js';
import { desc } from 'drizzle-orm';

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Shows the top 10 richest users.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const rows = await db.select().from(users).orderBy(desc(users.balance)).limit(10);

  if (rows.length === 0) {
    await interaction.reply({ content: 'No economy data yet.', ephemeral: true });
    return;
  }

  const lines = rows.map((r, i) => \`**\${i + 1}.** <@\${r.id}> — \${r.balance} coins\`).join('\\n');

  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent('## 💰 Leaderboard'))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(lines));

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
  }

  // No database — in-memory fallback
  return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

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
