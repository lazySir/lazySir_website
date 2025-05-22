---
title: exifRead 说明文档
author: lazySir
tags: [工具,图片信息查看]
description: 一个基于 **Vue 3 + Element Plus + exifr.js** 的图片元数据查看工具，支持上传图片并解析 EXIF 信息（包括 GPS），预览原图，并可导出为 JSON。
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host/lazySir_website/tools/exifRead.png
date: 2025-05-22
---

# 📷 EXIF 信息查看器组件

一个基于 **Vue 3 + Element Plus + exifr.js** 的图片元数据查看工具，支持上传图片并解析 EXIF 信息（包括 GPS），预览原图，并可导出为 JSON。

---

## ✨ 功能特色

- ✅ 拖拽或点击上传图片，自动读取 EXIF 元数据
- ✅ 支持原图预览
- ✅ 表格展示参数（含中文字段名）
- ✅ 一键导出为 `.json` 文件
- ✅ 若包含 GPS 信息，自动生成 Google 地图跳转链接
- ✅ 样式美观，集成 Element Plus UI

---

## 🧪 技术栈

- [Vue 3](https://vuejs.org/) + `<script setup>`
- [Element Plus](https://element-plus.org/)
- [exifr.js](https://github.com/MikeKovarik/exifr) - EXIF 解析库
- TypeScript

---

## 📸 使用说明

1. **上传图片**  
   拖拽或点击上传支持的图片文件（JPG、PNG 等）。

2. **查看 EXIF 信息**  
   上传后自动解析 EXIF 数据，并以表格形式展示，包括：
   - 中文字段名
   - 英文字段名（原始键名）
   - 字段值

3. **查看定位信息**  
   若图片包含 GPS 经纬度，将自动生成跳转链接：  
   ➡️ [在 Google 地图中查看位置](https://maps.google.com)

4. **导出 JSON**  
   点击“导出 EXIF JSON”按钮可下载完整 EXIF 数据。

---


## 🔗 在线地址

<img style='width:200px' src="https://cdn.jsdelivr.net/gh/lazySir/image-host/lazySir_website/tools/exifRead.png" alt="exifRead" />

- 🌐 **在线体验地址**：  
  👉 [exifRead在线地址](https://www.lazysir.me/tools/exifRead)


## 📁 组件结构简要说明

| 名称 | 说明 |
|------|------|
| `el-upload` | 拖拽上传图片 |
| `imageUrl` | 图像预览地址 |
| `exifData` | 解析后的 EXIF 对象 |
| `formatExifData()` | 将 EXIF 数据格式化为表格所需结构 |
| `chineseMap` | EXIF 字段中文映射表 |
| `gpsLink` | 根据经纬度生成的 Google 地图链接 |
| `exportExif()` | 导出 EXIF JSON 函数 |

---

## 📦 示例字段（部分）

| 中文名称 | 字段名 | 示例值 |
|----------|--------|--------|
| 拍摄时间 | `DateTimeOriginal` | `2024:12:01 14:22:11` |
| 相机型号 | `Model` | `Canon EOS 80D` |
| ISO 感光度 | `ISO` | `100` |
| 经纬度 | `latitude`, `longitude` | `34.0522`, `-118.2437` |

---

## 🚧 注意事项

- 某些图片（如微信截图、压缩图片）可能不包含 EXIF 信息。
- 为保障隐私，建议避免上传包含 GPS 信息的个人照片。
- exifr 支持 JPG、HEIC、TIFF 等格式，部分格式可能不完全兼容。

---

## 🔗 相关链接

- [exifr.js 文档](https://github.com/MikeKovarik/exifr)
- [Element Plus 官方文档](https://element-plus.org/)
- [Google 地图](https://maps.google.com)

---

