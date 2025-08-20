# Multi Ports Manager

[![NPM Version][npm-image]][npm-url]
[![Downloads Stats][npm-downloads]][npm-url]
[![License][license-image]][license-url]

An npm CLI tool for managing ports occupied by multiple projects, with TypeScript support.

**[中文文档](README_ZH.md)** | **[English](README.md)**

<!-- TABLE OF CONTENTS -->
<details>
<summary>Table of Contents</summary>
<ol>
<li><a href="#about-the-project">About The Project</a></li>
<li><a href="#built-with">Built With</a></li>
<li><a href="#getting-started">Getting Started</a></li>
<li><a href="#usage">Usage</a></li>
<li><a href="#roadmap">Roadmap</a></li>
<li><a href="#contributing">Contributing</a></li>
<li><a href="#license">License</a></li>
<li><a href="#contact">Contact</a></li>
<li><a href="#acknowledgments">Acknowledgments</a></li>
</ol>
</details>

## About The Project

![Multi Ports Manager Screenshot](images/screenshot.png)

There are many great port management tools available; however, I didn't find one that really suited my needs for managing multiple projects with named ports and environment variable integration. So I created this enhanced one.

Here's why Multi Ports Manager is special:

* **Your time should be focused** on creating something amazing. A project that solves port conflicts and helps manage development environments efficiently
* **You shouldn't be doing the same tasks** over and over like manually checking port availability and updating .env files
* **Smart port management** with automatic detection, naming, and environment variable integration
* **Cross-platform support** for Windows, macOS, and Linux

### Features

- 🚀 **Multi-Project Management**: Allocate and manage ports for different projects
- 🔧 **Port Naming**: Each port has a customizable name
- 📝 **Environment Variable Management**: Automatically add port information to .env files
- 🖥️ **Cross-Platform Support**: Supports Windows, macOS, and Linux
- 💻 **Process Management**: View and terminate processes occupying ports
- 🎯 **Smart Detection**: Automatically detect port occupancy
- 🌍 **Internationalization**: Support for English and Chinese languages

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

This section lists the major frameworks/libraries used to bootstrap this project.

* [Node.js](https://nodejs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Commander.js](https://github.com/tj/commander.js)
* [Chalk](https://github.com/chalk/chalk)
* [Inquirer](https://github.com/SBoudrias/Inquirer.js)
* [Portfinder](https://github.com/http-party/node-portfinder)
* [PS List](https://github.com/sindresorhus/ps-list)
* [Dotenv](https://github.com/motdotla/dotenv)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* npm
```bash
npm install npm@latest -g
```

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your_username/muti-ports-manager.git
   ```

2. **Install NPM packages**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Install globally (optional)**
   ```bash
   npm install -g muti-ports-manager
   ```

5. **Change git remote url to avoid accidental pushes to base project**
   ```bash
   git remote set-url origin your_username/muti-ports-manager
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space.

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

### Command Options

#### add-project
- `-n, --name <name>`: Project name

#### add-port
- `-p, --project <name>`: Project name
- `-P, --port <port>`: Port number
- `-N, --name <name>`: Port name

#### update-port-name
- `-p, --project <name>`: Project name
- `-P, --port <port>`: Port number
- `-N, --name <name>`: New port name

#### add-to-env
- `-p, --project <name>`: Project name
- `-e, --env-file <path>`: .env file path
- `-n, --name <name>`: Port name

#### remove-from-env
- `-e, --env-file <path>`: .env file path
- `-n, --name <name>`: Port name

#### list-env
- `-e, --env-file <path>`: .env file path

#### set-language
- `<language>`: Language code (en/zh)

### Environment Variable Format

Port names are automatically converted to uppercase format when added to .env files:

```env
# If port name is "API_PORT" and port number is 3000
API_PORT=3000

# If port name is "db_port" and port number is 5432
DB_PORT=5432
```

_For more examples, please refer to the [Documentation](https://github.com/your_username/muti-ports-manager)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Multi-project port management
- [x] Port naming system
- [x] Environment variable integration
- [x] Cross-platform support
- [x] Internationalization (English/Chinese)
- [ ] Web dashboard for port management
- [ ] Port conflict resolution
- [ ] Docker integration
- [ ] Kubernetes port management
- [ ] Port usage analytics
- [ ] Team collaboration features

See the [open issues](https://github.com/your_username/muti-ports-manager/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

[![Contributors][contributors-shield]][contributors-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your_username/muti-ports-manager](https://github.com/your_username/muti-ports-manager)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[npm-image]: https://img.shields.io/npm/v/muti-ports-manager.svg?style=flat-square
[npm-url]: https://npmjs.org/package/muti-ports-manager
[npm-downloads]: https://img.shields.io/npm/dm/muti-ports-manager.svg?style=flat-square
[license-image]: https://img.shields.io/npm/l/muti-ports-manager.svg?style=flat-square
[license-url]: https://github.com/your_username/muti-ports-manager/blob/main/LICENSE
[contributors-shield]: https://img.shields.io/github/contributors/your_username/muti-ports-manager.svg?style=flat-square
[contributors-url]: https://github.com/your_username/muti-ports-manager/graphs/contributors
