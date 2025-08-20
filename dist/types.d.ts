export interface Port {
    number: number;
    name: string;
    createdAt: string;
}
export interface Project {
    name: string;
    ports: Port[];
    createdAt: string;
    updatedAt: string;
}
export interface ProcessInfo {
    pid: number;
    name: string;
    cmd: string;
}
export interface PortStatus {
    port: number;
    occupied: boolean;
    process: ProcessInfo | null;
}
export interface EnvFileOptions {
    projectName?: string;
    envFile?: string;
    portName?: string;
}
//# sourceMappingURL=types.d.ts.map