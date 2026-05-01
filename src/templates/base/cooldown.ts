export function generateCooldownTs(): string {
  return `
const cooldowns = new Map<string, Map<string, number>>();

/**
 * Returns the remaining cooldown in seconds, or 0 if the user is allowed to run.
 * Call this before executing a command, then call \`setCooldown\` after.
 */
export function getRemainingCooldown(
  commandName: string,
  userId: string,
  seconds: number,
): number {
  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Map());
  }

  const timestamps = cooldowns.get(commandName)!;
  const now = Date.now();
  const expiry = timestamps.get(userId) ?? 0;

  if (now < expiry) {
    return Math.ceil((expiry - now) / 1000);
  }

  return 0;
}

/** Record that a user just used a command. */
export function setCooldown(commandName: string, userId: string, seconds: number): void {
  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Map());
  }

  const timestamps = cooldowns.get(commandName)!;
  timestamps.set(userId, Date.now() + seconds * 1000);

  // Auto-clean after expiry to avoid unbounded memory growth
  setTimeout(() => timestamps.delete(userId), seconds * 1000);
}
`.trim();
}
