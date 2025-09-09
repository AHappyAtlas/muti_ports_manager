// Jest setup file for global test configuration
import { jest } from '@jest/globals';

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set up environment variables for tests
process.env.NODE_ENV = 'test';