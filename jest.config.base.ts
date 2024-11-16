import type { Config } from '@jest/types';

const baseConfig: Config.InitialOptions = {
  roots: ["<rootDir>/src"], 
  testEnvironment: "node",
  testMatch: [
    "**/*.test.[jt]s?(x)"
  ],
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    "^@features/(.*)$": "<rootDir>/src/app/user_interface/$1",
    "^@components/(.*)$": "<rootDir>/component_library/$1",
    "^@data/(.*)$": "<rootDir>/src/data/$1",
    "^@logger/(.*)$": "<rootDir>/src/server/services/logger/$1",
    "^@domains/(.*)$": "<rootDir>/src/server/domains/$1",
    "^@server-services/(.*)$": "<rootDir>/src/server/services/$1",
    "^@client-services/(.*)$": "<rootDir>/src/app/services/$1",
  },
};

export default baseConfig;