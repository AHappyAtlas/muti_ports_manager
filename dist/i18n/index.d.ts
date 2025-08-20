import { Language } from '../types';
export interface I18nConfig {
    language: Language;
    fallbackLanguage: Language;
}
export declare class I18nManager {
    private static instance;
    private currentLanguage;
    private fallbackLanguage;
    private constructor();
    static getInstance(): I18nManager;
    private loadLanguageFromConfig;
    private detectSystemLanguage;
    setLanguage(language: Language): void;
    getLanguage(): Language;
    t(key: string, params?: Record<string, string | number>): string;
    private getMessages;
}
export declare const i18n: I18nManager;
//# sourceMappingURL=index.d.ts.map