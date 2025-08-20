import { Language } from '../types';
export interface LanguageConfig {
    language: Language;
    fallbackLanguage: Language;
}
export declare class LanguageConfigManager {
    private static instance;
    private configPath;
    private config;
    private constructor();
    static getInstance(): LanguageConfigManager;
    private loadConfig;
    saveConfig(): void;
    getLanguage(): Language;
    setLanguage(language: Language): void;
    getFallbackLanguage(): Language;
    setFallbackLanguage(language: Language): void;
    getConfig(): LanguageConfig;
}
export declare const languageConfig: LanguageConfigManager;
//# sourceMappingURL=config.d.ts.map