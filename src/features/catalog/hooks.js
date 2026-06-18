import { unref } from 'vue'
import { useQuery, useMutation, keepPreviousData } from '@tanstack/vue-query'
import { catalogApi } from '../../lib/api/catalog.js'
import { useTenant } from '../../store/tenant.js'

export function useStoreInfo() {
  const tenant = useTenant()
  return useQuery({
    queryKey: ['store', tenant.storeId],
    queryFn: () => catalogApi.storeInfo(tenant.storeId).then((r) => r.data),
    enabled: tenant.hasStore,
  })
}

export function useCatalog(params) {
  const tenant = useTenant()
  return useQuery({
    queryKey: ['products', tenant.storeId, params],
    queryFn: () => catalogApi.list(tenant.storeId, unref(params)),
    enabled: tenant.hasStore,
    placeholderData: keepPreviousData,
  })
}

export function useProduct(id) {
  const tenant = useTenant()
  return useQuery({
    queryKey: ['product', tenant.storeId, unref(id)],
    queryFn: () => catalogApi.get(tenant.storeId, unref(id)).then((r) => r.data),
    enabled: tenant.hasStore,
  })
}

export function useCreateOrder() {
  const tenant = useTenant()
  return useMutation({
    mutationFn: (payload) => catalogApi.createOrder(tenant.storeId, payload).then((r) => r.data),
  })
}
