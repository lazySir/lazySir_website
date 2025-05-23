<template>
  <div class="p-6 max-w-3xl mx-auto">
    <el-card shadow="hover">
      <template #header>
        <span class="text-lg font-semibold">🧠 智能 Todo List</span>
      </template>

      <div class="mb-6 space-y-4">
        <!-- 任务输入大文本框 -->
        <el-input
          type="textarea"
          v-model="newTask"
          placeholder="输入任务..."
          clearable
          class="w-full text-lg"
          :rows="3"
        />
        <!-- 分类和提醒时间同一行 -->
        <div class="flex space-x-4">
          <el-select
            v-model="newCategory"
            placeholder="分类"
            clearable
            class="flex-1"
          >
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
          <el-date-picker
            v-model="newReminder"
            type="datetime"
            placeholder="提醒时间（可选）"
            value-format="YYYY-MM-DD HH:mm"
            clearable
            class="flex-1"
          />
        </div>
        <!-- 添加任务按钮 -->
        <div>
          <el-button type="primary" @click="addTask" class="btn-animate">
            ➕ 添加任务
          </el-button>
        </div>
      </div>

      <!-- 导入导出按钮 -->
      <div class="flex space-x-4 mb-6">
        <el-button @click="exportJSON" type="success">导出 JSON</el-button>
        <el-button @click="exportCSV" type="warning">导出 CSV</el-button>
        <el-upload
          accept=".json,.csv"
          :show-file-list="false"
          :before-upload="handleImport"
        >
          <el-button>导入任务</el-button>
        </el-upload>
      </div>

      <!-- 筛选栏 -->
      <div class="mb-4 flex space-x-4 items-center">
        <el-select
          v-model="filterCategory"
          placeholder="分类筛选"
          clearable
          class="w-1/3"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="cat in categories"
            :key="cat"
            :label="cat"
            :value="cat"
          />
        </el-select>

        <!-- 年筛选 -->
        <el-date-picker
          v-model="filterYear"
          type="year"
          placeholder="筛选年份"
          clearable
          class="w-1/4"
        />

        <!-- 年月筛选 -->
        <el-date-picker
          v-model="filterYearMonth"
          type="month"
          placeholder="筛选年月"
          clearable
          class="w-1/4"
        />

        <!-- 年月日筛选 -->
        <el-date-picker
          v-model="filterFullDate"
          type="date"
          placeholder="筛选年月日"
          clearable
          class="w-1/4"
        />
      </div>

      <el-divider>📋 当前任务</el-divider>

      <ul ref="todoListRef" class="space-y-3">
        <li
          v-for="(todo, index) in filteredTodos"
          :key="todo.id"
          :class="[
            'border rounded p-4 bg-white shadow-sm flex justify-between items-start transition-colors duration-300',
            remindedIds.has(todo.id) && !todo.completed ? 'highlight' : '',
          ]"
        >
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <el-checkbox v-model="todo.completed" @change="saveTodos" />
              <span
                class="ml-3 text-lg leading-relaxed transition-colors duration-300"
                :class="{ 'line-through text-gray-500': todo.completed }"
              >
                {{ todo.text }}
              </span>
            </div>
            <div class="text-sm text-gray-500 space-x-6">
              <span v-if="todo.category && todo.category !== '未分类'">
                🏷️ 分类: {{ todo.category }}
              </span>
              <span v-if="todo.reminder">⏰ {{ todo.reminder }}</span>
            </div>
          </div>
          <el-button
            type="danger"
            :icon="Delete"
            size="small"
            @click="deleteTaskById(todo.id)"
            class="ml-4 self-start btn-delete"
          />
        </li>
      </ul>

      <div class="mt-6 text-sm text-gray-600">
        ✅ 已完成：{{ completedCount }} / {{ todos.length }}
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import Sortable from 'sortablejs'

interface Todo {
  id: string
  text: string
  category: string
  reminder: string | null
  completed: boolean
}

const newTask = ref<string>('')
const newCategory = ref<string>('')
const newReminder = ref<string | null>(null)
const todos = ref<Todo[]>([])
const todoListRef = ref<HTMLElement | null>(null)

const categories: string[] = ['工作', '学习', '个人', '购物', '健身']

function loadTodos(): void {
  const saved = localStorage.getItem('enhancedTodoList')
  if (saved) todos.value = JSON.parse(saved) as Todo[]
}

function saveTodos(): void {
  localStorage.setItem('enhancedTodoList', JSON.stringify(todos.value))
}

function addTask(): void {
  if (!newTask.value.trim()) return

  todos.value.push({
    id: crypto.randomUUID(),
    text: newTask.value.trim(),
    category: newCategory.value || '未分类',
    reminder: newReminder.value || null,
    completed: false,
  })

  newTask.value = ''
  newCategory.value = ''
  newReminder.value = null
  saveTodos()
}

// 按 ID 删除任务，避免筛选后索引混乱
function deleteTaskById(id: string): void {
  const idx = todos.value.findIndex((t) => t.id === id)
  if (idx !== -1) {
    todos.value.splice(idx, 1)
    saveTodos()
  }
}

const completedCount = computed<number>(
  () => todos.value.filter((t) => t.completed).length,
)

const remindedIds = ref<Set<string>>(new Set())

function formatTime(date: Date): string {
  const Y = date.getFullYear()
  const M = String(date.getMonth() + 1).padStart(2, '0')
  const D = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${Y}-${M}-${D} ${h}:${m}`
}

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    ElMessage.warning('当前浏览器不支持通知功能。')
    return false
  }
  if (Notification.permission === 'granted') {
    return true
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return false
}

async function checkReminders(): Promise<void> {
  const nowStr = formatTime(new Date())
  const hasPermission = await requestNotificationPermission()

  todos.value.forEach((todo) => {
    if (
      todo.reminder &&
      !todo.completed &&
      !remindedIds.value.has(todo.id) &&
      todo.reminder <= nowStr
    ) {
      if (hasPermission) {
        new Notification('任务提醒', {
          body: `${todo.text} （分类：${todo.category}）`,
          icon: '/favicon.ico',
          silent: false,
        })
      } else {
        alert(`任务提醒：${todo.text} （分类：${todo.category}）`)
      }
      remindedIds.value.add(todo.id)
    }
  })
}

function exportJSON() {
  const dataStr = JSON.stringify(todos.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'todo-list.json'
  a.click()
  URL.revokeObjectURL(url)
}

function exportCSV() {
  const header = ['id', 'text', 'category', 'reminder', 'completed']
  const rows = todos.value.map((t) =>
    [
      `"${t.id}"`,
      `"${t.text.replace(/"/g, '""')}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      `"${t.reminder ?? ''}"`,
      t.completed ? 'TRUE' : 'FALSE',
    ].join(','),
  )
  const csvContent = [header.join(','), ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'todo-list.csv'
  a.click()
  URL.revokeObjectURL(url)
}
function handleImport(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result
      if (!content) return

      if (file.name.endsWith('.json')) {
        // 先用 any[] 接收，避免类型推断为 never
        const importedAny = JSON.parse(content as string) as any[]
        if (!Array.isArray(importedAny)) throw new Error('JSON格式错误')

        const imported: Todo[] = importedAny.map((t) => {
          return {
            id: typeof t.id === 'string' && t.id ? t.id : crypto.randomUUID(),
            text: typeof t.text === 'string' ? t.text : '',
            category:
              typeof t.category === 'string' && t.category
                ? t.category
                : '未分类',
            reminder: 'reminder' in t ? t.reminder : null,
            completed: typeof t.completed === 'boolean' ? t.completed : false,
          }
        })

        todos.value = imported
        saveTodos()
        ElMessage.success('导入成功')
      } else if (file.name.endsWith('.csv')) {
        const lines = (content as string).split(/\r?\n/).filter(Boolean)
        const keys = lines.shift()?.split(',') || []
        const imported: Todo[] = []

        lines.forEach((line) => {
          const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
          if (!values) return

          const obj: any = {}
          keys.forEach((k, i) => {
            obj[k] = values[i]?.replace(/^"|"$/g, '') ?? ''
          })

          obj.completed = obj.completed === 'TRUE'
          if (!obj.id) obj.id = crypto.randomUUID()
          if (!obj.category) obj.category = '未分类'
          if (!('reminder' in obj)) obj.reminder = null

          imported.push(obj as Todo)
        })

        todos.value = imported
        saveTodos()
        ElMessage.success('导入成功')
      } else {
        ElMessage.error('仅支持 JSON 和 CSV 格式文件')
      }
    } catch {
      ElMessage.error('导入失败，文件格式错误')
    }
  }
  reader.readAsText(file)
  return false
}

// --------------- 筛选相关 ----------------

// 筛选响应式数据
const filterCategory = ref<string | ''>('')
const filterYear = ref<Date | null>(null)
const filterYearMonth = ref<Date | null>(null)
const filterFullDate = ref<Date | null>(null)

function formatDateY(dateStr: string): string | null {
  if (!dateStr) return null
  return dateStr.slice(0, 4)
}
function formatDateYM(dateStr: string): string | null {
  if (!dateStr) return null
  return dateStr.slice(0, 7)
}
function formatDateYMD(dateStr: string): string | null {
  if (!dateStr) return null
  return dateStr.slice(0, 10)
}

// 计算过滤后的任务列表
const filteredTodos = computed(() => {
  return todos.value.filter((todo) => {
    if (filterCategory.value && todo.category !== filterCategory.value)
      return false

    // 时间筛选优先级：年月日 > 年月 > 年
    if (filterFullDate.value) {
      const filterDateStr = filterFullDate.value.toISOString().slice(0, 10)
      if (!todo.reminder || formatDateYMD(todo.reminder) !== filterDateStr)
        return false
    } else if (filterYearMonth.value) {
      const filterYMStr = filterYearMonth.value.toISOString().slice(0, 7)
      if (!todo.reminder || formatDateYM(todo.reminder) !== filterYMStr)
        return false
    } else if (filterYear.value) {
      const filterYStr = filterYear.value.getFullYear().toString()
      if (!todo.reminder || formatDateY(todo.reminder) !== filterYStr)
        return false
    }

    return true
  })
})

// ------------------- 初始化 -------------------

onMounted(() => {
  loadTodos()

  // 初始化拖拽排序
  if (todoListRef.value) {
    Sortable.create(todoListRef.value, {
      animation: 150,
      handle: 'li',
      onEnd() {
        saveTodos()
      },
    })
  }

  // 定时提醒检测，每分钟一次
  setInterval(checkReminders, 60000)
  checkReminders()
})
</script>

<style scoped>
.highlight {
  background-color: #fef3c7;
  border-color: #f59e0b;
}
.btn-animate {
  transition: background-color 0.3s ease;
}
.btn-animate:hover {
  background-color: #409eff;
  color: white;
}
.btn-delete {
  transition: color 0.3s ease;
}
.btn-delete:hover {
  color: #f56c6c;
}
</style>
