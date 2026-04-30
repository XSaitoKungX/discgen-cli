export function generateLoggerTs(): string {
  return `type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  error?: unknown;
}

const COLORS: Record<LogLevel | 'reset' | 'dim' | 'bold', string> = {
  debug: '\\x1b[36m',
  info:  '\\x1b[32m',
  warn:  '\\x1b[33m',
  error: '\\x1b[31m',
  reset: '\\x1b[0m',
  dim:   '\\x1b[2m',
  bold:  '\\x1b[1m',
};

const ICONS: Record<LogLevel, string> = {
  debug: '●',
  info:  '✓',
  warn:  '⚠',
  error: '✗',
};

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info:  1,
  warn:  2,
  error: 3,
};

const currentLevel: LogLevel =
  (process.env['LOG_LEVEL'] as LogLevel | undefined) ?? 'info';

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[currentLevel];
}

function format(entry: LogEntry): string {
  const { level, message, context, error } = entry;
  const c = COLORS[level];
  const r = COLORS.reset;
  const dim = COLORS.dim;
  const bold = COLORS.bold;

  const ts = new Date().toISOString();
  const icon = ICONS[level];
  const lvl = level.toUpperCase().padEnd(5);
  const ctx = context ? \` \${dim}[\${context}]\${r}\` : '';
  const err =
    error instanceof Error
      ? \`\\n  \${dim}\${error.stack ?? error.message}\${r}\`
      : error
        ? \`\\n  \${dim}\${String(error)}\${r}\`
        : '';

  return \`\${dim}\${ts}\${r} \${c}\${bold}\${icon} \${lvl}\${r}\${ctx} \${message}\${err}\`;
}

function write(entry: LogEntry): void {
  if (!shouldLog(entry.level)) return;
  const line = format(entry);
  if (entry.level === 'error') {
    process.stderr.write(line + '\\n');
  } else {
    process.stdout.write(line + '\\n');
  }
}

export const logger = {
  debug(message: string, context?: string): void {
    write({ level: 'debug', message, context });
  },
  info(message: string, context?: string): void {
    write({ level: 'info', message, context });
  },
  warn(message: string, context?: string): void {
    write({ level: 'warn', message, context });
  },
  error(message: string, error?: unknown, context?: string): void {
    write({ level: 'error', message, context, error });
  },
};
`;
}
