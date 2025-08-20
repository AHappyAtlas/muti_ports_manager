import { Language } from '../types';
import { languageConfig } from './config';

export interface I18nConfig {
  language: Language;
  fallbackLanguage: Language;
}

export class I18nManager {
  private static instance: I18nManager;
  private currentLanguage: Language = 'en';
  private fallbackLanguage: Language = 'en';

  private constructor() {
    this.loadLanguageFromConfig();
  }

  public static getInstance(): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager();
    }
    return I18nManager.instance;
  }

  private loadLanguageFromConfig(): void {
    // 首先尝试从配置文件加载
    const config = languageConfig.getConfig();
    this.currentLanguage = config.language;
    this.fallbackLanguage = config.fallbackLanguage;

    // 如果没有配置或配置无效，则检测系统语言
    if (!this.currentLanguage || (this.currentLanguage !== 'en' && this.currentLanguage !== 'zh')) {
      this.detectSystemLanguage();
    }
  }

  private detectSystemLanguage(): void {
    // 检测系统语言
    const systemLang = process.env.LANG || process.env.LANGUAGE || 'en';
    if (systemLang.startsWith('zh')) {
      this.currentLanguage = 'zh';
      languageConfig.setLanguage('zh');
    } else {
      this.currentLanguage = 'en';
      languageConfig.setLanguage('en');
    }
  }

  public setLanguage(language: Language): void {
    this.currentLanguage = language;
    languageConfig.setLanguage(language);
  }

  public getLanguage(): Language {
    return this.currentLanguage;
  }

  public t(key: string, params?: Record<string, string | number>): string {
    const messages = this.getMessages();
    let message = messages[key] || key;

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        message = message.replace(new RegExp(`{${param}}`, 'g'), String(value));
      });
    }

    return message;
  }

  private getMessages(): Record<string, string> {
    switch (this.currentLanguage) {
      case 'zh':
        return zhMessages;
      case 'en':
      default:
        return enMessages;
    }
  }
}

// 英文消息
const enMessages: Record<string, string> = {
  // CLI 描述
  'cli.description': 'Multi-Port Manager - Manage ports for multiple projects',
  'cli.version': '1.0.0',
  
  // 命令描述
  'command.add-project.description': 'Add a new project',
  'command.add-port.description': 'Add a port to a project',
  'command.remove-project.description': 'Remove a project',
  'command.remove-port.description': 'Remove a port from a project',
  'command.update-port-name.description': 'Update port name',
  'command.check-port.description': 'Check port occupancy',
  'command.kill-port.description': 'Kill process occupying the specified port',
  'command.list.description': 'List all projects and ports',
  'command.add-to-env.description': 'Add port to .env file',
  'command.remove-from-env.description': 'Remove port from .env file',
  'command.list-env.description': 'List port variables in .env file',
  
  // 选项描述
  'option.name': 'Project name',
  'option.project': 'Project name',
  'option.port': 'Port number',
  'option.port-name': 'Port name',
  'option.env-file': '.env file path',
  
  // 交互提示
  'prompt.project-name': 'Enter project name:',
  'prompt.select-project': 'Select project:',
  'prompt.port-number': 'Enter port number:',
  'prompt.port-name': 'Enter port name:',
  'prompt.new-port-name': 'Enter new port name:',
  'prompt.confirm-delete-project': 'Are you sure you want to delete project "{name}"? This will remove all related port information.',
  'prompt.confirm-kill-process': 'Are you sure you want to kill this process?',
  'prompt.continue-add-port': 'Do you still want to add this port?',
  
  // 验证消息
  'validation.port-range': 'Port number must be between 1-65535',
  
  // 成功消息
  'success.project-added': '✅ Project "{name}" added successfully!',
  'success.port-added': '✅ Port {port} ({name}) has been added to project "{project}"',
  'success.project-removed': '✅ Project "{name}" removed successfully!',
  'success.port-removed': '✅ Port {port} has been removed from project "{project}"',
  'success.port-name-updated': '✅ Port {port} name has been updated to "{name}"',
  'success.port-killed': '✅ Process on port {port} has been killed',
  'success.port-added-to-env': '✅ Port "{name}" has been added to .env file',
  'success.port-removed-from-env': '✅ Port "{name}" has been removed from .env file',
  
  // 警告消息
  'warning.no-projects': '⚠️  No projects yet, please add a project first',
  'warning.no-projects-to-delete': '⚠️  No projects to delete',
  'warning.no-projects-general': '⚠️  No projects',
  'warning.project-no-ports': '⚠️  Project "{name}" has no ports',
  'warning.port-occupied': '⚠️  Port {port} is already occupied',
  'warning.port-not-occupied': '⚠️  Port {port} is not occupied',
  'warning.no-env-ports': '⚠️  No port variables in .env file',
  
  // 错误消息
  'error.add-project-failed': '❌ Failed to add project: {message}',
  'error.add-port-failed': '❌ Failed to add port: {message}',
  'error.remove-project-failed': '❌ Failed to remove project: {message}',
  'error.remove-port-failed': '❌ Failed to remove port: {message}',
  'error.update-port-name-failed': '❌ Failed to update port name: {message}',
  'error.check-port-failed': '❌ Failed to check port: {message}',
  'error.kill-port-failed': '❌ Failed to kill process: {message}',
  'error.list-projects-failed': '❌ Failed to list projects: {message}',
  'error.add-to-env-failed': '❌ Failed to add to .env file: {message}',
  'error.remove-from-env-failed': '❌ Failed to remove from .env file: {message}',
  'error.list-env-failed': '❌ Failed to list .env file: {message}',
  'error.project-not-found': '❌ Project "{name}" does not exist',
  
  // 信息消息
  'info.port-occupied': '❌ Port {port} is occupied',
  'info.port-available': '✅ Port {port} is available',
  'info.process-info': '   Process info: {name} (PID: {pid})',
  'info.process-name': '   Process name: {name}',
  'info.process-id': '   Process ID: {pid}',
  'info.command-line': '   Command line: {cmd}',
  'info.killing-process': '⚠️  About to kill process: {name} (PID: {pid})',
  'info.all-projects': '📋 All projects:',
  'info.env-ports': '📋 Port variables in .env file:',
  'info.no-projects': '📝 No projects yet',
  
  // 显示格式
  'display.project': '📁 Project: {name}',
  'display.no-ports': '   No ports',
  'display.ports': '   Ports:',
  'display.port-item': '     - {port} ({name})',
  'display.env-port-item': '   {name}={value}',
  
  // 语言相关
  'language.current': 'Current language: {language}',
  'language.available': 'Available languages: en, zh',
  'language.set': 'Language set to: {language}',
};

// 中文消息
const zhMessages: Record<string, string> = {
  // CLI 描述
  'cli.description': '多端口管理器 - 管理多个项目的端口',
  'cli.version': '1.0.0',
  
  // 命令描述
  'command.add-project.description': '添加新项目',
  'command.add-port.description': '添加端口到项目',
  'command.remove-project.description': '删除项目',
  'command.remove-port.description': '从项目中删除端口',
  'command.update-port-name.description': '更新端口名称',
  'command.check-port.description': '检查端口占用情况',
  'command.kill-port.description': '结束占用指定端口的进程',
  'command.list.description': '列出所有项目和端口',
  'command.add-to-env.description': '将端口添加到.env文件',
  'command.remove-from-env.description': '从.env文件移除端口',
  'command.list-env.description': '列出.env文件中的端口变量',
  
  // 选项描述
  'option.name': '项目名称',
  'option.project': '项目名称',
  'option.port': '端口号',
  'option.port-name': '端口名称',
  'option.env-file': '.env文件路径',
  
  // 交互提示
  'prompt.project-name': '请输入项目名称:',
  'prompt.select-project': '选择项目:',
  'prompt.port-number': '请输入端口号:',
  'prompt.port-name': '请输入端口名称:',
  'prompt.new-port-name': '请输入新的端口名称:',
  'prompt.confirm-delete-project': '确定要删除项目 "{name}" 吗？这将删除所有相关端口信息。',
  'prompt.confirm-kill-process': '确定要结束此进程吗？',
  'prompt.continue-add-port': '是否仍要添加此端口？',
  
  // 验证消息
  'validation.port-range': '端口号必须在1-65535之间',
  
  // 成功消息
  'success.project-added': '✅ 项目 "{name}" 添加成功！',
  'success.port-added': '✅ 端口 {port} ({name}) 已添加到项目 "{project}"',
  'success.project-removed': '✅ 项目 "{name}" 删除成功！',
  'success.port-removed': '✅ 端口 {port} 已从项目 "{project}" 中删除',
  'success.port-name-updated': '✅ 端口 {port} 的名称已更新为 "{name}"',
  'success.port-killed': '✅ 端口 {port} 的进程已结束',
  'success.port-added-to-env': '✅ 端口 "{name}" 已添加到.env文件',
  'success.port-removed-from-env': '✅ 端口 "{name}" 已从.env文件移除',
  
  // 警告消息
  'warning.no-projects': '⚠️  还没有项目，请先添加项目',
  'warning.no-projects-to-delete': '⚠️  没有项目可删除',
  'warning.no-projects-general': '⚠️  没有项目',
  'warning.project-no-ports': '⚠️  项目 "{name}" 没有端口',
  'warning.port-occupied': '⚠️  端口 {port} 已被占用',
  'warning.port-not-occupied': '⚠️  端口 {port} 未被占用',
  'warning.no-env-ports': '⚠️  .env文件中没有端口变量',
  
  // 错误消息
  'error.add-project-failed': '❌ 添加项目失败: {message}',
  'error.add-port-failed': '❌ 添加端口失败: {message}',
  'error.remove-project-failed': '❌ 删除项目失败: {message}',
  'error.remove-port-failed': '❌ 删除端口失败: {message}',
  'error.update-port-name-failed': '❌ 更新端口名称失败: {message}',
  'error.check-port-failed': '❌ 检查端口失败: {message}',
  'error.kill-port-failed': '❌ 结束进程失败: {message}',
  'error.list-projects-failed': '❌ 列出项目失败: {message}',
  'error.add-to-env-failed': '❌ 添加到.env文件失败: {message}',
  'error.remove-from-env-failed': '❌ 从.env文件移除失败: {message}',
  'error.list-env-failed': '❌ 列出.env文件失败: {message}',
  'error.project-not-found': '❌ 项目 "{name}" 不存在',
  
  // 信息消息
  'info.port-occupied': '❌ 端口 {port} 已被占用',
  'info.port-available': '✅ 端口 {port} 可用',
  'info.process-info': '   进程信息: {name} (PID: {pid})',
  'info.process-name': '   进程名称: {name}',
  'info.process-id': '   进程ID: {pid}',
  'info.command-line': '   命令行: {cmd}',
  'info.killing-process': '⚠️  即将结束进程: {name} (PID: {pid})',
  'info.all-projects': '📋 所有项目:',
  'info.env-ports': '📋 .env文件中的端口变量:',
  'info.no-projects': '📝 还没有项目',
  
  // 显示格式
  'display.project': '📁 项目: {name}',
  'display.no-ports': '   没有端口',
  'display.ports': '   端口:',
  'display.port-item': '     - {port} ({name})',
  'display.env-port-item': '   {name}={value}',
  
  // 语言相关
  'language.current': '当前语言: {language}',
  'language.available': '可用语言: en, zh',
  'language.set': '语言已设置为: {language}',
};

export const i18n = I18nManager.getInstance();
