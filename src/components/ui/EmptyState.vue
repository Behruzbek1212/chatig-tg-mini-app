<script setup>
defineProps({
  title: { type: String, required: true },
  description: String,
})
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-tg-bg-secondary text-tg-hint">
      <slot name="icon" />
    </div>
    <h3 class="text-base font-semibold text-tg-text">{{ title }}</h3>
    <p v-if="description" class="mt-1.5 max-w-xs text-sm text-tg-hint">{{ description }}</p>
    <div v-if="$slots.action" class="mt-5"><slot name="action" /></div>
  </div>
</template>
