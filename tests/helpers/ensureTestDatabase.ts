import { env } from '../../src/config/env.js';

export const ensureTestDatabase = () => {
  if (env.nodeEnv !== 'test') {
    throw new Error('ensureTestDatabase can only be used in test environment');
  }

  if (!env.databaseUrl.includes('_test') && !env.databaseUrl.includes(':5433')) {
    throw new Error('Refusing to operate on a non-test database');
  }
};
