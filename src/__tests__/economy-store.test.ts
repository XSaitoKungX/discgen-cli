import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { generateInMemoryEconomyStore } from '../templates/economy/store.js';

interface DailyClaimResult {
  claimed: boolean;
  balance: number;
  remainingMs: number;
}

interface EconomyStore {
  DAILY_AMOUNT: number;
  DAILY_COOLDOWN_MS: number;
  claimDailyReward: (userId: string, now: number) => DailyClaimResult;
  getBalance: (userId: string) => number;
  getLeaderboard: (limit?: number) => Array<{ userId: string; balance: number }>;
}

function isEconomyStore(value: object): value is EconomyStore {
  return (
    'DAILY_AMOUNT' in value &&
    typeof value.DAILY_AMOUNT === 'number' &&
    'DAILY_COOLDOWN_MS' in value &&
    typeof value.DAILY_COOLDOWN_MS === 'number' &&
    'claimDailyReward' in value &&
    typeof value.claimDailyReward === 'function' &&
    'getBalance' in value &&
    typeof value.getBalance === 'function' &&
    'getLeaderboard' in value &&
    typeof value.getLeaderboard === 'function'
  );
}

async function loadGeneratedStore(): Promise<EconomyStore> {
  const directory = await mkdtemp(join(tmpdir(), 'discgen-economy-'));
  const sourcePath = join(directory, 'store.ts');
  const outputPath = join(directory, 'store.cjs');

  try {
    await writeFile(sourcePath, generateInMemoryEconomyStore(), 'utf8');
    const source = await readFile(sourcePath, 'utf8');
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    await writeFile(outputPath, output, 'utf8');

    const module: unknown = await import(pathToFileURL(outputPath).href);
    if (!module || typeof module !== 'object' || !isEconomyStore(module)) {
      throw new Error('Generated economy store does not expose the expected public API.');
    }

    return module;
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}

describe('generated in-memory economy store', () => {
  it('makes a claimed daily reward visible to balance and leaderboard readers', async () => {
    const store = await loadGeneratedStore();

    expect(store.claimDailyReward('alice', 1_000)).toEqual({
      claimed: true,
      balance: 100,
      remainingMs: 0,
    });
    expect(store.getBalance('alice')).toBe(100);
    expect(store.getLeaderboard()).toEqual([{ userId: 'alice', balance: 100 }]);
  });

  it('accepts exactly one daily claim during a cooldown window', async () => {
    const store = await loadGeneratedStore();
    const firstClaimAt = 1_000;

    expect(store.claimDailyReward('alice', firstClaimAt).claimed).toBe(true);

    const attempts = await Promise.all(
      Array.from({ length: 10 }, () =>
        Promise.resolve().then(() => store.claimDailyReward('alice', firstClaimAt + 1)),
      ),
    );

    expect(attempts.filter(({ claimed }) => claimed)).toHaveLength(0);
    expect(store.getBalance('alice')).toBe(100);
    expect(attempts[0]).toEqual({
      claimed: false,
      balance: 100,
      remainingMs: store.DAILY_COOLDOWN_MS - 1,
    });
  });
});
