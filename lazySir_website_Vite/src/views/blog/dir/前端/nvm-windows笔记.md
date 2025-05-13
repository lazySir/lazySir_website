---
title: nvm-windows笔记
author: lazySir
tags: [nvm,前端,node.js]
description: node版本控制
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/node.js/cover.png
date: 2025-05-13
---

# 📘 nvm-windows 使用笔记（完整版）

> 适用于 Windows 系统的 Node.js 版本管理工具 —— nvm-windows  
> GitHub 项目地址：[https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

---

## 一、nvm-windows 是什么？

- **nvm-windows** 是 Windows 平台上的 Node.js 版本管理器。
- 支持安装和切换多个 Node.js 版本（包括 32/64 位）。
- 与 Linux/macOS 平台上的 `nvm-sh` 有区别，命令略有不同，不支持 `.nvmrc` 文件等特性。

---

## 二、安装指南

### ✅ 安装步骤

1. 下载地址：  
   👉 [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
   
2. 下载 `nvm-setup.exe` 并安装。

3. 安装路径建议 **不包含空格**，如：`C:\nvm`

4. 安装完成后，打开 `命令提示符（cmd）` 或 `PowerShell`，输入：

   ```bash
   nvm version
   ```

   看到版本号说明安装成功。

---

## 三、常用命令速查表

| 命令 | 说明 |
|------|------|
| `nvm install <version>` | 安装指定 Node.js 版本（如：`nvm install 18.17.1`） |
| `nvm install <version> <arch>` | 安装指定位数的版本（如：`nvm install 16.20.0 64`） |
| `nvm use <version>` | 切换到指定版本（如：`nvm use 18.17.1`） |
| `nvm list` 或 `nvm ls` | 查看已安装的版本 |
| `nvm list available` | 查看所有可安装的 Node.js 版本（远程列表） |
| `nvm uninstall <version>` | 卸载指定版本 |
| `nvm current` | 查看当前使用的 Node.js 版本 |
| `nvm arch` | 显示当前 Node.js 的架构（32位 / 64位） |
| `nvm root` | 显示或设置 nvm 的安装根目录 |
| `nvm proxy [url]` | 设置/查看代理地址 |
| `nvm node_mirror [url]` | 设置 node.js 镜像地址 |
| `nvm npm_mirror [url]` | 设置 npm 镜像地址 |
| `nvm upgrade` | 升级 nvm 本体版本（可选） |

---

## 四、安装和切换示例

### 安装最新 LTS 版本：

```bash
nvm install lts
```

### 安装特定版本（64 位）：

```bash
nvm install 18.17.1 64
```

### 使用该版本：

```bash
nvm use 18.17.1
```

切换后，建议重新打开终端，确保 `node` 和 `npm` 正常工作。

---

## 五、注意事项与问题排查

### ❗ 常见问题

| 问题 | 解决方法 |
|------|----------|
| `nvm` 命令未识别 | 确保安装路径添加到了环境变量 |
| 切换版本后 `node` 无法用 | 重启终端，或检查 `nvm use` 是否成功 |
| 安装失败 | 检查是否使用了中文路径或路径中带空格 |
| 需要设置镜像源 | 可使用淘宝镜像：`nvm node_mirror https://npmmirror.com/mirrors/node/` |

---

## 六、推荐配置（可选）

你可以设置国内镜像，下载更快：

```bash
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

---

## 七、nvm-windows 与 nvm-sh 的区别

| 功能 | nvm-windows | nvm-sh（Linux/macOS） |
|------|-------------|------------------------|
| 支持 32/64 位切换 | ✅ | ❌ |
| 支持 `.nvmrc` 文件 | ❌ | ✅ |
| 安装镜像切换 | ✅ | ✅ |
| 支持 alias 命令 | ❌ | ✅ |
| 自动补全 | ❌ | ✅（bash/zsh） |

---

## 八、总结建议

- 使用 `nvm-windows` 管理 Node.js 版本更轻松灵活，适合多项目开发者
- 不建议手动在环境变量中添加 Node.js 路径，交给 nvm 自动处理
- 经常使用 `nvm list` 和 `nvm use` 切换版本，确保不同项目 Node.js 环境隔离
