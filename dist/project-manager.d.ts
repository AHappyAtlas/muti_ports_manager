import { Project, Port } from './types';
export declare class ProjectManager {
    private dataDir;
    private dataFile;
    constructor();
    private ensureDataDir;
    loadProjects(): Promise<Project[]>;
    private saveProjects;
    addProject(name: string): Promise<Project>;
    getProjects(): Promise<Project[]>;
    getProject(name: string): Promise<Project | undefined>;
    removeProject(name: string): Promise<void>;
    addPortToProject(projectName: string, portNumber: number, portName?: string): Promise<Project>;
    removePortFromProject(projectName: string, portNumber: number): Promise<Project>;
    updatePortName(projectName: string, portNumber: number, newName: string): Promise<Project>;
    updateProject(projectName: string, updates: Partial<Project>): Promise<Project>;
    getProjectsByPort(portNumber: number): Promise<Project[]>;
    getPortsByProject(projectName: string): Promise<Port[]>;
    getPortByName(projectName: string, portName: string): Promise<Port | undefined>;
}
//# sourceMappingURL=project-manager.d.ts.map