<script setup>
import { ref, computed, watch, onActivated, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalog, useStoreInfo } from './hooks.js'
import { useCart } from '../../store/cart.js'
import { formatMoney } from '../../lib/format.js'
import { setMainButton, hideMainButton, haptic } from '../../lib/telegram.js'
import Card from '../../components/ui/Card.vue'
import Skeleton from '../../components/ui/Skeleton.vue'
import EmptyState from '../../components/ui/EmptyState.vue'
import { Icon } from '../../components/ui/icons.js'

const router = useRouter()
const cart = useCart()

const q = ref('')
const debouncedQ = ref('')
let t
watch(q, (v) => {
  clearTimeout(t)
  t = setTimeout(() => (debouncedQ.value = v), 350)
})

const params = computed(() => ({ q: debouncedQ.value || undefined, per_page: 30 }))

const { data: store } = useStoreInfo()
const { data, isLoading, isError } = useCatalog(params)
const products = computed(() => data.value?.data || [])

function open(p) {
  haptic()
  router.push({ name: 'product', params: { id: p.id } })
}

function syncMainButton() {
  if (cart.count > 0) {
    setMainButton(`Savatcha (${cart.count}) · ${formatMoney(cart.total)}`, () =>
      router.push({ name: 'cart' }),
    )
  } else {
    hideMainButton()
  }
}

watch(() => cart.count, syncMainButton)
onMounted(syncMainButton)
onActivated(syncMainButton)
onUnmounted(hideMainButton)
</script>

<template>
  <div class="px-4 pb-6 pt-3">
    <h1 class="text-xl font-bold text-tg-text">{{ store?.name || 'Katalog' }}</h1>

    <div class="relative my-3">
      <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-tg-hint">
        <Icon.Search :size="18" />
      </span>
      <input
        v-model="q"
        placeholder="Mahsulot qidirish..."
        class="h-11 w-full rounded-xl bg-tg-bg-secondary pl-10 pr-3 text-[15px] text-tg-text outline-none placeholder:text-tg-hint"
      />
    </div>

    <div v-if="isLoading" class="grid grid-cols-2 gap-3">
      <Card v-for="i in 6" :key="i" class="overflow-hidden">
        <Skeleton class="aspect-square w-full" />
        <div class="space-y-2 p-2.5">
          <Skeleton class="h-3.5 w-3/4" />
          <Skeleton class="h-3.5 w-1/2" />
        </div>
      </Card>
    </div>

    <EmptyState v-else-if="isError" title="Yuklashda xatolik" description="Keyinroq urinib ko'ring.">
      <template #icon><Icon.Box :size="28" /></template>
    </EmptyState>

    <EmptyState
      v-else-if="products.length === 0"
      title="Mahsulot topilmadi"
      :description="debouncedQ ? 'Boshqa so\'z bilan qidiring.' : 'Hozircha katalog bo\'sh.'"
    >
      <template #icon><Icon.Box :size="28" /></template>
    </EmptyState>

    <div v-else class="grid grid-cols-2 gap-3">
      <Card
        v-for="p in products"
        :key="p.id"
        as="button"
        type="button"
        class="overflow-hidden text-left"
        @click="open(p)"
      >
        <div class="aspect-square w-full bg-tg-bg-secondary">
          <img
            v-if="p.images?.[0]?.url"
            :src="p.images[0].url"
            :alt="p.name"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full items-center justify-center text-tg-hint">
            <Icon.Box :size="32" />
          </div>
        </div>
        <div class="p-2.5">
          <p class="line-clamp-2 text-sm font-medium text-tg-text">{{ p.name }}</p>
          <p class="mt-1 text-sm font-bold text-tg-text">{{ formatMoney(p.price) }}</p>
          <p v-if="p.out_of_stock" class="text-xs text-danger">Tugagan</p>
          <p v-else-if="p.low_stock" class="text-xs text-tg-hint">Kam qoldi</p>
        </div>
      </Card>
    </div>
  </div>
</template>
