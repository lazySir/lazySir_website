<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Option {
  label: string
  value: string
}

const props = defineProps<{
  options: Option[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onSelect = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="select">
    <div
      class="selected"
      v-bind="
        options.reduce(
          (acc, opt, i) => ({ ...acc, [`data-${i}`]: opt.label }),
          {},
        )
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        viewBox="0 0 512 512"
        class="arrow"
      >
        <path
          d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
        ></path>
      </svg>
    </div>
    <div class="options">
      <div
        v-for="(option, index) in options"
        :key="option.value"
        :title="option.value"
      >
        <input
          :id="option.value"
          name="option"
          type="radio"
          :checked="modelValue === option.value"
          @change="onSelect(option.value)"
        />
        <label
          class="option"
          :for="option.value"
          :data-txt="option.label"
        ></label>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* From Uiverse.io by 3bdel3ziz-T */
.select {
  width: fit-content;
  cursor: pointer;
  position: relative;
  transition: 300ms;
  color: white;
  overflow: hidden;
}

.selected {
  background-color: #2a2f3b;
  padding: 5px;
  margin-bottom: 3px;
  border-radius: 5px;
  position: relative;
  z-index: 100000;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.arrow {
  position: relative;
  right: 0px;
  height: 10px;
  transform: rotate(-90deg);
  width: 25px;
  fill: white;
  z-index: 100000;
  transition: 300ms;
}

.options {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding: 5px;
  background-color: #2a2f3b;
  position: relative;
  top: -100px;
  opacity: 0;
  transition: 300ms;
}

.select:hover > .options {
  opacity: 1;
  top: 0;
}

.select:hover > .selected .arrow {
  transform: rotate(0deg);
}

.option {
  border-radius: 5px;
  padding: 5px;
  transition: 300ms;
  background-color: #2a2f3b;
  width: 150px;
  font-size: 15px;
}
.option:hover {
  background-color: #323741;
}

.options input[type='radio'] {
  display: none;
}

.options label {
  display: inline-block;
}
.options label::before {
  content: attr(data-txt);
}

.options input[type='radio']:checked + label {
  display: none;
}

.options input[type='radio']#all:checked + label {
  display: none;
}

.select:has(.options input[type='radio']#all:checked) .selected::before {
  content: attr(data-default);
}
.select:has(.options input[type='radio']#option-1:checked) .selected::before {
  content: attr(data-one);
}
.select:has(.options input[type='radio']#option-2:checked) .selected::before {
  content: attr(data-two);
}
.select:has(.options input[type='radio']#option-3:checked) .selected::before {
  content: attr(data-three);
}
</style>
