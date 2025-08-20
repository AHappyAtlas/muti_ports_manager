"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
class ProjectManager {
    constructor() {
        this.dataDir = path_1.default.join(os_1.default.homedir(), '.muti-ports-manager');
        this.dataFile = path_1.default.join(this.dataDir, 'projects.json');
        this.ensureDataDir();
    }
    async ensureDataDir() {
        try {
            await fs_1.promises.access(this.dataDir);
        }
        catch {
            await fs_1.promises.mkdir(this.dataDir, { recursive: true });
        }
    }
    async loadProjects() {
        try {
            const data = await fs_1.promises.readFile(this.dataFile, 'utf8');
            return JSON.parse(data);
        }
        catch {
            return [];
        }
    }
    async saveProjects(projects) {
        await fs_1.promises.writeFile(this.dataFile, JSON.stringify(projects, null, 2), 'utf8');
    }
    async addProject(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('项目名称不能为空');
        }
        const projects = await this.loadProjects();
        if (projects.find(p => p.name === name)) {
            throw new Error(`项目 "${name}" 已存在`);
        }
        const newProject = {
            name,
            ports: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        projects.push(newProject);
        await this.saveProjects(projects);
        return newProject;
    }
    async getProjects() {
        return await this.loadProjects();
    }
    async getProject(name) {
        const projects = await this.loadProjects();
        return projects.find(p => p.name === name);
    }
    async removeProject(name) {
        const projects = await this.loadProjects();
        const filteredProjects = projects.filter(p => p.name !== name);
        if (filteredProjects.length === projects.length) {
            throw new Error(`项目 "${name}" 不存在`);
        }
        await this.saveProjects(filteredProjects);
    }
    async addPortToProject(projectName, portNumber, portName) {
        if (!Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535) {
            throw new Error('端口号必须是1-65535之间的整数');
        }
        const projects = await this.loadProjects();
        const project = projects.find(p => p.name === projectName);
        if (!project) {
            throw new Error(`项目 "${projectName}" 不存在`);
        }
        if (project.ports.find(p => p.number === portNumber)) {
            throw new Error(`项目 "${projectName}" 已包含端口 ${portNumber}`);
        }
        const newPort = {
            number: portNumber,
            name: portName || `PORT_${portNumber}`,
            createdAt: new Date().toISOString()
        };
        project.ports.push(newPort);
        project.updatedAt = new Date().toISOString();
        await this.saveProjects(projects);
        return project;
    }
    async removePortFromProject(projectName, portNumber) {
        if (!Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535) {
            throw new Error('端口号必须是1-65535之间的整数');
        }
        const projects = await this.loadProjects();
        const project = projects.find(p => p.name === projectName);
        if (!project) {
            throw new Error(`项目 "${projectName}" 不存在`);
        }
        const portIndex = project.ports.findIndex(p => p.number === portNumber);
        if (portIndex === -1) {
            throw new Error(`项目 "${projectName}" 不包含端口 ${portNumber}`);
        }
        project.ports.splice(portIndex, 1);
        project.updatedAt = new Date().toISOString();
        await this.saveProjects(projects);
        return project;
    }
    async updatePortName(projectName, portNumber, newName) {
        if (!newName || typeof newName !== 'string') {
            throw new Error('端口名称不能为空');
        }
        const projects = await this.loadProjects();
        const project = projects.find(p => p.name === projectName);
        if (!project) {
            throw new Error(`项目 "${projectName}" 不存在`);
        }
        const port = project.ports.find(p => p.number === portNumber);
        if (!port) {
            throw new Error(`项目 "${projectName}" 不包含端口 ${portNumber}`);
        }
        port.name = newName;
        project.updatedAt = new Date().toISOString();
        await this.saveProjects(projects);
        return project;
    }
    async updateProject(projectName, updates) {
        const projects = await this.loadProjects();
        const project = projects.find(p => p.name === projectName);
        if (!project) {
            throw new Error(`项目 "${projectName}" 不存在`);
        }
        Object.assign(project, updates, { updatedAt: new Date().toISOString() });
        await this.saveProjects(projects);
        return project;
    }
    async getProjectsByPort(portNumber) {
        const projects = await this.loadProjects();
        return projects.filter(p => p.ports.find(port => port.number === portNumber));
    }
    async getPortsByProject(projectName) {
        const project = await this.getProject(projectName);
        return project ? project.ports : [];
    }
    async getPortByName(projectName, portName) {
        const project = await this.getProject(projectName);
        return project?.ports.find(p => p.name === portName);
    }
}
exports.ProjectManager = ProjectManager;
//# sourceMappingURL=project-manager.js.map