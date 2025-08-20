#!/bin/bash

# Atlasflare 发布脚本
# 使用方法: ./scripts/release.sh [patch|minor|major|preview|rc]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# 检查Git状态
check_git_status() {
    step "检查Git状态..."
    if [[ -n $(git status --porcelain) ]]; then
        error "检测到未提交的更改，请先提交所有更改"
        git status --short
        exit 1
    fi
    log "Git状态检查通过"
}

# 检查NPM认证
check_npm_auth() {
    step "检查NPM认证..."
    if ! npm whoami > /dev/null 2>&1; then
        error "请先登录NPM: npm login"
        exit 1
    fi
    log "NPM认证检查通过"
}

# 运行测试
run_tests() {
    step "运行测试..."
    npm test
    log "测试通过"
}

# 构建项目
build_project() {
    step "构建项目..."
    npm run build
    log "构建完成"
}

# 发布版本
publish_version() {
    local version_type=$1
    local tag=${2:-latest}
    
    step "发布 ${version_type} 版本 (标签: ${tag})..."
    
    if [[ "$tag" == "latest" ]]; then
        npm version $version_type
    else
        npm version prerelease --preid=$tag
    fi
    
    npm publish --tag $tag
    log "发布成功!"
}

# 显示帮助信息
show_help() {
    echo -e "${BLUE}🚀 Atlasflare 发布脚本${NC}"
    echo "================================"
    echo ""
    echo "使用方法: $0 [command]"
    echo ""
    echo "可用命令:"
    echo -e "  ${GREEN}patch${NC}    - 发布补丁版本 (1.1.0 -> 1.1.1)"
    echo -e "  ${GREEN}minor${NC}    - 发布次要版本 (1.1.0 -> 1.2.0)"
    echo -e "  ${GREEN}major${NC}    - 发布主要版本 (1.1.0 -> 2.0.0)"
    echo -e "  ${GREEN}preview${NC}  - 发布预览版本 (1.1.0-beta.0)"
    echo -e "  ${GREEN}rc${NC}       - 发布候选版本 (1.1.0-rc.0)"
    echo -e "  ${GREEN}check${NC}    - 运行发布前检查"
    echo ""
    echo "当前版本: $(node -p "require('./package.json').version")"
}

# 主函数
main() {
    local command=${1:-help}
    
    case $command in
        patch)
            log "发布补丁版本"
            check_git_status
            check_npm_auth
            run_tests
            build_project
            publish_version "patch"
            ;;
        minor)
            log "发布次要版本"
            check_git_status
            check_npm_auth
            run_tests
            build_project
            publish_version "minor"
            ;;
        major)
            log "发布主要版本"
            check_git_status
            check_npm_auth
            run_tests
            build_project
            publish_version "major"
            ;;
        preview)
            log "发布预览版本"
            check_git_status
            check_npm_auth
            run_tests
            build_project
            publish_version "prerelease" "beta"
            ;;
        rc)
            log "发布候选版本"
            check_git_status
            check_npm_auth
            run_tests
            build_project
            publish_version "prerelease" "rc"
            ;;
        check)
            log "运行发布前检查"
            check_git_status
            check_npm_auth
            run_tests
            build_project
            log "所有检查通过，可以发布"
            ;;
        help|*)
            show_help
            ;;
    esac
}

# 执行主函数
main "$@"
