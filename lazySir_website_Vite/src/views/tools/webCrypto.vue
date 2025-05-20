<template>
  <el-card class="mx-auto mt-10" style="max-width: 800px">
    <h2>🔐 加密存储系统</h2>

    <el-form :model="form" label-width="80px" class="mb-4">
      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入统一口令"
          @input="onPasswordInput"
          clearable
        />
        <div
          v-if="passwordStrength"
          class="mt-1"
          style="color: #409eff; font-size: 12px"
        >
          强度：{{ passwordStrength.score }}/4
          <span v-if="passwordStrength.feedback.warning">
            - {{ passwordStrength.feedback.warning }}</span
          >
          <span v-else> - 安全性尚可</span>
        </div>
      </el-form-item>

      <el-form-item label="明文内容">
        <el-input
          type="textarea"
          :rows="4"
          v-model="form.plainText"
          placeholder="输入要加密的内容"
          clearable
        />
      </el-form-item>

      <el-form-item label="标签">
        <el-input
          v-model="form.tagInput"
          placeholder="用英文逗号分隔，如：工作,密码,备忘"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleEncrypt">加密保存</el-button>
        <el-button
          type="success"
          @click="exportRecords"
          style="margin-left: 10px"
          >导出记录</el-button
        >
        <el-upload
          :show-file-list="false"
          :before-upload="beforeUpload"
          accept=".json"
          style="margin-left: 10px"
        >
          <el-button>导入记录</el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <el-divider></el-divider>

    <el-input
      v-model="searchKeyword"
      placeholder="输入关键词搜索标题或标签"
      clearable
      :prefix-icon="Search"
      style="margin-bottom: 10px"
    />

    <el-select
      v-model="sortType"
      placeholder="排序方式"
      style="width: 140px; margin-bottom: 20px"
    >
      <el-option label="最新优先" value="desc" />
      <el-option label="最旧优先" value="asc" />
    </el-select>

    <el-table
      :data="filteredList"
      style="width: 100%"
      :row-key="(row:any) => row.id"
      stripe
      border
    >
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column
        prop="timestamp"
        label="时间"
        width="180"
        :formatter="formatTimestamp"
      />
      <el-table-column label="标签">
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.tags"
            :key="tag"
            type="info"
            size="small"
            style="margin-right: 4px"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="decryptItem(row)"
            >解密</el-button
          >
          <el-button
            type="danger"
            size="small"
            style="margin-left: 8px"
            @click="deleteItem(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-card
      v-if="decryptedText"
      class="mt-6"
      style="margin-top: 20px; background: #f0f9eb; border-color: #e1f3d8"
    >
      <h3>🔓 解密结果：</h3>
      <p style="white-space: pre-wrap">{{ decryptedText }}</p>
    </el-card>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { openDB, IDBPDatabase } from 'idb'
import type { ZxcvbnResult } from '@zxcvbn-ts/core'
import { Search } from '@element-plus/icons-vue'
import { zxcvbn } from '@zxcvbn-ts/core'

interface FormState {
  plainText: string
  password: string
  tagInput: string
}

interface RecordItem {
  id: string
  title: string
  cipher: string
  salt: string
  iv: string
  tags: string[]
  timestamp: number
}

const form = ref<FormState>({
  plainText: '',
  password: '',
  tagInput: '',
})

const passwordStrength = ref<ZxcvbnResult | null>(null)
const decryptedText = ref<string>('')
const recordList = ref<RecordItem[]>([])
const searchKeyword = ref<string>('')
const sortType = ref<'asc' | 'desc'>('desc')

const encoder = new TextEncoder()
const decoder = new TextDecoder()
let db: IDBPDatabase | null = null

onMounted(async () => {
  db = await openDB('cryptoStorageDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('records')) {
        db.createObjectStore('records', { keyPath: 'id' })
      }
    },
  })

  const all = await db.getAll('records')
  recordList.value = all.sort((a, b) => b.timestamp - a.timestamp)
})

watch(
  () => form.value.password,
  (newVal) => {
    passwordStrength.value = newVal ? zxcvbn(newVal) : null
  },
)

function onPasswordInput() {
  // 触发watch即可
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer, // 断言为 ArrayBuffer
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  )
}

async function handleEncrypt() {
  if (!form.value.plainText.trim()) return ElMessage.warning('请输入内容')
  if (!form.value.password) return ElMessage.warning('请输入密码')

  try {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const key = await deriveKey(form.value.password, salt)

    const encoded = encoder.encode(form.value.plainText)
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded,
    )

    const cipherBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    const saltBase64 = btoa(String.fromCharCode(...salt))
    const ivBase64 = btoa(String.fromCharCode(...iv))

    const tags = form.value.tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const newItem: RecordItem = {
      id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
      title: `记录 ${recordList.value.length + 1}`,
      cipher: cipherBase64,
      salt: saltBase64,
      iv: ivBase64,
      tags,
      timestamp: Date.now(),
    }

    await db!.put('records', newItem)
    recordList.value.unshift(newItem)
    form.value.plainText = ''
    decryptedText.value = ''
    form.value.tagInput = ''
    ElMessage.success('加密成功')
  } catch {
    ElMessage.error('加密失败，请重试')
  }
}

async function decryptItem(item: RecordItem) {
  if (!form.value.password) return ElMessage.warning('请输入密码')

  try {
    const cipherBytes = Uint8Array.from(atob(item.cipher), (c) =>
      c.charCodeAt(0),
    )
    const salt = Uint8Array.from(atob(item.salt), (c) => c.charCodeAt(0))
    const iv = Uint8Array.from(atob(item.iv), (c) => c.charCodeAt(0))

    const key = await deriveKey(form.value.password, salt)
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipherBytes,
    )

    decryptedText.value = decoder.decode(decrypted)
  } catch {
    decryptedText.value = '❌ 解密失败，密码错误或数据损坏'
  }
}

async function deleteItem(id: string): Promise<void> {
  await db!.delete('records', id)
  recordList.value = recordList.value.filter((item) => item.id !== id)
  ElMessage.success('删除成功')
}

const filteredList = computed(() => {
  return recordList.value
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchKeyword.value.toLowerCase()),
        ),
    )
    .sort((a, b) =>
      sortType.value === 'asc'
        ? a.timestamp - b.timestamp
        : b.timestamp - a.timestamp,
    )
})

function formatTimestamp(
  row: RecordItem,
  _col: any,
  cellValue: number,
): string {
  return new Date(cellValue).toLocaleString()
}

function exportRecords(): void {
  const dataStr = JSON.stringify(recordList.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `crypto_records_${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

function beforeUpload(file: File): boolean {
  const reader = new FileReader()
  reader.onload = async (e: ProgressEvent<FileReader>) => {
    try {
      const result = e.target?.result
      if (!result || typeof result !== 'string') throw new Error('无法读取文件')

      const importedRecords = JSON.parse(result)
      if (!Array.isArray(importedRecords)) throw new Error('数据格式错误')

      const tx = db!.transaction('records', 'readwrite')
      await tx.store.clear()

      for (const record of importedRecords) {
        if (
          record.id &&
          record.cipher &&
          record.salt &&
          record.iv &&
          record.timestamp
        ) {
          await tx.store.put(record)
        }
      }
      await tx.done

      recordList.value = importedRecords.sort(
        (a, b) => b.timestamp - a.timestamp,
      )
      ElMessage.success('导入成功')
    } catch (err: any) {
      ElMessage.error('导入失败：' + err.message)
    }
  }
  reader.readAsText(file)
  return false
}
</script>

<style scoped>
/* 可自定义样式 */
</style>
