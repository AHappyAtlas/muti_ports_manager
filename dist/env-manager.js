"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvManager = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class EnvManager {
    constructor(projectManager) {
        this.projectManager = projectManager;
    }
    async addPortToEnv(options) {
        const { projectName, envFile, portName } = options;
        if (!portName) {
            throw new Error('端口名称不能为空');
        }
        // 确定项目名称
        let targetProjectName = projectName;
        if (!targetProjectName) {
            const currentDir = path_1.default.basename(process.cwd());
            const project = await this.projectManager.getProject(currentDir);
            if (!project) {
                throw new Error(`当前目录 "${currentDir}" 不是已知项目，请指定项目名称`);
            }
            targetProjectName = currentDir;
        }
        // 获取项目信息
        const project = await this.projectManager.getProject(targetProjectName);
        if (!project) {
            throw new Error(`项目 "${targetProjectName}" 不存在`);
        }
        // 查找端口
        const port = project.ports.find(p => p.name === portName);
        if (!port) {
            throw new Error(`项目 "${targetProjectName}" 中不存在名称为 "${portName}" 的端口`);
        }
        // 确定.env文件路径
        let targetEnvFile = envFile;
        if (!targetEnvFile) {
            targetEnvFile = path_1.default.join(process.cwd(), '.env');
        }
        // 检查.env文件是否存在
        let envContent = '';
        try {
            envContent = await fs_1.promises.readFile(targetEnvFile, 'utf8');
        }
        catch {
            // 文件不存在，创建新文件
            envContent = '';
        }
        // 生成环境变量名（全大写）
        const envVarName = portName.toUpperCase();
        const envVarValue = port.number.toString();
        // 检查是否已存在
        const lines = envContent.split('\n');
        let found = false;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith(`${envVarName}=`)) {
                lines[i] = `${envVarName}=${envVarValue}`;
                found = true;
                break;
            }
        }
        if (!found) {
            // 添加新的环境变量
            if (envContent && !envContent.endsWith('\n')) {
                envContent += '\n';
            }
            envContent += `${envVarName}=${envVarValue}\n`;
        }
        else {
            // 更新现有环境变量
            envContent = lines.join('\n');
        }
        // 写入文件
        await fs_1.promises.writeFile(targetEnvFile, envContent, 'utf8');
    }
    async removePortFromEnv(options) {
        const { projectName, envFile, portName } = options;
        if (!portName) {
            throw new Error('端口名称不能为空');
        }
        // 确定.env文件路径
        let targetEnvFile = envFile;
        if (!targetEnvFile) {
            targetEnvFile = path_1.default.join(process.cwd(), '.env');
        }
        // 检查.env文件是否存在
        try {
            const envContent = await fs_1.promises.readFile(targetEnvFile, 'utf8');
            const lines = envContent.split('\n');
            const envVarName = portName.toUpperCase();
            // 过滤掉匹配的环境变量
            const filteredLines = lines.filter(line => {
                const trimmedLine = line.trim();
                return !trimmedLine.startsWith(`${envVarName}=`);
            });
            // 写入更新后的内容
            await fs_1.promises.writeFile(targetEnvFile, filteredLines.join('\n'), 'utf8');
        }
        catch (error) {
            throw new Error(`无法读取或写入.env文件: ${error.message}`);
        }
    }
    async listEnvPorts(envFile) {
        let targetEnvFile = envFile;
        if (!targetEnvFile) {
            targetEnvFile = path_1.default.join(process.cwd(), '.env');
        }
        try {
            const envContent = await fs_1.promises.readFile(targetEnvFile, 'utf8');
            const lines = envContent.split('\n');
            const portVars = [];
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes('=')) {
                    const [name, value] = trimmedLine.split('=', 2);
                    if (name && value) {
                        portVars.push({ name, value });
                    }
                }
            }
            return portVars;
        }
        catch (error) {
            return [];
        }
    }
}
exports.EnvManager = EnvManager;
//# sourceMappingURL=env-manager.js.map