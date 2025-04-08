import { getLightColor, getDarkColor, rgbaToHex } from "@/utils/color";
import { ElMessage } from 'element-plus';
import { storeToRefs } from "pinia";
import { useAdminGlobalStore } from '@/stores/admin/global';
import { useDark, useToggle } from '@vueuse/core'

//修改主题颜色
export const useThemeColor = () => {
    const adminGlobalStore = useAdminGlobalStore();
    const { theme, primary } = storeToRefs(adminGlobalStore);
    const changePrimary = (val: string | null) => {
        if (!val) {
            val = '#009688';
            ElMessage({ type: "success", message: `主题颜色已重置为 ${val}` });
        }

        // 如果是 rgba 格式，转换为十六进制
        if (val.startsWith("rgb")) {
            val = rgbaToHex(val);
        }

        // 计算主题颜色变化
        document.documentElement.style.setProperty("--el-color-primary", val);
        document.documentElement.style.setProperty(
            "--el-color-primary-dark-2",
            theme.value == 'dark' ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`
        );
        for (let i = 1; i <= 9; i++) {
            const primaryColor = theme.value == 'dark' ? `${getDarkColor(val, i / 10)}` : `${getLightColor(val, i / 10)}`;
            document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor);
        }
        adminGlobalStore.setPrimaryColor(val);
    };
    const initTheme = () => {
        changePrimary(primary.value);
    };
    return {
        initTheme,
        changePrimary
    }
}


//修改主题模式
export function useTheme() {
    // VueUse 提供的自动检测和存储
    const isDark = useDark();
    const toggleTheme = useToggle(isDark);

    return { isDark, toggleTheme };
}
