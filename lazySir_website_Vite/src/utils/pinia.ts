import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import router from '@/router'
import { Router } from 'vue-router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

declare module 'pinia' {
    export interface PiniaCustomProperties {
        router: Router,
    }
}

export const setupPinia = (app: any) => {
    const pinia = createPinia()
    pinia.use(({ store }) => {
        store.router = markRaw(router)
    })

    //持久化pinia
    pinia.use(piniaPluginPersistedstate)

    app.use(pinia)
}
