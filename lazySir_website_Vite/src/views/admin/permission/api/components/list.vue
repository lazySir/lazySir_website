<script setup lang="ts">
import { useAdminApiStore } from '@/stores/admin/api'
import type { TableColumnCtx } from 'element-plus'
import { onMounted, ref } from 'vue'

const adminApiStore = useAdminApiStore()
const sortedList = ref<AdminApiTypes.Api[]>([])

onMounted(async () => {
  await adminApiStore.getApiList({ page: 1, limit: 9999 })

  // 对数据按 group + apiName 排序，保证同组连续且更稳定
  sortedList.value = [...adminApiStore.list].sort((a, b) => {
    if (a.apiName && b.apiName)
      if (a.group === b.group) {
        return a.apiName.localeCompare(b.apiName)
      }
    return a.group?.localeCompare(b.group || '') || 0
  })
})

interface SpanMethodProps {
  row: AdminApiTypes.Api
  column: TableColumnCtx<AdminApiTypes.Api>
  rowIndex: number
  columnIndex: number
}

const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0) {
    const currentGroup = sortedList.value[rowIndex]?.group
    const prevGroup =
      rowIndex > 0 ? sortedList.value[rowIndex - 1]?.group : null

    if (currentGroup !== prevGroup) {
      let rowspan = 1
      for (let i = rowIndex + 1; i < sortedList.value.length; i++) {
        if (sortedList.value[i].group === currentGroup) {
          rowspan++
        } else {
          break
        }
      }
      return {
        rowspan,
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }

  return {
    rowspan: 1,
    colspan: 1,
  }
}
</script>

<template>
  <AuthBtn
    :text="false"
    content="添加角色"
    name="rolePermission"
    perm="CREATE"
    type="primary"
  >
    添加角色
  </AuthBtn>

  <el-table
    highlight-current-row
    :data="sortedList"
    :span-method="objectSpanMethod"
    style="width: 100%; margin-top: 10px"
    max-height="70vh"
    border
  >
    <el-table-column
      show-overflow-tooltip
      prop="group"
      label="分组名称"
      sortable
      width="150"
      align="center"
    />
    <el-table-column
      show-overflow-tooltip
      prop="apiName"
      label="接口名称"
      sortable
    />
    <el-table-column show-overflow-tooltip prop="apiPath" label="接口地址" />
    <el-table-column
      show-overflow-tooltip
      prop="method"
      label="请求方式"
      width="70"
      align="center"
    />
    <el-table-column
      show-overflow-tooltip
      align="center"
      label="状态"
      width="70"
    >
      <template #default="scope">
        <el-switch
          v-model="scope.row.state"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      prop="requireAuth"
      align="center"
      label="鉴权"
      width="83"
    >
      <template #default="scope">
        <el-tag :type="scope.row.requireAuth ? 'success' : 'danger'">
          {{ scope.row.requireAuth ? '启用' : '禁用' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      align="center"
      min-width="240"
      width="240"
      label="操作"
    >
      <template #default="scope">
        <AuthBtn content="详情" name="permissionApi" perm="READ">
          详情
        </AuthBtn>

        <AuthBtn content="修改" name="permissionApi" perm="UPDATE">
          修改
        </AuthBtn>

        <AuthBtn content="删除" name="permissionApi" perm="DELETE">
          删除
        </AuthBtn>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped></style>
