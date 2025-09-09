import { jest } from '@jest/globals';

// Mock the language config before importing I18nManager
jest.mock('../src/i18n/config', () => ({
  languageConfig: {
    getConfig: jest.fn().mockReturnValue({
      language: 'en',
      fallbackLanguage: 'en'
    }),
    setLanguage: jest.fn(),
  },
}));

import { I18nManager } from '../src/i18n/index';
import { languageConfig } from '../src/i18n/config';

const mockLanguageConfig = languageConfig as jest.Mocked<typeof languageConfig>;

describe('I18nManager', () => {
  let i18nManager: I18nManager;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the config to return English by default
    mockLanguageConfig.getConfig.mockReturnValue({
      language: 'en',
      fallbackLanguage: 'en'
    });
    i18nManager = I18nManager.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = I18nManager.getInstance();
      const instance2 = I18nManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('setLanguage', () => {
    it('should set language to Chinese', () => {
      i18nManager.setLanguage('zh');
      expect(mockLanguageConfig.setLanguage).toHaveBeenCalledWith('zh');
    });

    it('should set language to English', () => {
      i18nManager.setLanguage('en');
      expect(mockLanguageConfig.setLanguage).toHaveBeenCalledWith('en');
    });
  });

  describe('getLanguage', () => {
    it('should return current language', () => {
      const language = i18nManager.getLanguage();
      expect(language).toBe('en');
    });
  });

  describe('t (translate)', () => {
    it('should translate simple key', () => {
      const result = i18nManager.t('cli.description');
      expect(result).toBe('Multi-Port Manager - Manage ports for multiple projects');
    });

    it('should return key if translation not found', () => {
      const result = i18nManager.t('non.existent.key');
      expect(result).toBe('non.existent.key');
    });

    it('should replace parameters in translation', () => {
      const result = i18nManager.t('success.project-added', { name: 'test-project' });
      expect(result).toBe('✅ Project "test-project" added successfully!');
    });

    it('should replace multiple parameters', () => {
      const result = i18nManager.t('success.port-added', { 
        port: '3000', 
        name: 'API_PORT', 
        project: 'test-project' 
      });
      expect(result).toBe('✅ Port 3000 (API_PORT) has been added to project "test-project"');
    });

    it('should handle numeric parameters', () => {
      const result = i18nManager.t('info.port-available', { port: 3000 });
      expect(result).toBe('✅ Port 3000 is available');
    });
  });

  describe('Chinese translation', () => {
    beforeEach(() => {
      mockLanguageConfig.getConfig.mockReturnValue({
        language: 'zh',
        fallbackLanguage: 'en'
      });
      i18nManager = I18nManager.getInstance();
      i18nManager.setLanguage('zh');
    });

    it('should return Chinese translation', () => {
      const result = i18nManager.t('cli.description');
      expect(result).toBe('多端口管理器 - 管理多个项目的端口');
    });
  });
});