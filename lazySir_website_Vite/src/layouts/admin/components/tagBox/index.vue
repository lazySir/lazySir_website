<template>
  <div class="tagBox-container">

    <el-scrollbar height="30">
      <el-tabs @tab-change="tabClick" v-model="adminAsideStore.editableTabsValue" type="card" class="demo-tabs" closable
        @tab-remove="removeTab">

        <el-tab-pane v-for="(item, index) in adminAsideStore.tagList" :key="item.name" :label="item.meta.title"
          :name="item.name">
          <template #label>
            <IconifyIcon v-if="adminGlobalStore.isShowTabIcon" :name="item.meta.icon" />

            {{ item.meta.title }}
          </template>

        </el-tab-pane>

      </el-tabs>
    </el-scrollbar>
    <TagBoxMore class="more"></TagBoxMore>
  </div>
</template>
<script lang="ts" setup>

import TagBoxMore from '@/layouts/admin/components/tagBox/more.vue'
import { useAdminAsideStore } from '@/stores/admin/aside'
import { useAdminGlobalStore } from '@/stores/admin/global';
const adminGlobalStore = useAdminGlobalStore()


const adminAsideStore = useAdminAsideStore()


//移除标签页
const removeTab = (val: string) => {
  adminAsideStore.deleteTag(val)
}
const tabClick = (val: string
) => {
  adminAsideStore.pushPath(val)
}
</script>
<style scoped>
.tagBox-container {
  width: 100%;
  height: 30px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;

}

/* .el-tag {
  height: 25px;
  line-height: 25px;
  margin-top: 2px;
  margin-left: 5px;
  cursor: pointer;
} */


/* .more {
  position: absolute;
  right: 15px;
} */
/* 
.el-scrollbar {
  height: 100%;
} */

/* 设置 el-tabs 的整体高度 */
.demo-tabs {
  height: 30px;
  /* 整体高度 */


}

:deep(.el-tabs__nav-next) {
  height: 30px !important;
  line-height: 35px !important;

}

:deep(.el-tabs__nav-prev) {
  height: 30px !important;
  line-height: 35px !important;
}

/* 设置标签导航栏和内容区高度 */
:deep(.demo-tabs .el-tabs__nav) {
  height: 30px;
  /* 标签栏高度 */
  line-height: 30px;
  /* 垂直居中 */
}

:deep(.el-tabs__item) {
  color: #afafaf !important;
}

:deep(.is-active) {
  color: #009688 !important;
  border-bottom: 4px solid #009688 !important;
}

.el-tabs {
  --el-tabs-header-height: 30px
}

:deep(.el-tabs__header) {
  margin: 0;
  padding: 0;
}
</style>