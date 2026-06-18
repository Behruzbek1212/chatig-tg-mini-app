<script setup>
defineProps({ as: { type: String, default: 'div' } })
</script>

<template>
  <component :is="as" class="rounded-2xl bg-tg-bg shadow-soft" v-bind="$attrs">
    <slot />
  </component>
</template>
