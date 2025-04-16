<template>
  <figure
    class="relative cursor-pointer overflow-hidden rounded-xl border border-gray-950/[.1] bg-gray-950/[.01] p-4 hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
  >
    <div class="flex flex-row items-center gap-2">
      <img :src="img" class="w-[384px] h-[240px]" alt="" />
    </div>
    <div class="flex flex-col justify-center items-center">
      <blockquote class="mt-2 text-xl">{{ text }}</blockquote>
      <blockquote class="mt-2 text-sm text-blue-400">{{ link }}</blockquote>
    </div>
  </figure>
</template>

<script lang="ts" setup>
interface Props {
  img: string
  text: string
  link: string
}

defineProps<Props>()
</script>
