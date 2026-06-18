<script setup>
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useTenant } from './store/tenant.js'
import { tg } from './lib/telegram.js'
import EmptyState from './components/ui/EmptyState.vue'
import { Icon } from './components/ui/icons.js'

const tenant = useTenant()
const debug = ref('')

onMounted(() => {
  // Telegram may populate start_param a tick after init — re-resolve here.
  tenant.resolve()

  if (!tenant.hasStore) {
    // Surface what we actually received so the cause is visible on-device.
    const raw = tg?.initData || ''
    const keys = raw ? [...new URLSearchParams(raw).keys()] : []
    debug.value = JSON.stringify(
      {
        hasTelegram: !!tg,
        start_param: tg?.initDataUnsafe?.start_param || null,
        initDataKeys: keys, // <-- does it contain "start_param"?
        hash: window.location.hash || '(empty)',
        search: window.location.search || '(empty)',
      },
      null,
      2,
    )
  }
})
</script>

<template>
  <div class="mx-auto min-h-screen max-w-lg bg-tg-bg">
    <template v-if="!tenant.hasStore">
      <EmptyState
        title="Do'kon topilmadi"
        description="Bu sahifani do'kon havolasi orqali oching."
      >
        <template #icon><Icon.Box :size="28" /></template>
      </EmptyState>
      <pre class="mx-4 overflow-x-auto rounded-lg bg-tg-bg-secondary p-3 text-[11px] text-tg-hint">{{ debug }}</pre>
    </template>
    <RouterView v-else />
  </div>
</template>
