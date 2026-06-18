<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { closeApp, hideMainButton, haptic } from '../../lib/telegram.js'
import Button from '../../components/ui/Button.vue'
import { Icon } from '../../components/ui/icons.js'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  haptic('heavy')
  hideMainButton()
})
onUnmounted(hideMainButton)
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <div class="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success-50 text-success">
      <Icon.Check :size="40" />
    </div>
    <h1 class="text-xl font-bold text-tg-text">Buyurtma qabul qilindi!</h1>
    <p class="mt-2 text-[15px] text-tg-hint">
      Tez orada do'kon siz bilan bog'lanadi.
    </p>
    <p class="mt-1 text-sm text-tg-hint">
      Buyurtma raqami: <span class="font-semibold text-tg-text">#{{ route.params.publicId }}</span>
    </p>

    <div class="mt-8 flex w-full max-w-xs flex-col gap-2.5">
      <Button full-width size="lg" @click="closeApp">Yopish</Button>
      <Button variant="secondary" full-width @click="router.replace({ name: 'catalog' })">
        Yana xarid qilish
      </Button>
    </div>
  </div>
</template>
