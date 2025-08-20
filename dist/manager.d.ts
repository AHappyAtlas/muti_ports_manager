declare class MutiPortsManager {
    private program;
    private portManager;
    private projectManager;
    private envManager;
    constructor();
    private setupCommands;
    private addProject;
    private addPort;
    private removeProject;
    private removePort;
    private updatePortName;
    private checkPort;
    private killPort;
    private listProjects;
    private addToEnv;
    private removeFromEnv;
    private listEnv;
    private displayProject;
    run(): void;
}
export { MutiPortsManager };
//# sourceMappingURL=manager.d.ts.map