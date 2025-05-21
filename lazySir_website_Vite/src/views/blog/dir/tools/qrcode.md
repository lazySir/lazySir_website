---
title: qrCode说明文档
author: lazySir
tags: [工具,二维码生成器]
description: 一个基于 Vue3 + Element Plus + `qr-code-styling` 的强大批量二维码生成工具。
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host/lazySir_website/tools/qrCode.png
date: 2025-05-21
---


## 📇 批量二维码生成器

欢迎使用本二维码生成器，一个基于 Vue3 + Element Plus + `qr-code-styling` 的强大批量二维码生成工具。  
它支持多种数据输入方式，灵活自定义二维码样式，支持 LOGO 上传，且能导出多种格式，极大提升二维码批量制作效率！✨




## 为什么需要这款二维码生成器？ 🤔

二维码作为一种高效的信息载体，已经广泛应用于产品包装、线下扫码支付、活动签到、信息分享等场景。但当需要一次性生成大量二维码时，传统的手工操作非常耗时且容易出错。

我的这款二维码生成器，正是为解决这一痛点而生：

- **批量处理**：支持手动输入多条数据，也可上传TXT或CSV文件，一次搞定海量二维码生成。  
- **自定义样式**：二维码尺寸、颜色都能调整，还能嵌入品牌LOGO，让二维码更具辨识度和美观度。  
- **多样导出**：支持ZIP打包图片、PDF文档以及CSV内容表导出，满足不同需求。



## 详细功能介绍 🛠️

### 1. 灵活的数据输入

- **手动输入**  
  直接在文本框中按行输入数据，每一行对应一个二维码内容，快速直观。  
- **文件上传**  
  支持TXT和CSV格式文件导入，适合提前准备好的数据批量生成。

### 2. 高度自定义二维码样式

- **尺寸调整**  
  可以设置二维码的大小（100-200px之间），适配不同使用场景。  
- **颜色选择**  
  支持前景色和背景色的自由搭配，满足品牌色彩需求。  
- **LOGO嵌入**  
  可上传自定义LOGO图片，自动嵌入二维码中央，提升品牌识别度。
**核心代码**  
  ```js
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
  ```
### 3. 多格式导出支持

**导出ZIP**  
  所有生成的二维码图片打包为ZIP文件，便于批量下载和管理。  
  ```js
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
  ```
**导出PDF**  
  生成PDF格式二维码合集，适合打印分发，支持分页和排版。 
  ```js
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
  ``` 
**导出CSV**  
  导出二维码内容对应的CSV表，方便做数据备份或二次利用。
  ```js
        function exportToCSV() {
        const content = dataList.value.map((d, i) => `"${i + 1}","${d}"`).join('\n')
        const blob = new Blob(['编号,内容\n' + content], {
            type: 'text/csv;charset=utf-8;',
        })
        saveAs(blob, 'qr-codes.csv')
        }
  ```

### 4. 实时预览与交互

- 每条数据对应的二维码生成后立即预览，快速确认效果。  
- 清晰的界面与操作流程，即使是非技术用户也能轻松上手。

---

## 技术实现亮点 🔍

- **前端框架**：采用 Vue3 + TypeScript，实现响应式和类型安全开发体验。  
- **UI组件**：基于 Element Plus，界面简洁、交互流畅。  
- **二维码生成**：集成 [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) ，支持Canvas渲染和LOGO合成。  
- **文件处理**：利用 FileReader API 解析上传文件内容。  
- **文件导出**：结合 JSZip 和 file-saver 实现批量图片打包下载；使用 jsPDF 生成高质量PDF文档。  
- **用户体验优化**：上传限制、颜色选择器、导出按钮状态联动等细节提升交互友好度。

---

## 适用场景推荐 🌟

- **电商卖家**：批量生成商品二维码，方便线下推广和包装使用。  
- **活动组织者**：制作签到二维码，快速批量打印发放。  
- **市场营销**：生成定制二维码，配合宣传海报提升品牌影响力。  
- **教育培训**：课程资料二维码化，方便学员扫码获取学习资源。

---

## 未来计划与优化方向 🚧

- 增加二维码样式模板选择，支持更多创意点阵风格。  
- 增强二维码内容安全检测，防止生成无效或危险链接。  
- 支持更多导出格式，如PNG序列、SVG矢量等。  

---

## 🔗 在线地址

- 🌐 **在线体验地址**：  
  👉 [qrCode在线地址](https://www.lazysir.me/tools/qrCode)

---

感谢阅读！希望这款二维码生成器能帮你轻松解决二维码批量生成难题，工作更高效，生活更便捷！🎉🎉🎉

---
