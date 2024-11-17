import baseConfig from "./jest.config.base"

const frontendTestingConfig = {
    ...baseConfig,
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/src/app/**/*.test.ts?(x)'],
}

export default frontendTestingConfig;