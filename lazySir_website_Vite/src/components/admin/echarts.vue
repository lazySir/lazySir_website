<template>
  <div id="echarts" ref="chartRef" :style="echartsStyle" />
</template>

<script setup lang="ts" name="ECharts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
  markRaw,
  nextTick,
} from 'vue'
import echarts from '@/utils/eachrtsConfig'
import { useDebounceFn } from '@vueuse/core'

interface Props {
  option: any
  renderer?: 'canvas' | 'svg'
  resize?: boolean
  theme?: Object | string
  width?: number | string
  height?: number | string
  onClick?: (event: any) => any
}

const props = withDefaults(defineProps<Props>(), {
  renderer: 'canvas',
  resize: true,
})

const echartsStyle = computed(() => {
  return props.width || props.height
    ? { height: props.height + 'px', width: props.width + 'px' }
    : { height: '100%', width: '100%' }
})

const chartRef = ref<HTMLDivElement | HTMLCanvasElement>()
const chartInstance = ref()

const draw = () => {
  if (chartInstance.value) {
    chartInstance.value.setOption(props.option, { notMerge: true })
  }
}

watch(props, () => {
  draw()
})

const handleClick = (event: any) => props.onClick && props.onClick(event)

const init = () => {
  if (!chartRef.value) return
  chartInstance.value = echarts.getInstanceByDom(chartRef.value)

  if (!chartInstance.value) {
    chartInstance.value = markRaw(
      echarts.init(chartRef.value, props.theme, {
        renderer: props.renderer,
      }),
    )
    chartInstance.value.on('click', handleClick)
    draw()
  }
}

const resize = () => {
  if (chartInstance.value && props.resize) {
    chartInstance.value.resize({ animation: { duration: 300 } })
  }
}

const debouncedResize = useDebounceFn(resize, 300, { maxWait: 800 })

onMounted(() => {
  nextTick(() => init())
  window.addEventListener('resize', debouncedResize)
})

onBeforeUnmount(() => {
  chartInstance.value?.dispose()
  window.removeEventListener('resize', debouncedResize)
})

defineExpose({
  getInstance: () => chartInstance.value,
  resize,
  draw,
})
</script>
