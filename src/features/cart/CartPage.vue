<script setup>
import { watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../../store/cart.js'
import { formatMoney } from '../../lib/format.js'
import { setMainButton, hideMainButton, showBackButton } from '../../lib/telegram.js'
import QtyStepper from '../../components/ui/QtyStepper.vue'
import EmptyState from '../../components/ui/EmptyState.vue'
import { Icon } from '../../components/ui/icons.js'

const router = useRouter()
const cart = useCart()

const cleanups = []
cleanups.push(showBackButton(() => router.push({ name: 'catalog' })))

function syncMainButton() {
  if (cart.isEmpty) {
    hideMainButton()
  } else {
    cleanups.push(
      setMainButton(`Buyurtma berish · ${formatMoney(cart.total)}`, () =>
        router.push({ name: 'checkout' }),
      ),
    )
  }
}
watch(() => cart.count, syncMainButton, { immediate: true })

onUnmounted(() => {
  cleanups.forEach((fn) => fn())
  hideMainButton()
})
</script>

<template>
  <div class="px-4 pb-6 pt-3">
    <h1 class="mb-3 text-xl font-bold text-tg-text">Savatcha</h1>

    <EmptyState
      v-if="cart.isEmpty"
      title="Savatcha bo'sh"
      description="Katalogdan mahsulot tanlang."
    >
      <template #icon><Icon.Cart :size="28" /></template>
    </EmptyState>

    <div v-else class="space-y-3">
      <div
        v-for="item in cart.items"
        :key="item.product_id"
        class="flex gap-3 rounded-2xl bg-tg-bg-secondary p-2.5"
      >
        <div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-tg-bg">
          <img v-if="item.image" :src="item.image" class="h-full w-full object-cover" />
          <div v-else class="flex h-full items-center justify-center text-tg-hint">
            <Icon.Box :size="24" />
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <p class="line-clamp-1 text-sm font-medium text-tg-text">{{ item.name }}</p>
          <p class="text-sm font-bold text-tg-text">{{ formatMoney(item.price * item.quantity) }}</p>
          <div class="mt-1.5 flex items-center justify-between">
            <QtyStepper
              :model-value="item.quantity"
              @update:model-value="(v) => cart.setQty(item.product_id, v)"
            />
            <button
              type="button"
              class="rounded-lg p-2 text-tg-hint"
              aria-label="O'chirish"
              @click="cart.remove(item.product_id)"
            >
              <Icon.Trash :size="18" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-2 text-base font-bold text-tg-text">
        <span>Jami</span>
        <span>{{ formatMoney(cart.total) }}</span>
      </div>
    </div>
  </div>
</template>
