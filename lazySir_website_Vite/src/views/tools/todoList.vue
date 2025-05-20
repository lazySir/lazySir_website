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
          rows="3"
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

      <el-divider>📋 当前任务</el-divider>

      <ul ref="todoListRef" class="space-y-3">
        <li
          v-for="(todo, index) in todos"
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
            @click="deleteTask(index)"
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

function deleteTask(index: number): void {
  todos.value.splice(index, 1)
  saveTodos()
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
      if (typeof content !== 'string') throw new Error('文件读取失败')
      let importedTodos: Todo[] = []

      if (file.name.endsWith('.json')) {
        importedTodos = JSON.parse(content)
      } else if (file.name.endsWith('.csv')) {
        importedTodos = parseCSV(content)
      } else {
        throw new Error('不支持的文件格式')
      }

      if (
        !Array.isArray(importedTodos) ||
        !importedTodos.every(
          (t) =>
            typeof t.id === 'string' &&
            typeof t.text === 'string' &&
            typeof t.category === 'string' &&
            (typeof t.reminder === 'string' || t.reminder === null) &&
            typeof t.completed === 'boolean',
        )
      ) {
        throw new Error('导入文件格式错误')
      }

      todos.value = importedTodos
      saveTodos()
      ElMessage.success('导入成功！')
    } catch (err) {
      ElMessage.error('导入失败：' + (err as Error).message)
    }
  }
  reader.readAsText(file)
  return false
}

function parseCSV(content: string): Todo[] {
  const lines = content.trim().split(/\r?\n/)
  const header = lines.shift()?.split(',')
  if (!header) throw new Error('CSV格式错误：缺少表头')

  const idx = {
    id: header.indexOf('id'),
    text: header.indexOf('text'),
    category: header.indexOf('category'),
    reminder: header.indexOf('reminder'),
    completed: header.indexOf('completed'),
  }
  if (Object.values(idx).some((i) => i === -1)) throw new Error('CSV缺少必要列')

  const todosParsed: Todo[] = lines.map((line) => {
    const regex = /"([^"]|"")*"|[^,]+/g
    const cols =
      line
        .match(regex)
        ?.map((c) => c.replace(/^"|"$/g, '').replace(/""/g, '"')) || []
    return {
      id: cols[idx.id],
      text: cols[idx.text],
      category: cols[idx.category],
      reminder: cols[idx.reminder] || null,
      completed: cols[idx.completed].toLowerCase() === 'true',
    }
  })
  return todosParsed
}

onMounted(() => {
  loadTodos()

  setInterval(() => {
    checkReminders()
  }, 60 * 1000)

  checkReminders()

  if (todoListRef.value) {
    Sortable.create(todoListRef.value, {
      animation: 150,
      onEnd(evt) {
        const oldIndex = evt.oldIndex as number
        const newIndex = evt.newIndex as number
        const moved = todos.value.splice(oldIndex, 1)[0]
        todos.value.splice(newIndex, 0, moved)
        saveTodos()
      },
    })
  }
})
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}

.btn-animate {
  transition: transform 0.1s ease;
}
.btn-animate:active {
  transform: scale(0.95);
}

.highlight {
  background-color: #fff3c4;
}

.btn-delete {
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.btn-delete:hover {
  background-color: #f56c6c;
  transform: scale(1 05);
}
</style>
