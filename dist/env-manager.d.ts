import { ProjectManager } from './project-manager';
import { EnvFileOptions } from './types';
export declare class EnvManager {
    private projectManager;
    constructor(projectManager: ProjectManager);
    addPortToEnv(options: EnvFileOptions): Promise<void>;
    removePortFromEnv(options: EnvFileOptions): Promise<void>;
    listEnvPorts(envFile?: string): Promise<{
        name: string;
        value: string;
    }[]>;
}
//# sourceMappingURL=env-manager.d.ts.map