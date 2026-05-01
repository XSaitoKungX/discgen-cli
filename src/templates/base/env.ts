export function generateEnvValidatorTs(): string {
  return `
import 'dotenv/config';

const REQUIRED = ['DISCORD_TOKEN', 'CLIENT_ID'] as const;

type EnvKey = (typeof REQUIRED)[number];

function validateEnv(): Record<EnvKey, string> {
  const missing: string[] = [];
  const env = {} as Record<EnvKey, string>;

  for (const key of REQUIRED) {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    } else {
      env[key] = value;
    }
  }

  if (missing.length > 0) {
    console.error(\`[env] Missing required environment variables: \${missing.join(', ')}\`);
    console.error('[env] Copy .env.example to .env and fill in the values.');
    process.exit(1);
  }

  return env;
}

export const env = validateEnv();
`.trim();
}
