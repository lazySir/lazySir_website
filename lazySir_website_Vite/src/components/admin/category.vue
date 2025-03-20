<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue"
import { reqGetSysDictionary, reqGetAllParentDictionary } from '@/api/admin/sysDictionary'
const props = defineProps(['category1', 'size', 'categoryId'])
interface Category {
    category1Id: string,
    category2Id: string,
    category3Id: string
}
const category1List = ref({} as sysDictionaryTypes.sysDictionary)
const category2List = ref([] as sysDictionaryTypes.sysDictionary[])
const category3List = ref([] as sysDictionaryTypes.sysDictionary[])
const selectedCategory = ref({} as Category)

// 获取category1
const handler1 = async (val: sysDictionaryTypes.getSysDictionary) => {
    //已经拿到第一级的名称
    //发送请求获取第一级的数据
    const res = await reqGetSysDictionary(val) as any
    category1List.value = res.data.data.find((item: any) => {
        return item.value == val.value
    }) as sysDictionaryTypes.sysDictionary
    selectedCategory.value.category1Id = category1List.value.dictionaryId

    //将第二级的内容和第三级的内容清空
    category2List.value = []
    category3List.value = []
    selectedCategory.value.category2Id = ''
    selectedCategory.value.category3Id = ''
    //由于第一级是固定的，所以立刻获取第二级的内容
    handler2()
}
const handler2 = async () => {
    if (selectedCategory.value.category1Id) {
        const res = await (await reqGetSysDictionary({ parentId: selectedCategory.value.category1Id, level: 2, state: true })).data.data as any
        category2List.value = res
        category3List.value = []
        selectedCategory.value.category3Id = ''
        if (selectedCategory.value.category2Id) {
            const res = await (await reqGetSysDictionary({ parentId: selectedCategory.value.category2Id, level: 3, state: true })).data.data as any
            category3List.value = res
        }
        sendValue(selectedCategory.value.category2Id)
    }

}
const handler3 = async () => {
    sendValue(selectedCategory.value.category3Id)
}
onMounted(async () => {
    // 如果传入了categoryId.初始化对应的值
    if (props.categoryId) {
        getData()
    } else if (props.category1) {
        handler1({ value: props.category1 })  // 获取category1数据
    }
})
const toRefCategoryId = computed(() => {
    return props.categoryId
})
watch(toRefCategoryId, (newValue, oldValue) => {
    if (newValue) {
        getData()
    } else {
        selectedCategory.value.category2Id = ''
        category3List.value = []
        selectedCategory.value.category3Id = ''
    }
})
const getData = async () => {
    let res = await (await reqGetAllParentDictionary(props.categoryId)).data as any
    const level1Res = res.find((item: sysDictionaryTypes.sysDictionary) => item.level == 1) as sysDictionaryTypes.sysDictionary
    const level2Res = res.find((item: sysDictionaryTypes.sysDictionary) => item.level == 2) as sysDictionaryTypes.sysDictionary
    const level3Res = res.find((item: sysDictionaryTypes.sysDictionary) => item.level == 3) as sysDictionaryTypes.sysDictionary
    selectedCategory.value.category1Id = level1Res.dictionaryId
    selectedCategory.value.category2Id = level2Res.dictionaryId
    if (level3Res) {
        selectedCategory.value.category3Id = level3Res.dictionaryId
    }
    //获取二级的数据
    res = await (await reqGetSysDictionary({ parentId: level1Res.dictionaryId, level: 2, state: true })).data.data as any
    category2List.value = res
    if (level3Res) {
        //获取三级的数据
        res = await (await reqGetSysDictionary({ parentId: level2Res.dictionaryId, level: 3, state: true })).data.data as any
        category3List.value = res
    }
}
const emit = defineEmits(['sendValue']);
const sendValue = (val: string) => {
    emit('sendValue', val)
}

</script>

<template>
    <div>
        <!-- inline 代表行内表单  一行可以放多个表单元素 
        model:收集的表单所有数据存放位置
        -->
        <el-form label-width="auto" label-position="top" :inline="true" class="demo-form-inline"
            :model="selectedCategory">

            <el-form-item>
                <el-select :size="props.size" clearable @change="handler2" v-model="selectedCategory.category2Id"
                    filterable placeholder="请选择" style="width: 170px">
                    <el-option v-for="item in category2List" :key="item.dictionaryId" :label="item.value"
                        :value="item.dictionaryId" />
                </el-select>


            </el-form-item>
            <el-form-item v-if="category3List.length > 0">
                <el-select :size="props.size" @change="handler3" clearable v-model="selectedCategory.category3Id"
                    filterable placeholder="请选择" style="width: 170px">
                    <el-option v-for="item in category3List" :key="item.dictionaryId" :label="item.value"
                        :value="item.dictionaryId" />
                </el-select>
            </el-form-item>

        </el-form>
    </div>
</template>

<style scoped>
.el-form--inline .el-form-item {
    margin-right: 0px !important
}
</style>
