import baseConfig from "./jest.config.base"

const backendTestingConfig = {
    ...baseConfig,
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/server/**/*.test.ts?(x)'],
}

export default backendTestingConfig;