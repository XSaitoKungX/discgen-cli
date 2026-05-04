export function generateEmbedTs(): string {
  return `import { EmbedBuilder } from 'discord.js';

const COLORS = {
  success: 0x2ecc71,
  error:   0xe74c3c,
  info:    0x3498db,
  warn:    0xf39c12,
  default: 0x5865f2,
} as const;

type Preset = keyof typeof COLORS;

interface EmbedOptions {
  title?: string;
  description?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: string;
  thumbnail?: string;
  image?: string;
  timestamp?: boolean;
}

function build(preset: Preset, opts: EmbedOptions): EmbedBuilder {
  const embed = new EmbedBuilder().setColor(COLORS[preset]);

  if (opts.title)       embed.setTitle(opts.title);
  if (opts.description) embed.setDescription(opts.description);
  if (opts.fields)      embed.addFields(opts.fields);
  if (opts.footer)      embed.setFooter({ text: opts.footer });
  if (opts.thumbnail)   embed.setThumbnail(opts.thumbnail);
  if (opts.image)       embed.setImage(opts.image);
  if (opts.timestamp)   embed.setTimestamp();

  return embed;
}

export const Embed = {
  success(opts: EmbedOptions): EmbedBuilder { return build('success', opts); },
  error(opts: EmbedOptions): EmbedBuilder   { return build('error',   opts); },
  info(opts: EmbedOptions): EmbedBuilder    { return build('info',    opts); },
  warn(opts: EmbedOptions): EmbedBuilder    { return build('warn',    opts); },
  default(opts: EmbedOptions): EmbedBuilder { return build('default', opts); },
};
`;
}
