<script setup>
import { Icon } from './icons.js'

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 },
})
const emit = defineEmits(['update:modelValue'])

function dec() {
  if (props.modelValue > props.min) emit('update:modelValue', props.modelValue - 1)
}
function inc() {
  if (props.modelValue < props.max) emit('update:modelValue', props.modelValue + 1)
}
</script>

<template>
  <div class="inline-flex items-center gap-3 rounded-xl bg-tg-bg-secondary p-1">
    <button
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded-lg bg-tg-bg text-tg-text disabled:opacity-40"
      :disabled="modelValue <= min"
      @click="dec"
    >
      <Icon.Minus :size="16" />
    </button>
    <span class="min-w-[1.5rem] text-center text-sm font-semibold text-tg-text">{{ modelValue }}</span>
    <button
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded-lg bg-tg-bg text-tg-text disabled:opacity-40"
      :disabled="modelValue >= max"
      @click="inc"
    >
      <Icon.Plus :size="16" />
    </button>
  </div>
</template>
