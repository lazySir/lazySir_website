<template>
  <el-card shadow="hover" header="📷 EXIF 信息查看器" class="exif-card">
    <el-upload
      drag
      action="#"
      :show-file-list="false"
      :before-upload="handleFile"
      accept="image/*"
    >
      <el-icon><UploadFilled /></el-icon>
      <div class="el-upload__text">拖拽或点击上传图片</div>
    </el-upload>

    <div v-if="imageUrl" class="image-preview">
      <p>原图预览：</p>
      <img :src="imageUrl" alt="Uploaded" class="preview-image" />
    </div>

    <div
      v-if="Object.keys(exifData).length"
      style="
        margin-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <span style="font-weight: bold">EXIF 参数列表</span>
      <el-button type="primary" icon="Download" @click="exportExif">
        导出 EXIF JSON
      </el-button>
    </div>

    <el-table
      v-if="Object.keys(exifData).length"
      :data="formatExifData()"
      stripe
      border
      style="margin-top: 1rem"
    >
      <el-table-column prop="keyCn" label="参数（中文）" width="200" />
      <el-table-column prop="key" label="字段名" width="180" />
      <el-table-column prop="value" label="值" />
    </el-table>

    <div v-if="gpsLink" style="margin-top: 1rem">
      <el-link :href="gpsLink" type="primary" target="_blank">
        📍 在 Google 地图中查看位置
      </el-link>
    </div>

    <el-empty
      v-if="!Object.keys(exifData).length && fileSelected"
      description="未读取到 EXIF 信息"
      style="margin-top: 2rem"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import * as exifr from 'exifr'

const exifData = ref<Record<string, any>>({})
const gpsLink = ref<string | null>(null)
const fileSelected = ref(false)
const imageUrl = ref<string | null>(null)

const chineseMap: Record<string, string> = {
  // 基本信息
  ImageDescription: '图像描述',
  Make: '制造商',
  Model: '相机型号',
  Orientation: '方向',
  Software: '软件版本',
  ModifyDate: '修改时间',
  Artist: '作者',
  Copyright: '版权',
  DateTimeOriginal: '拍摄时间',
  CreateDate: '创建时间',
  ExposureTime: '曝光时间',
  FNumber: '光圈值',
  ISOSpeedRatings: 'ISO 感光度',
  ISO: 'ISO 感光度',
  FocalLength: '焦距',
  LensModel: '镜头型号',
  LensInfo: '镜头信息',
  ExposureProgram: '曝光程序',
  ExposureCompensation: '曝光补偿',
  MaxApertureValue: '最大光圈',
  MeteringMode: '测光模式',
  LightSource: '光源',
  Flash: '闪光灯状态',
  ColorSpace: '色彩空间',
  ExifImageWidth: '图像宽度',
  ExifImageHeight: '图像高度',
  FileSource: '来源设备',
  CustomRendered: '自定义渲染',
  ExposureMode: '曝光模式',
  WhiteBalance: '白平衡',
  DigitalZoomRatio: '数字变焦倍率',
  FocalLengthIn35mmFormat: '等效 35mm 焦距',
  SceneCaptureType: '场景类型',
  GainControl: '增益控制',
  Contrast: '对比度',
  Saturation: '饱和度',
  Sharpness: '锐度',

  // 分辨率
  XResolution: '水平分辨率',
  YResolution: '垂直分辨率',
  ResolutionUnit: '分辨率单位',

  // 色彩与通道
  YCbCrPositioning: '色差定位',
  ComponentsConfiguration: '通道配置',
  CompressedBitsPerPixel: '压缩率',
  ExifVersion: 'Exif 版本',
  FlashpixVersion: 'Flashpix 版本',

  // 快门与光圈参数
  ShutterSpeedValue: '快门速度',
  ApertureValue: '光圈值',

  // GPS 信息
  GPSLatitude: '纬度',
  GPSLongitude: '经度',
  GPSLatitudeRef: '纬度参考',
  GPSLongitudeRef: '经度参考',
  GPSAltitude: '海拔高度',
  GPSAltitudeRef: '海拔参考',
  GPSVersionID: 'GPS 版本',
  GPSStatus: 'GPS 状态',
  latitude: '十进制度纬度',
  longitude: '十进制度经度',

  // 其他信息（如果你需要）
  PrintIM: '打印图像制造商标识',
  SensitivityType: '感光类型',
}

const handleFile = async (file: File) => {
  fileSelected.value = true

  // 生成预览图
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  try {
    // 读取 EXIF，带GPS信息
    const output = await exifr.parse(file, { gps: true })
    exifData.value = output || {}

    // exifr 返回的经纬度是 latitude 和 longitude 字段
    const lat = output?.latitude
    const lon = output?.longitude

    if (typeof lat === 'number' && typeof lon === 'number') {
      gpsLink.value = `https://maps.google.com/?q=${lat},${lon}`
    } else {
      gpsLink.value = null
    }
  } catch (err) {
    console.error('EXIF 解析失败:', err)
    exifData.value = {}
    gpsLink.value = null
  }

  return false // 阻止默认上传行为
}

const formatExifData = () => {
  return Object.entries(exifData.value).map(([key, value]) => ({
    key,
    keyCn: chineseMap[key] || '-',
    value: Array.isArray(value) ? value.join(', ') : String(value),
  }))
}

const exportExif = () => {
  const blob = new Blob([JSON.stringify(exifData.value, null, 2)], {
    type: 'application/json',
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'exif-data.json'
  link.click()
  URL.revokeObjectURL(link.href)
}
</script>

<style scoped>
.exif-card {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.el-upload {
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
}

.image-preview {
  margin-top: 1.5rem;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
}
</style>
