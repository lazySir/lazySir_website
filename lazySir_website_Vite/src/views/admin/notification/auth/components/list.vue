<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  list: NotificationTypes.list[]
}>()

const emits = defineEmits(['openDialog', 'deleteEmits'])
// @select="handleSelectionChange"
const handleOpenDialog = (
  type: 'add' | 'read' | 'update',
  val?: NotificationTypes.list,
) => {
  emits('openDialog', type, val)
}
// 显示不同颜色类型：success / warning / danger / info / default
const getLevelType = (level?: string) => {
  switch (level) {
    case '最高级':
      return 'danger'
    case '高':
      return 'warning'
    case '中':
      return 'info'
    case '低':
      return ''
    case '计划':
      return 'success'
  }
}
const deleteList = ref<String[]>([])
//当被选中的新闻发生变化时
const handleSelectionChange = (val: Array<NotificationTypes.list>) => {
  deleteList.value = val.map((item) => item.notificationId)
}
const handleDelete = (val?: NotificationTypes.list) => {
  if (val) {
    emits('deleteEmits', true, [val.notificationId])
  } else {
    emits('deleteEmits', false, deleteList.value)
  }
}

//删除
</script>

<template>
  <el-table
    highlight-current-row
    @selection-change="handleSelectionChange"
    :data="props.list"
    border
    style="width: 100%"
  >
    <el-table-column type="selection" width="40" />
    <el-table-column
      align="center"
      show-overflow-tooltip
      prop="title"
      label="通知标题"
      width="width"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      prop="typeValue"
      label="通知范围"
      width="width"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="通知等级"
      sortable
      prop="levelValue"
      width="width"
    >
      <template #default="scope">
        <el-tag :type="getLevelType(scope.row.levelValue)">
          {{ scope.row.levelValue }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="发起人"
      width="width"
    >
      <template #default="scope">
        {{ scope.row.sender.nickname }}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="启用状态"
      width="83px"
    >
      <template #default="scope">
        <el-tag :type="scope.row.state ? 'success' : 'danger'">{{
          scope.row.state ? '启用' : '禁用'
        }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column
      align="center"
      show-overflow-tooltip
      sortable
      label="创建时间"
      order
      prop="createDate"
    >
    </el-table-column>

    <el-table-column
      align="center"
      fixed="right"
      label="操作"
      width="240"
      min-width="240"
    >
      <template #default="scope">
        <AuthBtn
          @click="handleOpenDialog('read', scope.row)"
          type="primary"
          content="详情"
          name="NotificationAuth"
          perm="READ"
        >
        </AuthBtn>
        <AuthBtn
          @click="handleOpenDialog('update', scope.row)"
          type="primary"
          content="编辑"
          name="NotificationAuth"
          perm="UPDATE"
        >
        </AuthBtn>

        <el-popconfirm
          @confirm="handleDelete(scope.row)"
          :title="`是否确定删除${scope.row.title}`"
        >
          <template #reference>
            <AuthBtn
              type="primary"
              content="删除"
              name="NotificationAuth"
              perm="DELETE"
            >
            </AuthBtn>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped></style>
