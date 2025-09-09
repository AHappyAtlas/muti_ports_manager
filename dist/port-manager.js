"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortManager = void 0;
const net_1 = __importDefault(require("net"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const ps_list_1 = __importDefault(require("ps-list"));
const i18n_1 = require("./i18n");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class PortManager {
    constructor() {
        this.isWindows = process.platform === 'win32';
        this.isMac = process.platform === 'darwin';
        this.isLinux = process.platform === 'linux';
    }
    async isPortOccupied(port) {
        return new Promise((resolve) => {
            const server = net_1.default.createServer();
            server.listen(port, () => {
                server.once('close', () => {
                    resolve(false);
                });
                server.close();
            });
            server.on('error', () => {
                resolve(true);
            });
        });
    }
    async getProcessInfo(port) {
        try {
            if (this.isWindows) {
                return await this.getProcessInfoWindows(port);
            }
            else if (this.isMac || this.isLinux) {
                return await this.getProcessInfoUnix(port);
            }
        }
        catch (error) {
            console.warn(`获取进程信息失败: ${error.message}`);
            return null;
        }
        return null;
    }
    async getProcessInfoWindows(port) {
        try {
            const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
            const lines = stdout.trim().split('\n');
            for (const line of lines) {
                if (line.includes(`:${port}`) && line.includes('LISTENING')) {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1];
                    if (pid && !isNaN(parseInt(pid))) {
                        const processInfo = await this.getProcessNameByPid(parseInt(pid));
                        return {
                            pid: parseInt(pid),
                            name: processInfo.name,
                            cmd: processInfo.cmd
                        };
                    }
                }
            }
        }
        catch (error) {
            // 忽略错误，可能端口没有被占用
        }
        return null;
    }
    async getProcessInfoUnix(port) {
        try {
            const { stdout } = await execAsync(`lsof -i :${port} -t`);
            const pids = stdout.trim().split('\n').filter(pid => pid);
            if (pids.length > 0) {
                const pid = pids[0];
                const processInfo = await this.getProcessNameByPid(parseInt(pid));
                return {
                    pid: parseInt(pid),
                    name: processInfo.name,
                    cmd: processInfo.cmd
                };
            }
        }
        catch (error) {
            // 忽略错误，可能端口没有被占用
        }
        return null;
    }
    async getProcessNameByPid(pid) {
        try {
            const processes = await (0, ps_list_1.default)();
            const process = processes.find(p => p.pid === pid);
            if (process) {
                return {
                    name: process.name,
                    cmd: process.cmd || ''
                };
            }
        }
        catch (error) {
            // 如果ps-list失败，尝试使用系统命令
            try {
                if (this.isWindows) {
                    const { stdout } = await execAsync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
                    const parts = stdout.trim().split(',');
                    if (parts.length > 0) {
                        const name = parts[0].replace(/"/g, '');
                        return { name, cmd: '' };
                    }
                }
                else {
                    const { stdout } = await execAsync(`ps -p ${pid} -o comm=`);
                    const name = stdout.trim();
                    return { name, cmd: '' };
                }
            }
            catch (cmdError) {
                // 忽略命令执行错误
            }
        }
        return { name: 'Unknown', cmd: '' };
    }
    async killProcess(port) {
        try {
            if (this.isWindows) {
                return await this.killProcessWindows(port);
            }
            else if (this.isMac || this.isLinux) {
                return await this.killProcessUnix(port);
            }
        }
        catch (error) {
            throw new Error(`终止进程失败: ${error.message}`);
        }
        return false;
    }
    async killProcessWindows(port) {
        try {
            const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
            const lines = stdout.trim().split('\n');
            for (const line of lines) {
                if (line.includes(`:${port}`) && line.includes('LISTENING')) {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1];
                    if (pid && !isNaN(parseInt(pid))) {
                        await execAsync(`taskkill /PID ${pid} /F`);
                        return true;
                    }
                }
            }
            throw new Error(`未找到占用端口 ${port} 的进程`);
        }
        catch (error) {
            throw new Error(`终止Windows进程失败: ${error.message}`);
        }
    }
    async killProcessUnix(port) {
        try {
            const { stdout } = await execAsync(`lsof -i :${port} -t`);
            const pids = stdout.trim().split('\n').filter(pid => pid);
            if (pids.length > 0) {
                for (const pid of pids) {
                    await execAsync(`kill -9 ${pid}`);
                }
                return true;
            }
            throw new Error(`未找到占用端口 ${port} 的进程`);
        }
        catch (error) {
            throw new Error(`终止Unix进程失败: ${error.message}`);
        }
    }
    async findAvailablePort(startPort = 3000, endPort = 4000) {
        for (let port = startPort; port <= endPort; port++) {
            const isOccupied = await this.isPortOccupied(port);
            if (!isOccupied) {
                return port;
            }
        }
        throw new Error(i18n_1.i18n.t('error.no-available-ports', { startPort, endPort }));
    }
    async getPortStatus(port) {
        const isOccupied = await this.isPortOccupied(port);
        if (isOccupied) {
            const processInfo = await this.getProcessInfo(port);
            return {
                port,
                occupied: true,
                process: processInfo
            };
        }
        return {
            port,
            occupied: false,
            process: null
        };
    }
}
exports.PortManager = PortManager;
//# sourceMappingURL=port-manager.js.map