"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutiPortsManager = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const port_manager_1 = require("./port-manager");
const project_manager_1 = require("./project-manager");
const env_manager_1 = require("./env-manager");
class MutiPortsManager {
    constructor() {
        this.program = new commander_1.Command();
        this.portManager = new port_manager_1.PortManager();
        this.projectManager = new project_manager_1.ProjectManager();
        this.envManager = new env_manager_1.EnvManager(this.projectManager);
        this.setupCommands();
    }
    setupCommands() {
        this.program
            .name('muti-ports')
            .description('多端口管理器 - 管理多个项目的端口')
            .version('1.0.0');
        // 添加项目
        this.program
            .command('add-project')
            .description('添加新项目')
            .option('-n, --name <name>', '项目名称')
            .action(async (options) => {
            await this.addProject(options);
        });
        // 添加端口到项目
        this.program
            .command('add-port')
            .description('添加端口到项目')
            .option('-p, --project <name>', '项目名称')
            .option('-P, --port <port>', '端口号')
            .option('-N, --name <name>', '端口名称')
            .action(async (options) => {
            await this.addPort(options);
        });
        // 删除项目
        this.program
            .command('remove-project')
            .description('删除项目')
            .option('-n, --name <name>', '项目名称')
            .action(async (options) => {
            await this.removeProject(options);
        });
        // 删除端口
        this.program
            .command('remove-port')
            .description('从项目中删除端口')
            .option('-p, --project <name>', '项目名称')
            .option('-P, --port <port>', '端口号')
            .action(async (options) => {
            await this.removePort(options);
        });
        // 更新端口名称
        this.program
            .command('update-port-name')
            .description('更新端口名称')
            .option('-p, --project <name>', '项目名称')
            .option('-P, --port <port>', '端口号')
            .option('-N, --name <name>', '新的端口名称')
            .action(async (options) => {
            await this.updatePortName(options);
        });
        // 查看端口占用
        this.program
            .command('check-port')
            .description('检查端口占用情况')
            .argument('<port>', '端口号')
            .action(async (port) => {
            await this.checkPort(port);
        });
        // 结束占用端口的进程
        this.program
            .command('kill-port')
            .description('结束占用指定端口的进程')
            .argument('<port>', '端口号')
            .action(async (port) => {
            await this.killPort(port);
        });
        // 列出所有项目和端口
        this.program
            .command('list')
            .description('列出所有项目和端口')
            .option('-p, --project <name>', '只显示指定项目')
            .action(async (options) => {
            await this.listProjects(options);
        });
        // 添加端口到.env文件
        this.program
            .command('add-to-env')
            .description('将端口添加到.env文件')
            .option('-p, --project <name>', '项目名称')
            .option('-e, --env-file <path>', '.env文件路径')
            .option('-n, --name <name>', '端口名称')
            .action(async (options) => {
            await this.addToEnv(options);
        });
        // 从.env文件移除端口
        this.program
            .command('remove-from-env')
            .description('从.env文件移除端口')
            .option('-e, --env-file <path>', '.env文件路径')
            .option('-n, --name <name>', '端口名称')
            .action(async (options) => {
            await this.removeFromEnv(options);
        });
        // 列出.env文件中的端口
        this.program
            .command('list-env')
            .description('列出.env文件中的端口变量')
            .option('-e, --env-file <path>', '.env文件路径')
            .action(async (options) => {
            await this.listEnv(options);
        });
        // 默认命令
        this.program
            .command('*')
            .action(() => {
            this.program.help();
        });
    }
    async addProject(options) {
        try {
            let projectName = options.name;
            if (!projectName) {
                const currentDir = path_1.default.basename(process.cwd());
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'projectName',
                        message: '请输入项目名称:',
                        default: currentDir
                    }
                ]);
                projectName = answer.projectName;
            }
            if (projectName) {
                await this.projectManager.addProject(projectName);
                console.log(chalk_1.default.green(`✅ 项目 "${projectName}" 添加成功！`));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ 添加项目失败: ${error.message}`));
        }
    }
    async addPort(options) {
        try {
            let projectName = options.project;
            let portNumber = options.port;
            let portName = options.name;
            if (!projectName) {
                const projects = await this.projectManager.getProjects();
                if (projects.length === 0) {
                    console.log(chalk_1.default.yellow('⚠️  还没有项目，请先添加项目'));
                    return;
                }
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'list',
                        name: 'projectName',
                        message: '选择项目:',
                        choices: projects.map(p => p.name)
                    }
                ]);
                projectName = answer.projectName;
            }
            if (!portNumber) {
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'port',
                        message: '请输入端口号:',
                        validate: (input) => {
                            const portNum = parseInt(input);
                            return (portNum >= 1 && portNum <= 65535) ? true : '端口号必须在1-65535之间';
                        }
                    }
                ]);
                portNumber = answer.port;
            }
            if (!portName) {
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'portName',
                        message: '请输入端口名称:',
                        default: `PORT_${portNumber}`
                    }
                ]);
                portName = answer.portName;
            }
            if (portNumber && projectName) {
                const port = parseInt(portNumber);
                // 检查端口是否被占用
                const isOccupied = await this.portManager.isPortOccupied(port);
                if (isOccupied) {
                    console.log(chalk_1.default.yellow(`⚠️  端口 ${port} 已被占用`));
                    const processInfo = await this.portManager.getProcessInfo(port);
                    if (processInfo) {
                        console.log(chalk_1.default.cyan(`   进程信息: ${processInfo.name} (PID: ${processInfo.pid})`));
                    }
                    const answer = await inquirer_1.default.prompt([
                        {
                            type: 'confirm',
                            name: 'continue',
                            message: '是否仍要添加此端口？',
                            default: false
                        }
                    ]);
                    if (!answer.continue) {
                        return;
                    }
                }
                await this.projectManager.addPortToProject(projectName, port, portName);
                console.log(chalk_1.default.green(`✅ 端口 ${port} (${portName}) 已添加到项目 "${projectName}"`));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ 添加端口失败: ${error.message}`));
        }
    }
    async removeProject(options) {
        try {
            let projectName = options.name;
            if (!projectName) {
                const projects = await this.projectManager.getProjects();
                if (projects.length === 0) {
                    console.log(chalk_1.default.yellow('⚠️  没有项目可删除'));
                    return;
                }
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'list',
                        name: 'projectName',
                        message: '选择要删除的项目:',
                        choices: projects.map(p => p.name)
                    }
                ]);
                projectName = answer.projectName;
            }
            const confirm = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: `确定要删除项目 "${projectName}" 吗？这将删除所有相关端口信息。`,
                    default: false
                }
            ]);
            if (confirm.confirm && projectName) {
                await this.projectManager.removeProject(projectName);
                console.log(chalk_1.default.green(`✅ 项目 "${projectName}" 删除成功！`));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ 删除项目失败: ${error.message}`));
        }
    }
    async removePort(options) {
        try {
            let projectName = options.project;
            let portNumber = options.port;
            if (!projectName) {
                const projects = await this.projectManager.getProjects();
                if (projects.length === 0) {
                    console.log(chalk_1.default.yellow('⚠️  没有项目'));
                    return;
                }
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'list',
                        name: 'projectName',
                        message: '选择项目:',
                        choices: projects.map(p => p.name)
                    }
                ]);
                projectName = answer.projectName;
            }
            if (!portNumber) {
                if (projectName) {
                    const project = await this.projectManager.getProject(projectName);
                    if (!project || project.ports.length === 0) {
                        console.log(chalk_1.default.yellow(`⚠️  项目 "${projectName}" 没有端口`));
                        return;
                    }
                    const answer = await inquirer_1.default.prompt([
                        {
                            type: 'list',
                            name: 'port',
                            message: '选择要删除的端口:',
                            choices: project.ports.map(p => `${p.number} (${p.name})`)
                        }
                    ]);
                    portNumber = answer.port.split(' ')[0];
                }
            }
            if (portNumber && projectName) {
                const port = parseInt(portNumber);
                await this.projectManager.removePortFromProject(projectName, port);
                console.log(chalk_1.default.green(`✅ 端口 ${port} 已从项目 "${projectName}" 中删除`));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ 删除端口失败: ${error.message}`));
        }
    }
    async updatePortName(options) {
        try {
            let projectName = options.project;
            let portNumber = options.port;
            let newName = options.name;
            if (!projectName) {
                const projects = await this.projectManager.getProjects();
                if (projects.length === 0) {
                    console.log(chalk_1.default.yellow('⚠️  没有项目'));
                    return;
                }
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'list',
                        name: 'projectName',
                        message: '选择项目:',
                        choices: projects.map(p => p.name)
                    }
                ]);
                projectName = answer.projectName;
            }
            if (!portNumber) {
                if (projectName) {
                    const project = await this.projectManager.getProject(projectName);
                    if (!project || project.ports.length === 0) {
                        console.log(chalk_1.default.yellow(`⚠️  项目 "${projectName}" 没有端口`));
                        return;
                    }
                    const answer = await inquirer_1.default.prompt([
                        {
                            type: 'list',
                            name: 'port',
                            message: '选择要更新的端口:',
                            choices: project.ports.map(p => `${p.number} (${p.name})`)
                        }
                    ]);
                    portNumber = answer.port.split(' ')[0];
                }
            }
            if (!newName) {
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'newName',
                        message: '请输入新的端口名称:'
                    }
                ]);
                newName = answer.newName;
            }
            if (portNumber && projectName && newName) {
                const port = parseInt(portNumber);
                await this.projectManager.updatePortName(projectName, port, newName);
                console.log(chalk_1.default.green(`✅ 端口 ${port} 的名称已更新为 "${newName}"`));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ 更新端口名称失败: ${error.message}`));
        }
    }
    async checkPort(port) {
        try {
            const portNumber = parseInt(port);
            const isOccupied = await this.portManager.isPortOccupied(portNumber);
            if (isOccupied) {
                console.log(chalk_1.default.red(`❌ 端口 ${portNumber} 已被占用`));
                const processInfo = await this.portManager.getProcessInfo(portNumber);
                if (processInfo) {
                    console.log(chalk_1.default.cyan(`   进程名称: ${processInfo.name}`));
                    console.log(chalk_1.default.cyan(`   进程ID: ${processInfo.pid}`));
                    console.log(chalk_1.default.cyan(`   命令行: ${processInfo.cmd}`));
                }
            }
            else {
                console.log(chalk_1.default.green(`✅ 端口 ${portNumber} 可用`));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ 检查端口失败: ${error.message}`));
        }
    }
    async killPort(port) {
        try {
            const portNumber = parseInt(port);
            const isOccupied = await this.portManager.isPortOccupied(portNumber);
            if (!isOccupied) {
                console.log(chalk_1.default.yellow(`⚠️  端口 ${portNumber} 未被占用`));
                return;
            }
            const processInfo = await this.portManager.getProcessInfo(portNumber);
            if (processInfo) {
                console.log(chalk_1.default.yellow(`⚠️  即将结束进程: ${processInfo.name} (PID: ${processInfo.pid})`));
                const confirm = await inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: '确定要结束此进程吗？',
                        default: false
                    }
                ]);
                if (confirm.confirm) {
                    await this.portManager.killProcess(portNumber);
                    console.log(chalk_1.default.green(`✅ 端口 ${portNumber} 的进程已结束`));
                }
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ 结束进程失败: ${error.message}`));
        }
    }
    async listProjects(options) {
        try {
            const projects = await this.projectManager.getProjects();
            if (projects.length === 0) {
                console.log(chalk_1.default.yellow('📝 还没有项目'));
                return;
            }
            if (options.project) {
                const project = projects.find(p => p.name === options.project);
                if (!project) {
                    console.log(chalk_1.default.red(`❌ 项目 "${options.project}" 不存在`));
                    return;
                }
                this.displayProject(project);
            }
            else {
                console.log(chalk_1.default.blue('📋 所有项目:'));
                projects.forEach(project => {
                    this.displayProject(project);
                    console.log(''); // 空行分隔
                });
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ 列出项目失败: ${error.message}`));
        }
    }
    async addToEnv(options) {
        try {
            let portName = options.name;
            if (!portName) {
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'portName',
                        message: '请输入端口名称:'
                    }
                ]);
                portName = answer.portName;
            }
            await this.envManager.addPortToEnv({
                projectName: options.project,
                envFile: options.envFile,
                portName
            });
            console.log(chalk_1.default.green(`✅ 端口 "${portName}" 已添加到.env文件`));
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ 添加到.env文件失败: ${error.message}`));
        }
    }
    async removeFromEnv(options) {
        try {
            let portName = options.name;
            if (!portName) {
                const answer = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'portName',
                        message: '请输入要移除的端口名称:'
                    }
                ]);
                portName = answer.portName;
            }
            await this.envManager.removePortFromEnv({
                envFile: options.envFile,
                portName
            });
            console.log(chalk_1.default.green(`✅ 端口 "${portName}" 已从.env文件移除`));
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ 从.env文件移除失败: ${error.message}`));
        }
    }
    async listEnv(options) {
        try {
            const portVars = await this.envManager.listEnvPorts(options.envFile);
            if (portVars.length === 0) {
                console.log(chalk_1.default.yellow('📝 .env文件中没有端口变量'));
                return;
            }
            console.log(chalk_1.default.blue('📋 .env文件中的端口变量:'));
            portVars.forEach(({ name, value }) => {
                console.log(chalk_1.default.cyan(`   ${name}=${value}`));
            });
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ 列出.env文件失败: ${error.message}`));
        }
    }
    displayProject(project) {
        console.log(chalk_1.default.cyan(`📁 项目: ${project.name}`));
        if (project.ports.length === 0) {
            console.log(chalk_1.default.gray('   没有端口'));
        }
        else {
            console.log(chalk_1.default.gray('   端口:'));
            project.ports.forEach(port => {
                console.log(chalk_1.default.gray(`     - ${port.number} (${port.name})`));
            });
        }
    }
    run() {
        this.program.parse();
    }
}
exports.MutiPortsManager = MutiPortsManager;
//# sourceMappingURL=manager.js.map