import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { Project, Port } from './types';
import { i18n } from './i18n';

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
      throw new Error(i18n.t('error.project-name-empty'));
    }

    const projects = await this.loadProjects();
    
    if (projects.find(p => p.name === name)) {
      throw new Error(i18n.t('error.project-already-exists', { name }));
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
      throw new Error(i18n.t('error.project-not-found', { name }));
    }

    await this.saveProjects(filteredProjects);
  }

  async addPortToProject(projectName: string, portNumber: number, portName?: string): Promise<Project> {
    if (!Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535) {
      throw new Error(i18n.t('error.port-invalid'));
    }

    const projects = await this.loadProjects();
    const project = projects.find(p => p.name === projectName);
    
    if (!project) {
      throw new Error(i18n.t('error.project-not-found', { name: projectName }));
    }

    if (project.ports.find(p => p.number === portNumber)) {
      throw new Error(i18n.t('error.port-already-exists', { project: projectName, port: portNumber }));
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
      throw new Error(i18n.t('error.port-invalid'));
    }

    const projects = await this.loadProjects();
    const project = projects.find(p => p.name === projectName);
    
    if (!project) {
      throw new Error(i18n.t('error.project-not-found', { name: projectName }));
    }

    const portIndex = project.ports.findIndex(p => p.number === portNumber);
    if (portIndex === -1) {
      throw new Error(i18n.t('error.port-not-exists', { project: projectName, port: portNumber }));
    }

    project.ports.splice(portIndex, 1);
    project.updatedAt = new Date().toISOString();
    
    await this.saveProjects(projects);
    
    return project;
  }

  async updatePortName(projectName: string, portNumber: number, newName: string): Promise<Project> {
    if (!newName || typeof newName !== 'string') {
      throw new Error(i18n.t('error.port-name-empty'));
    }

    const projects = await this.loadProjects();
    const project = projects.find(p => p.name === projectName);
    
    if (!project) {
      throw new Error(i18n.t('error.project-not-found', { name: projectName }));
    }

    const port = project.ports.find(p => p.number === portNumber);
    if (!port) {
      throw new Error(i18n.t('error.port-not-exists', { project: projectName, port: portNumber }));
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
      throw new Error(i18n.t('error.project-not-found', { name: projectName }));
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
