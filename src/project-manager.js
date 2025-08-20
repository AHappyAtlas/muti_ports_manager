const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class ProjectManager {
  constructor() {
    this.dataDir = path.join(os.homedir(), '.muti-ports-manager');
    this.dataFile = path.join(this.dataDir, 'projects.json');
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  async loadProjects() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async saveProjects(projects) {
    await fs.writeFile(this.dataFile, JSON.stringify(projects, null, 2), 'utf8');
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

  async addPortToProject(projectName, port) {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('端口号必须是1-65535之间的整数');
    }

    const projects = await this.loadProjects();
    const project = projects.find(p => p.name === projectName);
    
    if (!project) {
      throw new Error(`项目 "${projectName}" 不存在`);
    }

    if (project.ports.includes(port)) {
      throw new Error(`项目 "${projectName}" 已包含端口 ${port}`);
    }

    project.ports.push(port);
    project.updatedAt = new Date().toISOString();
    
    await this.saveProjects(projects);
    
    return project;
  }

  async removePortFromProject(projectName, port) {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('端口号必须是1-65535之间的整数');
    }

    const projects = await this.loadProjects();
    const project = projects.find(p => p.name === projectName);
    
    if (!project) {
      throw new Error(`项目 "${projectName}" 不存在`);
    }

    const portIndex = project.ports.indexOf(port);
    if (portIndex === -1) {
      throw new Error(`项目 "${projectName}" 不包含端口 ${port}`);
    }

    project.ports.splice(portIndex, 1);
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

  async getProjectsByPort(port) {
    const projects = await this.loadProjects();
    return projects.filter(p => p.ports.includes(port));
  }

  async getPortsByProject(projectName) {
    const project = await this.getProject(projectName);
    return project ? project.ports : [];
  }
}

module.exports = { ProjectManager };
