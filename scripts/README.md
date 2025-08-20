# 发布脚本使用说明

本项目提供了多种发布脚本，让版本管理和发布变得更加便捷。

## 🚀 快速开始

### 使用 NPM 脚本（推荐）

```bash
# 发布补丁版本 (1.1.0 -> 1.1.1)
npm run release:patch

# 发布次要版本 (1.1.0 -> 1.2.0)
npm run release:minor

# 发布主要版本 (1.1.0 -> 2.0.0)
npm run release:major

# 发布预览版本 (1.1.0-beta.0)
npm run release:preview

# 发布候选版本 (1.1.0-rc.0)
npm run release:rc
```

### 使用 Shell 脚本

```bash
# 发布补丁版本
./scripts/release.sh patch

# 发布次要版本
./scripts/release.sh minor

# 发布主要版本
./scripts/release.sh major

# 发布预览版本
./scripts/release.sh preview

# 发布候选版本
./scripts/release.sh rc

# 运行发布前检查
./scripts/release.sh check

# 显示帮助信息
./scripts/release.sh help
```

### 使用 Node.js 脚本

```bash
# 发布补丁版本
node scripts/release.js patch

# 发布次要版本
node scripts/release.js minor

# 发布主要版本
node scripts/release.js major

# 发布预览版本
node scripts/release.js preview

# 发布候选版本
node scripts/release.js rc

# 运行发布前检查
node scripts/release.js check
```

## 📋 版本类型说明

| 版本类型 | 说明 | 示例 |
|---------|------|------|
| `patch` | 补丁版本，修复bug | 1.1.0 → 1.1.1 |
| `minor` | 次要版本，新功能 | 1.1.0 → 1.2.0 |
| `major` | 主要版本，破坏性更新 | 1.1.0 → 2.0.0 |
| `preview` | 预览版本，测试用 | 1.1.0 → 1.1.0-beta.0 |
| `rc` | 候选版本，发布前测试 | 1.1.0 → 1.1.0-rc.0 |

## 🔍 发布前检查

所有发布脚本都会自动执行以下检查：

1. **Git状态检查** - 确保没有未提交的更改
2. **NPM认证检查** - 确保已登录NPM
3. **测试运行** - 运行项目测试
4. **项目构建** - 编译TypeScript代码

## 📦 发布流程

1. 运行发布前检查
2. 自动更新版本号
3. 构建项目
4. 发布到NPM
5. 推送Git标签

## ⚠️ 注意事项

- 发布前请确保所有更改已提交到Git
- 确保已登录NPM (`npm login`)
- 预览版本和候选版本会使用特殊标签，不会影响latest标签
- 发布后会自动推送Git标签

## 🛠️ 自定义配置

可以在 `package.json` 中修改以下脚本：

```json
{
  "scripts": {
    "release:patch": "npm version patch && npm publish",
    "release:minor": "npm version minor && npm publish",
    "release:major": "npm version major && npm publish"
  }
}
```

## 🆘 故障排除

### 常见问题

1. **Git状态检查失败**
   - 确保所有更改已提交
   - 运行 `git status` 查看状态

2. **NPM认证失败**
   - 运行 `npm login` 重新登录
   - 检查 `.npmrc` 配置

3. **构建失败**
   - 检查TypeScript编译错误
   - 运行 `npm run build` 查看详细错误

4. **发布失败**
   - 检查包名是否已存在
   - 确认版本号是否合法
   - 检查NPM权限

## 📚 相关文档

- [NPM版本管理](https://docs.npmjs.com/cli/v8/commands/npm-version)
- [NPM发布](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [语义化版本](https://semver.org/lang/zh-CN/)
