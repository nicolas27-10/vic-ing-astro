
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
    reporters: ['default'],
    passWithNoTests: false,
    logHeapUsage: true,
  },
});
