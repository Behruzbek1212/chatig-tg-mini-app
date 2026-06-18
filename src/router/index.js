import { createRouter, createWebHistory } from 'vue-router'
import CatalogPage from '../features/catalog/CatalogPage.vue'
import ProductDetailPage from '../features/catalog/ProductDetailPage.vue'
import CartPage from '../features/cart/CartPage.vue'
import CheckoutPage from '../features/checkout/CheckoutPage.vue'
import OrderSuccessPage from '../features/checkout/OrderSuccessPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'catalog', component: CatalogPage },
    { path: '/product/:id', name: 'product', component: ProductDetailPage },
    { path: '/cart', name: 'cart', component: CartPage },
    { path: '/checkout', name: 'checkout', component: CheckoutPage },
    { path: '/order/:publicId', name: 'order-success', component: OrderSuccessPage },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
