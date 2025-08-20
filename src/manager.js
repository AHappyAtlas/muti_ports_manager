const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const { PortManager } = require('./port-manager');
const { ProjectManager } = require('./project-manager');

class MutiPortsManager {
  constructor() {
    this.program = new Command();
    this.portManager = new PortManager();
    this.projectManager = new ProjectManager();
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
        const currentDir = path.basename(process.cwd());
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: '请输入项目名称:',
            default: currentDir
          }
        ]);
        projectName = answer.projectName;
      }

      await this.projectManager.addProject(projectName);
      console.log(chalk.green(`✅ 项目 "${projectName}" 添加成功！`));
    } catch (error) {
      console.error(chalk.red(`❌ 添加项目失败: ${error.message}`));
    }
  }

  async addPort(options) {
    try {
      let projectName = options.project;
      let port = options.port;

      if (!projectName) {
        const projects = await this.projectManager.getProjects();
        if (projects.length === 0) {
          console.log(chalk.yellow('⚠️  还没有项目，请先添加项目'));
          return;
        }

        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'projectName',
            message: '选择项目:',
            choices: projects.map(p => p.name)
          }
        ]);
        projectName = answer.projectName;
      }

      if (!port) {
        const answer = await inquirer.prompt([
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
        port = parseInt(answer.port);
      } else {
        port = parseInt(port);
      }

      // 检查端口是否被占用
      const isOccupied = await this.portManager.isPortOccupied(port);
      if (isOccupied) {
        console.log(chalk.yellow(`⚠️  端口 ${port} 已被占用`));
        const processInfo = await this.portManager.getProcessInfo(port);
        if (processInfo) {
          console.log(chalk.cyan(`   进程信息: ${processInfo.name} (PID: ${processInfo.pid})`));
        }
        
        const answer = await inquirer.prompt([
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

      await this.projectManager.addPortToProject(projectName, port);
      console.log(chalk.green(`✅ 端口 ${port} 已添加到项目 "${projectName}"`));
    } catch (error) {
      console.error(chalk.red(`❌ 添加端口失败: ${error.message}`));
    }
  }

  async removeProject(options) {
    try {
      let projectName = options.name;
      
      if (!projectName) {
        const projects = await this.projectManager.getProjects();
        if (projects.length === 0) {
          console.log(chalk.yellow('⚠️  没有项目可删除'));
          return;
        }

        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'projectName',
            message: '选择要删除的项目:',
            choices: projects.map(p => p.name)
          }
        ]);
        projectName = answer.projectName;
      }

      const confirm = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `确定要删除项目 "${projectName}" 吗？这将删除所有相关端口信息。`,
          default: false
        }
      ]);

      if (confirm.confirm) {
        await this.projectManager.removeProject(projectName);
        console.log(chalk.green(`✅ 项目 "${projectName}" 删除成功！`));
      }
    } catch (error) {
      console.error(chalk.red(`❌ 删除项目失败: ${error.message}`));
    }
  }

  async removePort(options) {
    try {
      let projectName = options.project;
      let port = options.port;

      if (!projectName) {
        const projects = await this.projectManager.getProjects();
        if (projects.length === 0) {
          console.log(chalk.yellow('⚠️  没有项目'));
          return;
        }

        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'projectName',
            message: '选择项目:',
            choices: projects.map(p => p.name)
          }
        ]);
        projectName = answer.projectName;
      }

      if (!port) {
        const project = await this.projectManager.getProject(projectName);
        if (!project || project.ports.length === 0) {
          console.log(chalk.yellow(`⚠️  项目 "${projectName}" 没有端口`));
          return;
        }

        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'port',
            message: '选择要删除的端口:',
            choices: project.ports.map(p => p.toString())
          }
        ]);
        port = parseInt(answer.port);
      } else {
        port = parseInt(port);
      }

      await this.projectManager.removePortFromProject(projectName, port);
      console.log(chalk.green(`✅ 端口 ${port} 已从项目 "${projectName}" 中删除`));
    } catch (error) {
      console.error(chalk.red(`❌ 删除端口失败: ${error.message}`));
    }
  }

  async checkPort(port) {
    try {
      port = parseInt(port);
      const isOccupied = await this.portManager.isPortOccupied(port);
      
      if (isOccupied) {
        console.log(chalk.red(`❌ 端口 ${port} 已被占用`));
        const processInfo = await this.portManager.getProcessInfo(port);
        if (processInfo) {
          console.log(chalk.cyan(`   进程名称: ${processInfo.name}`));
          console.log(chalk.cyan(`   进程ID: ${processInfo.pid}`));
          console.log(chalk.cyan(`   命令行: ${processInfo.cmd}`));
        }
      } else {
        console.log(chalk.green(`✅ 端口 ${port} 可用`));
      }
    } catch (error) {
      console.error(chalk.red(`❌ 检查端口失败: ${error.message}`));
    }
  }

  async killPort(port) {
    try {
      port = parseInt(port);
      const isOccupied = await this.portManager.isPortOccupied(port);
      
      if (!isOccupied) {
        console.log(chalk.yellow(`⚠️  端口 ${port} 未被占用`));
        return;
      }

      const processInfo = await this.portManager.getProcessInfo(port);
      if (processInfo) {
        console.log(chalk.yellow(`⚠️  即将结束进程: ${processInfo.name} (PID: ${processInfo.pid})`));
        
        const confirm = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: '确定要结束此进程吗？',
            default: false
          }
        ]);

        if (confirm.confirm) {
          await this.portManager.killProcess(port);
          console.log(chalk.green(`✅ 端口 ${port} 的进程已结束`));
        }
      }
    } catch (error) {
      console.error(chalk.red(`❌ 结束进程失败: ${error.message}`));
    }
  }

  async listProjects(options) {
    try {
      const projects = await this.projectManager.getProjects();
      
      if (projects.length === 0) {
        console.log(chalk.yellow('📝 还没有项目'));
        return;
      }

      if (options.project) {
        const project = projects.find(p => p.name === options.project);
        if (!project) {
          console.log(chalk.red(`❌ 项目 "${options.project}" 不存在`));
          return;
        }
        this.displayProject(project);
      } else {
        console.log(chalk.blue('📋 所有项目:'));
        projects.forEach(project => {
          this.displayProject(project);
          console.log(''); // 空行分隔
        });
      }
    } catch (error) {
      console.error(chalk.red(`❌ 列出项目失败: ${error.message}`));
    }
  }

  displayProject(project) {
    console.log(chalk.cyan(`📁 项目: ${project.name}`));
    if (project.ports.length === 0) {
      console.log(chalk.gray('   没有端口'));
    } else {
      console.log(chalk.gray('   端口:'));
      project.ports.forEach(port => {
        console.log(chalk.gray(`     - ${port}`));
      });
    }
  }

  run() {
    this.program.parse();
  }
}

module.exports = { MutiPortsManager };
