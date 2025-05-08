<script setup lang="ts">
interface Option {
  label: string
  value: string
}

const props = defineProps<{
  label: string
  options: Option[]
  selected: string
  optionType: 'previewTheme' | 'code'
}>()

const emit = defineEmits<{
  (
    e: 'change',
    value: { value: string; optionType: 'previewTheme' | 'code' },
  ): void
}>()

const handleSelect = (value: string) => {
  emit('change', { value, optionType: props.optionType })
}
</script>

<template>
  <div class="flex text-sm gap-3">
    <span>{{ label }}</span>
    <el-dropdown trigger="click">
      <el-button>{{ selected }}</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in options"
            :key="item.value"
            @click="handleSelect(item.value)"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
