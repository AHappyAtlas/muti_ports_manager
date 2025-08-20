#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      ...options 
    });
  } catch (error) {
    log(`❌ 命令执行失败: ${command}`, 'red');
    process.exit(1);
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      log('⚠️  检测到未提交的更改:', 'yellow');
      log(status, 'yellow');
      log('请先提交所有更改再发布', 'red');
      process.exit(1);
    }
  } catch (error) {
    log('❌ Git状态检查失败', 'red');
    process.exit(1);
  }
}

function checkNpmAuth() {
  try {
    execSync('npm whoami', { stdio: 'pipe' });
    log('✅ NPM认证检查通过', 'green');
  } catch (error) {
    log('❌ 请先登录NPM: npm login', 'red');
    process.exit(1);
  }
}

function runTests() {
  log('🧪 运行测试...', 'cyan');
  exec('npm test');
  log('✅ 测试通过', 'green');
}

function build() {
  log('🔨 构建项目...', 'cyan');
  exec('npm run build');
  log('✅ 构建完成', 'green');
}

function publish(version, tag = 'latest') {
  log(`📦 发布版本 ${version} (标签: ${tag})...`, 'cyan');
  
  if (tag === 'latest') {
    exec(`npm version ${version}`);
  } else {
    exec(`npm version ${version} --preid=${tag}`);
  }
  
  exec(`npm publish --tag ${tag}`);
  log('✅ 发布成功!', 'green');
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  log('🚀 Atlasflare 发布脚本', 'bright');
  log('========================', 'blue');
  
  // 检查前置条件
  checkGitStatus();
  checkNpmAuth();
  
  switch (command) {
    case 'patch':
      log('📝 发布补丁版本', 'cyan');
      runTests();
      build();
      publish('patch');
      break;
      
    case 'minor':
      log('📝 发布次要版本', 'cyan');
      runTests();
      build();
      publish('minor');
      break;
      
    case 'major':
      log('📝 发布主要版本', 'cyan');
      runTests();
      build();
      publish('major');
      break;
      
    case 'preview':
      log('📝 发布预览版本', 'cyan');
      runTests();
      build();
      publish('prerelease', 'beta');
      break;
      
    case 'rc':
      log('📝 发布候选版本', 'cyan');
      runTests();
      build();
      publish('prerelease', 'rc');
      break;
      
    case 'check':
      log('🔍 运行发布前检查...', 'cyan');
      runTests();
      build();
      log('✅ 所有检查通过，可以发布', 'green');
      break;
      
    default:
      log('使用方法:', 'bright');
      log('  node scripts/release.js <command>', 'cyan');
      log('');
      log('可用命令:', 'bright');
      log('  patch    - 发布补丁版本 (1.1.0 -> 1.1.1)', 'green');
      log('  minor    - 发布次要版本 (1.1.0 -> 1.2.0)', 'green');
      log('  major    - 发布主要版本 (1.1.0 -> 2.0.0)', 'green');
      log('  preview  - 发布预览版本 (1.1.0-beta.0)', 'green');
      log('  rc       - 发布候选版本 (1.1.0-rc.0)', 'green');
      log('  check    - 运行发布前检查', 'green');
      log('');
      log('当前版本:', 'bright');
      log(`  ${getCurrentVersion()}`, 'cyan');
      break;
  }
}

if (require.main === module) {
  main();
}
