import type { Database } from '../../types/index.js';

export function generateBalanceCommand(db: Database, hasI18n = false): string {
  const i18nImport = hasI18n ? `\nimport { useT } from '../../i18n/index.js';` : '';
  const i18nInit = hasI18n ? `\n  const t = useT(interaction.guildId);` : '';
  const djsImports = hasI18n
    ? `SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags`
    : `SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags`;
  const containerCode = hasI18n
    ? `  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(t.economy.balance(interaction.user.username, balance)));`
    : `  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(\`## \${interaction.user.username}'s Wallet\`),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(\`💰 **Balance:** \${balance} coins\`));`;

  if (db === 'sqlite') {
    return `import { ${djsImports} } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { db } from '../../database/index.js';${i18nImport}

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Check your wallet balance.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const row = db.prepare('SELECT balance FROM users WHERE id = ?').get(interaction.user.id) as { balance: number } | undefined;
  const balance = row?.balance ?? 0;

${containerCode}

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
  }

  if (db === 'postgresql') {
    return `import { ${djsImports} } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { db, users } from '../../database/index.js';
import { eq } from 'drizzle-orm';${i18nImport}

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Check your wallet balance.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const [row] = await db.select().from(users).where(eq(users.id, interaction.user.id));
  const balance = row?.balance ?? 0;

${containerCode}

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
  }

  if (db === 'mongodb') {
    return `import { ${djsImports} } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { User } from '../../database/index.js';${i18nImport}

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Check your wallet balance.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const doc = await User.findById(interaction.user.id);
  const balance = doc?.balance ?? 0;

${containerCode}

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
  }

  // No database — in-memory fallback
  return `import { ${djsImports} } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { getBalance } from '../../economy/store.js';${i18nImport}

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Check your wallet balance.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const balance = getBalance(interaction.user.id);

${containerCode}

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}

export function generateDailyCommand(db: Database, hasI18n = false): string {
  const i18nImport = hasI18n ? `\nimport { useT } from '../../i18n/index.js';` : '';
  const i18nInit = hasI18n ? `\n  const t = useT(interaction.guildId);` : '';
  const cooldownMsg = hasI18n
    ? `t.economy.dailyCooldown(\`\${remaining} minutes\`)`
    : `\`⏳ Come back in **\${remaining}** minutes.\``;
  const successContent = hasI18n
    ? `\`\${t.economy.dailyClaim(DAILY_AMOUNT)}\\n**New balance:** \${newBalance} coins\``
    : `\`✅ You claimed your daily **\${DAILY_AMOUNT}** coins!\\n**New balance:** \${newBalance} coins\``;

  if (db === 'sqlite') {
    return `import { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { db } from '../../database/index.js';${i18nImport}

const DAILY_AMOUNT = 100;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

interface DailyClaim {
  claimed: boolean;
  balance: number;
  remainingMs: number;
}

const claimDailyReward = db.transaction((userId: string, now: number): DailyClaim => {
  const row = db.prepare('SELECT balance, last_daily FROM users WHERE id = ?').get(userId) as
    | { balance: number; last_daily: number | null }
    | undefined;
  const lastClaim = row?.last_daily;

  if (lastClaim !== null && lastClaim !== undefined) {
    const remainingMs = COOLDOWN_MS - (now - lastClaim);
    if (remainingMs > 0) {
      return { claimed: false, balance: row?.balance ?? 0, remainingMs };
    }
  }

  const balance = (row?.balance ?? 0) + DAILY_AMOUNT;
  db.prepare(\`
    INSERT INTO users (id, balance, last_daily) VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET balance = excluded.balance, last_daily = excluded.last_daily
  \`).run(userId, balance, now);

  return { claimed: true, balance, remainingMs: 0 };
});

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily reward.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const userId = interaction.user.id;
  const now = Date.now();

  const claim = claimDailyReward(userId, now);

  if (!claim.claimed) {
    const remaining = Math.ceil(claim.remainingMs / 1000 / 60);
    await interaction.reply({ content: ${cooldownMsg}, ephemeral: true });
    return;
  }

  const newBalance = claim.balance;

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(${successContent}),
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
import { pool } from '../../database/index.js';${i18nImport}

const DAILY_AMOUNT = 100;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

interface DailyClaim {
  claimed: boolean;
  balance: number;
  remainingMs: number;
}

async function claimDailyReward(userId: string, now: Date): Promise<DailyClaim> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [userId]);

    const { rows } = await client.query<{ balance: number; last_daily: Date | null }>(
      'SELECT balance, last_daily FROM users WHERE id = $1 FOR UPDATE',
      [userId],
    );
    const account = rows[0];
    const lastClaim = account?.last_daily;

    if (lastClaim) {
      const remainingMs = COOLDOWN_MS - (now.getTime() - lastClaim.getTime());
      if (remainingMs > 0) {
        await client.query('COMMIT');
        return { claimed: false, balance: account?.balance ?? 0, remainingMs };
      }
    }

    const balance = (account?.balance ?? 0) + DAILY_AMOUNT;
    await client.query(
      \`INSERT INTO users (id, balance, last_daily) VALUES ($1, $2, $3)
       ON CONFLICT(id) DO UPDATE SET balance = excluded.balance, last_daily = excluded.last_daily\`,
      [userId, balance, now],
    );
    await client.query('COMMIT');

    return { claimed: true, balance, remainingMs: 0 };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily reward.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const userId = interaction.user.id;
  const now = new Date();

  const claim = await claimDailyReward(userId, now);

  if (!claim.claimed) {
    const remaining = Math.ceil(claim.remainingMs / 1000 / 60);
    await interaction.reply({ content: ${cooldownMsg}, ephemeral: true });
    return;
  }

  const newBalance = claim.balance;

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(${successContent}),
    );

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
  }

  if (db === 'mongodb') {
    return `import { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { User } from '../../database/index.js';${i18nImport}

const DAILY_AMOUNT = 100;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

interface DailyClaim {
  claimed: boolean;
  balance: number;
  remainingMs: number;
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'number' &&
    error.code === 11000
  );
}

async function claimDailyReward(userId: string, now: Date): Promise<DailyClaim> {
  const eligibleBefore = new Date(now.getTime() - COOLDOWN_MS);
  const account = await User.findOneAndUpdate(
    {
      _id: userId,
      $or: [
        { lastDaily: null },
        { lastDaily: { $exists: false } },
        { lastDaily: { $lte: eligibleBefore } },
      ],
    },
    { $inc: { balance: DAILY_AMOUNT }, $set: { lastDaily: now } },
    { new: true },
  );

  if (account) {
    return { claimed: true, balance: account.balance, remainingMs: 0 };
  }

  try {
    const created = await User.create({ _id: userId, balance: DAILY_AMOUNT, lastDaily: now });
    return { claimed: true, balance: created.balance, remainingMs: 0 };
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw error;
    }

    const existing = await User.findById(userId);
    if (!existing) {
      throw error;
    }

    const lastClaim = existing.lastDaily?.getTime() ?? now.getTime();
    const remainingMs = Math.max(0, COOLDOWN_MS - (now.getTime() - lastClaim));
    return { claimed: false, balance: existing.balance, remainingMs };
  }
}

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily reward.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const userId = interaction.user.id;
  const now = new Date();

  const claim = await claimDailyReward(userId, now);

  if (!claim.claimed) {
    const remaining = Math.ceil(claim.remainingMs / 1000 / 60);
    await interaction.reply({ content: ${cooldownMsg}, ephemeral: true });
    return;
  }

  const newBalance = claim.balance;

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(${successContent}),
    );

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
  }

  // No database — in-memory fallback
  return `import { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';${i18nImport}

import { DAILY_AMOUNT, claimDailyReward } from '../../economy/store.js';

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily reward.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const claim = claimDailyReward(interaction.user.id);

  if (!claim.claimed) {
    const remaining = Math.ceil(claim.remainingMs / 1000 / 60);
    await interaction.reply({ content: ${cooldownMsg}, ephemeral: true });
    return;
  }

  const newBalance = claim.balance;

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(${successContent}),
    );

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}

export function generateLeaderboardCommand(db: Database, hasI18n = false): string {
  const i18nImport = hasI18n ? `\nimport { useT } from '../../i18n/index.js';` : '';
  const i18nInit = hasI18n ? `\n  const t = useT(interaction.guildId);` : '';
  const heading = hasI18n ? `\`## \${t.economy.leaderboard}\`` : `'## 💰 Leaderboard'`;

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
import { db } from '../../database/index.js';${i18nImport}

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Shows the top 10 richest users.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const rows = db.prepare('SELECT id, balance FROM users ORDER BY balance DESC LIMIT 10').all() as { id: string; balance: number }[];

  if (rows.length === 0) {
    await interaction.reply({ content: 'No economy data yet.', ephemeral: true });
    return;
  }

  const lines = rows.map((r, i) => \`**\${i + 1}.** <@\${r.id}> — \${r.balance} coins\`).join('\\n');

  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(${heading}))
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
import { desc } from 'drizzle-orm';${i18nImport}

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Shows the top 10 richest users.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const rows = await db.select().from(users).orderBy(desc(users.balance)).limit(10);

  if (rows.length === 0) {
    await interaction.reply({ content: 'No economy data yet.', ephemeral: true });
    return;
  }

  const lines = rows.map((r, i) => \`**\${i + 1}.** <@\${r.id}> — \${r.balance} coins\`).join('\\n');

  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(${heading}))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(lines));

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
  }

  if (db === 'mongodb') {
    return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { User } from '../../database/index.js';${i18nImport}

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Shows the top 10 richest users.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const docs = await User.find().sort({ balance: -1 }).limit(10);

  if (docs.length === 0) {
    await interaction.reply({ content: 'No economy data yet.', ephemeral: true });
    return;
  }

  const lines = docs.map((d, i) => \`**\${i + 1}.** <@\${d._id}> — \${d.balance} coins\`).join('\\n');

  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(${heading}))
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
import { getLeaderboard } from '../../economy/store.js';${i18nImport}

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Shows the top 10 richest users.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {${i18nInit}
  const sorted = getLeaderboard();

  if (sorted.length === 0) {
    await interaction.reply({ content: 'No economy data yet.', ephemeral: true });
    return;
  }

  const rows = sorted
    .map(({ userId, balance }, i) => \`**\${i + 1}.** <@\${userId}> — \${balance} coins\`)
    .join('\\n');

  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(${heading}))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(rows));

  await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default { data, execute } satisfies Command;
`;
}
