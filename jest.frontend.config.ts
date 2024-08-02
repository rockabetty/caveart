import baseConfig from "./jest.config.base"

const frontendTestingConfig = {
    ...baseConfig,
    testEnvironment: 'jsdom',
}

export default frontendTestingConfig;