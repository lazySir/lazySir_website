//导入所有图标并进行全局注册。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// element dark(内置暗黑模式)
import 'element-plus/theme-chalk/dark/css-vars.css'
import ElementPlus from 'element-plus'
export const setupElementPlus = (app: any) => {
    //注册图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }
    app.use(ElementPlus, {
        locale: zhCn,
    })
}
