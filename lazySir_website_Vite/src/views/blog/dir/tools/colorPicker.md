---
title: colorPicker 说明文档
author: lazySir
tags: [工具,颜色工具]
description: 本组件集合了多种实用的颜色工具，帮助设计师和前端开发者轻松完成颜色选择、转换、配色及可读性检测，提升设计效率和用户体验。
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host/lazySir_website/tools/colorPicker.png
date: 2025-05-23
---

# 🎨 前端颜色工具介绍

本组件集合了多种实用的颜色工具，帮助设计师和前端开发者轻松完成颜色选择、转换、配色及可读性检测，提升设计效率和用户体验。

## 🔗 在线地址

<img style='width:200px' src="https://cdn.jsdelivr.net/gh/lazySir/image-host/lazySir_website/tools/colorPicker.png" alt="exifRead" />

- 🌐 **在线体验地址**：  
  👉 [颜色工具在线地址](https://www.lazysir.me/tools/colorPicker)

## 1️⃣ 颜色对比 / 可读性检测 🧐

- 根据 WCAG 标准，自动计算文字颜色（前景色）与背景颜色的对比度。  
- 实时判断对比度是否达到最低可读性要求，确保内容清晰易读。  
- 显示对比度数值和可读性结论，帮助无障碍设计。
    ```html
        <el-card shadow="hover">
        <template #header>
            <span class="text-lg font-semibold">颜色对比 / 可读性检测</span>
        </template>

        <div class="flex flex-wrap gap-8 items-center mb-6">
            <div class="flex flex-col items-start">
            <label class="text-sm font-medium text-gray-700 mb-1"
                >文字颜色 (前景)</label
            >
            <el-color-picker v-model="contrastFg" />
            </div>
            <div class="flex flex-col items-start">
            <label class="text-sm font-medium text-gray-700 mb-1">背景颜色</label>
            <el-color-picker v-model="contrastBg" />
            </div>
        </div>

        <div
            class="w-full h-20 rounded border flex items-center justify-center text-lg font-semibold"
            :style="{ backgroundColor: contrastBg, color: contrastFg }"
        >
            示例文字 ABC abc 123
        </div>

        <p class="mt-4 text-sm text-gray-600">
            对比度：<code class="font-mono text-black">{{
            contrastRatio.toFixed(2)
            }}</code
            ><br />
            可读性结论：
            <span
            :class="
                contrastPass
                ? 'text-green-600 font-semibold'
                : 'text-red-600 font-semibold'
            "
            >
            {{
                contrastPass
                ? '通过 ✅ (符合 WCAG AA 标准)'
                : '不通过 ❌ (不符合最低对比度要求)'
            }}
            </span>
        </p>
        </el-card>
    ```


## 2️⃣ 屏幕拾色器 🖱️🎯

- 利用浏览器 `EyeDropper` API，点击屏幕任意位置取色。  
- 方便快速捕获屏幕上的颜色值。  
- 取色结果同步至颜色拾取器，便于后续使用。  
- 注意：需支持该 API 的现代浏览器。
    ```js
    /* 屏幕取色器 */
    async function activatePicker() {
    if (!('EyeDropper' in window)) {
        ElMessage.error('当前浏览器不支持 EyeDropper API')
        return
    }
    const eyeDropper = new (window as any).EyeDropper()
    try {
        const result = await eyeDropper.open()
        screenPickedColor.value = result.sRGBHex
        pickedColor.value = result.sRGBHex
        ElMessage.success('取色成功：' + result.sRGBHex)
    } catch (err) {
        ElMessage.warning('已取消取色')
    }
    }

    ```


## 3️⃣ 颜色拾取器 🎨

- 内置颜色选择器，支持透明度调整。  
- 支持手动输入颜色代码和调色板选择，灵活方便。  
- 实时显示当前选中色。



## 4️⃣ 颜色格式转换 🔄

- 支持 RGB 与 HEX 两种颜色格式互转。  
- 输入 RGB 自动转换为 HEX，输入 HEX 自动转换为 RGB。  
- 简化颜色代码转换，适配不同需求。
    ```js
        /* RGB <-> HEX 转换 */
        function rgbToHex(rgb: string): string {
        const parts = rgb.split(',').map((v) => parseInt(v.trim()))
        if (parts.length !== 3 || parts.some(isNaN)) return '无效输入'
        return (
            '#' +
            parts
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase()
        )
        }

        function hexToRgb(hex: string): string {
        let cleanHex = hex.replace('#', '')
        if (![3, 6].includes(cleanHex.length)) return '无效输入'
        if (cleanHex.length === 3)
            cleanHex = cleanHex
            .split('')
            .map((c) => c + c)
            .join('')
        const r = parseInt(cleanHex.slice(0, 2), 16)
        const g = parseInt(cleanHex.slice(2, 4), 16)
        const b = parseInt(cleanHex.slice(4, 6), 16)
        return `${r},${g},${b}`
        }
    ```


## 5️⃣ 渐变生成器 🌈

- 选择起始色与结束色，生成线性渐变效果。  
- 支持多种渐变方向（水平、垂直、斜向）。  
- 实时预览渐变效果，自动生成对应 CSS 代码。  
- 方便复制，快速应用于项目。

    ```html
        <el-card shadow="hover">
        <template #header>
            <span class="text-lg font-semibold">渐变生成器</span>
        </template>
        <div class="flex gap-4 items-center mb-4">
            <el-color-picker v-model="gradientStart" />
            <el-color-picker v-model="gradientEnd" />
            <el-select v-model="gradientDirection" placeholder="方向" class="w-44">
            <el-option label="Left → Right" value="to right" />
            <el-option label="Top → Bottom" value="to bottom" />
            <el-option label="Diagonal ↗" value="to top right" />
            </el-select>
        </div>
        <div
            class="w-full h-20 rounded border"
            :style="{
            background: `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`,
            }"
        ></div>
        <p class="mt-2 text-sm text-gray-600">
            CSS 代码：
            <code class="font-mono"
            >background: linear-gradient({{ gradientDirection }},
            {{ gradientStart }}, {{ gradientEnd }})</code
            >
        </p>
        </el-card>
    ```


## 6️⃣ 配色方案推荐器 🎯

基于当前颜色自动推荐经典配色方案：

- **相邻色 (Analogous)** 🎨：色轮上相邻的柔和搭配，适合统一风格。  
- **互补色 (Complementary)** ⚔️：色轮上相对的颜色，形成强烈对比。  
- **三角配色 (Triadic)** 🔺：色轮上均匀分布的三色，丰富且平衡。

帮助设计师快速生成专业且美观的配色方案。

```js
    /* 配色方案推荐器 */
    function hexToHsl(hex: string) {
    return chroma(hex).hsl()
    }
    function hslToHex(h: number, s: number, l: number) {
    return chroma.hsl(h, s, l).hex()
    }
    const colorSchemes = computed(() => {
    try {
        const hsl = hexToHsl(pickedColor.value)
        if (isNaN(hsl[0])) return {}

        const baseHue = hsl[0]
        const s = hsl[1]
        const l = hsl[2]

        // 相邻色 (Analogous)
        const analogous = [
        hslToHex((baseHue + 30) % 360, s, l),
        pickedColor.value,
        hslToHex((baseHue + 330) % 360, s, l),
        ]

        // 互补色 (Complementary)
        const complementary = [
        pickedColor.value,
        hslToHex((baseHue + 180) % 360, s, l),
        ]

        // 三角配色 (Triadic)
        const triadic = [
        pickedColor.value,
        hslToHex((baseHue + 120) % 360, s, l),
        hslToHex((baseHue + 240) % 360, s, l),
        ]

        return {
        '相邻色 (Analogous)': analogous,
        '互补色 (Complementary)': complementary,
        '三角配色 (Triadic)': triadic,
        }
    } catch {
        return {}
    }
    })
```



✨ 该工具覆盖了从颜色选取、格式转换、对比度检测到配色推荐的全流程，极大提升前端配色设计效率与品质。

欢迎使用并反馈宝贵建议！🚀
