import type { Database } from '../../types/index.js';

export function generateDatabaseTs(db: Database): string {
  if (db === 'sqlite') {
    return `import Database from 'better-sqlite3';
import type { Database as BetterSqlite3Database } from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const db: BetterSqlite3Database = new Database(join(__dirname, '..', '..', 'data.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDb(): void {
  db.exec(\`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      balance INTEGER NOT NULL DEFAULT 0,
      last_daily INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  \`);
}
`;
  }

  if (db === 'postgresql') {
    return `import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  balance: integer('balance').notNull().default(0),
  lastDaily: timestamp('last_daily'),
  createdAt: timestamp('created_at').defaultNow(),
});
`;
  }

  return '';
}

export function generateDatabaseEnvVars(db: Database): string {
  if (db === 'sqlite') return '';
  if (db === 'postgresql') return 'DATABASE_URL=postgresql://user:password@localhost:5432/mybot\n';
  return '';
}
