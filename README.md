# Muti Ports Manager

一个可以管理多个项目所占用端口的 npm CLI 工具，支持 TypeScript。

## 功能特性

- 🚀 **多项目管理**: 为不同项目分配和管理端口
- 🔧 **端口名称**: 每个端口都有可自定义的名称
- 📝 **环境变量管理**: 自动将端口信息添加到.env文件
- 🖥️ **跨平台支持**: 支持 Windows、macOS 和 Linux
- 💻 **进程管理**: 查看和终止占用端口的进程
- 🎯 **智能检测**: 自动检测端口占用情况

## 安装

```bash
npm install -g muti-ports-manager
```

## 使用方法

### 基本命令

```bash
# 添加项目
muti-ports add-project

# 添加端口到项目
muti-ports add-port

# 列出所有项目和端口
muti-ports list

# 检查端口占用
muti-ports check-port 3000

# 终止占用端口的进程
muti-ports kill-port 3000
```

### 端口名称管理

```bash
# 添加带名称的端口
muti-ports add-port -p myproject -P 3000 -N API_PORT

# 更新端口名称
muti-ports update-port-name -p myproject -P 3000 -N NEW_API_PORT

# 删除端口
muti-ports remove-port -p myproject -P 3000
```

### 环境变量管理

```bash
# 将端口添加到.env文件
muti-ports add-to-env -n API_PORT

# 指定项目和.env文件路径
muti-ports add-to-env -p myproject -e .env.local -n API_PORT

# 从.env文件移除端口
muti-ports remove-from-env -n API_PORT

# 列出.env文件中的端口变量
muti-ports list-env

# 指定.env文件路径
muti-ports list-env -e .env.production
```

## 命令选项

### add-project
- `-n, --name <name>`: 项目名称

### add-port
- `-p, --project <name>`: 项目名称
- `-P, --port <port>`: 端口号
- `-N, --name <name>`: 端口名称

### update-port-name
- `-p, --project <name>`: 项目名称
- `-P, --port <port>`: 端口号
- `-N, --name <name>`: 新的端口名称

### add-to-env
- `-p, --project <name>`: 项目名称
- `-e, --env-file <path>`: .env文件路径
- `-n, --name <name>`: 端口名称

### remove-from-env
- `-e, --env-file <path>`: .env文件路径
- `-n, --name <name>`: 端口名称

### list-env
- `-e, --env-file <path>`: .env文件路径

## 环境变量格式

端口名称会自动转换为全大写格式添加到.env文件中：

```env
# 如果端口名称为 "API_PORT"，端口号为 3000
API_PORT=3000

# 如果端口名称为 "db_port"，端口号为 5432
DB_PORT=5432
```

## 开发

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 开发模式运行
npm run dev

# 运行构建后的版本
npm start
```

## 项目结构

```
src/
├── types.ts          # TypeScript 类型定义
├── project-manager.ts # 项目管理器
├── port-manager.ts   # 端口管理器
├── env-manager.ts    # 环境变量管理器
├── manager.ts        # 主管理器
├── index.ts          # 入口文件
└── bin/
    └── muti-ports.ts # CLI 入口
```

## 数据存储

项目数据存储在用户主目录下的 `.muti-ports-manager/projects.json` 文件中。

## 许可证

MIT