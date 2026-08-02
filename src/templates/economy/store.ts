export function generateInMemoryEconomyStore(): string {
  return `export const DAILY_AMOUNT = 100;
export const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;

interface EconomyAccount {
  balance: number;
  lastDaily: number | null;
}

export interface DailyClaimResult {
  claimed: boolean;
  balance: number;
  remainingMs: number;
}

export interface EconomyLeaderboardEntry {
  userId: string;
  balance: number;
}

const accounts = new Map<string, EconomyAccount>();

export function getBalance(userId: string): number {
  return accounts.get(userId)?.balance ?? 0;
}

export function getLeaderboard(limit = 10): EconomyLeaderboardEntry[] {
  return [...accounts.entries()]
    .map(([userId, account]) => ({ userId, balance: account.balance }))
    .sort((left, right) => right.balance - left.balance)
    .slice(0, limit);
}

export function claimDailyReward(userId: string, now = Date.now()): DailyClaimResult {
  const account = accounts.get(userId) ?? { balance: 0, lastDaily: null };

  if (account.lastDaily !== null) {
    const remainingMs = DAILY_COOLDOWN_MS - (now - account.lastDaily);
    if (remainingMs > 0) {
      return { claimed: false, balance: account.balance, remainingMs };
    }
  }

  const balance = account.balance + DAILY_AMOUNT;
  accounts.set(userId, { balance, lastDaily: now });

  return { claimed: true, balance, remainingMs: 0 };
}
`;
}
