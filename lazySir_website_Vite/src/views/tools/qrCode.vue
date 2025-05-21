<template>
  <el-card class="max-w-5xl mx-auto">
    <template #header>
      <span class="text-lg font-semibold">📇 二维码生成器</span>
    </template>
    <el-form label-width="120px">
      <el-form-item label="二维码数据来源">
        <el-radio-group v-model="importType">
          <el-radio-button label="manual">手动输入</el-radio-button>
          <el-radio-button label="file">上传 TXT/CSV</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="importType === 'manual'" label="手动输入数据">
        <el-input
          v-model="textInput"
          type="textarea"
          rows="6"
          placeholder="每行一个二维码数据"
        />
      </el-form-item>

      <el-form-item v-if="importType === 'file'" label="上传 TXT/CSV">
        <el-upload
          accept=".txt,.csv"
          :auto-upload="false"
          :show-file-list="true"
          :limit="1"
          :on-change="handleFileChange"
        >
          <el-button type="primary">选择文件</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="二维码尺寸">
        <el-input-number v-model="qrSize" :min="100" :max="200" />
      </el-form-item>

      <el-form-item label="前景色">
        <el-color-picker v-model="qrColor" />
      </el-form-item>

      <el-form-item label="背景色">
        <el-color-picker v-model="qrBgColor" />
      </el-form-item>

      <el-form-item label="LOGO 上传">
        <el-upload
          accept="image/*"
          :auto-upload="false"
          :limit="1"
          :file-list="logoFileList"
          list-type="picture"
          @change="handleLogoChange"
          @remove="handleLogoRemove"
        >
          <el-button type="success">上传 LOGO</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="generateQRCodes"
          >生成二维码</el-button
        >
        <el-button
          type="success"
          @click="exportToZip"
          :disabled="!dataList.length"
          >导出 ZIP</el-button
        >
        <el-button
          type="warning"
          @click="exportToPDF"
          :disabled="!dataList.length"
          >导出 PDF</el-button
        >
        <el-button type="info" @click="exportToCSV" :disabled="!dataList.length"
          >导出 CSV</el-button
        >
      </el-form-item>
    </el-form>

    <el-divider content-position="left">预览</el-divider>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in dataList" :key="index">
        <div class="qr-preview">
          <p class="text-center">{{ item }}</p>
          <div :id="'qr-code-' + index" class="qr-img-box"></div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import QRCodeStyling from 'qr-code-styling'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import type { UploadRawFile, UploadUserFile } from 'element-plus'

const importType = ref('manual')
const textInput = ref('')
const fileContent = ref('')
const dataList = ref<string[]>([])
const qrSize = ref(200)
const qrColor = ref('#000000')
const qrBgColor = ref('#ffffff')
const logoFileList = ref<UploadUserFile[]>([])
const logoDataUrl = ref<string>('')

function handleFileChange(file: any) {
  const raw = file.raw as UploadRawFile
  const reader = new FileReader()
  reader.onload = () => {
    fileContent.value = reader.result as string
  }
  reader.readAsText(raw)
}

function handleLogoChange(file: UploadUserFile) {
  const raw = file.raw as UploadRawFile
  const reader = new FileReader()
  reader.onload = () => {
    logoDataUrl.value = reader.result as string
    file.url = logoDataUrl.value
  }
  reader.readAsDataURL(raw)
}

function handleLogoRemove() {
  logoDataUrl.value = ''
  logoFileList.value = []
}

async function generateQRCodes() {
  const sourceText =
    importType.value === 'manual' ? textInput.value : fileContent.value
  dataList.value = sourceText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)

  await nextTick()

  dataList.value.forEach((text, index) => {
    const container = document.getElementById('qr-code-' + index)
    if (!container) return
    container.innerHTML = ''

    const qrCode = new QRCodeStyling({
      width: qrSize.value,
      height: qrSize.value,
      type: 'canvas',
      data: text,
      image: logoDataUrl.value || undefined,
      dotsOptions: { color: qrColor.value },
      backgroundOptions: { color: qrBgColor.value },
      imageOptions: { crossOrigin: 'anonymous', margin: 10 },
    })

    qrCode.append(container)
  })
}

async function exportToZip() {
  const zip = new JSZip()
  const folder = zip.folder('qr-codes')

  for (let i = 0; i < dataList.value.length; i++) {
    const text = dataList.value[i]
    const filename = `${text}.png`.replace(/[\\/:*?"<>|]/g, '_')
    const canvas = document.querySelector(
      `#qr-code-${i} canvas`,
    ) as HTMLCanvasElement
    if (!canvas) continue
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/png'),
    )
    folder?.file(filename, blob)
  }

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'qr-codes.zip')
}

function exportToPDF() {
  const pdf = new jsPDF()
  let y = 10
  const gap = 70

  dataList.value.forEach((text, i) => {
    const canvas = document.querySelector(
      `#qr-code-${i} canvas`,
    ) as HTMLCanvasElement
    if (!canvas) return
    const imgData = canvas.toDataURL('image/png')
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    //@ts-ignore
    pdf.text(text, 10, y - 3, { encoding: 'Identity-H' })
    pdf.addImage(imgData, 'PNG', 10, y, 50, 50)
    y += gap
    if (y > 270 && i < dataList.value.length - 1) {
      pdf.addPage()
      y = 10
    }
  })

  pdf.save('qr-codes.pdf')
}

function exportToCSV() {
  const content = dataList.value.map((d, i) => `"${i + 1}","${d}"`).join('\n')
  const blob = new Blob(['编号,内容\n' + content], {
    type: 'text/csv;charset=utf-8;',
  })
  saveAs(blob, 'qr-codes.csv')
}
</script>

<style scoped>
.qr-preview {
  border: 1px solid #e4e7ed;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  background: transparent;
  text-align: center;
}
.qr-img-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  background-color: transparent;
}
</style>
