# Cursor Rules for Multi Ports Manager

This directory contains Cursor Rules that help AI assistants understand and work with your Multi Ports Manager project.

## Available Rules

### 1. [project-structure.mdc](project-structure.mdc)
- **Always Applied**: Yes
- **Purpose**: Provides overview of project architecture and file organization
- **Use Case**: General project understanding and navigation

### 2. [typescript-standards.mdc](typescript-standards.mdc)
- **Applies to**: `*.ts`, `*.tsx` files
- **Purpose**: Defines TypeScript coding standards and conventions
- **Use Case**: Code quality and consistency

### 3. [cli-development.mdc](cli-development.mdc)
- **Applies to**: CLI-related files (`src/bin/*.ts`, `src/manager.ts`)
- **Purpose**: Guidelines for CLI development using Commander.js
- **Use Case**: Command implementation and user experience

### 4. [port-management.mdc](port-management.mdc)
- **Applies to**: Port and project management files
- **Purpose**: Rules for port operations and project-port relationships
- **Use Case**: Core functionality development

### 5. [internationalization.mdc](internationalization.mdc)
- **Applies to**: i18n files (`src/i18n/*.ts`)
- **Purpose**: Guidelines for multi-language support
- **Use Case**: Localization and internationalization

### 6. [build-and-deployment.mdc](build-and-deployment.mdc)
- **Applies to**: Configuration and documentation files
- **Purpose**: Build process and deployment guidelines
- **Use Case**: Project building and distribution

## How to Use

These rules are automatically applied by Cursor based on:
- **File patterns** (globs) for specific file types
- **Always apply** for general project context
- **Manual application** when needed

## Customization

You can modify these rules to match your specific development preferences:
- Update file paths if project structure changes
- Modify coding standards to match your team's style
- Add new rules for additional concerns

## Rule Format

Rules use Markdown with Cursor-specific extensions:
- `[filename](mdc:filename)` for file references
- Frontmatter for metadata (alwaysApply, globs, description)
- Clear, actionable guidelines for AI assistance
