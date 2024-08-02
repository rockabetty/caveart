import { requireEnvVar } from './envcheck';

describe('requireEnvVar', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should return the environment variable if it exists', () => {
        process.env.TEST_VAR = 'test_value';
        const result = requireEnvVar('TEST_VAR');
        expect(result).toBe('test_value');
    });

    it('should throw an error with a specific message in development mode if the variable is missing', () => {
        (process.env as any).NODE_ENV = 'development';
        delete process.env.MISSING_VAR;
        expect(() => requireEnvVar('MISSING_VAR')).toThrow('Missing env variable: MISSING_VAR');
    });

    it('should throw a generic error message in production mode if the variable is missing', () => {
        (process.env as any).NODE_ENV = 'production';
        delete process.env.MISSING_VAR;
        expect(() => requireEnvVar('MISSING_VAR')).toThrow('Service unavailable.');
    });

     it('should default to development environment if NODE_ENV is not set', () => {
        (process.env as any).NODE_ENV = undefined
        expect(() => requireEnvVar('MISSING_VAR')).toThrow('Missing env variable: MISSING_VAR');
    });
});