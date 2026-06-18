<script setup>
defineOptions({ inheritAttrs: false })

const VARIANTS = {
  primary: 'bg-tg-button text-tg-button-text disabled:opacity-50',
  secondary: 'bg-tg-bg-secondary text-tg-text disabled:opacity-50',
  danger: 'bg-danger text-white disabled:opacity-50',
}
const SIZES = {
  md: 'h-11 px-4 text-[15px] gap-2',
  lg: 'h-12 px-5 text-base gap-2',
}

defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})
</script>

<template>
  <button
    v-bind="$attrs"
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex select-none items-center justify-center rounded-xl font-semibold transition-opacity disabled:cursor-not-allowed"
    :class="[VARIANTS[variant], SIZES[size], fullWidth ? 'w-full' : '']"
  >
    <svg v-if="loading" class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" class="opacity-25" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    </svg>
    <slot v-else name="icon" />
    <slot />
  </button>
</template>
