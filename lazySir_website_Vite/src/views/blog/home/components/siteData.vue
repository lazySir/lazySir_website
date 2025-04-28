<script setup lang="ts">
import OpcityCard from '@/components/public/opcityCard.vue'
//加载脚本
// 这里使用了一个自定义的 loadScript 函数来加载外部脚本
import { loadScript } from '@/utils/index'
import { onMounted, ref } from 'vue'
// 建站时间
const launchDate = new Date('2025-04-27')
const siteDays = ref(0)

function calculateSiteDays() {
  const now = new Date()
  const diffTime = now.getTime() - launchDate.getTime()
  siteDays.value = Math.floor(diffTime / (1000 * 60 * 60 * 24)) // 转成天数
}
onMounted(() => {
  calculateSiteDays()
  loadScript(
    'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js',
    {
      async: true,
      reload: true,
    },
  )
})
</script>

<template>
  <OpcityCard class="w-[17vw] gap-2 flex flex-col">
    <span class="text-sm mb-2">📈站点数据</span>

    <div class="flex flex-col gap-2">
      <span>⏳建站天数： {{ siteDays }} 天</span>
      <span>📊总访问量：<span id="busuanzi_value_site_pv">0</span> 次</span>
      <span>👥总访人数：<span id="busuanzi_value_site_uv">0</span> 人</span>
    </div>
  </OpcityCard>
</template>

<style scoped></style>
