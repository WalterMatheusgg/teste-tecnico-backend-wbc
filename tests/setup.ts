import { beforeAll, afterAll } from 'vitest';
import { env } from '../src/config/env.js';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = env.databaseUrl || process.env.DATABASE_URL;

beforeAll(() => {
  if (!process.env.DATABASE_URL?.includes('_test') && !process.env.DATABASE_URL?.includes(':5433')) {
    throw new Error('Refusing to operate on a non-test database');
  }
});

afterAll(async () => {
  // no-op
});
