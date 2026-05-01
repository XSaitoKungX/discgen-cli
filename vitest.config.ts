import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'forks',
    exclude: ['.claude/**', 'node_modules/**', 'dist/**'],
  },
});
