import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { Project, Port } from './types';

export class ProjectManager {
  private dataDir: string;
  private dataFile: string;

  constructor() {
    this.dataDir = path.join(os.homedir(), '.muti-ports-manager');
    this.dataFile = path.join(this.dataDir, 'projects.json');
    this.ensureDataDir();
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  async loadProjects(): Promise<Project[]> {
    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private async saveProjects(projects: Project[]): Promise<void> {
    await fs.writeFile(this.dataFile, JSON.stringify(projects, null, 2), 'utf8');
  }

  async addProject(name: string): Promise<Project> {
    if (!name || typeof name !== 'string') {
      throw new Error('项目名称不能为空');
    }

    const projects = await this.loadProjects();
    
    if (projects.find(p => p.name === name)) {
      throw new Error(`项目 "${name}" 已存在`);
    }

    const newProject: Project = {
      name,
      ports: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(newProject);
    await this.saveProjects(projects);
    
    return newProject;
  }

  async getProjects(): Promise<Project[]> {
    return await this.loadProjects();
  }

  async getProject(name: string): Promise<Project | undefined> {
    const projects = await this.loadProjects();
    return projects.find(p => p.name === name);
  }

  async removeProject(name: string): Promise<void> {
    const projects = await this.loadProjects();
    const filteredProjects = projects.filter(p => p.name !== name);
    
    if (filteredProjects.length === projects.length) {
      throw new Error(`项目 "${name}" 不存在`);
    }

    await this.saveProjects(filteredProjects);
  }

  async addPortToProject(projectName: string, portNumber: number, portName?: string): Promise<Project> {
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

    const newPort: Port = {
      number: portNumber,
      name: portName || `PORT_${portNumber}`,
      createdAt: new Date().toISOString()
    };

    project.ports.push(newPort);
    project.updatedAt = new Date().toISOString();
    
    await this.saveProjects(projects);
    
    return project;
  }

  async removePortFromProject(projectName: string, portNumber: number): Promise<Project> {
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

  async updatePortName(projectName: string, portNumber: number, newName: string): Promise<Project> {
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

  async updateProject(projectName: string, updates: Partial<Project>): Promise<Project> {
    const projects = await this.loadProjects();
    const project = projects.find(p => p.name === projectName);
    
    if (!project) {
      throw new Error(`项目 "${projectName}" 不存在`);
    }

    Object.assign(project, updates, { updatedAt: new Date().toISOString() });
    
    await this.saveProjects(projects);
    
    return project;
  }

  async getProjectsByPort(portNumber: number): Promise<Project[]> {
    const projects = await this.loadProjects();
    return projects.filter(p => p.ports.find(port => port.number === portNumber));
  }

  async getPortsByProject(projectName: string): Promise<Port[]> {
    const project = await this.getProject(projectName);
    return project ? project.ports : [];
  }

  async getPortByName(projectName: string, portName: string): Promise<Port | undefined> {
    const project = await this.getProject(projectName);
    return project?.ports.find(p => p.name === portName);
  }
}
