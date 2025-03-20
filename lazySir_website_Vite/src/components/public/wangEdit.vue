<template>
    <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" />
        <Editor @onChange="handleChange" style="height: 500px; " mode="default" :defaultConfig="editorConfig"
            v-model="valueHtml" @onCreated="handleCreated" />
    </div>
</template>
<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, computed, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IEditorConfig } from '@wangeditor/editor'
import { useAdminAccountStore } from '@/stores/admin/account'
const adminAccountStore = useAdminAccountStore()
const serverUrl = import.meta.env.VITE_SERVER_URL;




const props = defineProps(['content', 'uploadImageUrl'])
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = ref('')
const emits = defineEmits(['sendValue'])

//算出图片上传地址
const uploadImageUrl = computed(() => {
    return `${serverUrl}` + props.uploadImageUrl
})
const toolbarConfig = {}

// 初始化 MENU_CONF 属性
const editorConfig: Partial<IEditorConfig> = {  // TS 语法
    // const editorConfig = {                       // JS 语法
    MENU_CONF: {
        uploadImage: {
            server: uploadImageUrl.value,
            fieldName: 'img',
            headers: {
                token: adminAccountStore.token,
            },
        }
    },
    placeholder: '请输入内容...',


    // 其他属性...
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})



const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
    valueHtml.value = props.content

}
const handleChange = (editor: any) => {

    emits('sendValue', editor.getHtml())
};

</script>
<style scoped>
/* 解决打开后不显示滚动条的问题 */
:deep(.w-e-scroll) {
    height: 380px;
}
</style>