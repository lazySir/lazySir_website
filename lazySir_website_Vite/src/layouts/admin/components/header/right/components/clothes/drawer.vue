<template>
    <el-drawer min-size="20%" size="20%" class="drawer" v-model="drawer">
        <template #header>
            <h1 class="title">
                <!-- <span>{{ $t("header.layoutSetting") }}</span> -->
                <span>布局设置</span>
            </h1>
        </template>
        <template #default>
            <!-- 布局切换 -->
            <el-scrollbar>
                <el-divider class="divider" content-position="center">
                    <el-icon>
                        <Notification />
                    </el-icon>
                    <!-- <span>{{ $t('header.layoutSwitching') }}</span> -->
                    <span>布局切换</span>
                </el-divider>
                <div class="layout-box mb30">
                    <div :class="['layout-item layout-vertical', { 'is-active': adminGlobalStore.layout == 'vertical' }]"
                        @click="setLayout('vertical')">
                        <div class="layout-dark"></div>
                        <div class="layout-container">
                            <div class="layout-light"></div>
                            <div class="layout-content"></div>
                        </div>
                        <el-icon v-if="adminGlobalStore.layout == 'vertical'">
                            <CircleCheckFilled />
                        </el-icon>
                    </div>

                    <div :class="['layout-item layout-classic', { 'is-active': adminGlobalStore.layout == 'classic' }]"
                        @click="setLayout('classic')">
                        <div class="layout-dark"></div>
                        <div class="layout-container">
                            <div class="layout-light"></div>
                            <div class="layout-content"></div>
                        </div>
                        <el-icon v-if="adminGlobalStore.layout == 'classic'">
                            <CircleCheckFilled />
                        </el-icon>
                    </div>

                    <div :class="['layout-item layout-transverse', { 'is-active': adminGlobalStore.layout == 'transverse' }]"
                        @click="setLayout('transverse')">
                        <div class="layout-dark"></div>
                        <div class="layout-content"></div>
                        <el-icon v-if="adminGlobalStore.layout == 'transverse'">
                            <CircleCheckFilled />
                        </el-icon>
                    </div>

                    <div :class="['layout-item layout-columns', { 'is-active': adminGlobalStore.layout == 'columns' }]"
                        @click="setLayout('columns')">
                        <div class="layout-dark"></div>
                        <div class="layout-light"></div>
                        <div class="layout-content"></div>
                        <el-icon v-if="adminGlobalStore.layout == 'columns'">
                            <CircleCheckFilled />
                        </el-icon>
                    </div>
                </div>
                <!-- 全局主题 -->
                <el-divider class="divider" content-position="center">
                    <el-icon>
                        <ColdDrink />
                    </el-icon>
                    <!-- <span>{{ $t('header.topicGlobal') }}</span> -->
                    <span>全局主题</span>
                </el-divider>
                <div class="drawer_item">
                    <!-- <span> {{ $t('header.themeColor') }}</span> -->
                    <span>主题颜色</span>
                    <ThemeColor></ThemeColor>
                </div>
                <!-- 主题模式 -->
                <div class="drawer_item">
                    <!-- <span>{{ $t('header.themeModel') }}</span> -->
                    <span>主题类型</span>
                    <ThemeTypes></ThemeTypes>
                </div>

                <!-- 界面设置 -->
                <el-divider class="divider" content-position="center">
                    <el-icon>
                        <Setting />
                    </el-icon>
                    <!-- <span>{{ $t('header.interfaceDesign') }}</span> -->
                    <span>界面设计</span>
                </el-divider>
                <div class="drawer_item">
                    <!-- <span>{{ $t('header.foldingMenu') }}</span> -->
                    <span>折叠菜单</span>
                    <el-switch v-model="adminGlobalStore.isCollapse"></el-switch>
                </div>
                <div class="drawer_item">
                    <!-- <span>{{ $t('header.tabIcons') }}</span> -->
                    <span>水印</span>
                    <el-switch v-model="adminGlobalStore.watermark"></el-switch>
                </div>
                <div class="drawer_item">
                    <!-- <span>{{ $t('header.breadCrumbs') }}</span> -->
                    <span>面包屑</span>
                    <el-switch v-model="adminGlobalStore.isShowBread"></el-switch>
                </div>
                <div class="drawer_item">
                    <!-- <span>{{ $t('header.breadCrumbsIcons') }}</span> -->
                    <span>面包屑图标</span>
                    <el-switch v-model="adminGlobalStore.isShowBreadIcon"></el-switch>
                </div>
                <div class="drawer_item">
                    <!-- <span>{{ $t('header.tab') }}</span> -->
                    <span>标签页</span>
                    <el-switch v-model="adminGlobalStore.isShowTab"></el-switch>
                </div>
                <div class="drawer_item">
                    <!-- <span>{{ $t('header.tabIcons') }}</span> -->
                    <span>标签页图标</span>
                    <el-switch v-model="adminGlobalStore.isShowTabIcon"></el-switch>
                </div>
                <div class="drawer_item">
                    <!-- <span>{{ $t('header.footer') }}</span> -->
                    <span>页脚</span>
                    <el-switch v-model="adminGlobalStore.isShowFooter"></el-switch>
                </div>
            </el-scrollbar>

        </template>
    </el-drawer>
</template>
<script lang="ts" setup>
import { Notification, Setting, CircleCheckFilled, ColdDrink } from "@element-plus/icons-vue";
import { useAdminGlobalStore } from "@/stores/admin/global";
import ThemeColor from '@/theme/color.vue'
import ThemeTypes from '@/theme/Types.vue'
const adminGlobalStore = useAdminGlobalStore()
import { ref } from 'vue'
const setLayout = (val: any) => {
    adminGlobalStore.setLayout(val)
}
const drawer = ref(false)
const showDrawer = () => {
    drawer.value = true
}
//暴露方法
defineExpose({ showDrawer })
</script>
<style scoped>
.divider {
    margin-top: 15px;
}

.title {
    color: #303133;
    font-size: 17px;
}

.drawer_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin: 14px 0;
    color: #000;
}

.theme-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 14px 0;
}

.theme-item span {
    display: flex;
    align-items: center;
    font-size: 14px;
}

.theme-item span .el-icon {
    margin-left: 3px;
    font-size: 15px;
    color: var(--el-text-color-regular);
    cursor: pointer;
}

.layout-box {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 10px 0 0;
}

.layout-box .layout-item {
    position: relative;
    box-sizing: border-box;
    width: 117px;
    height: 81px;
    padding: 6px;
    margin-bottom: 20px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--el-border-color-lighter);
    transition: all 0.2s;
}

.layout-box .layout-item .layout-dark {
    background-color: var(--el-color-primary);
    border-radius: 3px;
}

.layout-box .layout-item .layout-light {
    background-color: var(--el-color-primary-light-5);
    border-radius: 3px;
}

.layout-box .layout-item .layout-content {
    background-color: var(--el-color-primary-light-8);
    border: 1px dashed var(--el-color-primary);
    border-radius: 3px;
}

.layout-box .layout-item .el-icon {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: var(--el-color-primary);
    transition: all 0.2s;
}

.layout-box .layout-item:hover {
    box-shadow: 0 0 5px 1px var(--el-border-color-darker);
}

.layout-box .is-active {
    box-shadow: 0 0 0 2px var(--el-color-primary) !important;
}

.layout-box .layout-vertical {
    display: flex;
    justify-content: space-between;
}

.layout-box .layout-vertical .layout-dark {
    width: 20%;
}

.layout-box .layout-vertical .layout-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 72%;
}

.layout-box .layout-vertical .layout-light {
    height: 20%;
}

.layout-box .layout-vertical .layout-content {
    height: 67%;
}

.layout-box .layout-classic {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.layout-box .layout-classic .layout-dark {
    height: 22%;
}

.layout-box .layout-classic .layout-container {
    display: flex;
    justify-content: space-between;
    height: 70%;
}

.layout-box .layout-classic .layout-light {
    width: 20%;
}

.layout-box .layout-classic .layout-content {
    width: 70%;
}

.layout-box .layout-transverse {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.layout-box .layout-transverse .layout-dark {
    height: 20%;
}

.layout-box .layout-transverse .layout-content {
    height: 67%;
}

.layout-box .layout-columns {
    display: flex;
    justify-content: space-between;
}

.layout-box .layout-columns .layout-dark {
    width: 14%;
}

.layout-box .layout-columns .layout-light {
    width: 17%;
}

.layout-box .layout-columns .layout-content {
    width: 55%;
}
</style>