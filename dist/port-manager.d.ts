import { ProcessInfo, PortStatus } from './types';
export declare class PortManager {
    private isWindows;
    private isMac;
    private isLinux;
    constructor();
    isPortOccupied(port: number): Promise<boolean>;
    getProcessInfo(port: number): Promise<ProcessInfo | null>;
    private getProcessInfoWindows;
    private getProcessInfoUnix;
    private getProcessNameByPid;
    killProcess(port: number): Promise<boolean>;
    private killProcessWindows;
    private killProcessUnix;
    findAvailablePort(startPort?: number, endPort?: number): Promise<number>;
    getPortStatus(port: number): Promise<PortStatus>;
}
//# sourceMappingURL=port-manager.d.ts.map