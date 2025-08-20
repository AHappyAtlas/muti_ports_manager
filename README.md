# Multi Ports Manager

An npm CLI tool for managing ports occupied by multiple projects, with TypeScript support.

**[中文文档](README_ZH.md)** | **[English](README.md)**

## Features

- 🚀 **Multi-Project Management**: Allocate and manage ports for different projects
- 🔧 **Port Naming**: Each port has a customizable name
- 📝 **Environment Variable Management**: Automatically add port information to .env files
- 🖥️ **Cross-Platform Support**: Supports Windows, macOS, and Linux
- 💻 **Process Management**: View and terminate processes occupying ports
- 🎯 **Smart Detection**: Automatically detect port occupancy
- 🌍 **Internationalization**: Support for English and Chinese languages

## Installation

```bash
npm install -g muti-ports-manager
```

## Usage

### Basic Commands

```bash
# Add a project
muti-ports add-project

# Add a port to a project
muti-ports add-port

# List all projects and ports
muti-ports list

# Check port occupancy
muti-ports check-port 3000

# Terminate process occupying a port
muti-ports kill-port 3000
```

### Language Management

```bash
# Set language to English
muti-ports set-language en

# Set language to Chinese
muti-ports set-language zh

# Show current language
muti-ports language
```

### Port Name Management

```bash
# Add a port with a name
muti-ports add-port -p myproject -P 3000 -N API_PORT

# Update port name
muti-ports update-port-name -p myproject -P 3000 -N NEW_API_PORT

# Remove a port
muti-ports remove-port -p myproject -P 3000
```

### Environment Variable Management

```bash
# Add a port to .env file
muti-ports add-to-env -n API_PORT

# Specify project and .env file path
muti-ports add-to-env -p myproject -e .env.local -n API_PORT

# Remove a port from .env file
muti-ports remove-from-env -n API_PORT

# List port variables in .env file
muti-ports list-env

# Specify .env file path
muti-ports list-env -e .env.production
```

## Command Options

### add-project
- `-n, --name <name>`: Project name

### add-port
- `-p, --project <name>`: Project name
- `-P, --port <port>`: Port number
- `-N, --name <name>`: Port name

### update-port-name
- `-p, --project <name>`: Project name
- `-P, --port <port>`: Port number
- `-N, --name <name>`: New port name

### add-to-env
- `-p, --project <name>`: Project name
- `-e, --env-file <path>`: .env file path
- `-n, --name <name>`: Port name

### remove-from-env
- `-e, --env-file <path>`: .env file path
- `-n, --name <name>`: Port name

### list-env
- `-e, --env-file <path>`: .env file path

### set-language
- `<language>`: Language code (en/zh)

## Environment Variable Format

Port names are automatically converted to uppercase format when added to .env files:

```env
# If port name is "API_PORT" and port number is 3000
API_PORT=3000

# If port name is "db_port" and port number is 5432
DB_PORT=5432
```

## Development

```bash
# Install dependencies
npm install

# Build project
npm run build

# Run in development mode
npm run dev

# Run built version
npm start
```

## Project Structure

```
src/
├── types.ts          # TypeScript type definitions
├── project-manager.ts # Project manager
├── port-manager.ts   # Port manager
├── env-manager.ts    # Environment variable manager
├── manager.ts        # Main manager
├── i18n/
│   └── index.ts     # Internationalization manager
├── index.ts          # Entry file
└── bin/
    └── muti-ports.ts # CLI entry
```

## Data Storage

Project data is stored in the `.muti-ports-manager/projects.json` file in the user's home directory.

## Internationalization

The tool supports multiple languages:
- **English (en)**: Default language
- **Chinese (zh)**: Full Chinese localization

Language can be changed at runtime using the `set-language` command.

## License

MIT
