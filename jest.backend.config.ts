import baseConfig from "./jest.config.base"

const backendTestingConfig = {
    ...baseConfig,
    testEnvironment: 'node',
}

export default backendTestingConfig;