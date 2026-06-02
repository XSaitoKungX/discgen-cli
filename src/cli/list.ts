const PRESETS = ['basic', 'moderation', 'full'] as const;
const COMMAND_TYPES = ['slash', 'prefix', 'both'] as const;
const FEATURES = ['moderation', 'utility', 'fun', 'economy', 'music', 'components', 'i18n'] as const;
const DATABASES = ['none', 'sqlite', 'postgresql'] as const;
const GENERATE_TYPES = ['command', 'event', 'guard', 'button', 'select', 'modal', 'service'] as const;

function formatList(values: readonly string[]): string {
  return values.map((value) => `  - ${value}`).join('\n');
}

export function runList(): void {
  console.log(
    [
      'discgen-cli options',
      '',
      'Presets:',
      formatList(PRESETS),
      '',
      'Command types:',
      formatList(COMMAND_TYPES),
      '',
      'Features:',
      formatList(FEATURES),
      '',
      'Databases:',
      formatList(DATABASES),
      '',
      'Generate types:',
      formatList(GENERATE_TYPES),
    ].join('\n'),
  );
}
