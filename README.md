# Muti ports manager

一个可以管理多个项目所占用端口的 npm cli 工具

## 功能特性

1. 添加项目，默认名称为当前目录名
2. 每个项目可包含多个端口
3. 添加端口时查看当前端口有无被占用
4. 可删除项目和项目中的某个端口
5. 快速查看端口被什么占用
6. 快速结束占用指定端口的进程
7. 展示所有项目和端口
8. 展示指定项目的端口

## 安装

```bash
# 克隆项目
git clone <repository-url>
cd muti_ports_manager

# 安装依赖
npm install

# 全局安装（可选）
npm install -g .
```

## 使用方法

### 基本命令

```bash
# 查看帮助
muti-ports --help

# 查看版本
muti-ports --version
```

### 项目管理

```bash
# 添加项目（使用当前目录名作为默认名称）
muti-ports add-project

# 添加项目（指定名称）
muti-ports add-project -n my-project

# 删除项目
muti-ports remove-project -n my-project

# 列出所有项目
muti-ports list

# 列出指定项目
muti-ports list -p my-project
```

### 端口管理

```bash
# 添加端口到项目
muti-ports add-port -p my-project -P 3000

# 添加端口（交互式选择项目）
muti-ports add-port -P 3000

# 删除项目中的端口
muti-ports remove-port -p my-project -P 3000

# 删除端口（交互式选择）
muti-ports remove-port
```

### 端口监控

```bash
# 检查端口占用情况
muti-ports check-port 3000

# 结束占用端口的进程
muti-ports kill-port 3000
```

## 命令选项

### add-project
- `-n, --name <name>`: 指定项目名称

### add-port
- `-p, --project <name>`: 指定项目名称
- `-P, --port <port>`: 指定端口号

### remove-project
- `-n, --name <name>`: 指定项目名称

### remove-port
- `-p, --project <name>`: 指定项目名称
- `-P, --port <port>`: 指定端口号

### list
- `-p, --project <name>`: 只显示指定项目

### check-port
- `<port>`: 要检查的端口号

### kill-port
- `<port>`: 要结束进程的端口号

## 数据存储

项目数据存储在用户主目录下的 `.muti-ports-manager/projects.json` 文件中。

## 系统支持

- ✅ macOS
- ✅ Linux
- ✅ Windows

## 开发

```bash
# 安装开发依赖
npm install

# 运行测试
npm test

# 启动开发模式
npm start
```

## 许可证

MIT