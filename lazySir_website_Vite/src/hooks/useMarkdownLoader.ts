// src/composables/useMarkdownLoader.ts
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { markdownMap } from '@/utils/markdownMap'

export function useMarkdownLoader(path?: string) {
    const route = useRoute()
    const content = ref('# 正在加载...')
    const realPath = ref(path || (route.params.path as string))

    const load = async () => {
        const loader = markdownMap[realPath.value]

        if (loader) {
            content.value = await loader()
        } else {
            content.value = '# ❌ 找不到对应文章'
        }
    }

    onMounted(load)

    // 如果路径是传进来的，可以动态监听变化
    watch(() => path, (newVal) => {
        if (newVal) {
            realPath.value = newVal
            load()
        }
    })

    return {
        content,
        reload: load,
        path: realPath,
    }
}
