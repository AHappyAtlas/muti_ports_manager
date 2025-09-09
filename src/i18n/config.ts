import fs from 'fs';
import path from 'path';
import os from 'os';
import { Language } from '../types';

export interface LanguageConfig {
  language: Language;
  fallbackLanguage: Language;
}

export class LanguageConfigManager {
  private static instance: LanguageConfigManager;
  private configPath: string;
  private config: LanguageConfig;

  private constructor() {
    this.configPath = path.join(os.homedir(), '.muti-ports-manager', 'language.json');
    this.config = this.loadConfig();
  }

  public static getInstance(): LanguageConfigManager {
    if (!LanguageConfigManager.instance) {
      LanguageConfigManager.instance = new LanguageConfigManager();
    }
    return LanguageConfigManager.instance;
  }

  private loadConfig(): LanguageConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf8');
        const config = JSON.parse(configData);
        return {
          language: config.language || 'en',
          fallbackLanguage: config.fallbackLanguage || 'en'
        };
      }
    } catch {
      console.warn('Failed to load language config, using default');
    }

    return {
      language: 'en',
      fallbackLanguage: 'en'
    };
  }

  public saveConfig(): void {
    try {
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.warn('Failed to save language config:', error);
    }
  }

  public getLanguage(): Language {
    return this.config.language;
  }

  public setLanguage(language: Language): void {
    this.config.language = language;
    this.saveConfig();
  }

  public getFallbackLanguage(): Language {
    return this.config.fallbackLanguage;
  }

  public setFallbackLanguage(language: Language): void {
    this.config.fallbackLanguage = language;
    this.saveConfig();
  }

  public getConfig(): LanguageConfig {
    return { ...this.config };
  }
}

export const languageConfig = LanguageConfigManager.getInstance();
