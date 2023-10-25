import { Pool } from 'pg';
import PoolConnection from '../connection';

const mockOn = jest.fn();

jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => {
      return {
        on: mockOn
      };
    }),
  };
});

describe('PoolConnection', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('should create a new Pool instance if one does not exist', () => {
    const instance1 = PoolConnection.get();
    const instance2 = PoolConnection.get();

    expect(Pool).toHaveBeenCalledTimes(1);
    expect(instance1).toBe(instance2);
  });

  it('should attach an error listener to the Pool instance', () => {
    const poolInstanceMock = new Pool();
    PoolConnection.get();

    expect(mockOn).toHaveBeenCalledWith('error', expect.any(Function));
  });
});