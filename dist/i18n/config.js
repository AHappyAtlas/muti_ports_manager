"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageConfig = exports.LanguageConfigManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
class LanguageConfigManager {
    constructor() {
        this.configPath = path_1.default.join(os_1.default.homedir(), '.muti-ports-manager', 'language.json');
        this.config = this.loadConfig();
    }
    static getInstance() {
        if (!LanguageConfigManager.instance) {
            LanguageConfigManager.instance = new LanguageConfigManager();
        }
        return LanguageConfigManager.instance;
    }
    loadConfig() {
        try {
            if (fs_1.default.existsSync(this.configPath)) {
                const configData = fs_1.default.readFileSync(this.configPath, 'utf8');
                const config = JSON.parse(configData);
                return {
                    language: config.language || 'en',
                    fallbackLanguage: config.fallbackLanguage || 'en'
                };
            }
        }
        catch {
            console.warn('Failed to load language config, using default');
        }
        return {
            language: 'en',
            fallbackLanguage: 'en'
        };
    }
    saveConfig() {
        try {
            const configDir = path_1.default.dirname(this.configPath);
            if (!fs_1.default.existsSync(configDir)) {
                fs_1.default.mkdirSync(configDir, { recursive: true });
            }
            fs_1.default.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        }
        catch (error) {
            console.warn('Failed to save language config:', error);
        }
    }
    getLanguage() {
        return this.config.language;
    }
    setLanguage(language) {
        this.config.language = language;
        this.saveConfig();
    }
    getFallbackLanguage() {
        return this.config.fallbackLanguage;
    }
    setFallbackLanguage(language) {
        this.config.fallbackLanguage = language;
        this.saveConfig();
    }
    getConfig() {
        return { ...this.config };
    }
}
exports.LanguageConfigManager = LanguageConfigManager;
exports.languageConfig = LanguageConfigManager.getInstance();
//# sourceMappingURL=config.js.map