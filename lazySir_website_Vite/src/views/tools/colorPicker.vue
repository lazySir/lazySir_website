<template>
  <el-card class="min-h-screen max-w-6xl mx-auto space-y-10">
    <template #header>
      <span class="text-2xl font-semibold flex items-center"
        >🎨 前端颜色工具</span
      >
    </template>

    <!-- 1. 颜色对比 / 可读性检测 -->
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

    <!-- 2. 屏幕拾色器 -->
    <el-card shadow="hover">
      <template #header>
        <span class="text-lg font-semibold">屏幕取色器 (实验功能)</span>
      </template>
      <div class="flex gap-4 items-center">
        <el-button type="primary" @click="activatePicker"
          >点击屏幕任意位置取色</el-button
        >
        <span v-if="screenPickedColor" class="text-sm text-gray-600">
          已取色：<code class="font-mono">{{ screenPickedColor }}</code>
        </span>
      </div>
    </el-card>

    <!-- 3. 颜色拾取器 -->
    <el-card shadow="hover">
      <template #header>
        <span class="text-lg font-semibold">颜色拾取器</span>
      </template>
      <div class="flex items-center gap-4">
        <el-color-picker v-model="pickedColor" show-alpha class="!w-40" />
        <el-input v-model="pickedColor" class="w-52" />
      </div>
      <p class="mt-2 text-sm text-gray-600">
        当前颜色：<span class="font-mono">{{ pickedColor }}</span>
      </p>
    </el-card>

    <!-- 4. 颜色格式转换 -->
    <el-card shadow="hover">
      <template #header>
        <span class="text-lg font-semibold">颜色格式转换</span>
      </template>
      <div class="flex flex-wrap gap-4 items-start">
        <el-input
          v-model="rgbInput"
          placeholder="如 255,255,255"
          class="w-52"
        />
        <el-input v-model="hexInput" placeholder="#FFFFFF" class="w-52" />
      </div>
      <div class="mt-2 text-sm text-gray-600">
        RGB → HEX：<code class="font-mono">{{ rgbToHex(rgbInput) }}</code
        ><br />
        HEX → RGB：<code class="font-mono">{{ hexToRgb(hexInput) }}</code>
      </div>
    </el-card>

    <!-- 5. 渐变生成器 -->
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

    <!-- 7. 配色方案推荐器 -->
    <el-card shadow="hover">
      <template #header>
        <span class="text-lg font-semibold">配色方案推荐器</span>
      </template>

      <div class="flex items-center gap-4 mb-4">
        <el-color-picker v-model="pickedColor" show-alpha class="!w-40" />
        <el-input v-model="pickedColor" class="w-52" />
      </div>

      <div class="flex flex-wrap gap-6">
        <div
          v-for="(scheme, name) in colorSchemes"
          :key="name"
          class="flex flex-col items-center gap-2"
        >
          <div class="flex gap-1">
            <div
              v-for="c in scheme"
              :key="c"
              :style="{ backgroundColor: c }"
              class="w-12 h-12 rounded border shadow"
            ></div>
          </div>
          <div class="text-sm font-semibold text-gray-700">{{ name }}</div>
          <div v-if="scheme" class="text-xs font-mono text-gray-500">
            {{ scheme.join(' | ') }}
          </div>
        </div>
      </div>
    </el-card>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import chroma from 'chroma-js'

/* 颜色拾取相关 */
const pickedColor = ref('#3498db')
const rgbInput = ref('')
const hexInput = ref('')

const gradientStart = ref('#ff7e5f')
const gradientEnd = ref('#feb47b')
const gradientDirection = ref('to right')

const screenPickedColor = ref('')

/* 颜色对比检测 */
const contrastFg = ref('#000000')
const contrastBg = ref('#ffffff')

const contrastRatio = computed(() =>
  chroma.contrast(contrastFg.value, contrastBg.value),
)

const contrastPass = computed(() => contrastRatio.value >= 4.5)

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
</script>

<style scoped>
/* 如果你用 TailwindCSS，可以不用这里写额外样式 */
</style>
