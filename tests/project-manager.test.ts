import { jest } from '@jest/globals';

// Mock dependencies before importing
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    access: jest.fn(),
    mkdir: jest.fn(),
  },
}));

jest.mock('../src/i18n', () => ({
  i18n: {
    t: jest.fn((key: string, params?: Record<string, string | number>) => {
      // Simple mock translation
      const translations: Record<string, string> = {
        'error.project-name-empty': 'Project name cannot be empty',
        'error.project-already-exists': 'Project "{name}" already exists',
        'error.project-not-found': 'Project "{name}" does not exist',
        'error.port-invalid': 'Port number must be an integer between 1-65535',
        'error.port-already-exists': 'Project "{project}" already contains port {port}',
        'error.port-not-exists': 'Project "{project}" does not contain port {port}',
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

import { ProjectManager } from '../src/project-manager';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

const mockFs = fs as jest.Mocked<typeof fs>;

describe('ProjectManager', () => {
  let projectManager: ProjectManager;
  const mockDataDir = path.join(os.homedir(), '.muti-ports-manager');
  const mockDataFile = path.join(mockDataDir, 'projects.json');

  beforeEach(() => {
    jest.clearAllMocks();
    projectManager = new ProjectManager();
  });

  describe('addProject', () => {
    it('should add a new project successfully', async () => {
      // Mock empty projects file
      mockFs.readFile.mockRejectedValueOnce(new Error('File not found'));
      mockFs.writeFile.mockResolvedValueOnce();

      const project = await projectManager.addProject('test-project');

      expect(project.name).toBe('test-project');
      expect(project.ports).toEqual([]);
      expect(project.createdAt).toBeDefined();
      expect(project.updatedAt).toBeDefined();
      expect(mockFs.writeFile).toHaveBeenCalledTimes(1);
    });

    it('should throw error for empty project name', async () => {
      await expect(projectManager.addProject('')).rejects.toThrow('Project name cannot be empty');
    });

    it('should throw error for duplicate project name', async () => {
      const existingProjects = [
        {
          name: 'existing-project',
          ports: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      mockFs.readFile.mockResolvedValueOnce(JSON.stringify(existingProjects));

      await expect(projectManager.addProject('existing-project'))
        .rejects.toThrow('Project "existing-project" already exists');
    });
  });

  describe('addPortToProject', () => {
    it('should add a port to an existing project', async () => {
      const existingProjects = [
        {
          name: 'test-project',
          ports: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      mockFs.readFile.mockResolvedValueOnce(JSON.stringify(existingProjects));
      mockFs.writeFile.mockResolvedValueOnce();

      const project = await projectManager.addPortToProject('test-project', 3000, 'API_PORT');

      expect(project.ports).toHaveLength(1);
      expect(project.ports[0].number).toBe(3000);
      expect(project.ports[0].name).toBe('API_PORT');
    });

    it('should throw error for invalid port number', async () => {
      await expect(projectManager.addPortToProject('test-project', 0))
        .rejects.toThrow('Port number must be an integer between 1-65535');

      await expect(projectManager.addPortToProject('test-project', 70000))
        .rejects.toThrow('Port number must be an integer between 1-65535');
    });

    it('should throw error for non-existent project', async () => {
      mockFs.readFile.mockResolvedValueOnce(JSON.stringify([]));

      await expect(projectManager.addPortToProject('non-existent', 3000))
        .rejects.toThrow('Project "non-existent" does not exist');
    });
  });

  describe('loadProjects', () => {
    it('should return empty array when file does not exist', async () => {
      mockFs.readFile.mockRejectedValueOnce(new Error('File not found'));

      const projects = await projectManager.loadProjects();

      expect(projects).toEqual([]);
    });

    it('should parse and return projects from file', async () => {
      const mockProjects = [
        {
          name: 'project1',
          ports: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockProjects));

      const projects = await projectManager.loadProjects();

      expect(projects).toEqual(mockProjects);
    });
  });
});