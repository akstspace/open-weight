// Prisma configuration for SQLite
// Prisma 7 requires database URL in config file instead of schema

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL') || 'file:./dev.db',
  },
});
