import { jest } from '@jest/globals';

// Mock net module
jest.mock('net', () => ({
  createServer: jest.fn()
}));

// Mock i18n
jest.mock('../src/i18n', () => ({
  i18n: {
    t: jest.fn((key: string, params?: Record<string, string | number>) => {
      const translations: Record<string, string> = {
        'error.no-available-ports': 'No available ports found in range {startPort}-{endPort}',
      };
      
      let message = translations[key] || key;
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          message = message.replace(new RegExp(`{${param}}`, 'g'), String(value));
        });
      }
      return message;
    }),
  },
}));

import { PortManager } from '../src/port-manager';
import net from 'net';

const mockNet = net as jest.Mocked<typeof net>;

describe('PortManager', () => {
  let portManager: PortManager;

  beforeEach(() => {
    jest.clearAllMocks();
    portManager = new PortManager();
  });

  describe('isPortOccupied', () => {
    it('should return false when port is available', async () => {
      const mockServer = {
        listen: jest.fn((port: number, callback: () => void) => {
          callback();
        }),
        close: jest.fn(),
        once: jest.fn((event: string, callback: () => void) => {
          if (event === 'close') callback();
        }),
        on: jest.fn(),
      };

      mockNet.createServer.mockReturnValueOnce(mockServer as any);

      const result = await portManager.isPortOccupied(3000);

      expect(result).toBe(false);
      expect(mockServer.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    });

    it('should return true when port is occupied', async () => {
      const mockServer = {
        listen: jest.fn(),
        close: jest.fn(),
        once: jest.fn(),
        on: jest.fn((event: string, callback: () => void) => {
          if (event === 'error') callback();
        }),
      };

      mockNet.createServer.mockReturnValueOnce(mockServer as any);

      const result = await portManager.isPortOccupied(3000);

      expect(result).toBe(true);
    });
  });

  describe('findAvailablePort', () => {
    it('should find an available port in the given range', async () => {
      // Mock the first port as occupied, second as available
      const mockServer1 = {
        listen: jest.fn(),
        close: jest.fn(),
        once: jest.fn(),
        on: jest.fn((event: string, callback: () => void) => {
          if (event === 'error') callback();
        }),
      };

      const mockServer2 = {
        listen: jest.fn((port: number, callback: () => void) => {
          callback();
        }),
        close: jest.fn(),
        once: jest.fn((event: string, callback: () => void) => {
          if (event === 'close') callback();
        }),
        on: jest.fn(),
      };

      mockNet.createServer
        .mockReturnValueOnce(mockServer1 as any)
        .mockReturnValueOnce(mockServer2 as any);

      const port = await portManager.findAvailablePort(3000, 3010);

      expect(port).toBe(3001);
    });

    it('should throw error when no ports are available', async () => {
      const mockServer = {
        listen: jest.fn(),
        close: jest.fn(),
        once: jest.fn(),
        on: jest.fn((event: string, callback: () => void) => {
          if (event === 'error') callback();
        }),
      };

      mockNet.createServer.mockReturnValue(mockServer as any);

      await expect(portManager.findAvailablePort(3000, 3000))
        .rejects.toThrow('No available ports found in range 3000-3000');
    });
  });

  describe('getPortStatus', () => {
    it('should return correct status for occupied port', async () => {
      const mockServer = {
        listen: jest.fn(),
        close: jest.fn(),
        once: jest.fn(),
        on: jest.fn((event: string, callback: () => void) => {
          if (event === 'error') callback();
        }),
      };

      mockNet.createServer.mockReturnValueOnce(mockServer as any);

      // Mock getProcessInfo method to return null (simplified for testing)
      jest.spyOn(portManager as any, 'getProcessInfo').mockResolvedValueOnce(null);

      const status = await portManager.getPortStatus(3000);

      expect(status.port).toBe(3000);
      expect(status.occupied).toBe(true);
      expect(status.process).toBeNull();
    });

    it('should return correct status for available port', async () => {
      const mockServer = {
        listen: jest.fn((port: number, callback: () => void) => {
          callback();
        }),
        close: jest.fn(),
        once: jest.fn((event: string, callback: () => void) => {
          if (event === 'close') callback();
        }),
        on: jest.fn(),
      };

      mockNet.createServer.mockReturnValueOnce(mockServer as any);

      const status = await portManager.getPortStatus(3000);

      expect(status.port).toBe(3000);
      expect(status.occupied).toBe(false);
      expect(status.process).toBeNull();
    });
  });
});