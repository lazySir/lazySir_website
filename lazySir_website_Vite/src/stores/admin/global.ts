import { defineStore } from 'pinia'
import { useColorMode } from '@vueuse/core'
interface GlobalTypes {
    // 布局模式 (纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns)
    layoutTypes: "vertical" | "classic" | "transverse" | "columns";
    // 主题
    themeTypes: "light" | "dark" | "auto";
    AssemblySizeType: "large" | "default" | "small";
}
export const useAdminGlobalStore = defineStore("adminGlobalStore", {
    // 开启数据持久化
    persist: {
        // enabled:true,
        storage: window.localStorage,
    },
    state: () => {
        return {
            // 布局模式 (纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns)
            layout: 'vertical',
            //侧边栏是否折叠
            isCollapse: false,
            //是否显示面包屑
            isShowBread: true,
            //是否显示面包屑图标
            isShowBreadIcon: true,
            //是否显示标签栏
            isShowTab: true,
            //是否显示标签栏图标
            isShowTabIcon: true,
            //是否显示页脚
            isShowFooter: true,
            //语言
            // language: 'zh',
            //主题
            theme: 'auto' as GlobalTypes["themeTypes"],
            //水印
            watermark: false,
            // element 组件大小
            assemblySize: "default",
            //全局主题颜色
            primary: '#009688'
        };
    },
    getters: {
    },
    actions: {
        // 侧边栏折叠
        Collapse() {
            this.isCollapse = !this.isCollapse;
        },
        //改变侧边栏折叠状态
        changeCollapse() {
            this.isCollapse = !this.isCollapse
        },
        //改变布局模式
        setLayout(val: GlobalTypes["layoutTypes"]) {
            this.layout = val
        },
        //设置主题
        setTheme(val: GlobalTypes["themeTypes"]) {
            const colorMode = useColorMode()
            this.theme = val
            colorMode.value = val
        },
        //
        setSize(val: GlobalTypes['AssemblySizeType']) {
            this.assemblySize = val
        },
        setPrimaryColor(val: string) {
            this.primary = val
        }
    },
});
