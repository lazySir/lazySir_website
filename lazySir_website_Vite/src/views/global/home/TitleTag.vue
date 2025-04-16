<script setup lang="ts">
interface Props {
  icon: string
  content: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="mt-4 flex items-center gap-2">
    <IconifyIcon :name="props.icon" />
    <span>{{ props.content }}</span>
  </div>
</template>

<style scoped></style>
