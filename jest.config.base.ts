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
};

export default baseConfig;