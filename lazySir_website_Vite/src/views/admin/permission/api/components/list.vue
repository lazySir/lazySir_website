<script setup lang="ts">
import { useAdminApiStore } from '@/stores/admin/api'
import type { TableColumnCtx } from 'element-plus'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import Dialog from '@/views/admin/permission/api/components/dialog.vue'
const adminApiStore = useAdminApiStore()
const sortedList = ref<AdminApiTypes.Api[]>([])
onMounted(async () => {
  await getData()
})
interface SpanMethodProps {
  row: AdminApiTypes.Api
  column: TableColumnCtx<AdminApiTypes.Api>
  rowIndex: number
  columnIndex: number
}
//处理表格合并单元格
const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0) {
    const currentGroup = sortedList.value[rowIndex]?.groupValue
    const prevGroup =
      rowIndex > 0 ? sortedList.value[rowIndex - 1]?.groupValue : null

    if (currentGroup !== prevGroup) {
      let rowspan = 1
      for (let i = rowIndex + 1; i < sortedList.value.length; i++) {
        if (sortedList.value[i].groupValue === currentGroup) {
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
//获取数据
const getData = async () => {
  await adminApiStore.getApiList({ page: 1, limit: 9999 })
  // 对数据按 group + apiName 排序，保证同组连续且更稳定
  sortedList.value = [...adminApiStore.list].sort((a, b) => {
    if (a.apiName && b.apiName)
      if (a.groupValue === b.groupValue) {
        return a.apiName.localeCompare(b.apiName)
      }
    return a.groupValue?.localeCompare(b.groupValue || '') || 0
  })
}
const getGroups = computed(() => {
  return Array.from(
    new Set(sortedList.value.map((item) => item.groupValue).filter(Boolean)),
  ) as string[]
})
const DialogRef = useTemplateRef('DialogRef')
//确认修改的回调
const handleConfirm = async (data: AdminApiTypes.Api) => {
  const res = await adminApiStore.addOrUpdateApi(data)
  if (res) {
    await getData()
    if (DialogRef.value) {
      DialogRef.value.clearApiForm()
    }
  }
}
//确认删除的回调
const handleDelete = async (id: string) => {
  const res = await adminApiStore.deleteApi(id)
  if (res) {
    await getData()
    if (DialogRef.value) {
      DialogRef.value.clearApiForm()
    }
  }
}
</script>

<template>
  <AuthBtn
    :text="false"
    content="添加接口"
    @click="DialogRef?.handleDialogOpen(true)"
    name="permissionApi"
    perm="CREATE"
    type="primary"
  >
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
      prop="groupValue"
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
      prop="updateNickname"
      align="center"
      label="更新人"
      width="100"
      sortable
    />
    <el-table-column
      show-overflow-tooltip
      prop="updateDate"
      label="更新时间"
      width="150"
      sortable
    />

    <el-table-column
      show-overflow-tooltip
      prop="methodValue"
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
          @click="handleConfirm(scope.row)"
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
        <AuthBtn
          @click="DialogRef?.handleDialogOpen(false, scope.row)"
          content="详情"
          name="permissionApi"
          perm="READ"
        >
          详情
        </AuthBtn>

        <AuthBtn
          @click="DialogRef?.handleDialogOpen(true, scope.row)"
          content="修改"
          name="permissionApi"
          perm="UPDATE"
        >
          修改
        </AuthBtn>

        <el-popconfirm
          :title="`确定要删除:${scope.row.apiName} 接口吗？`"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="handleDelete(scope.row.apiId)"
        >
          <template #reference>
            <AuthBtn content="删除" name="permissionApi" perm="DELETE">
              删除
            </AuthBtn>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <Dialog
    :groups="getGroups"
    @addOrUpdateApiEmit="handleConfirm"
    ref="DialogRef"
  />
</template>

<style scoped></style>
