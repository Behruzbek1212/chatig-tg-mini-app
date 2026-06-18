<script setup>
import { ref, reactive, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../../store/cart.js'
import { useCreateOrder } from '../catalog/hooks.js'
import { formatMoney, isPhoneComplete, phoneDigits } from '../../lib/format.js'
import {
  setMainButton,
  hideMainButton,
  showBackButton,
  tgUser,
  requestContact,
  haptic,
} from '../../lib/telegram.js'
import Button from '../../components/ui/Button.vue'
import { Icon } from '../../components/ui/icons.js'

const router = useRouter()
const cart = useCart()
const createOrder = useCreateOrder()

const form = reactive({
  customer_name: tgUser()?.first_name || '',
  phone: '',
  customer_address: '',
  notes: '',
})
const error = ref('')

const valid = computed(
  () => form.customer_name.trim().length > 0 && isPhoneComplete(form.phone),
)

if (cart.isEmpty) router.replace({ name: 'catalog' })

async function shareContact() {
  const phone = await requestContact()
  if (phone) form.phone = phone
}

async function submit() {
  error.value = ''
  if (!valid.value) {
    error.value = 'Ism va to\'liq telefon raqamini kiriting.'
    return
  }
  try {
    haptic('medium')
    const order = await createOrder.mutateAsync({
      items: cart.orderItems(),
      customer_name: form.customer_name.trim(),
      customer_phone: phoneDigits(form.phone),
      customer_address: form.customer_address.trim() || null,
      notes: form.notes.trim() || null,
    })
    cart.clear()
    router.replace({ name: 'order-success', params: { publicId: order.public_id } })
  } catch (e) {
    error.value = e?.message || 'Buyurtma berishda xatolik.'
  }
}

const cleanups = []
cleanups.push(showBackButton(() => router.back()))

watch(
  [valid, () => createOrder.isPending.value],
  () => {
    cleanups.push(
      setMainButton('Buyurtmani tasdiqlash', submit, { enabled: valid.value && !createOrder.isPending.value }),
    )
  },
  { immediate: true },
)

onUnmounted(() => {
  cleanups.forEach((fn) => fn())
  hideMainButton()
})
</script>

<template>
  <div class="px-4 pb-8 pt-3">
    <h1 class="mb-4 text-xl font-bold text-tg-text">Buyurtma berish</h1>

    <div class="space-y-3">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-tg-text">Ism *</label>
        <input
          v-model="form.customer_name"
          placeholder="Ismingiz"
          class="h-11 w-full rounded-xl bg-tg-bg-secondary px-3.5 text-[15px] text-tg-text outline-none placeholder:text-tg-hint"
        />
      </div>

      <div>
        <div class="mb-1.5 flex items-center justify-between">
          <label class="block text-sm font-medium text-tg-text">Telefon *</label>
          <button type="button" class="text-xs font-semibold text-tg-link" @click="shareContact">
            Kontaktni ulashish
          </button>
        </div>
        <input
          v-model="form.phone"
          inputmode="tel"
          placeholder="+998 90 123 45 67"
          class="h-11 w-full rounded-xl bg-tg-bg-secondary px-3.5 text-[15px] text-tg-text outline-none placeholder:text-tg-hint"
        />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-tg-text">Manzil</label>
        <textarea
          v-model="form.customer_address"
          rows="2"
          placeholder="Yetkazib berish manzili"
          class="w-full resize-y rounded-xl bg-tg-bg-secondary px-3.5 py-2.5 text-[15px] text-tg-text outline-none placeholder:text-tg-hint"
        />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-tg-text">Izoh</label>
        <textarea
          v-model="form.notes"
          rows="2"
          placeholder="Qo'shimcha izoh (ixtiyoriy)"
          class="w-full resize-y rounded-xl bg-tg-bg-secondary px-3.5 py-2.5 text-[15px] text-tg-text outline-none placeholder:text-tg-hint"
        />
      </div>
    </div>

    <div class="mt-5 flex items-center justify-between rounded-2xl bg-tg-bg-secondary p-4 text-base font-bold text-tg-text">
      <span>Jami</span>
      <span>{{ formatMoney(cart.total) }}</span>
    </div>

    <p v-if="error" class="mt-3 text-sm text-danger">{{ error }}</p>

    <!-- Fallback button for browser/dev where Telegram MainButton is absent -->
    <Button
      class="mt-4"
      full-width
      size="lg"
      :loading="createOrder.isPending"
      :disabled="!valid"
      @click="submit"
    >
      <template #icon><Icon.Check :size="18" /></template>
      Buyurtmani tasdiqlash
    </Button>
  </div>
</template>
