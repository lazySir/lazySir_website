<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <label class="inline-flex items-center relative h-[32px]">
    <!-- v-model 改为 @change 事件手动调用 toggleTheme() -->
    <input
      :checked="isDark"
      @change="toggleTheme()"
      class="peer hidden"
      type="checkbox"
    />
    <div
      class="relative w-[60px] h-[32px] bg-white peer-checked:bg-zinc-500 rounded-full after:absolute after:content-[''] after:w-[24px] after:h-[24px] after:bg-gradient-to-r from-orange-500 to-yellow-400 peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 after:rounded-full after:top-[4px] after:left-[4px] active:after:w-[28px] peer-checked:after:left-[100%] peer-checked:after:translate-x-[-100%] shadow-sm duration-300 after:duration-300 after:shadow-md"
    ></div>
    <svg
      height="0"
      width="100"
      viewBox="0 0 24 24"
      class="fill-white peer-checked:opacity-60 absolute w-4 h-4 left-[6px]"
    >
      <path
        d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z"
      ></path>
    </svg>
  </label>
</template>
