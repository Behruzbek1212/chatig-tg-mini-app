<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProduct } from './hooks.js'
import { useCart } from '../../store/cart.js'
import { formatMoney } from '../../lib/format.js'
import { setMainButton, hideMainButton, showBackButton, haptic } from '../../lib/telegram.js'
import Skeleton from '../../components/ui/Skeleton.vue'
import QtyStepper from '../../components/ui/QtyStepper.vue'
import { Icon } from '../../components/ui/icons.js'

const route = useRoute()
const router = useRouter()
const cart = useCart()

const { data: product, isLoading } = useProduct(() => route.params.id)
const qty = ref(1)
const activeImage = ref(0)

const outOfStock = computed(() => product.value?.out_of_stock)
const maxQty = computed(() => Math.max(1, product.value?.quantity || 1))

function addToCart() {
  if (!product.value || outOfStock.value) return
  haptic('medium')
  cart.add(product.value, qty.value)
  router.push({ name: 'cart' })
}

const cleanups = []
cleanups.push(showBackButton(() => router.back()))

watch(
  [product, outOfStock],
  () => {
    if (!product.value) return
    if (outOfStock.value) {
      hideMainButton()
    } else {
      cleanups.push(setMainButton('Savatga qo\'shish', addToCart))
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  cleanups.forEach((fn) => fn())
  hideMainButton()
})
</script>

<template>
  <div class="pb-8">
    <div v-if="isLoading" class="p-4">
      <Skeleton class="aspect-square w-full rounded-2xl" />
      <Skeleton class="mt-4 h-6 w-2/3" />
      <Skeleton class="mt-2 h-5 w-1/3" />
    </div>

    <template v-else-if="product">
      <div class="aspect-square w-full bg-tg-bg-secondary">
        <img
          v-if="product.images?.length"
          :src="product.images[activeImage]?.url"
          :alt="product.name"
          class="h-full w-full object-cover"
        />
        <div v-else class="flex h-full items-center justify-center text-tg-hint">
          <Icon.Box :size="48" />
        </div>
      </div>

      <div v-if="product.images?.length > 1" class="flex gap-2 overflow-x-auto px-4 py-2">
        <button
          v-for="(img, i) in product.images"
          :key="img.id"
          type="button"
          class="h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2"
          :class="i === activeImage ? 'border-tg-button' : 'border-transparent'"
          @click="activeImage = i"
        >
          <img :src="img.url" class="h-full w-full object-cover" />
        </button>
      </div>

      <div class="px-4 pt-3">
        <h1 class="text-lg font-bold text-tg-text">{{ product.name }}</h1>
        <p class="mt-1 text-xl font-bold text-tg-text">{{ formatMoney(product.price) }}</p>

        <p v-if="outOfStock" class="mt-1 text-sm font-medium text-danger">Omborda tugagan</p>
        <p v-else-if="product.low_stock" class="mt-1 text-sm text-tg-hint">
          Kam qoldi ({{ product.quantity }} ta)
        </p>

        <p v-if="product.description" class="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-tg-text">
          {{ product.description }}
        </p>

        <div v-if="!outOfStock" class="mt-5 flex items-center justify-between">
          <span class="text-sm text-tg-hint">Miqdor</span>
          <QtyStepper v-model="qty" :max="maxQty" />
        </div>
      </div>
    </template>
  </div>
</template>
