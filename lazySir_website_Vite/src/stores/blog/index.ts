import { defineStore } from 'pinia'
// 引入获取博客结构化数据的工具方法
import { getStructuredBlogList } from '@/utils/blog'
import dayjs from 'dayjs' // 要安装 dayjs，npm install dayjs
// --- 新增：将结构化数据拍平成纯数组 ---


//1.定义容器
//参数1：容器的ID，必须唯一（可以自己取名），将来Pinia会把所有的容器挂在到跟容器
export const useBlogStore = defineStore('blogStore', {

    state: () => {
        return {
            blogList: [] as blogAPITypes.BlogFolder[],//所有的文章数据
            showList: [] as blogAPITypes.BlogFile[],//展示的文章数据
            total: 0, //总计条数
            activeTab: 'all' as string, // 默认选中第一个标签，防止为空
            showStyle: 'list' as blogAPITypes.DisplayMode, // 默认展示样式
            currentPage: 1, // 当前页码
            pageSize: 10, // 每页条数
        }
    },
    //相当于computed
    getters: {
        //// 计算属性：提取每个博客文件夹的 folder 名称用于导航标签
        folderNames(): string[] {
            const folderList = this.blogList.map(item => item.folder)
            folderList.unshift('all') // 在数组的开头插入 'all'
            return folderList
        },
        //// 计算当前页数据函数
        getPageList(): blogAPITypes.BlogFile[] {
            const start = (this.currentPage - 1) * this.pageSize
            const end = start + this.pageSize
            return this.blogList.flatMap(item => item.files).slice(start, end)
        },
        //计算本月新增博客数量
        monthlyUpdate(): number {
            const currentMonth = dayjs().format('YYYY-MM')
            let count = 0
            this.blogList.forEach((folder) => {
                folder.files.forEach((file) => {
                    if (dayjs(file.date).format('YYYY-MM') === currentMonth) {
                        count++
                    }
                })
            })
            return count
        },
        //计算本周新增博客数量
        weeklyUpdate(): number {
            const startOfWeek = dayjs().startOf('week')
            const endOfWeek = dayjs().endOf('week')
            let count = 0
            this.blogList.forEach((folder) => {
                folder.files.forEach((file) => {
                    const fileDate = dayjs(file.date)
                    if (fileDate.isAfter(startOfWeek) && fileDate.isBefore(endOfWeek)) {
                        count++
                    }
                })
            })
            return count
        },
        //获取所有的标签
        tags(): string[] {
            return [...new Set(this.blogList.flatMap(folder => folder.files.flatMap(file => file.tags || [])))]
        },
        //获取指定分类的文章列表
        filteredBlogList(state) {
            // 把所有 blogList 扁平化
            const flatList = state.blogList.flatMap(({ folder, files }) =>
                files.map(file => ({
                    ...file,
                    folder,
                }))
            )

            // 先按 activeTab 筛选
            const filtered = state.activeTab === 'all'
                ? flatList
                : flatList.filter(file => file.folder === state.activeTab)

            // 更新总条数
            state.total = filtered.length

            // 分页处理
            const start = (state.currentPage - 1) * state.pageSize
            const end = start + state.pageSize
            return filtered.slice(start, end)
        }
    },

    //相当于methods
    actions: {
        //获取博客结构化数据
        async getBlogList() {
            this.blogList = await getStructuredBlogList()
            // 计算总条数
            this.total = this.blogList.flatMap(item => item.files).length
        },
        //修改当前选中的标签
        changeActiveTab(tab: string) {
            this.activeTab = tab
        },
        //修改当前展示的样式
        changeShowStyle(style: blogAPITypes.DisplayMode) {
            this.showStyle = style
        }
    }
})


