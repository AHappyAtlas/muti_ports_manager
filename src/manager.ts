import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import { PortManager } from './port-manager';
import { ProjectManager } from './project-manager';
import { EnvManager } from './env-manager';
import { Project, Port } from './types';
import { i18n } from './i18n';

class MutiPortsManager {
  private program: Command;
  private portManager: PortManager;
  private projectManager: ProjectManager;
  private envManager: EnvManager;

  constructor() {
    this.program = new Command();
    this.portManager = new PortManager();
    this.projectManager = new ProjectManager();
    this.envManager = new EnvManager(this.projectManager);
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('muti-ports')
      .description(i18n.t('cli.description'))
      .version(i18n.t('cli.version'));

    // 语言设置命令
    this.program
      .command('set-language')
      .description('Set language (en/zh)')
      .argument('<language>', 'Language code (en/zh)')
      .action((language) => {
        this.setLanguage(language);
      });

    // 显示当前语言
    this.program
      .command('language')
      .description('Show current language')
      .action(() => {
        this.showLanguage();
      });

    // 添加项目
    this.program
      .command('add-project')
      .description(i18n.t('command.add-project.description'))
      .option('-n, --name <name>', i18n.t('option.name'))
      .action(async (options) => {
        await this.addProject(options);
      });

    // 添加端口到项目
    this.program
      .command('add-port')
      .description(i18n.t('command.add-port.description'))
      .option('-p, --project <name>', i18n.t('option.project'))
      .option('-P, --port <port>', i18n.t('option.port'))
      .option('-N, --name <name>', i18n.t('option.port-name'))
      .action(async (options) => {
        await this.addPort(options);
      });

    // 删除项目
    this.program
      .command('remove-project')
      .description(i18n.t('command.remove-project.description'))
      .option('-n, --name <name>', i18n.t('option.name'))
      .action(async (options) => {
        await this.removeProject(options);
      });

    // 删除端口
    this.program
      .command('remove-port')
      .description(i18n.t('command.remove-port.description'))
      .option('-p, --project <name>', i18n.t('option.project'))
      .option('-P, --port <port>', i18n.t('option.port'))
      .action(async (options) => {
        await this.removePort(options);
      });

    // 更新端口名称
    this.program
      .command('update-port-name')
      .description(i18n.t('command.update-port-name.description'))
      .option('-p, --project <name>', i18n.t('option.project'))
      .option('-P, --port <port>', i18n.t('option.port'))
      .option('-N, --name <name>', i18n.t('option.port-name'))
      .action(async (options) => {
        await this.updatePortName(options);
      });

    // 查看端口占用
    this.program
      .command('check-port')
      .description(i18n.t('command.check-port.description'))
      .argument('<port>', i18n.t('option.port'))
      .action(async (port) => {
        await this.checkPort(port);
      });

    // 结束占用端口的进程
    this.program
      .command('kill-port')
      .description(i18n.t('command.kill-port.description'))
      .argument('<port>', i18n.t('option.port'))
      .action(async (port) => {
        await this.killPort(port);
      });

    // 列出所有项目和端口
    this.program
      .command('list')
      .description(i18n.t('command.list.description'))
      .option('-p, --project <name>', i18n.t('option.project'))
      .action(async (options) => {
        await this.listProjects(options);
      });

    // 添加端口到.env文件
    this.program
      .command('add-to-env')
      .description(i18n.t('command.add-to-env.description'))
      .option('-p, --project <name>', i18n.t('option.project'))
      .option('-e, --env-file <path>', i18n.t('option.env-file'))
      .option('-n, --name <name>', i18n.t('option.port-name'))
      .action(async (options) => {
        await this.addToEnv(options);
      });

    // 从.env文件移除端口
    this.program
      .command('remove-from-env')
      .description(i18n.t('command.remove-from-env.description'))
      .option('-e, --env-file <path>', i18n.t('option.env-file'))
      .option('-n, --name <name>', i18n.t('option.port-name'))
      .action(async (options) => {
        await this.removeFromEnv(options);
      });

    // 列出.env文件中的端口
    this.program
      .command('list-env')
      .description(i18n.t('command.list-env.description'))
      .option('-e, --env-file <path>', i18n.t('option.env-file'))
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

  private setLanguage(language: string): void {
    if (language === 'en' || language === 'zh') {
      i18n.setLanguage(language as 'en' | 'zh');
      console.log(chalk.green(i18n.t('language.set', { language })));
    } else {
      console.log(chalk.red('Invalid language. Use "en" or "zh"'));
    }
  }

  private showLanguage(): void {
    const currentLang = i18n.getLanguage();
    console.log(chalk.blue(i18n.t('language.current', { language: currentLang })));
    console.log(chalk.cyan(i18n.t('language.available')));
  }

  private async addProject(options: { name?: string }): Promise<void> {
    try {
      let projectName = options.name;
      
      if (!projectName) {
        const currentDir = path.basename(process.cwd());
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: i18n.t('prompt.project-name'),
            default: currentDir
          }
        ]);
        projectName = answer.projectName;
      }

      if (projectName) {
        await this.projectManager.addProject(projectName);
        console.log(chalk.green(i18n.t('success.project-added', { name: projectName })));
      }
    } catch (error) {
      console.error(chalk.red(i18n.t('error.add-project-failed', { message: (error as Error).message })));
    }
  }

  private async addPort(options: { project?: string; port?: string; name?: string }): Promise<void> {
    try {
      let projectName = options.project;
      let portNumber = options.port;
      let portName = options.name;

      if (!projectName) {
        const projects = await this.projectManager.getProjects();
        if (projects.length === 0) {
          console.log(chalk.yellow(i18n.t('warning.no-projects-general')));
          return;
        }

        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'projectName',
            message: i18n.t('prompt.select-project'),
            choices: projects.map(p => p.name)
          }
        ]);
        projectName = answer.projectName;
      }

      if (!portNumber) {
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'port',
            message: i18n.t('prompt.port-number'),
            validate: (input) => {
              const portNum = parseInt(input);
              return (portNum >= 1 && portNum <= 65535) ? true : i18n.t('validation.port-range');
            }
          }
        ]);
        portNumber = answer.port;
      }

      if (!portName) {
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'portName',
            message: i18n.t('prompt.port-name'),
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
          console.log(chalk.yellow(i18n.t('warning.port-occupied', { port })));
          const processInfo = await this.portManager.getProcessInfo(port);
          if (processInfo) {
            console.log(chalk.cyan(i18n.t('info.process-info', { name: processInfo.name, pid: processInfo.pid })));
          }
          
          const answer = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'continue',
              message: i18n.t('prompt.continue-add-port'),
              default: false
            }
          ]);
          
          if (!answer.continue) {
            return;
          }
        }

        if (projectName && portName) {
          await this.projectManager.addPortToProject(projectName, port, portName);
          console.log(chalk.green(i18n.t('success.port-added', { port, name: portName, project: projectName })));
        }
      }
    } catch (error) {
      console.error(chalk.red(i18n.t('error.add-port-failed', { message: (error as Error).message })));
    }
  }

  private async removeProject(options: { name?: string }): Promise<void> {
    try {
      let projectName = options.name;
      
      if (!projectName) {
        const projects = await this.projectManager.getProjects();
        if (projects.length === 0) {
          console.log(chalk.yellow(i18n.t('warning.no-projects-to-delete')));
          return;
        }

        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'projectName',
            message: i18n.t('prompt.select-project'),
            choices: projects.map(p => p.name)
          }
        ]);
        projectName = answer.projectName;
      }

      if (projectName) {
        const confirm = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: i18n.t('prompt.confirm-delete-project', { name: projectName }),
            default: false
          }
        ]);

        if (confirm.confirm) {
          await this.projectManager.removeProject(projectName);
          console.log(chalk.green(i18n.t('success.project-removed', { name: projectName })));
        }
      }
    } catch (error) {
      console.error(chalk.red(i18n.t('error.remove-project-failed', { message: (error as Error).message })));
    }
  }

  private async removePort(options: { project?: string; port?: string }): Promise<void> {
    try {
      let projectName = options.project;
      let portNumber = options.port;

      if (!projectName) {
        const projects = await this.projectManager.getProjects();
        if (projects.length === 0) {
          console.log(chalk.yellow(i18n.t('warning.no-projects-general')));
          return;
        }

        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'projectName',
            message: i18n.t('prompt.select-project'),
            choices: projects.map(p => p.name)
          }
        ]);
        projectName = answer.projectName;
      }

      if (!portNumber) {
        if (projectName) {
          const project = await this.projectManager.getProject(projectName);
          if (!project || project.ports.length === 0) {
            console.log(chalk.yellow(i18n.t('warning.project-no-ports', { name: projectName })));
            return;
          }

          const answer = await inquirer.prompt([
            {
              type: 'list',
              name: 'port',
              message: i18n.t('prompt.select-project'),
              choices: project.ports.map(p => `${p.number} (${p.name})`)
            }
          ]);
          portNumber = answer.port.split(' ')[0];
        }
      }

      if (portNumber && projectName) {
        const port = parseInt(portNumber);

        await this.projectManager.removePortFromProject(projectName, port);
        console.log(chalk.green(i18n.t('success.port-removed', { port, project: projectName })));
      }
    } catch (error) {
      console.error(chalk.red(i18n.t('error.remove-port-failed', { message: (error as Error).message })));
    }
  }

  private async updatePortName(options: { project?: string; port?: string; name?: string }): Promise<void> {
    try {
      let projectName = options.project;
      let portNumber = options.port;
      let newName = options.name;

      if (!projectName) {
        const projects = await this.projectManager.getProjects();
        if (projects.length === 0) {
          console.log(chalk.yellow(i18n.t('warning.no-projects-general')));
          return;
        }

        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'projectName',
            message: i18n.t('prompt.select-project'),
            choices: projects.map(p => p.name)
          }
        ]);
        projectName = answer.projectName;
      }

      if (!portNumber) {
        if (projectName) {
          const project = await this.projectManager.getProject(projectName);
          if (!project || project.ports.length === 0) {
            console.log(chalk.yellow(i18n.t('warning.project-no-ports', { name: projectName })));
            return;
          }

          const answer = await inquirer.prompt([
            {
              type: 'list',
              name: 'port',
              message: i18n.t('prompt.select-project'),
              choices: project.ports.map(p => `${p.number} (${p.name})`)
            }
          ]);
          portNumber = answer.port.split(' ')[0];
        }
      }

      if (!newName) {
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'newName',
            message: i18n.t('prompt.new-port-name')
          }
        ]);
        newName = answer.newName;
      }

      if (portNumber && projectName && newName) {
        const port = parseInt(portNumber);

        await this.projectManager.updatePortName(projectName, port, newName);
        console.log(chalk.green(i18n.t('success.port-name-updated', { port, name: newName })));
      }
    } catch (error) {
      console.error(chalk.red(i18n.t('error.update-port-name-failed', { message: (error as Error).message })));
    }
  }

  private async checkPort(port: string): Promise<void> {
    try {
      const portNumber = parseInt(port);
      const isOccupied = await this.portManager.isPortOccupied(portNumber);
      
      if (isOccupied) {
        console.log(chalk.red(i18n.t('info.port-occupied', { port: portNumber })));
        const processInfo = await this.portManager.getProcessInfo(portNumber);
        if (processInfo) {
          console.log(chalk.cyan(i18n.t('info.process-name', { name: processInfo.name })));
          console.log(chalk.cyan(i18n.t('info.process-id', { pid: processInfo.pid })));
          console.log(chalk.cyan(i18n.t('info.command-line', { cmd: processInfo.cmd })));
        }
      } else {
        console.log(chalk.green(i18n.t('info.port-available', { port: portNumber })));
      }
    } catch (error) {
      console.error(chalk.red(i18n.t('error.check-port-failed', { message: (error as Error).message })));
    }
  }

  private async killPort(port: string): Promise<void> {
    try {
      const portNumber = parseInt(port);
      const isOccupied = await this.portManager.isPortOccupied(portNumber);
      
      if (!isOccupied) {
        console.log(chalk.yellow(i18n.t('warning.port-not-occupied', { port: portNumber })));
        return;
      }

      const processInfo = await this.portManager.getProcessInfo(portNumber);
      if (processInfo) {
        console.log(chalk.yellow(i18n.t('info.killing-process', { name: processInfo.name, pid: processInfo.pid })));
        
        const confirm = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: i18n.t('prompt.confirm-kill-process'),
            default: false
          }
        ]);

        if (confirm.confirm) {
          await this.portManager.killProcess(portNumber);
          console.log(chalk.green(i18n.t('success.port-killed', { port: portNumber })));
        }
      }
    } catch (error) {
      console.error(chalk.red(i18n.t('error.kill-port-failed', { message: (error as Error).message })));
    }
  }

  private async listProjects(options: { project?: string }): Promise<void> {
    try {
      const projects = await this.projectManager.getProjects();
      
      if (projects.length === 0) {
        console.log(chalk.yellow(i18n.t('info.no-projects')));
        return;
      }

      if (options.project) {
        const project = projects.find(p => p.name === options.project);
        if (!project) {
          console.log(chalk.red(i18n.t('error.project-not-found', { name: options.project })));
          return;
        }
        this.displayProject(project);
      } else {
        console.log(chalk.blue(i18n.t('info.all-projects')));
        projects.forEach(project => {
          this.displayProject(project);
          console.log(''); // 空行分隔
        });
      }
    } catch (error) {
      console.error(chalk.red(i18n.t('error.list-projects-failed', { message: (error as Error).message })));
    }
  }

  private async addToEnv(options: { project?: string; envFile?: string; name?: string }): Promise<void> {
    try {
      let portName = options.name;
      
      if (!portName) {
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'portName',
            message: i18n.t('prompt.port-name')
          }
        ]);
        portName = answer.portName;
      }

      await this.envManager.addPortToEnv({
        projectName: options.project,
        envFile: options.envFile,
        portName
      });

      if (portName) {
        console.log(chalk.green(i18n.t('success.port-added-to-env', { name: portName })));
      }
    } catch (error) {
      console.error(chalk.red(i18n.t('error.add-to-env-failed', { message: (error as Error).message })));
    }
  }

  private async removeFromEnv(options: { envFile?: string; name?: string }): Promise<void> {
    try {
      let portName = options.name;
      
      if (!portName) {
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'portName',
            message: i18n.t('prompt.port-name')
          }
        ]);
        portName = answer.portName;
      }

      await this.envManager.removePortFromEnv({
        envFile: options.envFile,
        portName
      });

      if (portName) {
        console.log(chalk.green(i18n.t('success.port-removed-from-env', { name: portName })));
      }
    } catch (error) {
      console.error(chalk.red(i18n.t('error.remove-from-env-failed', { message: (error as Error).message })));
    }
  }

  private async listEnv(options: { envFile?: string }): Promise<void> {
    try {
      const portVars = await this.envManager.listEnvPorts(options.envFile);
      
      if (portVars.length === 0) {
        console.log(chalk.yellow(i18n.t('warning.no-env-ports')));
        return;
      }

      console.log(chalk.blue(i18n.t('info.env-ports')));
      portVars.forEach(({ name, value }) => {
        console.log(chalk.cyan(i18n.t('display.env-port-item', { name, value })));
      });
    } catch (error) {
      console.error(chalk.red(i18n.t('error.list-env-failed', { message: (error as Error).message })));
    }
  }

  private displayProject(project: Project): void {
    console.log(chalk.cyan(i18n.t('display.project', { name: project.name })));
    if (project.ports.length === 0) {
      console.log(chalk.gray(i18n.t('display.no-ports')));
    } else {
      console.log(chalk.gray(i18n.t('display.ports')));
      project.ports.forEach(port => {
        console.log(chalk.gray(i18n.t('display.port-item', { port: port.number, name: port.name })));
      });
    }
  }

  run(): void {
    this.program.parse();
  }
}

export { MutiPortsManager };
