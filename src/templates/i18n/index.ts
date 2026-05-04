export function generateLocaleEn(): string {
  return `export interface Locale {
  errors: {
    commandFailed:  string;
    unknownCommand: string;
    guildOnly:      string;
    noPermission:   string;
    cooldown:       (seconds: number) => string;
  };
  ping: {
    pinging: string;
    result:  (latency: number, ws: number) => string;
  };
  moderation: {
    banned:     (user: string, reason: string) => string;
    kicked:     (user: string, reason: string) => string;
    timedOut:   (user: string, duration: string) => string;
    warned:     (user: string, reason: string) => string;
    noTarget:   string;
    cantTarget: string;
  };
  economy: {
    balance:       (user: string, amount: number) => string;
    dailyClaim:    (amount: number) => string;
    dailyCooldown: (remaining: string) => string;
    leaderboard:   string;
  };
  fun: {
    coinflipHeads: string;
    coinflipTails: string;
    eightBall:     (answer: string) => string;
  };
}

const en: Locale = {
  errors: {
    commandFailed:  'There was an error executing that command.',
    unknownCommand: 'Unknown command.',
    guildOnly:      'This command can only be used in a server.',
    noPermission:   'You do not have permission to use this command.',
    cooldown:       (seconds) => \`Please wait \${seconds}s before using this command again.\`,
  },
  ping: {
    pinging: 'Pinging...',
    result:  (latency, ws) => \`🏓 Pong!\\n**Latency:** \${latency}ms | **WebSocket:** \${ws}ms\`,
  },
  moderation: {
    banned:     (user, reason) => \`✅ Banned **\${user}**. Reason: \${reason}\`,
    kicked:     (user, reason) => \`✅ Kicked **\${user}**. Reason: \${reason}\`,
    timedOut:   (user, duration) => \`✅ Timed out **\${user}** for \${duration}.\`,
    warned:     (user, reason) => \`⚠️ Warned **\${user}**: \${reason}\`,
    noTarget:   'You must specify a valid member.',
    cantTarget: 'You cannot moderate this member.',
  },
  economy: {
    balance:       (user, amount) => \`💰 \${user}'s balance: **\${amount}** coins\`,
    dailyClaim:    (amount) => \`✅ You claimed your daily **\${amount}** coins!\`,
    dailyCooldown: (remaining) => \`⏳ Come back in **\${remaining}** for your daily reward.\`,
    leaderboard:   'Economy Leaderboard',
  },
  fun: {
    coinflipHeads: '🪙 Heads!',
    coinflipTails: '🪙 Tails!',
    eightBall:     (answer) => \`🎱 \${answer}\`,
  },
};

export default en;
`;
}

export function generateLocaleDe(): string {
  return `import type { Locale } from './en.js';

const de: Locale = {
  errors: {
    commandFailed:  'Beim Ausführen des Befehls ist ein Fehler aufgetreten.',
    unknownCommand: 'Unbekannter Befehl.',
    guildOnly:      'Dieser Befehl kann nur auf einem Server verwendet werden.',
    noPermission:   'Du hast keine Berechtigung, diesen Befehl zu verwenden.',
    cooldown:       (seconds: number) => \`Bitte warte \${seconds}s, bevor du diesen Befehl erneut verwendest.\`,
  },

  ping: {
    pinging: 'Messe...',
    result:  (latency: number, ws: number) => \`🏓 Pong!\\n**Latenz:** \${latency}ms | **WebSocket:** \${ws}ms\`,
  },

  moderation: {
    banned:   (user: string, reason: string) => \`✅ **\${user}** gebannt. Grund: \${reason}\`,
    kicked:   (user: string, reason: string) => \`✅ **\${user}** gekickt. Grund: \${reason}\`,
    timedOut: (user: string, duration: string) => \`✅ **\${user}** für \${duration} stummgeschaltet.\`,
    warned:   (user: string, reason: string) => \`⚠️ **\${user}** verwarnt: \${reason}\`,
    noTarget: 'Du musst ein gültiges Mitglied angeben.',
    cantTarget: 'Du kannst dieses Mitglied nicht moderieren.',
  },

  economy: {
    balance:     (user: string, amount: number) => \`💰 \${user}s Kontostand: **\${amount}** Münzen\`,
    dailyClaim:  (amount: number) => \`✅ Du hast deine täglichen **\${amount}** Münzen abgeholt!\`,
    dailyCooldown: (remaining: string) => \`⏳ Komm in **\${remaining}** wieder für deine tägliche Belohnung.\`,
    leaderboard: 'Wirtschaft-Rangliste',
  },

  fun: {
    coinflipHeads: '🪙 Kopf!',
    coinflipTails: '🪙 Zahl!',
    eightBall:     (answer: string) => \`🎱 \${answer}\`,
  },
};

export default de;
`;
}

export function generateI18nIndex(): string {
  return `import type { Locale } from './en.js';
import en from './en.js';
import de from './de.js';

const locales: Record<string, Locale> = { en, de };

const guildLocales = new Map<string, string>();

/**
 * Set the locale for a specific guild.
 * Persist this in your database and restore it on startup.
 */
export function setGuildLocale(guildId: string, locale: string): void {
  if (!locales[locale]) throw new Error(\`Unsupported locale: \${locale}\`);
  guildLocales.set(guildId, locale);
}

/**
 * Get the locale object for a guild, falling back to English.
 */
export function getLocale(guildId: string | null | undefined): Locale {
  const key = (guildId && guildLocales.get(guildId)) ?? 'en';
  return locales[key] ?? en;
}

/**
 * Translate helper — call with the guild ID from any interaction.
 *
 * @example
 * const t = useT(interaction.guildId);
 * await interaction.reply(t.ping.pinging);
 */
export function useT(guildId: string | null | undefined): Locale {
  return getLocale(guildId);
}

export const supportedLocales = Object.keys(locales) as string[];
`;
}

export function generateLocaleSwitchCommand(): string {
  return `import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';
import { setGuildLocale, supportedLocales } from '../../i18n/index.js';

export const data = new SlashCommandBuilder()
  .setName('locale')
  .setDescription('Set the bot language for this server.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((opt) =>
    opt
      .setName('language')
      .setDescription('Language code')
      .setRequired(true)
      .addChoices(...supportedLocales.map((l) => ({ name: l, value: l }))),
  );

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const lang = interaction.options.getString('language', true);

  try {
    setGuildLocale(interaction.guildId!, lang);
    await interaction.reply({ content: \`✅ Language set to **\${lang}**.\`, ephemeral: true });
  } catch {
    await interaction.reply({ content: '❌ Unsupported language.', ephemeral: true });
  }
}

export default { data, execute } satisfies Command;
`;
}
